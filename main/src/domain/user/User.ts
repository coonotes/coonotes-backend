/// <reference path="../../../../typings/node-uuid/node-uuid.d.ts" />
"use strict";

import {Note, CreateNewNote, NoteCreator} from "../notes/Note";

import uuid = require('node-uuid');

export interface User extends NoteCreator {
    dto(): any
}

function validateEmail(a: string) {
    const matches = /^([a-zA-Z0-9\-\.]+)@([a-zA-Z0-9\-\.]+)\.[\w]{2,5}$/.exec(a);
    return matches !== null;
}

export class DefaultUser implements User {
    constructor(private id:string,
                private username:string,
                private email:string,
                private password:string) {
        if (!username) {
            throw new Error('username can not be empty');
        }

        if (!email) {
            throw new Error('email can not be empty');
        }

        if(!validateEmail(email)) {
            throw new Error('email is invalid');
        }

        if (!password) {
            throw new Error('password can not be empty');
        }

        if (password.length < 4) {
            throw new Error('password must be more than 4 characters')
        }

        this.id = id || uuid.v4();
        this.username = username;
        this.email = email;
        this.password = password;
    }

    dto():any {
        return this;
    }

    createNote(title:string, body:string):Note {
        return CreateNewNote(this.id, title, body);
    }
}

export function CreateNewUser(username:string, email:string, password:string) {
    return new DefaultUser(undefined, username, email, password);
}
