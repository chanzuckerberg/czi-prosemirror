#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os
import platform
import logging
import socket    
from subprocess import check_output

# [FS][03-MAR-2020]
# IRAD-892 Correct licit windows build
# gracefully handling commands WRT OS.
hostname = socket.gethostname()    
IPAddr = socket.gethostbyname(hostname)  
port = '3001'

if platform.system()=="Windows": cmd = 'node utils/build_web_server.js ' + ' PORT=' + port + ' IP='+ IPAddr
else: cmd = 'PORT=' + port + ' IP=' + IPAddr + ' node utils/build_web_server.js'

print('=' * 80)
print(cmd)
print('=' * 80)
print('run web server at http://' + IPAddr + ':' + port)
print('=' * 80)
os.system(cmd)
