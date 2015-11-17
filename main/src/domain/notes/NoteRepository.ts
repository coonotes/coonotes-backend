"use strict";

import { NoteId } from "./NoteId";
import { Note, DefaultNote } from "./Note";
import { SharedConnectionRepository as Repository } from '../../infr/Repository';

export class NoteRepository extends Repository<Note> {
    constructor(collection?: string) {
        super(collection || "notes");
    }

    public async findById(id: NoteId): Promise<Note> {
        return await this.findOneGeneric(DefaultNote,
          {
              "id.uuid": id.single(),
              "$or": [
                  { "id.owner": id.asOwner() },
                  {"collaborators": { "$in": [ id.asOwner() ] } }
              ]
          }
        );
    }

    public async save(note: Note): Promise<Note> {
        const state = <any> note;
        return await this.upsertOne({ id : { uuid: state.dto().id.uuid } }, note);
    }
}

/**
 db.notes.find(
 { $or: [
 { "id.uuid": "f3f430a3-f22f-475f-af54-67be932c9b14" },
 { "id.owner": "a", "collaborators": { $in: [ "a" ] } }
 ]}).pretty()
**/
