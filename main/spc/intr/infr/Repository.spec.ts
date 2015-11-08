"use strict";

import {expect, eventually} from '../../suite';
import {SharedConnectionRepository} from '../../../src/infr/Repository';

describe("Repository", () => {
    const SlowTimeout = 10000;

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

    afterEach(eventually ( async () => {
        await SharedConnectionRepository.disconnect();
    }));

    describe("connection", () => {
        it("should connect to a single mongo at localhost", (done) => {
            givenAMongoConnection(
                thenItShouldNotThrowAnException(done)
            );
        });


        it("should throw an error when connecting to an invalid mongodb (slow)", function (done) {
            this.timeout(SlowTimeout);
            givenAnInvalidMongoConnection(
                thenItShouldThrowAnException(done)
            );
        });
    });
});
