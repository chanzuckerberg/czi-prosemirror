#!/bin/bash

npm run build:dist > /dev/null

RED='\033[0;31m'
GREEN='\033[0;32m'
NO_COLOR='\033[0m'
if git diff --quiet --exit-code dist/; then
  echo -e "${GREEN}dist/ check passed${NO_COLOR}"
  exit 0
else
  echo -e "${RED}dist/ check failed${NO_COLOR} - run \"npm run build:dist\""
  exit 1
fi