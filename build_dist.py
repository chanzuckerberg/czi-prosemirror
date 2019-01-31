#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os

# Must run this script before committing to repository if JS files within `src`
# had changed.

# Build ES5 modules to lib
# See https://medium.com/netscape/shipping-flowtype-definitions-in-npm-packages-c987917efb65
os.system('rm -fr dist')

presets = [
  'es2015',
  'react',
  'env',
]

plugins = [
  'transform-export-extensions',
  'transform-class-properties',
  'transform-runtime',
  'flow-react-proptypes',
  'transform-object-rest-spread',
  'transform-es2015-parameters',
  'transform-flow-strip-types',
]

node_command = (
  './node_modules/.bin/babel src' +
  '  --out-dir dist' +
  '  --presets=' + ','.join(presets) +
  '  --plugins=' + ','.join(plugins)
)

# Build the ES5 JS files.
print(node_command)
os.system(node_command)

# Generate files for flow types checking.
os.system("node ./node_modules/flow-copy-source/bin/flow-copy-source.js -v -i '**/__tests__/**' src dist")

# Copy CSS files.
os.system('cp src/ui/*.css dist/ui')
os.system('cp src/ui/mathquill-editor/*.css dist/ui/mathquill-editor')
