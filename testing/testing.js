// We can test our asynchronous RxJS code synchronously and deterministically by virtualizing time using the TestScheduler.
// ASCII marble diagrams provide a visual way for us to represent the behavior of an Observable.
// We can use them to assert that a particular Observable behaves as expected, as well as to create hot and cold Observables we can use as mocks.

// At this time the TestScheduler can only be used to test code that uses timers, like delay/debounceTime/etc (i.e. it uses AsyncScheduler with delays > 1).
// If the code consumes a Promise or does scheduling with AsapScheduler/AnimationFrameScheduler/etc it cannot be reliably tested with TestScheduler, but instead should be tested more traditionally.

const { TestScheduler } = require('rxjs/testing');

const testScheduler = new TestScheduler((actual, expected) => {
  // asserting the two objects are equal
  // e.g. using chai.
  expect(actual).deep.equal(expected);
});

// This test will actually run *synchronously*
it('generate the stream correctly', () => {
  testScheduler.run((helpers) => {
    const { cold, expectObservable, expectSubscriptions } = helpers;
    const e1 = cold('-a--b--c---|');
    const subs = '^----------!';
    const expected = '-a-----c---|';

    expectObservable(e1.pipe(throttleTime(3, testScheduler))).toBe(expected);
    expectSubscriptions(e1.subscriptions).toBe(subs);
  });
});

// The callback function you provide to testScheduler.run(callback) is called with helpers object that contains functions you'll use to write your tests.

// When the code inside this callback is being executed, any operator that uses timers/AsyncScheduler (like delay, debounceTime, etc) will **automatically** use the TestScheduler instead, so that we have "virtual time".
// You do not need to pass the TestScheduler to them, like in the past.

testScheduler.run((helpers) => {
  const { cold, hot, expectObservable, expectSubscriptions, flush } = helpers;
  // use them
});
