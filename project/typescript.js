const ts = require( 'typescript' );

module.exports = function (gobble, module) {
    gobble(module + '/test/src').transform( 'typescript', {
        noImplicitAny: false,
        sourceMap: true,
        declaration: false,
        target: ts.ScriptTarget.ES6,
        module: ts.ModuleKind.CommonJS,
        removeComments: true,
        jsx: ts.JsxEmit.React,
        typescript: ts,
        listFiles: true
    });
};
