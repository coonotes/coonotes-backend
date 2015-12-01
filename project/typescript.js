const gobble = require('gobble');
const ts = require('typescript');

module.exports = function (module) {
    return gobble([
        gobble(module).transform('typescript', {
            noImplicitAny: false,
            sourceMap: true,
            target: "ES6",
            module: "CommonJS",
            removeComments: false,
            typescript: ts,
            experimentalDecorators: true
        })
    ]);
};
