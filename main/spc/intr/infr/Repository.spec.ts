/// <reference path="../../../../typings/tsd.d.ts" />
"use strict";

import * as chai from 'chai';
import {SharedConnectionRepository} from '../../../src/infr/Repository';

const expect = chai.expect;

describe("Repository", () => {
    // region preconditions
    const givenAMongoConnection = (cb) => SharedConnectionRepository.initialize(undefined, undefined, undefined, cb);
    const givenAnInvalidMongoConnection = (cb) => SharedConnectionRepository.initialize('icannotconnecthere', '80', 'errorplx', cb);
    // endregion
    // region assertions
    const thenItShouldNotThrowAnException = (done) => (err) => {
        expect(err).to.equal(undefined);
        SharedConnectionRepository.close(done);
    };

    const thenItShouldThrowAnException = (done) => (err) => {
        expect(err).to.not.equal(undefined);
        SharedConnectionRepository.close(done);
    };
    // endregion

    describe("connection", () => {
        it("should connect to a single mongo at localhost", (done) => {
            givenAMongoConnection(
                thenItShouldNotThrowAnException(done)
            );
        });

        it("should throw an error when connecting to an invalid mongodb", (done) => {
            givenAnInvalidMongoConnection(
                thenItShouldThrowAnException(done)
            );
        });
    });
});
