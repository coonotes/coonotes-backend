import {eventually, expect, _} from '../../../suite';

import {SharedConnectionRepository} from '../../../../src/infr/Repository';
import {Note, CreateNewNote} from '../../../../src/domain/notes/Note';
import {NoteRepository} from '../../../../src/domain/notes/NoteRepository';

describe("NoteRepository", () => {
    beforeEach(eventually(SharedConnectionRepository.connect));
    afterEach(eventually(SharedConnectionRepository.disconnect));

    // region constants
    const Repository = () => new NoteRepository();
    // endregion
    // region preconditions
    const givenASavedNote = async (cb) => await cb(async () => {
        const note = CreateNewNote("owner", "title", "body");
        await Repository().save(note);
        return note;
    });
    // endregion preconditions
    // region steps
    const whenFindingTheSame = (cb) => async (noteCreator) => {
        const note = await noteCreator();
        await cb(async () => {
            return await Repository().findById(note.dto().id)
        }, note);
    };
    // endregion steps
    const thenTheyShouldBeIdentical = async (foundNote, note) => {
        expect(await foundNote()).to.deep.equal(note);
    };
    // region assertions

    // endregion assertions
    it('should find an already saved note', eventually( async () =>
        await givenASavedNote(
            whenFindingTheSame(
                thenTheyShouldBeIdentical
            )
        )
    ));
});
