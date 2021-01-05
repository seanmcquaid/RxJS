// Core Observable concerns:

// Creating Observables
// Subscribing to Observables
// Executing the Observable
// Disposing Observables

// Creating Observables
// The Observable constructor takes one argument: the subscribe function.

// The following example creates an Observable to emit the string 'hi' every second to a subscriber.

const { Observable, from } = require('rxjs');

const observable = new Observable(function subscribe(subscriber) {
  const id = setInterval(() => {
    subscriber.next('hi');
  }, 1000);
});

// observable.subscribe((x) => console.log(x));

//There are three types of values an Observable Execution can deliver:

// "Next" notification: sends a value such as a Number, a String, an Object, etc.
// "Error" notification: sends a JavaScript Error or exception.
// "Complete" notification: does not send a value.

// It is a good idea to wrap any code in subscribe with try/catch block that will deliver an Error notification if it catches an exception:

// const observable = new Observable(function subscribe(subscriber) {
//   try {
//     subscriber.next(1);
//     subscriber.next(2);
//     subscriber.next(3);
//     subscriber.complete();
//   } catch (err) {
//     subscriber.error(err); // delivers an error if it caught one
//   }
// });

// Disposing Observable Executions

const observable2 = from([10, 20, 30]);
const subscription = observable2.subscribe((x) => console.log(x));
// Later:
subscription.unsubscribe();
