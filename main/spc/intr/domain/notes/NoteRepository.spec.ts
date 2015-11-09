import {eventually, expect, _} from '../../../suite';

import {SharedConnectionRepository} from '../../../../src/infr/Repository';
import {Note, CreateNewNote} from '../../../../src/domain/notes/Note';
import {NoteRepository} from '../../../../src/domain/notes/NoteRepository';

describe("NoteRepository", () => {
    beforeEach(eventually(SharedConnectionRepository.connect));
    afterEach(eventually(SharedConnectionRepository.disconnect));

    it('should do something', eventually (async () => {
        const note = CreateNewNote("owner", "title", "body");
        const repo = new NoteRepository();
        await repo.save(note);
        const loadedNote = await repo.findById(note.dto().id);

        console.log("on Expect", _(loadedNote), _(note));
        expect(note).to.contain(loadedNote);
    }));
});
