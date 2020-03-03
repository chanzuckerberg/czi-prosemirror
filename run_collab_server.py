#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os
import platform
import logging
from subprocess import check_output

# [FS-NK][03-MAR-2020]
# IRAD-892 Correct licit windows build
# gracefully handling commands WRT OS.
if platform.system()=="Windows": command = 'ipconfig | grep "inet " | grep -v 127.0.0.1 | cut -d\  -f2'
else: command = 'ifconfig | grep "inet " | grep -v 127.0.0.1 | cut -d\  -f2'

f = os.popen(command)
ip = f.read().strip()
port = '3002'
os.system('node utils/build_demo_collab_server.js')
logging.info('This is an info message port',port)
# [FS-NK][03-MAR-2020]
# IRAD-892 Correct licit windows build
# gracefully handling commands WRT OS.
if platform.system()=="Windows": cmd = 'node servers/run_demo_collab_server.bundle.js ' + ' PORT=' + port + ' IP='+ ip
else: cmd = 'PORT=' + port + ' IP=' + str(ip) + ' node servers/run_demo_collab_server.bundle.js'

print('=' * 80)
print(cmd)
print('=' * 80)
os.system(cmd)
