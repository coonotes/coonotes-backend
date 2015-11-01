const gobble = require('gobble');
const typescript = require('./project/typescript');

module.exports = gobble([
    typescript('main')
]);
