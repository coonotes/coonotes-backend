#!/bin/bash

./node_modules/gobble-cli/lib/index.js build tmp -f
mocha tmp/spc/intr/**/*.spec.js
