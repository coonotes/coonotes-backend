/// <reference path="../../typings/tsd.d.ts" />

import * as chai from 'chai';
import chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);

export const _ = JSON.stringify;
export const expect = chai.expect;
export function eventually(cb: () => Promise<any>) {
    return (done) => cb().then(() => done(), done);
}

export function future(cb: Promise<any>) {
    return (done) => cb.then(() => done(), done);
}
