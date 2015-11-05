/// <reference path="../../../../../typings/mocha/mocha.d.ts" />
/// <reference path="../../../../../typings/chai/chai.d.ts" />

import chai = require('chai');
import User = require('../../../../src/domain/user/User');
import {DefaultUser} from "../../../../src/domain/user/User";

var expect = chai.expect;

describe('User', () => {
    // region constants
    const TestUsername = 'someone';
    const TestEmail = 'a@b.com';
    const TestPassword = 'S3CR37';
    // endregion

    describe('email', () => {
        it('should create new DefaultUser with valid email', () => {
            const givenAUserWithValidEmail = (cb) => {
                cb(() => User.CreateNewUser(TestUsername, TestEmail, TestPassword))
            };
            const thenItReturnsDefaultUser = (userWithValidMail) => {
                expect(userWithValidMail).to.not.throw();
            };

            givenAUserWithValidEmail(
                thenItReturnsDefaultUser
            );
        });

        it('should throw an error if email is empty', () => {
            const whenUserTryToInsertAnEmptyEmail = (cb) => {
                cb(() => User.CreateNewUser(TestUsername, '', TestPassword))
            };
            const thenItShouldThrowAnException = (userWithInvalidEmail) => {
                expect(userWithInvalidEmail).to.throw('email can not be empty');
            };

            whenUserTryToInsertAnEmptyEmail(
                thenItShouldThrowAnException
            );
        });

        it('should throw an error if email is invalid', () => {
            const whenUserTryToInsertAnInvalidEmail = (cb) => {
                cb(() => User.CreateNewUser(TestUsername, 'invalidMail', TestPassword))
            };
            const thenItShouldThrowAnException = (userWithInvalidEmail) => {
                expect(userWithInvalidEmail).to.throw('email is invalid');
            };

            whenUserTryToInsertAnInvalidEmail(
                thenItShouldThrowAnException
            );
        });
    });
});
