"use strict";

import {Note, CreateNewNote, NoteCreator} from "../notes/Note";

import uuid = require('node-uuid');
// var bcrypt = require('bcrypt');

export interface User extends NoteCreator {
    dto(): any
}

function validateEmail(email: string) {
    const matches = /^([a-zA-Z0-9\-\.]+)@([a-zA-Z0-9\-\.]+)\.[\w]{2,5}$/.exec(email);
    return matches !== null;
}

export class DefaultUser implements User {
    constructor(private id: string,
                private username: string,
                private email: string,
                private password: string) {
        if (!username) {
            throw new Error('username can not be empty');
        }

        if (!email) {
            throw new Error('email can not be empty');
        }

        if (!validateEmail(email)) {
            throw new Error('email is invalid');
        }

        if (!password) {
            throw new Error('password can not be empty');
        }

        if (password.length < 4) {
            throw new Error('password must be more than 4 characters')
        }

        // var salt = bcrypt.genSaltSync(10);

        this.id       = id || uuid.v4();
        this.username = username;
        this.email    = email;
        this.password = password;
        // TODO hash password and test it
        // this.password = bcrypt.hashSync(password, salt);
    }

    dto(): any {
        return this;
    }

    createNote(title: string, body: string): Note {
        return CreateNewNote(this.id, title, body);
    }

    rename(newName: string): DefaultUser {
        return new DefaultUser(this.id, newName, this.email, this.password);
    }
}

export function CreateNewUser(username: string, email: string, password: string) {
    return new DefaultUser(undefined, username, email, password);
}

export function CreateUser(id: string, username: string, email: string, password: string) {
    return new DefaultUser(id, username, email, password);
}
