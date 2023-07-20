---
title: "Setting a Hostname on Linux"
description: "An extensive overview on setting unix device hostnames"
#image: ""
date: 2023-07-19T20:58:46-04:00
draft: false
keywords: ["unorthodoxdev"]
toc: true
---

> ⚠️ Danger
> You will need administrative access to the device in question. Changing a hostname can have unintended catastrophic consequences if done without proper consideration.

A hostname is a computers human readable address that allows you to communicate with it, regardless of weather or not you know what its IP address is. Hostnames are pratcial and easy to remember. For whatever reason if you need to reset your hostname on a linux machine, you can follow the below instructions

To view your current hostname type 
```bash
$ hostname
```

When I do so on the current machine, I see that for whatever reason the machines name is set to localhost. This is a problem as localhost also happens to be an alias to [127.0.0.1](http://localhost/).

# Temporarily
To temporarily reset the hostname of the machine I should do the following

```bash
$ hostname changeme
```

Again though, unfortunately this only keeps the hostname that way until the next reboot. This might be good for testing or even just to get a prod server off of a bearing load and replace it with a backup server. But for a more permanent and serious effect, we should do the following.

# Permanently

```bash
$ hostnamectl set-hostname imstuck
```

The above command should set the hostname immediately as well as it should stick beyond a reboot. To confirm that the name has been configured permanently we can check the following file `/etc/hostname` and confirm the contents are what we are expecting. The thing I would do in this case is to reboot as soon as possible so that permanent hostname can really take affect and your DNS servers can update accordingly.