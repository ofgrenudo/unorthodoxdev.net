---
title: "New Bloging System"
description: "We are up and running baby!"
image: "this-is-fine.png"
date: 2023-07-21T10:58:35-04:00
draft: false
categories: ["System Administration"]
toc: true
---

Ive migrated my website from the ghost blogging platform to [hugo](https://gohugo.io/) (go hugo, go hugo, go!). Its a little simpler and easier to manage. I also feel as though I have more controll. Currently, im using the hugo-stacked-theme as it looks the most appealing to me, and is not a massive website with insane overhead. It also comes with a indexing feature that allows me (and you ofcourse) to search my content for specific keywords.

Another great thing about it being simple is I dont have to constantly monitor that the ghost instance isnt taking too much resources as the web server just lives on a static nginx route. The only thing I **will** have to get used to is making sure that before I push to the remote repository, that I have ran `hugo` so that it can build each of my pages.

Currently I am manually logging into the web server and pulling the repostory whenever I feel like it. In the future, ideally id set a cron job for every 30 minutes or something like that.

ehhh either way this new cms seems to be working. Keep in touch as im hoping to release a new feature to my website soon :)
