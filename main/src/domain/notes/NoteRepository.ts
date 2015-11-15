"use strict";

import {Note, DefaultNote} from "./Note";
import { SharedConnectionRepository as Repository } from '../../infr/Repository';

export class NoteRepository extends Repository<Note> {
    constructor(collection?: string) {
        super(collection || "notes");
    }

    public async findById(id: string): Promise<Note> {
        return await this.findOneGeneric(DefaultNote, {id: id});
    }
}
