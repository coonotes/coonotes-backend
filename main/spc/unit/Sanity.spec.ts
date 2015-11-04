/// <reference path="../../../typings/tsd.d.ts" />

import * as chai from 'chai';
const expect = chai.expect;

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
