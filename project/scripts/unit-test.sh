#!/bin/bash

./node_modules/gobble-cli/lib/index.js build tmp -f
./node_modules/mocha/bin/_mocha -R dot tmp/spc/unit/**/**/**/**/**/**/**/*.spec.js

