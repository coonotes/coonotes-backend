#!/bin/sh

./node_modules/gobble-cli/lib/index.js build tmp -f
node tmp/main.js
