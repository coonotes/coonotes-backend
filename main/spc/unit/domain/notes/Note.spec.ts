/// <reference path="../../../../../typings/mocha/mocha.d.ts" />
/// <reference path="../../../../../typings/chai/chai.d.ts" />

import chai = require('chai');
import Note = require('../../../../src/domain/notes/Note');

var expect = chai.expect;

describe('Note', () => {
    describe('constraints', () => {
        [
            { id: null, owner: null, title: 'someTitle', body: null, collaborators: [], permalink: null },
            { id: null, owner: 'someOwner', title: null, body: null, collaborators: [], permalink: null },
        ].forEach((test) => {
            // region preconditions
            const givenAnInvalidNote = (cb) => {
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
                    givenAnInvalidNote(
                        thenItShouldThrowAnException
                    );
                });
            });
        });
    });

    describe("id", () => {
        // region exercises
        const exerciseRandomNote = () => Note.CreateNewNote('owner', 'title', 'body');
        // endregion
        // region preconditions
        const givenTwoNotes = (cb) => {
            cb(exerciseRandomNote(), exerciseRandomNote());
        };
        // endregion

        // region cases
        const thenTheyShouldContainDifferentIds = (a, b) => expect(a.dto().id).to.not.equal(b.dto().id);
        // endregion

        it("should not have any object the same id", () => {
            givenTwoNotes(
                thenTheyShouldContainDifferentIds
            );
        });
    });
});
