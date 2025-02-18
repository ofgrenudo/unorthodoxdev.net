---
title: 'Why You Should Disable Javascript From Loading By Default'
description: 'death by svg images and the importance preventing other XSS vulnerabilities.'
date: '2025-02-17T18:10:31-05:00'
#image: 
categories: ["Security"]
# ["General", "MECM", "Network-Administration", "Programming", "System-Administration"]
tags: []
license: GNU General Public License v3.0 
hidden: false
toc: true
draft: false
---


Have you ever thought about how easy it is to launch a xss attempt? Or why your organization disables loading images by default in your inbox? Its because something as simple as a svg can contain javascript, that can execute some malicious code. 

For example, if we wanted to create a svg file with the following contents:

```javascript
<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg" onmouseover="javascript:alert(String.fromCharCode(88,83,83))">
    <circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="red" />
</svg>
```

To run a demonstration, you can <u>click on the button here and then hover your mouse over the new image.</u> This should then open up an alert with the text XSS : 
<br>
- <button onclick="showImage()">Test Your JavaScript Blocking Abilities!</button>

<div id="soon_to_be_vuln">
</div>

<br>

and load it into your web browser, you would get an alert saying `XSS`. Honestly a vulnerability like this is something really simple, but probably more viable than you may think for example, my site, does not stripping to svg content loaded. And, if I were to per say make my pfp a svg, and inject some kind of malicious payload into it, you would honestly never notice right? 

Unless, you blocked javascript by default, in which this kind of trick wouldnt work.

## The Fear of XSS Is More Than An Image or An Alert.

Theres more to this kind of vulnerability than what may appear to the eye, hypothetically if a user could upload an image to this website, that could contain some xss then there could be an even greater and more malicious attack than what ive presented here. At one point on my job, I had discovered a XSS vulnerability in a homebrewed application. I notified the appropriate people responsible for the application, but it was hard to explain to management what the severity of this vulnerability is. Honestly, the easiest way to do this was to just send them a link with an malicious payload included doing something as follows :

```javascript
document.getElementById("someID").onload = function() { [load malicious iframe here] }
```

I think specifically I sent them to Burger Kings website, or the NFL website. Having this kind of vulnerability available allows for people to spoof your website or perform some kind phishing attempt.

## Preventing XSS

Honestly, the easiest way to prevent XSS vulnerabilities, is to filter anything and everything given to you by a user. Even images. Users for the most part are good right? righttt? Well hackers are bad. Our worst case is a hacker, so we need to anticipate these bad actors. Why leave our selves wide open to such an easy, yet drastically impactful vulnerability?






<script src="/p/2025-02-17-why-you-should-disable-javascript-from-loading-by-default/script.js" type="text/javascript"></script>