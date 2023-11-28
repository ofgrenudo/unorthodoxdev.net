---
title: "MECM API"
description: "My cheat sheet for working with the MECM API."
#image: ""
date: 2023-07-19T21:02:50-04:00
draft: false
keywords: ["unorthodoxdev"]
toc: true
---

Currently im looking into creating an application to harvest device information using the MECM API. Since I constantly have to research where the MECM Admin service has its hooks, i thought it would be a good idea to add some general information here.

## The Basics

The AdminService is a REST API that runs as a service, independent of the other web components in IIS on your site servers.

### Service

You can check the status of the service in the console under **\Monitoring\Overview\System Status\Component Status - SMS_REST_PROVIDER**

### Read-Only Query Basics

---

Note: All queries in this section use a HTTP GET method. Also, everything is CASE SenSiTiVe.

---

-   Get all Devices `https://<ServerName>/AdminService/wmi/SMS_R_System`
-   Get All Users `https://<ServerName>/AdminService/wmi/SMS_R_User`
-   Get Device By ResourceID (same syntax for users) `https://<ServerName>/AdminService/wmi/SMS_R_System(12345678)`
-   Get User By ResourceID `https://<ServerName>/AdminService/wmi/SMS_R_User(12345678)`
-   Retrieve related class information. This example gets Operating System information for a specific device. `https://<ServerName>/AdminService/wmi/SMS_R_System(12345678)/SMS_G_System_OPERATING_SYSTEM`