#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os
import platform
import socket

# [FS] IRAD-991 2020-07-17
# gracefully handling commands WRT OS.
hostname = socket.gethostname()    
IPAddr = socket.gethostbyname(hostname)  
port = '3004'

if platform.system()=="Windows": cmd = 'node servers/image/run_image_server.bundle.js ' + ' PORT=' + port + ' IP='+ IPAddr
else: cmd = 'PORT=' + port + ' IP=' + IPAddr + ' node servers/image/run_image_server.bundle.js'

print('=' * 80)
print(cmd)
print('=' * 80)
os.system(cmd)
