#!/bin/bash

./node_modules/gobble-cli/lib/index.js build tmp -f

mkdir -p reports

MOCHA=./node_modules/mocha/bin/_mocha
ISTANBUL=./node_modules/istanbul/lib/cli.js
DIR=tmp/spc/**/**/**/**/**/**/**/*.spec.js

${ISTANBUL} cover --dir ./reports ${MOCHA} -- -c -R dot -S -u bdd ${DIR}