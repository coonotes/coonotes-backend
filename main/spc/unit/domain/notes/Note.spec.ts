/// <reference path="../../../../../typings/mocha/mocha.d.ts" />
/// <reference path="../../../../../typings/chai/chai.d.ts" />

import chai = require('chai');
import Note = require('../../../../src/domain/notes/Note');

var expect = chai.expect;

describe('Note', () => {
    // region constants
    const PredefinedUser = 'someone';
    const Owner = 'owner';
    const SomeNoteName = 'someNewTitle';
    // endregion
    // region exercises
    const exerciseRandomNote = () => Note.CreateNewNote(Owner, 'title', 'body');
    // endregion

    describe('constraints', () => {
        [
            { id: null, owner: null, title: 'someTitle', body: null, collaborators: [], permalink: null },
            { id: null, owner: 'someOwner', title: null, body: null, collaborators: [], permalink: null },
        ].forEach((test) => {
            // region steps
            const whenTryingToBuildAnInvalidNote = (cb) => {
                cb(() => Note.CreateNote(test.id, test.owner, test.title, test.body, test.collaborators, test.permalink))
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

        it("two objects should not have the same id", () => {
            givenTwoNotes(
                thenTheyShouldContainDifferentIds
            );
        });
    });

    describe("DTO", () => {
        // region preconditions
        const givenAPredefinedNote = (cb) => cb(exerciseRandomNote());
        // endregion
        // region assertions
        const thenTheDtoShouldMatch = (dto) => {
            return (note) => expect(note.dto()).to.contain(dto);
        };
        // endregion

        it('should be consistent on a new note', () => {
            givenAPredefinedNote(
                thenTheDtoShouldMatch({ title: 'title', owner: 'owner', body: 'body' })
            )
        });
    });

    describe("renaming a note", () => {
        // region preconditions
        const givenSomeNote = (cb) => cb(exerciseRandomNote());
        // endregion
        // region steps
        const whenRenamingTo = (newName, cb) => (note) => cb(note.rename(newName));
        // endregion
        // region assertions
        const thenItShouldBeNamed = (name) => (note) => expect(note.dto().title).to.equal(name);
        // endregion
        it("should contain the new name", () => {
            givenSomeNote(
                whenRenamingTo(SomeNoteName,
                    thenItShouldBeNamed(SomeNoteName)
                )
            );
        });
    });

    describe("sharing a note", () => {
        // region preconditions
        const givenASharedNoteTo = (toUser, cb) => cb(exerciseRandomNote().share(toUser));
        // endregion
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
});
