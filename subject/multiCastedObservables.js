// A "multicasted Observable" passes notifications through a Subject which may have many subscribers,
// whereas a plain "unicast Observable" only sends notifications to a single Observer.

// A multicasted Observable uses a Subject under the hood to make multiple Observers see the same Observable execution.

// Under the hood, this is how the multicast operator works: Observers subscribe to an underlying Subject,
// and the Subject subscribes to the source Observable.
// The following example is similar to the previous example which used observable.subscribe(subject):

const { from, Subject, interval } = require('rxjs');
const { multicast, refCount } = require('rxjs/operators');

const source = from([1, 2, 3]);
const subject = new Subject();
const multicasted = source.pipe(multicast(subject));

// These are, under the hood, `subject.subscribe({...})`:
multicasted.subscribe({
  next: (v) => console.log(`observerA: ${v}`),
});
multicasted.subscribe({
  next: (v) => console.log(`observerB: ${v}`),
});

// This is, under the hood, `source.subscribe(subject)`:
multicasted.connect();

// multicast returns an Observable that looks like a normal Observable, but works like a Subject when it comes to subscribing.
// multicast returns a ConnectableObservable, which is simply an Observable with the connect() method.

// The connect() method is important to determine exactly when the shared Observable execution will start.
// Because connect() does source.subscribe(subject) under the hood, connect() returns a Subscription,
// which you can unsubscribe from in order to cancel the shared Observable execution.

// Reference counting
// Calling connect() manually and handling the Subscription is often cumbersome.
// Usually, we want to automatically connect when the first Observer arrives, and automatically cancel the shared
// execution when the last Observer unsubscribes.

// Consider the following example where subscriptions occur as outlined by this list:

// First Observer subscribes to the multicasted Observable
// The multicasted Observable is connected
// The next value 0 is delivered to the first Observer
// Second Observer subscribes to the multicasted Observable
// The next value 1 is delivered to the first Observer
// The next value 1 is delivered to the second Observer
// First Observer unsubscribes from the multicasted Observable
// The next value 2 is delivered to the second Observer
// Second Observer unsubscribes from the multicasted Observable
// The connection to the multicasted Observable is unsubscribed
// To achieve that with explicit calls to connect(), we write the following code:

const source = interval(500);
const subject = new Subject();
const multicasted = source.pipe(multicast(subject));
let subscription1, subscription2, subscriptionConnect;

subscription1 = multicasted.subscribe({
  next: (v) => console.log(`observerA: ${v}`),
});
// We should call `connect()` here, because the first
// subscriber to `multicasted` is interested in consuming values
subscriptionConnect = multicasted.connect();

setTimeout(() => {
  subscription2 = multicasted.subscribe({
    next: (v) => console.log(`observerB: ${v}`),
  });
}, 600);

setTimeout(() => {
  subscription1.unsubscribe();
}, 1200);

// We should unsubscribe the shared Observable execution here,
// because `multicasted` would have no more subscribers after this
setTimeout(() => {
  subscription2.unsubscribe();
  subscriptionConnect.unsubscribe(); // for the shared Observable execution
}, 2000);

// If we wish to avoid explicit calls to connect(), we can use ConnectableObservable's refCount()
// method (reference counting), which returns an Observable that keeps track of how many
// subscribers it has. When the number of subscribers increases from 0 to 1, it will call connect() for us,
// which starts the shared execution. Only when the number of subscribers decreases from 1 to 0 will it be fully unsubscribed, stopping further execution.

// refCount makes the multicasted Observable automatically start executing when the first subscriber arrives, and stop executing when the last subscriber leaves.

const source = interval(500);
const subject = new Subject();
const refCounted = source.pipe(multicast(subject), refCount());
let subscription1, subscription2;

// This calls `connect()`, because
// it is the first subscriber to `refCounted`
console.log('observerA subscribed');
subscription1 = refCounted.subscribe({
  next: (v) => console.log(`observerA: ${v}`),
});

setTimeout(() => {
  console.log('observerB subscribed');
  subscription2 = refCounted.subscribe({
    next: (v) => console.log(`observerB: ${v}`),
  });
}, 600);

setTimeout(() => {
  console.log('observerA unsubscribed');
  subscription1.unsubscribe();
}, 1200);

// This is when the shared Observable execution will stop, because
// `refCounted` would have no more subscribers after this
setTimeout(() => {
  console.log('observerB unsubscribed');
  subscription2.unsubscribe();
}, 2000);

// Logs
// observerA subscribed
// observerA: 0
// observerB subscribed
// observerA: 1
// observerB: 1
// observerA unsubscribed
// observerB: 2
// observerB unsubscribed
