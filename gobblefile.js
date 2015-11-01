const gobble = require('gobble');
const typescript = require('project/typescript');

module.exports = gobble([
    // We are going to split the project in two modules:
    typescript('domain'), // where the domain logic lives
    typescript('server') // where the server adapter lives
]);
