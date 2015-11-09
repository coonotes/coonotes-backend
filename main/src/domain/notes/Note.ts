"use strict";

import uuid = require('node-uuid');
import {Entity} from '../../infr/Repository';

export interface NoteCreator {
    createNote(title: string, body: string): Note
}

export interface Note {
    dto(): any

    rename(newName: string): Note
    update(body: string): Note

    share(user: string): Note
    transfer(user: string): Note
}

@Entity
export class DefaultNote implements Note {
    constructor(
        private id: string,
        private owner: string,
        private title: string,
        private body: string,
        private collaborators: string[],
        private permalink: string
    ) {
        if (!owner) {
            throw new Error('note should contain an owner');
        }

        if (!title) {
            throw new Error('note should contain a title');
        }

        this.id = id || uuid.v4();
        this.collaborators = collaborators || [];
    }

    dto(): any {
        return this;
    }

    rename(newName: string): Note {
        return new DefaultNote(this.id, this.owner, newName, this.body, this.collaborators, this.permalink);
    }

    update(body: string): Note {
        return new DefaultNote(this.id, this.owner, this.title, body, this.collaborators, this.permalink);
    }

    share(user: string): Note {
        if (user == this.owner || this.collaborators.indexOf(user) != -1) {
            return this;
        } else {
            const permalink = this.id;
            return new DefaultNote(this.id, this.owner, this.title, this.body, this.collaborators.concat(user), permalink);
        }
    }

    transfer(user: string): Note {
        return new DefaultNote(this.id, user, this.title, this.body, this.collaborators.filter(u => u != user).concat(this.owner), this.permalink);
    }
}

export function CreateNote(id: string, owner: string, title: string, body: string, collaborators: string[], permalink: string) {
    return new DefaultNote(id, owner, title, body, collaborators, permalink);
}

export function CreateNewNote(owner: string, title: string, body: string) {
    return new DefaultNote(undefined, owner, title, body, [], undefined);
}
