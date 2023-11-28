---
title: "Where am i on the network?"
description: "Ever plug into a jack, and just wonder what port that is on the switch? Heres your guide!"
#image: ""
date: 2023-09-07T16:51:44-04:00
draft: false
keywords: ["unorthodoxdev"]
toc: true
---

Ever wonder what port your connected to when plugged into a ethernet jack? Open up wireshark and apply a filter, searching for `cdp or lldp` traffic. That will kick back:

- The switches MAC Address.
- The port description.
- The switch system name.
- Some information about the operating system running on the switch.

> Don't see any information populating? Most likely your network admins have disabled your switches from transmitting CDP or LLDP traffic. In this case, im sorry this wont work for you.

Have fun troubleshooting.
