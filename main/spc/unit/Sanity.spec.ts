/// <reference path="../../../typings/tsd.d.ts" />

import {expect} from '../suite';

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
