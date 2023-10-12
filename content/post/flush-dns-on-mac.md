---
title: "Flush Dns on Mac"
description: ""
#image: ""
date: 2023-10-12T16:45:31-04:00
draft: true
keywords: ["unorthodoxdev"]
toc: true
---

Gah, they make everything so hard. (I need to run two simple commands.) Why cant I just run one command and flush the dns on my mac? Well im sure theres a better way to do this... (there is)

Welcome to flushdns(.sh)

```bash
#!/bin/bash
# This script will clear your dns cache on your mac. It has been tested on macOS 13.4 Ventura
# Joshua Winters-Brown

sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder > /dev/null

echo "  _____ "
echo "  |   D "
echo "  |   | "
echo "  |   | "
echo "  \___|            _ "
echo "    ||  _______  -( (- "
echo "    |_'(-------)  '-' "
echo "       |       / "
echo " _____,-\__..__|_____ "
echo " "
echo " Your DNS has been flushed... "
```

Throw this script into your /usr/local/bin and you can run flushdns from anywhere in the terminal.

Tada!
