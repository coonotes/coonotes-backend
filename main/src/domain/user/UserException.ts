"use strict";

export class UserException extends Error {
    constructor(message?:string) {
        message = message || "User exception.";
        super(message);
    }
}

export class UserAlreadyExistException extends UserException {
    constructor(private email: string) {
        super("Email " + email + " already exists.")
    }
}

export class UserDoesNotExistException extends UserException {
    constructor(private email: string) {
        super("Email " + email + " does not exists.")
    }
}
