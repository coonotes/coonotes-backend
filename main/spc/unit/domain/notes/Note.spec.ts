import {expect} from '../../../suite';
import {Note, CreateNewNote, CreateNote} from '../../../../src/domain/notes/Note';

describe('Note', () => {
    // region constants
    const PredefinedUser = 'someone';
    const Owner = 'owner';
    const SomeNoteName = 'someNewTitle';
    const SomeNoteBody = 'SomeBodyToLove';
    // endregion
    // region exercises
    const exerciseRandomNote = () => CreateNewNote(Owner, 'title', 'body');
    // endregion
    // region preconditions
    const givenSomeNote = (cb) => cb(exerciseRandomNote());
    const givenASharedNoteTo = (toUser, cb) => cb(exerciseRandomNote().share(toUser));
    // endregion

    describe('constraints', () => {
        [
            { id: null, owner: null, title: 'someTitle', body: null, collaborators: [], permalink: null },
            { id: null, owner: 'someOwner', title: null, body: null, collaborators: [], permalink: null },
        ].forEach((test) => {
            // region steps
            const whenTryingToBuildAnInvalidNote = (cb) => {
                cb(() => CreateNote(test.id, test.owner, test.title, test.body, test.collaborators, test.permalink))
            };
            // endregion
            // region cases
            const thenItShouldThrowAnException = (invalidNote) => {
                expect(invalidNote).to.throw();
            };
            // endregion

            describe(JSON.stringify(test), () => {
                it('should throw an error', () => {
                    whenTryingToBuildAnInvalidNote(
                        thenItShouldThrowAnException
                    );
                });
            });
        });
    });

    describe("uniqueness", () => {
        // region preconditions
        const givenTwoNotes = (cb) => {
            cb(exerciseRandomNote(), exerciseRandomNote());
        };
        // endregion
        // region cases
        const thenTheyShouldContainDifferentIds = (a, b) => expect(a.dto().id).to.not.equal(b.dto().id);
        // endregion

        it("two notes should not have the same id", () => {
            givenTwoNotes(
                thenTheyShouldContainDifferentIds
            );
        });
    });

    describe("DTO", () => {
        // region assertions
        const thenTheDtoShouldMatch = (dto) => (note) => expect(note.dto()).to.contain(dto);
        // endregion

        it('should be consistent on a new note', () => {
            givenSomeNote(
                thenTheDtoShouldMatch({ title: 'title', owner: 'owner', body: 'body' })
            )
        });
    });

    describe("renaming a note", () => {
        // region steps
        const whenRenamingTo = (newName, cb) => (note) => cb(note.rename(newName));
        // endregion
        // region assertions
        const thenItShouldBeNamed = (name) => (note) => expect(note.dto()).to.contain({ title: name });
        // endregion
        it("should contain the new name", () => {
            givenSomeNote(
                whenRenamingTo(SomeNoteName,
                    thenItShouldBeNamed(SomeNoteName)
                )
            );
        });
    });

    describe('updating a note', () => {
        // region steps
        const whenUpdatingTheBodyTo = (newBody, cb) => (note) => cb(note.update(newBody));
        // endregion
        // region assertions
        const thenTheBodyShouldBe = (body) => (note) => expect(note.dto().body).to.equal(body);
        // endregion

        it('should contain the new body', () => {
            givenSomeNote(
                whenUpdatingTheBodyTo(SomeNoteBody,
                    thenTheBodyShouldBe(SomeNoteBody)
                )
            );
        });
    });

    describe("sharing a note", () => {
        // region steps
        const whenSharingTheNoteTo = (toUser, cb) => (note) => cb(note.share(toUser));
        // endregion
        // region assertions
        const thenItShouldContainTheCollaboratorOnce = (collaborator) => {
            return (note) => expect(note.dto().collaborators).to.deep.equal([collaborator]);
        };

        const thenItShouldNotContainTheCollaborator = (collaborator) => {
            return (note) => expect(note.dto().collaborators).to.not.contain([collaborator]);
        };

        const thenItShouldContainAPermalink = (note) => expect(note.dto().permalink).to.not.equal(null);
        // endregion

        it('should contain a new collaborator', () => {
            givenASharedNoteTo(PredefinedUser,
                thenItShouldContainTheCollaboratorOnce(PredefinedUser)
            );
        });

        it('should contain a permalink', () => {
            givenASharedNoteTo(PredefinedUser,
                thenItShouldContainAPermalink
            );
        });

        it('should not share again to the same person', () => {
            givenASharedNoteTo(PredefinedUser,
                whenSharingTheNoteTo(PredefinedUser,
                    thenItShouldContainTheCollaboratorOnce(PredefinedUser)
                )
            );
        });

        it('should not share to the owner of the note', () => {
            givenASharedNoteTo(PredefinedUser,
                whenSharingTheNoteTo(Owner,
                    thenItShouldNotContainTheCollaborator(Owner)
                )
            );
        });
    });

    describe("transfering the note ownership", () => {
        // region steps
        const whenTransferingTheNoteTo = (user, cb) => (note) => cb(note.transfer(user));
        // endregion
        // region assertions
        const thenTheCollaboratorAndTheOwnerMustSwap = (newOwner, newColl) => (note) => {
            const dto = note.dto();
            expect(dto.owner).to.equal(newOwner);
            expect(dto.collaborators).to.contain(newColl);
        };
        // endregion
        it('should swap the collaborator and the new owner', () => {
            givenASharedNoteTo(PredefinedUser,
                whenTransferingTheNoteTo(PredefinedUser,
                    thenTheCollaboratorAndTheOwnerMustSwap(PredefinedUser, Owner)
                )
            )
        });
    });
});
