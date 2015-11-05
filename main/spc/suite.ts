/// <reference path="../../typings/tsd.d.ts" />

import * as chai from 'chai';
import chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);

export const expect = chai.expect;
export function eventually(cb: () => Promise<void>) {
    return async (done) => {
        await cb();
        done();
    };
}
