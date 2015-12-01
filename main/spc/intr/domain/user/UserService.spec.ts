"use strict";

import {Repository} from "../../../../src/infr/Repository";
import {eventually, expect} from '../../../suite';
import {SharedConnectionRepository} from '../../../../src/infr/Repository';
import {UserRepository} from '../../../../src/domain/user/UserRepository';
import {UserService} from "../../../../src/domain/user/UserService";
import {DefaultUser} from "../../../../src/domain/user/User";
import {UserAlreadyExistException} from "../../../../src/domain/user/UserException";

describe("UserService", () => {
    const Repository = () => new UserRepository();
    const Service = () => new UserService(Repository());

    beforeEach(eventually(async () => {
        await SharedConnectionRepository.connect();
        await Repository().drop();
    }));

    afterEach(eventually(SharedConnectionRepository.disconnect));

    it("should create a new user", (async () => {
        let user = Service().create("testUser", "valid@email.com", "testPassword");

        await expect(user).to.be.eventually.instanceOf(DefaultUser);
    }));

    it("should rename a user", (async () => {
        await Service().create("testUser", "userRenamed@email.com", "testPassword");
        await Service().rename("newName", "userRenamed@email.com");

        const findedRenamedUser = await Repository().findByEmail("userRenamed@email.com");

        await expect(findedRenamedUser).to.be.have.property("username", "newName");
    }));

    //it("should throw UserAlreadyExistException if email already exist", (async () => {
    //    await Service().create("testUser", "valid@email.com", "testPassword");
    //    let duplicatedUser = () => Service().create("testUser", "valid@email.com", "testPassword");
    //
    //    expect(duplicatedUser()).to.eventually.not.throw(UserAlreadyExistException);
    //}));
});
