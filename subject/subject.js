// What is a Subject? An RxJS Subject is a special type of Observable that allows values to be multicasted to many Observers.
// While plain Observables are unicast (each subscribed Observer owns an independent execution of the Observable), Subjects are multicast.

// A Subject is like an Observable, but can multicast to many Observers. Subjects are like EventEmitters: they maintain a registry of many listeners.

const { Subject } = require('rxjs');

const subject = new Subject();

subject.subscribe({
  next: (v) => console.log(`observerA: ${v}`),
});
subject.subscribe({
  next: (v) => console.log(`observerB: ${v}`),
});

subject.next(1);
subject.next(2);

// Logs:
// observerA: 1
// observerB: 1
// observerA: 2
// observerB: 2
