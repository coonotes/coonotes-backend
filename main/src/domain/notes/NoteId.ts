"use strict";

import uuidGenerator = require('node-uuid');
import { Entity } from '../../infr/Repository';

export interface NoteIdCreator {
    createNoteId(uuid?: string): NoteId
}

@Entity
export class NoteId {
    constructor(private owner: string, private uuid?: string) {
        if (owner == null || owner.trim() === "") {
            throw "owner must not be empty!";
        }

        this.uuid = uuid || uuidGenerator.v4();
    }

    own(owner: string): NoteId {
        return new NoteId(owner, this.uuid);
    }

    asOwner() {
        return this.owner;
    }

    single(): string {
        return this.uuid;
    }
}
