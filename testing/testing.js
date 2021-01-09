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

// Marble Syntax
// In the context of TestScheduler, a marble diagram is a string containing special syntax representing events happening over virtual time.
// Time progresses by frames. The first character of any marble string always represents the zero frame, or the start of time.
// Inside of testScheduler.run(callback) the frameTimeFactor is set to 1, which means one frame is equal to one virtual millisecond.

// How many virtual milliseconds one frame represents depends on the value of TestScheduler.frameTimeFactor. For legacy reasons the value of frameTimeFactor is 1 only when your code inside the testScheduler.run(callback) callback is running. Outside of it, it's set to 10. This will likely change in a future version of RxJS so that it is always 1.

// IMPORTANT: This syntax guide refers to usage of marble diagrams when using the new testScheduler.run(callback). The semantics of marble diagrams when using the TestScheduler manually are different, and some features like the new time progression syntax are not supported.

// ' ' whitespace: horizontal whitespace is ignored, and can be used to help vertically align multiple marble diagrams.
// '-' frame: 1 "frame" of virtual time passing (see above description of frames).
// [0-9]+[ms|s|m] time progression: the time progression syntax lets you progress virtual time by a specific amount. It's a number, followed by a time unit of ms (milliseconds), s (seconds), or m (minutes) without any space between them, e.g. a 10ms b. See Time progression syntax for more details.
// '|' complete: The successful completion of an observable. This is the observable producer signaling complete().
// '#' error: An error terminating the observable. This is the observable producer signaling error().
// [a-z0-9] e.g. 'a' any alphanumeric character: Represents a value being emitted by the producer signaling next(). Also consider that you could map this into an object or an array like this:

const expected = '400ms (a-b|)';
const values = {
  a: 'value emitted',
  b: 'another value emitter',
};

expectObservable(someStreamForTesting).toBe(expected, values);
// This would work also
const expected = '400ms (0-1|)';
const values = ['value emitted', 'another value emitted'];

expectObservable(someStreamForTesting).toBe(expected, values);

// Time progression syntax
// The new time progression syntax takes inspiration from the CSS duration syntax. It's a number (int or float) immediately followed by a unit; ms (milliseconds), s (seconds), m (minutes). e.g. 100ms, 1.4s, 5.25m.

// When it's not the first character of the diagram it must be padded a space before/after to disambiguate it from a series of marbles. e.g. a 1ms b needs the spaces because a1msb will be interpreted as ['a', '1', 'm', 's', 'b'] where each of these characters is a value that will be next()'d as-is.

// NOTE: You may have to subtract 1 millisecond from the time you want to progress because the alphanumeric marbles (representing an actual emitted value) advance time 1 virtual frame themselves already, after they emit. This can be very unintuitive and frustrating, but for now it is indeed correct.

const input = ' -a-b-c|';
const expected = '-- 9ms a 9ms b 9ms (c|)';
/*
 
// Depending on your personal preferences you could also
// use frame dashes to keep vertical aligment with the input
const input = ' -a-b-c|';
const expected = '------- 4ms a 9ms b 9ms (c|)';
// or
const expected = '-----------a 9ms b 9ms (c|)';
 
*/

const result = cold(input).pipe(concatMap((d) => of(d).pipe(delay(10))));

expectObservable(result).toBe(expected);

// Subscription Marbles
// The expectSubscriptions helper allows you to assert that a cold() or hot() Observable you created was subscribed/unsubscribed to at the correct point in time. The subscriptionMarbles parameter to expectObservable allows your test to defer subscription to a later virtual time, and/or unsubscribe even if the observable being tested has not yet completed.

// The subscription marble syntax is slightly different to conventional marble syntax.

// '-' time: 1 frame time passing.
// [0-9]+[ms|s|m] time progression: the time progression syntax lets you progress virtual time by a specific amount. It's a number, followed by a time unit of ms (milliseconds), s (seconds), or m (minutes) without any space between them, e.g. a 10ms b. See Time progression syntax for more details.
// '^' subscription point: shows the point in time at which a subscription happen.
// '!' unsubscription point: shows the point in time at which a subscription is unsubscribed.
// There should be at most one ^ point in a subscription marble diagram, and at most one ! point. Other than that, the - character is the only one allowed in a subscription marble diagram.

// Examples
// '-' or '------': no subscription ever happened.

// '--^--': a subscription happened after 2 "frames" of time passed, and the subscription was not unsubscribed.

// '--^--!-': on frame 2 a subscription happened, and on frame 5 was unsubscribed.

// '500ms ^ 1s !': on frame 500 a subscription happened, and on frame 1,501 was unsubscribed.

// Given a hot source, test multiple subscribers that subscribe at different times:

testScheduler.run(({ hot, expectObservable }) => {
  const source = hot('--a--a--a--a--a--a--a--');
  const sub1 = '      --^-----------!';
  const sub2 = '      ---------^--------!';
  const expect1 = '   --a--a--a--a--';
  const expect2 = '   -----------a--a--a-';
  expectObservable(source, sub1).toBe(expect1);
  expectObservable(source, sub2).toBe(expect2);
});

it('should repeat forever', () => {
  const testScheduler = createScheduler();

  testScheduler.run(({ expectObservable }) => {
    const foreverStream$ = interval(1).pipe(mapTo('a'));

    // Omitting this arg may crash the test suite.
    const unsub = '------ !';

    expectObservable(foreverStream$, unsub).toBe('-aaaaa');
  });
});

// Synchronous Assertion
// Sometimes, we need to assert changes in state after an observable stream has completed - such as when a side effect like tap updates a variable. Outside of Marbles testing with TestScheduler, we might think of this as creating a delay or waiting before making our assertion.

let eventCount = 0;

const s1 = cold('--a--b|', { a: 'x', b: 'y' });

// side effect using 'tap' updates a variable
const result = s1.pipe(tap(() => eventCount++));

expectObservable(result).toBe('--a--b|', ['x', 'y']);

// flush - run 'virtual time' to complete all outstanding hot or cold observables
flush();

expect(eventCount).toBe(2);

// Known Issues
// You can't directly test RxJS code that consumes Promises or uses any of the other schedulers (e.g. AsapScheduler)
// If you have RxJS code that uses any other form of async scheduling other than AsyncScheduler, e.g. Promises, AsapScheduler, etc. you can't reliably use marble diagrams for that particular code. This is because those other scheduling methods won't be virtualized or known to TestScheduler.

// The solution is to test that code in isolation, with the traditional async testing methods of your testing framework. The specifics depend on your testing framework of choice, but here's a pseudo-code example:

// Some RxJS code that also consumes a Promise, so TestScheduler won't be able
// to correctly virtualize and the test will always be really async
const myAsyncCode = () => from(Promise.resolve('something'));

it('has async code', (done) => {
  myAsyncCode().subscribe((d) => {
    assertEqual(d, 'something');
    done();
  });
});
