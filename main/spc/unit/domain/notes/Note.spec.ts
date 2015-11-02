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
            const whenIHaveAnInvalidNote = () => {
                return () => {
                    Note.CreateNote(test.id, test.owner, test.title, test.body, test.collaborators, test.permalink);
                };
            };
            // endregion
            // region cases
            const thenItShouldThrowAnException = (invalidNote) => {
                expect(invalidNote).to.throw();
            };
            // endregion

            describe(JSON.stringify(test), () => {
                it('should throw an error', () => {
                    const note = whenIHaveAnInvalidNote();
                    thenItShouldThrowAnException(note);
                });
            })
        });
    });
});
