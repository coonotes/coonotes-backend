/// <reference path="../../../../typings/tsd.d.ts" />
"use strict";

import {Collection} from "mongodb";

import {User, CreateNewUser} from "./User";
import * as Q from 'q';

import { SharedConnectionRepository as Repository } from '../../infr/Repository';

export class UserRepository extends Repository<User> {
    constructor(collection?: string) {
        super(collection || "users");
    }

    public async save(user:User):Promise<User> {
        const state = <any> user;
        return await Q.ninvoke(this.collection(), 'updateOne', {id: state.id,}, state, {upsert: true}).then(() => user);
    }

    public findByEmail(email:string):void {
        Q.ninvoke(this.collection(), "findOne", {email: email}).then((data) => {
            console.log(data);
        });
    }
}
