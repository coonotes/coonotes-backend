/// <reference path="../../../../typings/tsd.d.ts" />
"use strict";

import {Collection} from "mongodb";

import {Note, CreateNote} from "./Note";
import * as Q from 'q';

import { SharedConnectionRepository as Repository } from '../../infr/Repository';

export class NoteRepository extends Repository<Note> {
    constructor() {
        super("notes");
    }

    public async save(note: Note): Promise<Note> {
        const state = <any> note;
        return await Q.ninvoke(this.collection(), 'updateOne', { id: state.id, }, state, { upsert: true }).then(() => note);
    }
}
