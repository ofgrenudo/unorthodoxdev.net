---
title: "Ghost Printers"
description: ""
#image: ""
date: 2023-07-20T16:03:40-04:00
draft: false
keywords: ["unorthodoxdev"]
toc: true
---

Ive recently had an encounter with a printer that creates 100s of copies of its self within the computers printer settings. Ive spent quite a bit of time tinkering with this printer and its settings. I think I’ve come to a resolution. Overall, to recap what I did; Opening up the Regedit there were 100’s of keys associated with the Xerox printer. Typically, these registry keys are created when installing the printer and the windows printui.dll handles it. But the amount of registry keys meant that windows kept recreating these keys. I dug a little bit more into the registry keys and it appears that each of these keys had the following properties assigned to them. Name “PRT-AWH-321-COLOR”, Driver “Xerox …” that was pretty much it. The rest of the fields were empty.

I started off looking into removing these printers via a script etc. Doing so I found the existence of a registry key we can create that would have windows remove the printers on exit. To enable this feature you would have to create a 32bit dWord key in the following location `"HKLM:\Software\Microsoft\Windows NT\CurrentVersion\Print\Providers\Client Side Rendering Print Provider"` with the name `"RemovePrintersAtLogoff"` and the value of 1.

After creating this key, when a user logs out it should clear out any installed printers, and apply the group policy user settings next time a user logs in. Well creating that key and then logging out seemed to work. But those xerox registry keys persisted for some reason. I grabbed one of the GUIDS from a ghost printer and ran a search for all the instances I could find it in regedit. I ran across quite a few instances and ended up writing a script.

We start by stopping the printer spooler, and then removing the following:

```bash
HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Print\Connections
HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Print\Printers
HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Print\Providers
HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Print\V4 Connections
HKLM:\SOFTWARE\Wow6432Node\Microsoft\Windows NT\CurrentVersion\Print\Connections
HKLM:\SOFTWARE\Wow6432Node\Microsoft\Windows NT\CurrentVersion\Print\Printers
HKLM:\SOFTWARE\Wow6432Node\Microsoft\Windows NT\CurrentVersion\Print\Providers
HKLM:\SOFTWARE\Wow6432Node\Microsoft\Windows NT\CurrentVersion\Print\V4 Connections
HKCU:\Printers
HKCU:\Software\Microsoft\Windows NT\CurrentVersion\PrinterPorts
HKEY_USERS\.DEFAULT\Printers
```

The following below you need a system user context to remove. You can do so by using PSExec from Windows PowerToys.

```bash
HKLM:\SYSTEM\CurrentControlSet\Enum\SWD\PRINTENUM 
HKLM:\SYSTEM\CurrentControlSet\Control\DeviceClasses\{0ecef634-6ef0-472a-8085-5ad023ecbccd} 
HKLM:\SYSTEM\ControlSet001\Enum\SWD\PRINTENUM    
HKLM:\SYSTEM\ControlSet001\Control\DeviceClasses\{0ecef634-6ef0-472a-8085-5ad023ecbccd}    
HKLM:\SYSTEM\ControlSet002\Enum\SWD\PRINTENUM    
HKLM:\SYSTEM\ControlSet002\Control\DeviceClasses\{0ecef634-6ef0-472a-8085-5ad023ecbccd}    
HKLM:\SYSTEM\CurrentControlSet\Control\Class\{1ed2bbf9-11f0-4084-b21f-ad83a8e6dcdc} 
```

After doing so, when you open up the control panel all the printers should be grayed out. Because these printers are being added via group policy, doing a reboot, should resolve any issues we had previously. Once the computer comes back up again, all of those printers should remain grey, and anything that gets installed via group policy should then fill in with color. But shortly after, it started happening again. I kept getting notifications of the printer installing, over and over and over again. 

With that, its confirms that it is not some residual left over install, but narrows it down to one or two things. A messed up group policy or a bad driver. Looking at the group policy I could find anything wrong, so I decided to start at the driver. I took the computer off the domain, and downloaded the PCL, General, and PS, driver for the printer. 

Once the computers off the domain, I remove all printers. And repeat the above steps. After doing so I started with the identical driver installed, the General driver. I setup the printer and as soon as the install finishes. I immediately get the same issue again.

Its no longer a group policy issue, its now a driver issue. Uninstall all the printers again and start from step one. Once I get to installing the printer I use the PCL driver. I had similar issues. Finally the Post Script (PS) driver ended up working for me and resolved in no issues.

Either way, cleaning up the ghost printers is a pain in my ass, and is nothing but manual labor. I ended up reimaging the comptuers after fixing the driver on the print server and going from there.

 Since then its seemed to have been fixed.
 
 ## Scripts
part-one.ps1
 ```Powershell
New-ItemProperty -Path "HKLM:\Software\Microsoft\Windows NT\CurrentVersion\Print\Providers\Client Side Rendering Print Provider" -Name "RemovePrintersAtLogoff" -Value 1 -Force
Restart-Computer -Force
 ```
 
part-two.ps1
 ```Powershell
 Stop-Service spooler -Force
Remove-Item -Path "HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Print\Connections" -Recurse
Remove-Item -Path "HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Print\Printers" -Recurse
Remove-Item -Path "HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Print\Providers" -Recurse
Remove-Item -Path "HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Print\V4 Connections" -Recurse
Remove-Item -Path "HKLM:\SOFTWARE\Wow6432Node\Microsoft\Windows NT\CurrentVersion\Print\Connections" -Recurse
Remove-Item -Path "HKLM:\SOFTWARE\Wow6432Node\Microsoft\Windows NT\CurrentVersion\Print\Printers" -Recurse
Remove-Item -Path "HKLM:\SOFTWARE\Wow6432Node\Microsoft\Windows NT\CurrentVersion\Print\Providers" -Recurse
Remove-Item -Path "HKLM:\SOFTWARE\Wow6432Node\Microsoft\Windows NT\CurrentVersion\Print\V4 Connections" -Recurse
Remove-Item -Path "HKCU:\Printers" -Recurse
Remove-Item -Path "HKCU:\Software\Microsoft\Windows NT\CurrentVersion\PrinterPorts" -Recurse
Remove-Item -Path "Registry::HKEY_USERS\.DEFAULT\Printers" -Recurse

.\PsExec.exe /accepteula
.\PsExec.exe powershell Remove-Item -Path "HKLM:\SYSTEM\CurrentControlSet\Enum\SWD\PRINTENUM" -Recurse
.\PsExec.exe powershell Remove-Item -Path "HKLM:\SYSTEM\CurrentControlSet\Control\DeviceClasses\{0ecef634-6ef0-472a-8085-5ad023ecbccd}" -Recurse
.\PsExec.exe powershell Remove-Item -Path "HKLM:\SYSTEM\ControlSet001\Enum\SWD\PRINTENUM" -Recurse -ErrorAction SilentlyContinue
.\PsExec.exe powershell Remove-Item -Path "HKLM:\SYSTEM\ControlSet001\Control\DeviceClasses\{0ecef634-6ef0-472a-8085-5ad023ecbccd}" -Recurse -ErrorAction SilentlyContinue
.\PsExec.exe powershell Remove-Item -Path "HKLM:\SYSTEM\ControlSet002\Enum\SWD\PRINTENUM" -Recurse -ErrorAction SilentlyContinue
.\PsExec.exe powershell Remove-Item -Path "HKLM:\SYSTEM\ControlSet002\Control\DeviceClasses\{0ecef634-6ef0-472a-8085-5ad023ecbccd}" -Recurse -ErrorAction SilentlyContinue
.\PsExec.exe powershell Remove-Item -Path "HKLM:\SYSTEM\CurrentControlSet\Control\Class\{1ed2bbf9-11f0-4084-b21f-ad83a8e6dcdc}" -Recurse 

Restart-Computer -Force
 ```