// What is a Subject? An RxJS Subject is a special type of Observable that allows values to be multicasted to many Observers.
// While plain Observables are unicast (each subscribed Observer owns an independent execution of the Observable), Subjects are multicast.

// A Subject is like an Observable, but can multicast to many Observers. Subjects are like EventEmitters: they maintain a registry of many listeners.

const { Subject, from } = require('rxjs');

const subject = new Subject();

// subject.subscribe({
//   next: (v) => console.log(`observerA: ${v}`),
// });
// subject.subscribe({
//   next: (v) => console.log(`observerB: ${v}`),
// });

// subject.next(1);
// subject.next(2);

// Logs:
// observerA: 1
// observerB: 1
// observerA: 2
// observerB: 2

// Since a Subject is an Observer, this also means you may provide a Subject as the argument to the subscribe of any Observable, like the example below shows:

subject.subscribe({
  next: (v) => console.log(`observerA: ${v}`),
});
subject.subscribe({
  next: (v) => console.log(`observerB: ${v}`),
});

const observable = from([1, 2, 3]);

observable.subscribe(subject); // You can subscribe providing a Subject

// Logs:
// observerA: 1
// observerB: 1
// observerA: 2
// observerB: 2
// observerA: 3
// observerB: 3

// With the approach above, we essentially just converted a unicast Observable execution to multicast, through the Subject.
// This demonstrates how Subjects are the only way of making any Observable execution be shared to multiple Observers.

// There are also a few specializations of the Subject type: BehaviorSubject, ReplaySubject, and AsyncSubject.
