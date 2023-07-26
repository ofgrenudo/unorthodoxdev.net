---
title: "Making a Comment Board Part 2"
description: ""
#image: ""
date: 2023-07-24T10:11:15-04:00
draft: false
keywords: ["unorthodoxdev"]
toc: true
---

## Finishing Up CManager

Between the last post and the current post, ive made a few changes to the CManager. The first is the struct now contains a time stamp.

```rust
#[derive(Debug)]
pub struct Comment {
    pub id: Uuid,
    pub ip: String,
    pub username: String,
    pub comment: String,
    pub timestamp: String,
    pub visible: i64,
}
```

besides that everything else stays the same. Currently there are two functions `new()` and `get_all()`. New intakes only two paramters, a String for the username and a string for the comment.

One of the first things I do is take create a sha256 sum of the IP by doing the following

```rust
let sha_ip = digest(&ip.replace(":", ""));
```

Fun fact, I found out that sha256 sums do not work well with special characters like a `:`. So replacing it with noting helped make the string replacable. After converting our IP it was time to move onto some content filtering. Im sure that some of this code could be extrapulated into a private function, something like `check_content_length()` but for now its here.

We basically sift through a series of if statements to confirm that none of the values are over a maximum lenght. Looking at the code im sure that I could do a for loop here.

```rust
    if username.len() > 500 { 
        let problem_comment = Comment {
            id: Uuid::new_v4(),
            ip: sha_ip.to_string(),
            username: "error".to_string(),
            comment: comment,
            timestamp: Utc::now().to_string(),
            visible: 0,        
        };

        let username_too_long = CommentError {
            error: "Error, your user name was over 500 characters, this attempt has been logged, and will be reviewed later. Pleas try again :)".to_string(),
            comment: problem_comment,
        };

        return Err(username_too_long);
    }

    if comment.len() > 10000 {
        let problem_comment = Comment {
            id: Uuid::new_v4(),
            ip: sha_ip.to_string(),
            username: username,
            comment: "error".to_string(),
            timestamp: Utc::now().to_string(),
            visible: 0,        
        };

        let comment_too_long = CommentError {
            error: "Error, your comment was over 10,000 characters, this attempt has been logged, and will be reviewed later. Pleas try again :)".to_string(),
            comment: problem_comment
        };

        return Err(comment_too_long);
    }
```

Finally, we commit our comment, into a new variable, and open our database up. We then generate a query and insert the comment into the database forming a record. To finish off the function, we return an `Ok` and the incoming comment.

```rust
    // Everything looks good, lets move forward with commiting the information to the database.
    let incoming_comment = Comment {
        id: Uuid::new_v4(),
        ip: sha_ip.to_string(),
        username: username,
        comment: comment,
        timestamp: Utc::now().to_string(),
        visible: 1,        
    };
    
    let connection = sqlite::open("comments.db").unwrap();

    let query = format!("
        CREATE TABLE IF NOT EXISTs comments (id TEXT NOT NULL PRIMARY KEY, ip TEXT, username TEXT NOT NULL, comment TEXT NOT NULL, timestamp TEXT, visible INT NOT NULL);
        INSERT INTO comments VALUES ('{}', '{}', '{}', '{}', '{}', {})", incoming_comment.id, incoming_comment.ip, incoming_comment.username, incoming_comment.comment, incoming_comment.timestamp, incoming_comment.visible );

    connection.execute(query).unwrap();

    // All looks good, lets return it.
    Ok(incoming_comment)
```

That was about the most complicated part of the CManager library. The next function we will cover is the `get_all()` function. Every now and then I get the urge to just overload a function in rust. Then I remember thats no bueno. So I think traits. But traits confuse me. So I keep my brain smooth by making functions like `get_all()` which I think is unanimously acceptable.

The `get_all()` function is pretty simple. We return a vector of `Comment`, we affecitionally will reffer to this as `comments`. We return our comments by running a query `SELECT * FROM comments ORDER BY timestamp DESC LIMIT 50;`. We then iterate through our Statements and create a comment  for each row. Then before iterating to the next row in our statement, we will commit our comment, by adding it to the vector comments.

Finally, we will return our vector and allow the client to whatever they would like with it.

```rust
pub fn get_all() -> Vec<Comment> {
    let mut comments: Vec<Comment> = vec![];
    let connection = sqlite::open("comments.db").unwrap();
    
    // Note we had to split up the blow two statements. For some reason, the statement.next() function later down the program would not pull comments when we ran the CREATE TABLE command.
    // Maybe its because I didnt do the format!() like i did in the new comment function???
    // The compiler is angry here, i know. Ill fix it all later, but for now it looks aesthetically pleasing uwu.
    
    let mut query = "SELECT * FROM comments ORDER BY timestamp DESC LIMIT 50;";
    let mut statement = connection.prepare(query).unwrap();

    while let Ok(State::Row) = statement.next() {
        let temp_id = statement.read::<String, _>("id").unwrap();
        let id: Uuid = Uuid::parse_str(&temp_id).unwrap();

        comments.push(Comment {
            id: id,
            ip: statement.read::<String, _>("ip").unwrap().to_string(),
            username: statement.read::<String, _>("username").unwrap().to_string(),
            comment: statement.read::<String, _>("comment").unwrap().to_string(),
            timestamp: statement.read::<String, _>("timestamp").unwrap(),
            visible: statement.read::<i64, _>("visible").unwrap(),            
        });
    }

    comments
}
```

While I dont think we have gone over a lot, i think that we are a bit too far as is to continue going on with the main.rs implementation. So I would like to put a pause here and continue forward in the next part.