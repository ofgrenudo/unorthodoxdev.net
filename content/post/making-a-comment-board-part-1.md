---
title: "Making a Comment Board Part 1"
description: ""
#image: ""
date: 2023-07-21T12:48:09-04:00
draft: false
keywords: ["unorthodoxdev"]
toc: true
---

## comment.unorthodoxdev.net

Currently, my blog is made using hugo. The theme that I am using has the capability to enable comments, although they would all be hosted on a third party. Unfortunately for me, im unwilling to signup for said third parties. One saturday morning as I was drinking my coffee and browsing the blogs that I follow, landed on a favorite of mine: https://blog.ari-web.xyz/.

I really love ari's blog. I think that Ari does what the web was supposed to do and really embodies the the nature of blogging. Something that I aspire to do. But am too introverted to even post things about my self online, personally I get too wrapped up in making sure everything is perfect, that when I do get the urge to post something I post it and avoid my computer for the rest of the day in fear of finding a misspelled word (which happens more often than not). 

One of the features of Ari's blog that I really like is the https://user.ari-web.xyz/ section. Its a comment board that anyone can post to anon or not. While i havent looked at what Ari's comment section was written in, im planning on writing this comment section in rust. My goal for now is to seperate the project into two secions

**Binary**: comment.unorthodoxdev.net

**Library**: cmanager (Comments Manager)

The **Binary** will contain the code related to the web hooks and buisness logic.

The **Library** will contain the code that will store said comments into a JSON file or whatever database I decide to use (a JSON file).

## Implementation

Of course, we always must start with the library. The first step to making this comment board is figuring out what kind of data structure we will use. For now I will avoid thinking about databases, and focus on just figuring out what our data is going to look like.

I start by imaginging that we have a html web page, that users connect to. There we will have a **form** that allows users to input into the form, the following information

- User Name
- Their Comment

From there, they will click submit and then it will create a __post__ or a __put__ to some backend service that will gather the following information

- id
- ip
- username
- comment
- visible
- time ( i just thought of this and will need to add it in the future)

From there it will do some kind of content filtering, checking that the string length is appropriate, checking that there arent any vulgar words, here we could have a filter list, Censored Words, and Banned Words. Banned Words will have the comment shown as hidden and be logged and stored, along with the banned word being censored. Censored words will just replace the word that is not allowed or approriate, and replace it with @@@@@. for example, "God i @@@@@@@ you joshua. I hope you die --- Anon"

Im sure I wont be able to catch all the possible ban able words and or censored words, but it will be a fun experiment to work on with word processing.

Where I have left off, you can currently create a new comment using `cmanager::new(ip, username, comment);` the next step here is saving it. I initially wanted to do just a json file, but decided to go against that to get me comfortable with using SQL. So far, im hoping to use a sqlite database, since it can one file, uploaded with the repository, and! it doesnt make a lot of overhang on my project.

So far I have also done some content filtering in the data that `cmanager::new` recieves. Currently limits are set at 500 characters for all values with the exclusion of the comment in which, I have allowed a small hate filled paragraph to be typed out and submitted on the comment board (10,000 characters). Anything more than that is one of two things, not worth reading, or an spam/advertisement.

The reason I bring this feature up is because there are no try fail, loops in rust. If someone where to buffer overload my program, it would just simply quit to a unrecoverable fail state where I would have to then manually log in and start the program. But whos to say someone isnt constantly submitting comments to my comment board, breaking my system. To prevent that kind of behaviour you can strongly type into the program the abbility to encounter those errors, and tell the compiler what to do.

For example, within the `cmanager::new()` function, I have written an `if` statement that checks the length of those values. It then returns a Enum containing a struct, that contains two parts. Information about the reason the program errored out. And a sample of the data that caused the error. This allows for me to log, what caused that error, and continue moving on as if it was intended behaviour.

Simply put, that error __**was intended behaviour**__.

```lib.rs

#[derive(Debug)]
pub struct Comment {
    id: Uuid,
    ip: String,
    username: String,
    comment: String,
    visible: bool,
}

#[derive(Debug)]
pub struct CommentError {
    error: String,
    comment: Comment,
}

enum CommentResult<Comment, CommentError> {
    Ok(Comment),
    Err(CommentError),
}


if ip.len() > 500 {
        let problem_comment = Comment {
            id: Uuid::new_v4(),
            ip: "error".to_string(),
            username: username,
            comment: comment,
            visible: false,        
        };

        let ip_too_long = CommentError {
            error: "Error, your ip address was over 500 characters, this attempt has been logged, and will be reviewed later. Pleas try again :)".to_string(),
            comment: problem_comment,
        };

        return Err(ip_too_long);
}

```

