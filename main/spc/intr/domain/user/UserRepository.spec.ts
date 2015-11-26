import {eventually, expect} from '../../../suite';

import {SharedConnectionRepository} from '../../../../src/infr/Repository';
import {User, CreateNewUser} from '../../../../src/domain/user/User';
import {UserRepository} from '../../../../src/domain/user/UserRepository';

describe("UserRepository", () => {
    const Repository = () => new UserRepository();

    beforeEach(eventually(async () => {
        await SharedConnectionRepository.connect();
        await Repository().drop();
    }));

    afterEach(eventually(SharedConnectionRepository.disconnect));

    it("should create a new user", (async () => {
        const user = CreateNewUser("testUser", "valid@email.com", "testPassword");

        await Repository().save(user);

        await expect(Repository().findByEmail('valid@email.com')).to.eventually.deep.equal(user);
    }));

    it("should update username", (async () => {
        var user = CreateNewUser("testUser", "valid@email.com", "testPassword");
        await Repository().save(user);

        var renamedUser = user.rename("newTestUser");
        var newUser = await Repository().save(renamedUser);

        expect(newUser).to.have.property('username', 'newTestUser');
    }));

    it("should find user by email", (async () => {
        var user = CreateNewUser("testUser", "valid@email.com", "testPassword");
        await Repository().save(user);

        var findedUser = await Repository().findByEmail("valid@email.com");

        expect(findedUser).to.deep.equal(user);
    }));
});
