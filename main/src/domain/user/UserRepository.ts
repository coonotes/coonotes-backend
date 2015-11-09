"use strict";

import {Collection} from "mongodb";

import {User, CreateNewUser} from "./User";
import * as Q from 'q';

import { SharedConnectionRepository as Repository } from '../../infr/Repository';

export class UserRepository extends Repository<User> {
    constructor(collection?: string) {
        super(collection || "users");
    }

    public findByEmail(email:string):void {
        Q.ninvoke(this.collection(), "findOne", {email: email}).then((data) => {
            console.log(data);
        });
    }
}
