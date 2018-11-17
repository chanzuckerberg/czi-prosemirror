#!/usr/bin/env python
# -*- coding: utf-8 -*-

import codecs
import glob
import json
import os
import re
import datetime
import time

def read_text(path):
  try :
    text = None
    with codecs.open(path, mode='rt', encoding='utf-8') as f:
      text = f.read()
      f.close()
    return text
  except Exception as e :
    print 'Unable to read file' + path
    raise e

def write_text(path, text) :
  try :
    with codecs.open(path, mode='w', encoding='utf-8') as f:
      f.write(text)
      f.close()
  except Exception as e :
    print 'Unable to write file' + path
    raise e

def find_text(pattern, text, group_name=None) :
  matches = pattern.finditer(text)
  for match in matches :
    if group_name is None :
      return match.group()
    else :
      return match.group(group_name)
  return None

def build_html_app(html_path, namespace):
  file_name = html_path.split('/').pop().split('.')[0]
  output_html_file_name = file_name + '_' + namespace + '.html'
  print 'process "%s"' % html_path
  html_text = read_text(html_path)
  # We don't wanna host the fonts. Use CDN instead.
  # See https://github.com/Khan/KaTeX
  html_text= re.sub(r'fonts\/KaTeX_', 'https://cdn.jsdelivr.net/npm/katex@0.10.0-beta/dist/fonts/KaTeX_', html_text)
  html_path = 'bin/' + output_html_file_name
  write_text(html_path, html_text)
  write_text('bin/' + file_name + '_latest.html', html_text)

def main():
  os.system('clear')



  print '-' * 80
  os.system('killall -9 node')
  os.system('rm -fr bin')
  os.system('NODE_ENV=production npm run build_bin')

  # ls # BUG: os.system('cp web_app/web_runtime.bundle.js bin/web_runtime.js')

  package_json_text = read_text('./package.json')
  package_json = json.loads(package_json_text)
  namespace = str(package_json['name'] + '-' + package_json['version'] + '-' + package_json['subversion'])
  namespace = re.sub(r'[-\.]+', '_', namespace)

  for html_path in glob.glob('web_app/*.html'):
    build_html_app(html_path, namespace)

  print '#' * 80

  cmds = [
    '# namespace: ' + namespace,
    '# version: ' + package_json['version'],
    '# name: ' + package_json['name'],
    '# subversion: ' + package_json['subversion'],
    '',
  ]

  st = datetime.datetime.fromtimestamp(time.time()).strftime('%Y%m%d%H%M%S')
  namespace = namespace + '_' + st + '_'
  for deploy_path in  glob.glob('bin/*.html'):
    file_name = deploy_path.split('/').pop()
    cmd = '\n\n\n'
    cmd = cmd + 'echo "http://cdn.summitlearning.org/assets/' + namespace + file_name + '"\n'
    cmd = '\n\n\n'
    cmd = cmd + 'aws s3 cp ' + deploy_path + ' '
    cmd = cmd + 's3://opt-static-resources/assets/' + namespace + file_name + ' --grants '
    cmd = cmd + 'read=uri=http://acs.amazonaws.com/groups/global/AllUsers;\n\n'
    cmds.append(cmd)

  print '\n'.join(cmds)
  print '#' * 80

  os.system('touch bin/deploy_to_s3.sh')
  write_text('bin/deploy_to_s3.sh', '\n'.join(cmds))

  print 'done'

main()
