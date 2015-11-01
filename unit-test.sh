#!/bin/bash

./node_modules/gobble-cli/lib/index.js build tmp -f
mocha tmp/unit/**/*.spec.js
