/// <reference path="../../../../typings/tsd.d.ts" />
"use strict";

import * as Q from 'q';
import * as chai from 'chai';

import {SharedConnectionRepository} from '../../../src/infr/Repository';

const expect = chai.expect;

describe("Repository", () => {
    // region preconditions
    const givenAMongoConnection = (cb) => cb( SharedConnectionRepository.connect() );
    const givenAnInvalidMongoConnection = (cb) => cb( SharedConnectionRepository.connect('icannotconnecthere') );
    // endregion
    // region assertions
    const thenItShouldNotThrowAnException = (done) => async (conn) => {
        await conn;
        await SharedConnectionRepository.disconnect();
        done();
    };

    const thenItShouldThrowAnException = (done) => async (conn) => {
        try {
            await conn;
            done('It did not throw an error');
        } catch (e) {
            done();
        } finally {
            await SharedConnectionRepository.disconnect();
        }
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
