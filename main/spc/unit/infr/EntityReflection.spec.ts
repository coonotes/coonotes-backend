"use strict";

import {expect} from '../../suite';
import {ValueObject, Entity} from '../../../src/infr/Repository';

@Entity
class Bar {
    constructor(private n: number) {
        if (n < 0) throw "It must be 0 or positive";
    }

    sayBar() {
        return "Hi!";
    }
}
@Entity
class Foo {
    constructor(private a: string, private b: string, @ValueObject(Bar) public c: Bar) {
        if (a === "") throw "Some Error";
    }
}

describe('EntityReflection', () => {
    // region constants
    const ValidMap = {a: "aa", b: "bb", c: { n: 5 } };
    const InvalidMap = {a: "", b: "some", c: { n: 5 } };
    const InvalidMapForValueObject = {a: "aa", b: "some", c: { n: -5} };
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
    const thenTheValueObjectShouldBeCallable = (entity) => expect(entity().c.sayBar()).to.equal('Hi!');
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

    it('should fail on invalid object (running the primary constructor)', () => {
        givenAClass(
            whenCalledTheMapperWithMap(InvalidMap,
                thenItShouldFail
            )
        );
    });

    it('should fail on invalid object (when a value object fails)', () => {
        givenAClass(
            whenCalledTheMapperWithMap(InvalidMapForValueObject,
                thenItShouldFail
            )
        );
    });

    it('should build real value objects', () => {
        givenAClass(
            whenCalledTheMapperWithMap(ValidMap,
                thenTheValueObjectShouldBeCallable
            )
        );
    });
});
