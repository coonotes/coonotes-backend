import {eventually, expect} from '../../../suite';

import {SharedConnectionRepository} from '../../../../src/infr/Repository';
import {User, CreateNewUser} from '../../../../src/domain/user/User';
import {UserRepository} from '../../../../src/domain/user/UserRepository';

describe("UserRepository", () => {
    const repo = new UserRepository();

    beforeEach(eventually(async () => {
        await SharedConnectionRepository.connect();
        await repo.drop();
    }));

    afterEach(eventually(SharedConnectionRepository.disconnect));

    it("should create a new user", (async () => {
        const user = CreateNewUser("testUser", "valid@email.com", "testPassword");

        await repo.save(user);

        await expect(repo.findByEmail('valid@email.com')).to.eventually.deep.equal(user);
    }));

    it("should update username", (async () => {
        var user = CreateNewUser("testUser", "valid@email.com", "testPassword");
        await repo.save(user);

        user = user.rename("newTestUser");
        await repo.save(user);

        await expect(repo.findByEmail("valid@email.com")).to.eventually.have.property('username', 'newTestUser');
    }));
});
