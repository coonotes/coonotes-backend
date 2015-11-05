/// <reference path="../../../../../typings/tsd.d.ts" />
import {eventually, expect} from '../../../suite';

import {SharedConnectionRepository} from '../../../../src/infr/Repository';
import {Note, CreateNewNote} from '../../../../src/domain/notes/Note';
import {NoteRepository} from '../../../../src/domain/notes/NoteRepository';

describe("NoteRepository", () => {
    it('should do something', eventually (async () => {
        await SharedConnectionRepository.connect();
        const note = CreateNewNote("owner", "title", "body");
        const repo = new NoteRepository();
        await repo.save(note);
        await SharedConnectionRepository.disconnect();
    }));
});
