"use strict";

import {UserDoesNotExistException} from "./UserException";
import {UserAlreadyExistException} from "./UserException"
import {User} from "./User";
import {DefaultUser} from "./User";
import {CreateNewUser} from "./User";
import {UserRepository} from "./UserRepository";

export class UserService {
    constructor(private repository) {
        this.repository = repository || new UserRepository();
    }

    public async create(username:string, email:string, password:string): Promise<DefaultUser> {
        if(await this.repository.findByEmail(email)) {
            throw new UserAlreadyExistException(email);
        }

        let user = CreateNewUser(username, email, password);
        return await this.repository.save(user);
    }

    public async rename(newName:string, email:string): Promise<DefaultUser> {
        let user = await this.repository.findByEmail(email);
        if(!user) {
            throw new UserDoesNotExistException(email);
        }

        let renamedUser = user.rename(newName);

        return await this.repository.save(renamedUser);
    }
}
