"use strict";

import {Collection} from "mongodb";

import {User, CreateUser} from "./User";
import * as Q from 'q';

import { SharedConnectionRepository as Repository } from '../../infr/Repository';

export class UserRepository extends Repository<User> {
    constructor(collection?:string) {
        super(collection || "users");
    }

    public async save(user:User):Promise<User> {
        const state = <any> user;
        return await Q.ninvoke(this.collection(), 'updateOne', {id: state.id,}, state, {upsert: true}).then(() => user);
    }

    public async findByEmail(email:string):Promise<User> {
        return await Q.ninvoke(this.collection(), "findOne", {email: email}).then((item) => {
            return CreateUser(item['id'], item['username'], item['email'], item['password']);
        });
    }
}
