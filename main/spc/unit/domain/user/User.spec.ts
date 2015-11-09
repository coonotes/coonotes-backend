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

    const givenAUserWithValidData = (cb) => {
        cb(() => User.CreateNewUser(TestUsername, TestEmail, TestPassword))
    };

    const givenAUser = (cb) => cb(User.CreateNewUser(TestUsername, TestEmail, TestPassword));

    describe('with valid data', () => {
        it('should not throw an exception', () => {
            const thenItNotThrowAnException = (userWithValidData) => {
                expect(userWithValidData).to.not.throw();
            };

            givenAUserWithValidData(
                thenItNotThrowAnException
            );
        });
    });

    describe ('username', () => {
        it('should throw an exception with an empty username', () => {
            const whenUserTryToInsertAnEmptyUsername = (cb) => {
                cb(() => User.CreateNewUser('', TestEmail, TestPassword))
            };
            const thenItShouldThrowAnException = (userWithInvalidEmail) => {
                expect(userWithInvalidEmail).to.throw('username can not be empty');
            };

            whenUserTryToInsertAnEmptyUsername(
                thenItShouldThrowAnException
            );
        });
    });

    describe ('password', () => {
        it('should throw with an empty password', () => {
            const whenUserTryToInsertAnEmptyPassword = (cb) => {
                cb(() => User.CreateNewUser(TestUsername, TestEmail, ''))
            };
            const thenItShouldThrowAnException = (userWithEmptyPassword) => {
                expect(userWithEmptyPassword).to.throw('password can not be empty');
            };

            whenUserTryToInsertAnEmptyPassword(
                thenItShouldThrowAnException
            );
        });

        it('should throw if password is less than 4 characters', () => {
            const whenUserTryToInsertAPasswordWithLessThan4chars = (cb) => {
                cb(() => User.CreateNewUser(TestUsername, TestEmail, 'abc'))
            };
            const thenItShouldThrowAnException = (userWithEmptyPassword) => {
                expect(userWithEmptyPassword).to.throw('password must be more than 4 characters');
            };

            whenUserTryToInsertAPasswordWithLessThan4chars(
                thenItShouldThrowAnException
            );
        });
    });

    describe('email', () => {
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

    describe('dto', () => {
        it('should return dto of a valid user', () => {
            const thenItShouldReturnAnObject = (dto) => (user) => expect(user.dto()).to.contain(dto);

            givenAUser(
                thenItShouldReturnAnObject({ username: TestUsername, email: TestEmail, password: TestPassword })
            )
        });
    });

    describe('creates note', () => {
        it('should not throw with valid data', () => {
            const whenCreateNewNote = (cb) => (user) => cb(() => user.createNote('title', 'body'));
            const thenItShouldReturnANote = (cb) => expect(cb).to.not.throw();

            givenAUser(
                whenCreateNewNote(
                    thenItShouldReturnANote
                )
            );
        });
    });
});
