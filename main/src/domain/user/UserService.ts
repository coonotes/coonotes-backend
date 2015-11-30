"use strict";

import {UserAlreadyExistException} from "./UserException"
import {User, CreateNewUser, DefaultUser} from "./User";
import {UserRepository} from "./UserRepository";

export class UserService {
    constructor(private repository) {
        this.repository = repository || new UserRepository();
    }

    public async create(username:string, email:string, password:string): Promise<DefaultUser> {
        if(await this.repository.findByEmail(email)) {
            throw new UserAlreadyExistException(email);
        }

        const user = CreateNewUser(username, email, password);
        return await this.repository.save(user);
    }
}
