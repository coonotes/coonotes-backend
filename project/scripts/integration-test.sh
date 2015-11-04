#!/bin/bash

./node_modules/gobble-cli/lib/index.js build tmp -f
./node_modules/mocha/bin/_mocha tmp/spc/intr/**/*.spec.js
