import {expect, future} from '../suite';

describe('Sanity', () => {
    // region preconditions
    const givenATrue = (cb) => cb(true);
    const givenAnAsyncTrue = async (cb) => await cb(async () => true);
    // endregion preconditions
    // region assertions
    const thenItShouldBeTrue = (value) => expect(value).to.equal(true);
    const thenItShouldBeAsyncTrue = async (value) => expect(await value()).to.equal(true);
    // endregion assertions

    it('true should be true', () => {
        givenATrue(
            thenItShouldBeTrue
        );
    });

    it('support asynchronous testing', future(
        givenAnAsyncTrue(
            thenItShouldBeAsyncTrue
        )
    ));
});
