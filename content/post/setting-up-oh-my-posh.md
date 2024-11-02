---
title: "Setting Up Oh My Posh"
description: "I suck at writing instructions the first time, so here I go..." 
date: 2024-11-02T13:16:16-04:00
image: 
math: false
license: GNU-GPLv4
hidden: false
comments: false
draft: true
---

I've been using Oh-My-Posh for some time now, and I never really documented how I setup my environment. I had a `.ps1` file saved but that was without instructions usless. So ill go through installing Oh-My-Posh here

1. `choco install oh-my-posh`
2. Configure Windows Terminal [https://raw.githubusercontent.com/ofgrenudo/confs/refs/heads/main/configurations/wt_conf.json](https://raw.githubusercontent.com/ofgrenudo/confs/refs/heads/main/configurations/wt_conf.json)
    1. Install Agave Nerd Font (my favorite)
3. Edit your $PROFILE.
    1. Within your $PROFILE use the following command `oh-my-posh init pwsh --config 'C:\Program Files (x86)\oh-my-posh\themes\darkblood.omp.json' | Invoke-Expression`
4. Exit out of your terminal, and boom you all of a sudden have oh-my-posh configured and snazy.

Otherwise, there you have it. I realized after writing enough blog posts over the years, how akin a tech blog is to a cooking recipie you find online lol. One day, i was sitting in my kitchen pulling up a recipie on my laptop to follow along, and you know that lengthy preamble they give you before you actually get the recipie? LOL do I do that? I suppose blogs are mostly baout rambling. But it just was a general thought that popped into my head. 

Tech blogs are really no better than cooking blogs. So im deciding to keep it short and straight to the point here with this post.
