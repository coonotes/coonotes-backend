/// <reference path="../../../../typings/tsd.d.ts" />
import * as chai from 'chai';
import {SharedConnectionRepository} from '../../../src/infr/Repository';
import {Note, CreateNewNote} from '../../../src/domain/notes/Note';
import {NoteRepository} from '../../../src/domain/notes/NoteRepository';

const expect = chai.expect;

describe("NoteRepository", () => {
    it('should do something', async (done) => {
        await SharedConnectionRepository.connect();
        const note = CreateNewNote("owner", "title", "body");
        const repo = new NoteRepository();
        await repo.save(note);
        await SharedConnectionRepository.disconnect();
        done();
    })
});
