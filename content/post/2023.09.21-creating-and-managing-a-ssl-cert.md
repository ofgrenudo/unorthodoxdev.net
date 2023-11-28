---
title: "Creating and Managing a SSL Cert"
description: "Heres my cheat sheet on creating and managing a ssl cert on ubuntu :)"
#image: ""
date: 2023-09-21T16:39:17-04:00
draft: false
keywords: ["unorthodoxdev"]
toc: true
---

This guide is intended for Ubuntu 22.04 and is intended for use with a Apache2 web server. To get started we need to make sure you have Apache2 installed, we can use grep to check. These instructions were written on a Ubuntu Server.

```bash
apt list --installed | grep "apache2"
```

Next will need to allow Apache through the firewall on both http (80) and https (443). We can do so with the below command

```bash
sudo ufw allow "Apache Full"
```

Next we will need to enable the Apache `mod_ssl` module. The Apache `mod_ssl` module will allow Apache to support SSL encryption. The command to do so is below.

```bash
sudo a2enmod ssl
sudo systemctl restart apache2
```

Now, Apache is configured and ready for encryption. We can move onto generating a TLS certificate. To do so we will need to do the following below command

```bash
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/ssl/private/apache-selfsigned.key -out /etc/ssl/certs/apache-selfsigned.crt
```

Running the above command will prompt you to enter a bunch of information. Please follow through each of the steps and answer them completely. The following flags on the above command do as listed below

| Flag               | Description                                                                                                                                                                                                |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `req -x509`        | This specifies that we want to use the X.509 certificate signing request managment. X.509 is a public key infrastructure standard that TLS adhears too.                                                    |
| `-nodes`           | Nodes tells OpenSSL to skip the option to secure our certificate with a passphrase because we want apache to be able to read the file. A passphrase would prevent apache from being able to do so.         |
| `-days 365`        | This option sets the length of time that the certificate will be considered valid. Here we have set it for one year. Browsers will reject just about any certificate that is valid for longer than a year. |
| `-newkey rsa:2048` | This tells the program we want to generate a new certificate and key at the same time. the rsa:2048 makes it a RSA key that is 2048 bits long.                                                             |
| `-keyout`          | This line tells the program where to place the private key file.                                                                                                                                           |
| `-out`             | This line tells the program where to place the certificate that we are creating.                                                                                                                           |

As a general note, certificates and their keys are generally recommended to be put in the `/etc/ssl/private` (for keys) and `/etc/ssl/certs/` (for certificates). It is a best practice that we should employ.

To recap we have just created a key and a certificate.
- `/etc/ssl/private/apache-selfsigned.key`
- `/etc/ssl/certs/apache-selfsigned.crt`

You can test if either file exists by, running the following command

```
sudo locate apache-selfsigned.key
locate apache-selfsigned.key
```

## Configure Apache to use TLS

Since we have created our self signed certificates. We will then need to tell Apache to use them. We can do so by editing our Apache .conf file. These are typically in the `/etc/apache2/sites-availabe` folder. We will start by creating a new file in the `/etc/apache2/sites-available/` folder.

```bash
sudo vim /etc/apache2/sites-available/my_website.conf
```

next you will want to paste in the following information. Make sure to update it accordingly to before creating this file.

```txt
<VirtualHost *:443>
   ServerName your_domain_or_ip
   DocumentRoot /var/www/your_domain_or_ip

   SSLEngine on
   SSLCertificateFile /etc/ssl/certs/apache-selfsigned.crt
   SSLCertificateKeyFile /etc/ssl/private/apache-selfsigned.key
</VirtualHost>
```

Next we will need to enable the configuration file with the `a2ensite` tool.

```bash
sudo a2ensite my_website.conf
sudo systemctl reload apache2
```

Finally, your web server should be good to go with a self signed cert. Now I would recommend you visit it and ensuring that you are using the `https://` prefix. If alls well, you should get a error, saying that it cant verify the identity of the server. This is normal behavior because in fact, we gave it a self signed cert. In the future, It would be advisable to get your certificates from a CA vender.

## I no longer want any http:// requests

We can redirect all `http://` to your `https://` route relatively easily. To do so you will need to edit your .conf that we created above, and add the following configuration to it:

```txt
<VirtualHost *:80>
	ServerName your_domain_or_ip
	Redirect / https://your_domain_or_ip/
</VirtualHost>
```

I would recommend doing a backup of the conf before hand just incase you break something in the process. You never really know what may happen.

Now all you will need to do is bounce the service, and give it a run.

```bash
sudo apachectl configtest
sudo systemctl reload apache2
```

You can test this by attempting to force your browser to visit the insecure version of the site. To do so ensure that the prefix to the websites name is `http://`.
