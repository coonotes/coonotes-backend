/// <reference path="../../../../../typings/tsd.d.ts" />
import {eventually, expect} from '../../../suite';

import {SharedConnectionRepository} from '../../../../src/infr/Repository';
import {User, CreateNewUser} from '../../../../src/domain/user/User';
import {UserRepository} from '../../../../src/domain/user/UserRepository';

describe("UserRepository", () => {
    it("should create a new user", eventually (async () => {
        await SharedConnectionRepository.connect();
        const user = CreateNewUser("testUser", "valid@email.com", "testPassword");
        const repo = new UserRepository();
        await repo.save(user);

        const userExistPromise = repo.findByEmail('valid@test.com');

        userExistPromise.then((user) => {
            expect(user).to.be.eq(user);
        });
        await SharedConnectionRepository.disconnect();
    }));
});
