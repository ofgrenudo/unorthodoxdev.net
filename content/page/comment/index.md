---
title: "Comments is under maintenance please check back soon!"
date: 2022-03-06
layout: "Comment"
slug: "comment"
image: "https://images.unsplash.com/photo-1523861751938-121b5323b48b?q=80&w=2062&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
menu: 
    main:
        name: Comment
        weight: 4
        params:
            icon: comment
            newTab: true
---

> If you believe that this message was shown to you when it should not have been, please submit an issue here 
>
> - [https://github.com/ofgrenudo/comment.unorthodoxdev.net/issues/new](https://github.com/ofgrenudo/comment.unorthodoxdev.net/issues/new?assignees=&labels=status+down&projects=&template=comment-service-down.md&title=https%3A%2F%2Funorthodoxdev.net%2Fcomment+is+down)

<form action="http://localhost:8080/comment/new/post" method="post" id="new_comment">
            <input type="text" name="username" id="username" placeholder="what should we call you?" maxlength="500" required="">
            <textarea id="comment" name="comment" maxlength="10000" placeholder="whats on your mind...." spellcheck="true" required=""></textarea>
            <input type="text" name="post_url" id="post_url" required="" hidden>
            <button id="submit">Send!</button>
</form>

<script>

  // Get the <a> element within the <h2>
//   const link = document.querySelector('.article-title a');
    const link = document.getElementsByClassName('article-title')[0].getElementsByTagName('a')[0];
    // Get the href value
    const href = link.getAttribute('href');
    alert(href)
    // Extract the part after '/p/' and before the next '/'
    const valueAfterP = href.split('/p/')[1].split('/')[0];

    // Show the result
    alert(valueAfterP);

    postURL = document.getElementById('post_url');
    postURL.value = window.location.href;
</script>


