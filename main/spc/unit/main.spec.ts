/// <reference path="../../../typings/mocha/mocha.d.ts" />
/// <reference path="../../../typings/chai/chai.d.ts" />

/**
 * Module dependencies.
 */
import chai = require('chai');

/**
 * Globals
 */

var expect = chai.expect;

/**
 * Unit tests
 */
describe('User Model Unit Tests:', () => {

    describe('2 + 4', () => {
        it('should be 6', () => {
            expect(2+4).to.equals(6);
        });

        it('should not be 7', () => {
            expect(2+4).to.not.equals(7);
        });
    });
});
