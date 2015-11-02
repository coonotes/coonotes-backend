/// <reference path="../../../typings/mocha/mocha.d.ts" />
/// <reference path="../../../typings/chai/chai.d.ts" />

import chai = require('chai');
var expect = chai.expect;

describe('Sanity', () => {
    it('true should be true', () => {
        expect(true).to.equal(true);
    });

    it('support asynchronous testing', async (done) => {
        const f = async () => true;
        expect(await f()).to.equal(true);
        done();
    });
});
