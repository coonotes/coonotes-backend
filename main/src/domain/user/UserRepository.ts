"use strict";

import {Collection} from "mongodb";

import {User, CreateUser, DefaultUser} from "./User";
import * as Q from 'q';

import { SharedConnectionRepository as Repository } from '../../infr/Repository';

export class UserRepository extends Repository<User> {
    constructor(collection?: string) {
        super(collection || "users");
    }

    public async save(user: User): Promise<User> {
        const state = <any> user;
        return await this.upsertOne({ id : { uuid : state.dto().id } }, user);
    }

    public async findByEmail(email: string): Promise<User> {
        return await this.findOneGeneric(DefaultUser,
            {
                "email": email
            }
        );
    }
}
