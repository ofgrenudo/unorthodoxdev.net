---
title: "Simple File Parsing Takes Three Hours"
description: "try, except wreks newb trying to terminal output."
#image: ""
date: 2023-09-21T09:53:13-04:00
draft: false
keywords: ["unorthodoxdev"]
toc: true
---

NMAP really needs some kind of file output option that isnt leetcode, xml, or gibberish. I would kill for a csv output from nmap. Regardless, lets solve this problem. I chose to ues python because I figured it would be quick and easy and would take no time. I was in fact wrong; Im not quite as comfortable with python as I am with rust at this point, but thats ok. [It took about 2-3 hours to build and test a simple program](https://github.com/ofgrenudo/noparser/blob/main/noparser.py). This stupid script, took a little over 40 minutes trying to figure out how to build a stupid CLI interface and I immediately realized I miss rusts built in fail handling. Your telling me that I have to try, except **everything???**. Oh well it doesnt matter anyways this doesnt actually compile down to machine code there are no assembly jumps or calls, lets just do it.... 

God I hate this I decided to just cave and research a few CLI libraries and landed on plac, which has some very terrible documentation. For example, they do not explicilty provide a way for you to accept a file path or string lol. I just had to play around with the program until I found something that works, but this library could literally kill for some more english in the documentation. After I got that going it was easy peasy lemon squeezy. Except, when you error out, it doesnt really tell you why if your in a try catch loop. So I have to effectively comment out the try catch loop, and lower my code a indentation bracket figure out what the hell is breaking my code, just to realize I forgot to pass a variable to a function but was referencing it anyways.... Another downside to try catch. Why the hell is my program failing. Otherwise, this program is less than 40 lines without all the stupid comments.

All I could think about was those intro to CS classes in college where your just recycling CSV parsing code over and over again for a whole semester and building stupid text UI. All those hours of code, ammounted to a waste of three hours at work trying to get a CSV. But was it worth the three hours one might ask? well, the fact that I can run and scan the network using NMAP, and imemdiately convert it to a csv file to later open in XSLX or another stupid app to make a report later in my day in seconds, I would say that yes. Yes spending the three hours fighting with try, catch loops was worth it.

TLDR, noob gets wrekt by pythons immaculate error handling. Check out my project, [noparser](https://github.com/ofgrenudo/noparser/tree/main)
