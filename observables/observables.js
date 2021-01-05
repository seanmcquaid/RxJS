const { Observable } = require('rxjs');

const observable = new Observable((subscriber) => {
  subscriber.next(1);
  subscriber.next(2);
  subscriber.next(3);
  setTimeout(() => {
    subscriber.next(4);
    subscriber.complete();
  }, 1000);
});

console.log('just before subscribe');

observable.subscribe({
  next(x) {
    console.log('got value ' + x);
  },
  error(err) {
    console.error('something wrong occurred: ' + err);
  },
  complete() {
    console.log('done');
  },
});
console.log('just after subscribe');

// Vanilla JS
// function foo() {
//   console.log('Hello');
//   return 42;
// }

// const x = foo.call(); // same as foo()
// console.log(x);
// const y = foo.call(); // same as foo()
// console.log(y);

// observables can return MULTIPLE values

// const foo = new Observable((subscriber) => {
//   console.log('Hello');
//   subscriber.next(42);
//   subscriber.next(100); // "return" another value
//   subscriber.next(200); // "return" yet another
// });

// console.log('before');
// foo.subscribe((x) => {
//   console.log(x);
// });
// console.log('after');

const foo = new Observable((subscriber) => {
  console.log('Hello');
  subscriber.next(42);
  subscriber.next(100);
  subscriber.next(200);
  setTimeout(() => {
    subscriber.next(300); // happens asynchronously
  }, 1000);
});

console.log('before');
foo.subscribe((x) => {
  console.log(x);
});
console.log('after');
