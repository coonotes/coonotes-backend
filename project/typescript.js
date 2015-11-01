const gobble = require('gobble');
const ts = require( 'typescript' );

module.exports = function (module) {
        return gobble([
            gobble(module + '/src/').transform('typescript', {
                noImplicitAny: false,
                sourceMap: true,
                declaration: false,
                target: ts.ScriptTarget.ES6,
                module: ts.ModuleKind.CommonJS,
                removeComments: true,
                typescript: ts,
                listFiles: true,
                out: "build/dist/" + module + ".js"
            }),

            gobble(module + '/spc/').transform('typescript', {
                noImplicitAny: false,
                sourceMap: true,
                declaration: false,
                target: ts.ScriptTarget.ES6,
                module: ts.ModuleKind.CommonJS,
                removeComments: false,
                typescript: ts,
                listFiles: true
            })
        ]);
};
