"use strict";

import {NoteId} from "./NoteId";
import {Note, DefaultNote} from "./Note";
import { SharedConnectionRepository as Repository } from '../../infr/Repository';

export class NoteRepository extends Repository<Note> {
    constructor(collection?: string) {
        super(collection || "notes");
    }

    public async findById(id: NoteId): Promise<Note> {
        return await this.findOneGeneric(DefaultNote, { id : id });
    }

    public async saveBySingle(note: Note): Promise<Note> {
        const state = <any> note;
        return await Q.ninvoke(this.collection(), 'updateOne', { id : { uuid: state.dto().id.uuid } }, state, { upsert : true }).then(() => note);
    }
}
