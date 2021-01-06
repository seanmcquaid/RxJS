// What is an Observer? An Observer is a consumer of values delivered by an Observable.
// Observers are simply a set of callbacks, one for each type of notification delivered by the Observable:
// next, error, and complete. The following is an example of a typical Observer object:

const observer = {
  next: (x) => console.log('Observer got a next value: ' + x),
  error: (err) => console.error('Observer got an error: ' + err),
  complete: () => console.log('Observer got a complete notification'),
};

// To use the Observer, provide it to the subscribe of an Observable:

observable.subscribe(observer);
