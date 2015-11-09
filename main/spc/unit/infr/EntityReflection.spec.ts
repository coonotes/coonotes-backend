"use strict";

import {expect} from '../../suite';
import {Entity} from '../../../src/infr/Repository';

@Entity
class Foo {
    constructor(private a:string, private b:string) {
        if (a === "") throw "Some Error";
    }
}

describe('EntityReflection', () => {
    // region constants
    const ValidMap = {a: "aa", b: "bb"};
    const InvalidMap = {a: "", b: "some"};
    // endregion
    // region preconditions
    const givenAClass = (cb) => cb(<any> Foo.prototype);
    // endregion preconditions
    // region steps
    const whenCalledTheMapperWithMap = (map, cb) => (theClass) => cb(() => theClass._constructorForMap(map));
    // endregion
    // region assertions
    const thenItShouldContainTheConstructorForMapMethod = (theClass) => expect(theClass._constructorForMap).to.not.equal(null);
    const thenItShouldEqual = (map) => (entity) => expect(JSON.stringify(entity())).to.equal(JSON.stringify(map));
    const thenItShouldFail = (entity) => expect(entity).to.throw();
    // endregion
    it('should contain a _constructorForMap method', () => {
        givenAClass(
            thenItShouldContainTheConstructorForMapMethod
        );
    });

    it('should build only valid object (running the primary constructor)', () => {
        givenAClass(
            whenCalledTheMapperWithMap(ValidMap,
                thenItShouldEqual(ValidMap)
            )
        );
    });

    it('should build fail on invalid object (running the primary constructor)', () => {
        givenAClass(
            whenCalledTheMapperWithMap(InvalidMap,
                thenItShouldFail
            )
        );
    });
});
