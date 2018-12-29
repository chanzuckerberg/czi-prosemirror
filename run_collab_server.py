#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os
from subprocess import check_output

# This command is not tested on mac only.
command = 'ifconfig | grep "inet " | grep -v 127.0.0.1 | cut -d\  -f2'
f = os.popen(command)

ip = f.read().strip()
port = '3002'
os.system('node utils/build_demo_collab_server.js')
cmd = 'PORT=' + port + ' IP=' + str(ip) + ' node servers/run_demo_collab_server.bundle.js'
print('=' * 80)
print(cmd)
print('=' * 80)
os.system(cmd)
