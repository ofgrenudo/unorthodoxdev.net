---
title: "Implementing a Sick 504 Page"
description: "Im tired of seeing it."
#image: ""
date: 2023-07-27T12:09:39-04:00
draft: false
keywords: ["unorthodoxdev"]
toc: true
---

Rust takes forever to build. Im sure I could do alot better deploying the application. But who knows, maybe im doing great at deploying my [comment board](https://unorthodoxdev. net/comment) but what if there is some bug that I introduced that crashes the server 👻. What if while the server is crashed, Im at work??? Well good thing we can customize the default 504 page that nginx uses. So lets get started.

First we will go to our `/var/www/html` folder and create a page called `maintenance.html`. Inside of maintenance I have put the following.

```html
<!doctype html>
<title>Site Maintenance</title>
<style>
  body { text-align: center; padding: 150px; }
  h1 { font-size: 50px; }
  body { font: 20px Helvetica, sans-serif; color: #333; }
  article { display: block; text-align: left; width: 650px; margin: 0 auto; }
  a { color: #dc8100; text-decoration: none; }
  a:hover { color: #333; text-decoration: none; }
</style>

<article>
    <h1>We&rsquo;ll be back soon!</h1>
    <div>
        <p>Sorry for the inconvenience but we&rsquo;re performing some maintenance at the moment. If you need to you can always <a href="mailto:#">contact us</a>, otherwise I&rsquo;ll be back online shortly!</p>
        <p>&mdash; Joshua Winters-Brown</p>
    </div>
</article>
```

Simple and sweet right? next, we have to edit our nginx default config. You can find that at `/etc/nginx/sites-available/default`. 

> Remember! You must edit this files as sudo!

Inside of our config file, just below your ssl certificates (or your port 80 config. Who knows maybe your rocking http naked). paste the following

```config
error_page 502 /maintenance.html;
location = /maintenance.html {
    root /var/www/html;
    internal;
}
```

Next, you will need to restart your nginx server. You can do so via the following command

```bash
sudo systemctl restart nginx
```

Now, kill your service, and run to the url to try to capture the error.

![ill-be-back-soon.png](https://pasteboard.co/HtneDCu6qMmC.png)