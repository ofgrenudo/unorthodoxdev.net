---
title: "Making a Comment Board Part 3"
description: ""
#image: ""
date: 2023-07-26T12:08:38-04:00
draft: false
keywords: ["unorthodoxdev"]
toc: true
---

## Actix and Askama Webserver and Rendering

Now we move onto the main.rs file, this is particularly simple as we will only be worried about two routes. a `get('/comment/')` and a `post('/comment/new')`. To start, I chose to use [Askama](https://github.com/djc/askama) for templating since its closest to what im comforatble with ([mustache templating](https://mustache.github.io/)). Overall askama is pretty simple. We have to create a `Template` that links to our template file. We will then add the content that we want to send to the template. Typically this is done with a struct. 

Since we are interfacing with the library, we will have to duplicate our code here and create a template of our array of templates instead of just passing a long our array of templates. We can do so by...

```rust
#[derive(Template)] // this will generate the code...
#[template(path = "index.html")] 
pub struct CommentTemplate {
    comments: Vec<cmanager::Comment>,
}
```

Next we will, create our `#[actix_web::main]` function.

```rust
#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        App::new()
            .service(web::resource("/").to(|| async { CommentTemplate {comments: cmanager::get_all()}}))
    })
    .bind(("0.0.0.0", 8080))?
    .run()
    .await
}
```

Notice that we build the route, we are creating a function with the `|| async {}` and then calling on our `CommentTemplate` that should have all the needed code generated with the macro. Before we run this thing though, were missing one more file. The `index.html` refrenced by the template. To get that we will have to create a folder in our root directory called `templates`. Then include a file called `index.html`. I wont link my css here but you can view the active template file [HERE](https://github.com/ofgrenudo/comment.unorthodoxdev.net/blob/7a6a3200a661613efe1bed94d573db4373f61ed2/templates/index.html).

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Comments</title>
</head>
<body>
    <div class="input-section">
        <h2>Submit Your Comment</h2>
        <form action="/comment/new" method="post" id="new_comment">
            <input type="text" name="username" id="username" placeholder="whats your name anon?" maxlength="500" required>
            <textarea
                id="comment"
                name="comment"
                maxlength="10000"
                placeholder="whats on your mind...."
                spellcheck="true"
                required
            ></textarea>
            <button id="submit">Send!</button>
        </form>
    </div>
    <div class="comment-section">
        <h2>Comments</h2>
        <ul id="comments">
            {% for comment in comments %}
            <div id="comment">
                {% if comment.visible == 1 %}
                    <li id="comment_id" hidden>{{comment.id}}</li>
                    <li id="comment_ip" hidden>{{comment.ip}}</li>
                    <li id="comment_username"><p><b>{{comment.username}}</b> says...</p></li>
                    <li id="comment_input">{{comment.comment}}</li>   
                    <li id="comment_timestamp">{{comment.timestamp}}</li> 
                {% endif %}
            </div>
            {% endfor %}
        </ul>
    </div>
</body>
</html>
```

Above, you can see the `{% for comment in comments %}`. Thats all voodo stuff askama does. So no need for us to worry about it other than, know it is a loop that iterates over our vector. Also ive got a conditional statement, `{% if comments.visible == 1 %}`. This only shows the comments that are visible and not hiddne. Im sure that eventually I need to completely remove that conditional and do it at the sql request side, but I kind of like the idea of being able to pull all comments, regardless of weather or not I want to show them or not.

Finally, when you run your instance, You will probably see that there nothing populates. That is most likely because there are no comments yet. That brings us into the next step, lets work on the POST function. We will start by creating the new function on in our main.rs

```rust
#[derive(Deserialize)]
#[derive(Debug)]
struct FormData {
    username: String,
    comment: String,
}

async fn new(web::Form(form): web::Form<FormData>, req: HttpRequest) -> impl Responder {
    let ip = req.peer_addr().unwrap_or(SocketAddr::new(IpAddr::V4(Ipv4Addr::new(6, 6, 6, 6)), 666)).ip();
    let username = form.username;
    let comment = form.comment;

    let _ = cmanager::new(ip.to_string(), username, comment);

    // CommentTemplate {comments: cmanager::get_all()}
    web::redirect("/comment/new", "/")
}
```

Starting from top to bottom, we create a new function that intakes `FormData` a new struct we have created that represents the content being sent to us from the HTML form. We also take in as an accept parameter the `req: HttpRequest` this allows us to capture the IP address of the sender. After translating the FormData into some new variables, we input it into our `cmanager::new();` to create a new comment entry. Wrapping it all up with a redirect to the root domain, scince I dont really want to deal with re rendering the in every function. Although in the future that may change. What if I want to give a dynamic error message about how you didnt read the rules? How would that work? Either way, to actually use the `new()` function we need to add it as a route, in our `App::new()`. The new main function looks like below,

```rust
#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        App::new()
            .service(web::resource("/").to(|| async { CommentTemplate {comments: cmanager::get_all()}}))
            .route("/comment/new", web::post().to(new))
    })
    .bind(("0.0.0.0", 8080))?
    .run()
    .await
}
```

Now go ahead and build your comment board, and run it. It should be able to accept comments and display them when you go to the homepage.
