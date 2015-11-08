const gobble = require('gobble');
const ts = require( 'typescript' );

module.exports = function (module) {
        return gobble([
            gobble(module).transform('typescript', {
                noImplicitAny: false,
                sourceMap: true,
                target: ts.ScriptTarget.ES6,
                module: ts.ModuleKind.CommonJS,
                removeComments: false,
                typescript: ts,
                experimentalDecorators: true
            })
        ]);
};
