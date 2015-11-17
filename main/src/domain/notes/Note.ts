"use strict";

import { NoteId } from "./NoteId";
import uuid = require('node-uuid');
import {Entity, ValueObject} from '../../infr/Repository';

export interface NoteCreator {
    createNote(title:string, body:string): Note
}

export interface Note {
    dto(): any

    rename(newName:string): Note
    update(body:string): Note

    share(user:string): Note
    transfer(user:string): Note
}

@Entity
export class DefaultNote implements Note {
    constructor(@ValueObject(NoteId) private id:NoteId,
                private title:string,
                private body:string,
                private collaborators:string[],
                private permalink:string) {
        if (!id) {
            throw new Error('note id must not be null');
        }
        if (!title) {
            throw new Error('note should contain a title');
        }

        this.collaborators = collaborators || [];
    }

    dto():any {
        return this;
    }

    rename(newName:string):Note {
        return new DefaultNote(this.id, newName, this.body, this.collaborators, this.permalink);
    }

    update(body:string):Note {
        return new DefaultNote(this.id, this.title, body, this.collaborators, this.permalink);
    }

    share(user:string):Note {
        if (this.id.asOwner() === user || this.collaborators.indexOf(user) != -1) {
            return this;
        } else {
            const permalink = this.id.single();
            return new DefaultNote(this.id, this.title, this.body, this.collaborators.concat(user), permalink);
        }
    }

    transfer(user:string):Note {
        return new DefaultNote(this.id.own(user), this.title, this.body, this.collaborators.filter(u => u != user).concat(this.id.asOwner()), this.permalink);
    }
}

export function CreateNote(id:NoteId, title:string, body:string, collaborators:string[], permalink:string) {
    return new DefaultNote(id, title, body, collaborators, permalink);
}

export function CreateNewNote(owner:string, title:string, body:string) {
    return new DefaultNote(new NoteId(owner), title, body, [], null);
}
