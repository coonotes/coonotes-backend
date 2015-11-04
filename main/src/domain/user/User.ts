/// <reference path="../../../../typings/node-uuid/node-uuid.d.ts" />
"use strict";

import uuid = require('node-uuid');
import Note = require('../notes/Note');

export interface User {
    dto(): any
}

class DefaultUser implements User, Note.NoteCreator {
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
        // TODO check if email is valid with a regexp

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
        return new Note.CreateNewNote(this.id, title, body);
    }
}

export function RegisterNewUser(username:string, email:string, password:string) {
    return new DefaultUser(undefined, username, email, password);
}
