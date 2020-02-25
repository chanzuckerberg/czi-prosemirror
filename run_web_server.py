#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os
from subprocess import check_output

# This command is not tested on mac only.
command = 'ifconfig | grep "inet " | grep -v 127.0.0.1 | cut -d\  -f2'
f = os.popen(command)

ip = f.read().strip()
port = '3001'
cmd = 'PORT=' + port + ' IP=' + str(ip) + ' node utils/build_web_server.js'
print('=' * 80)
print(cmd)
print('=' * 80)
print('run web server at http://' + ip + ':' + port)
print('=' * 80)
os.system(cmd)
