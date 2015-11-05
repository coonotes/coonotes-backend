"use strict";

import {expect} from '../../suite';
import {SharedConnectionRepository} from '../../../src/infr/Repository';

describe("Repository", () => {
    // region preconditions
    const givenAMongoConnection = (cb) => cb( SharedConnectionRepository.connect() );
    const givenAnInvalidMongoConnection = (cb) => cb( SharedConnectionRepository.connect('icannotconnecthere') );
    // endregion
    // region assertions
    const thenItShouldNotThrowAnException = (done) => (conn) => {
        expect(conn).to.eventually.be.fulfilled.notify(done);
    };

    const thenItShouldThrowAnException = (done) => (conn) => {
        expect(conn).to.eventually.be.rejected.notify(done);
    };
    // endregion

    afterEach((done) => {
        SharedConnectionRepository.disconnect().then(done);
    });

    describe("connection", () => {
        it("should connect to a single mongo at localhost", (done) => {
            givenAMongoConnection(
                thenItShouldNotThrowAnException(done)
            );
        });


        // TODO Error: timeout of 2000ms exceeded. Ensure the done() callback is being called in this test.
        it("should throw an error when connecting to an invalid mongodb", (done) => {
            givenAnInvalidMongoConnection(
                thenItShouldThrowAnException(done)
            );
        });
    });
});
