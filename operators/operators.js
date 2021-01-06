// Operators are functions. There are two kinds of operators:

// Pipeable Operators are the kind that can be piped to Observables using the syntax observableInstance.pipe(operator()).
// These include, filter(...), and mergeMap(...). When called, they do not change the existing Observable instance.
// Instead, they return a new Observable, whose subscription logic is based on the first Observable.

// A Pipeable Operator is essentially a pure function which takes one Observable as input and generates another Observable as output.
// Subscribing to the output Observable will also subscribe to the input Observable.

// Creation Operators are the other kind of operator, which can be called as standalone functions to create a new Observable.
// For example: of(1, 2, 3) creates an observable that will emit 1, 2, and 3, one right after another.
// Creation operators will be discussed in more detail in a later section.

// For example, the operator called map is analogous to the Array method of the same name.
// Just as [1, 2, 3].map(x => x * x) will yield [1, 4, 9], the Observable created like this:

const { of } = require('rxjs');
const { map } = require('rxjs/operators');

map((x) => x * x)(of(1, 2, 3)).subscribe((v) => console.log(`value: ${v}`));

// Logs:
// value: 1
// value: 4
// value: 9

//  Another useful operator is first:

const { first } = require('rxjs/operators');

first()(of(1, 2, 3)).subscribe((v) => console.log(`value: ${v}`));

// Logs:
// value: 1

// Piping
// Pipeable operators are functions, so they could be used like ordinary functions: op()(obs) —
// but in practice, there tend to be many of them convolved together,
// and quickly become unreadable: op4()(op3()(op2()(op1()(obs)))).
// For that reason, Observables have a method called .pipe() that accomplishes the same thing while being much easier to read:
// obs.pipe(op1(), op2(), op3(), op3());

// Creation Operators
// What are creation operators? Distinct from pipeable operators,
// creation operators are functions that can be used to create an Observable
// with some common predefined behavior or by joining other Observables.

// A typical example of a creation operator would be the interval function.
// It takes a number (not an Observable) as input argument, and produces an Observable as output:

const { interval } = require('rxjs');

const observable = interval(1000 /* number of milliseconds */);

// Higher-order Observables
// Observables most commonly emit ordinary values like strings and numbers,
// but surprisingly often, it is necessary to handle Observables of Observables,
// so-called higher-order Observables. For example, imagine you had an Observable
// emitting strings that were the URLs of files you wanted to see.
// The code might look like this:

const fileObservable = urlObservable.pipe(map((url) => http.get(url)));

// http.get() returns an Observable (of string or string arrays probably) for each individual URL.
// Now you have an Observables of Observables, a higher-order Observable.

// But how do you work with a higher-order Observable? Typically, by flattening:
// by (somehow) converting a higher-order Observable into an ordinary Observable. For example:

const fileObservable = urlObservable.pipe(
  map((url) => http.get(url)),
  concatAll()
);

// The concatAll() operator subscribes to each "inner" Observable that comes out of the "outer" Observable, and copies all the emitted values until that Observable completes, and goes on to the next one. All of the values are in that way concatenated. Other useful flattening operators (called join operators) are

// mergeAll() — subscribes to each inner Observable as it arrives, then emits each value as it arrives
// switchAll() — subscribes to the first inner Observable when it arrives, and emits each value as it arrives, but when the next inner Observable arrives, unsubscribes to the previous one, and subscribes to the new one.
// exhaust() — subscribes to the first inner Observable when it arrives, and emits each value as it arrives, discarding all newly arriving inner Observables until that first one completes, then waits for the next inner Observable.
