import {eventually, expect} from '../../../suite';

import {SharedConnectionRepository} from '../../../../src/infr/Repository';
import {UserRepository} from '../../../../src/domain/user/UserRepository';
import {UserService} from "../../../../src/domain/user/UserService";
import {DefaultUser} from "../../../../src/domain/user/User";
import {UserAlreadyExistException} from "../../../../src/domain/user/UserException";

describe("UserRepository", () => {
    const Repository = () => new UserRepository();
    const Service = () => new UserService(Repository());

    beforeEach(eventually(async () => {
        await SharedConnectionRepository.connect();
        await Repository().drop();
    }));

    afterEach(eventually(SharedConnectionRepository.disconnect));

    it("should create a new user", (async () => {
        const user = Service().create("testUser", "valid@email.com", "testPassword");

        await expect(user).to.be.eventually.instanceOf(DefaultUser);
    }));

    //it("should throw UserAlreadyExistException if email already exist", (async () => {
    //    await Service().create("testUser", "valid@email.com", "testPassword");
    //    const duplicatedUser = () => Service().create("testUser", "valid@email.com", "testPassword");
    //
    //    expect(duplicatedUser()).to.eventually.not.throw(UserAlreadyExistException);
    //}));
});
