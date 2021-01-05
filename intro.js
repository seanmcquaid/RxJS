// The essential concepts in RxJS which solve async event management are:

// Observable: represents the idea of an invokable collection of future values or events.

// Observer: is a collection of callbacks that knows how to listen to values delivered by the Observable.

// Subscription: represents the execution of an Observable, is primarily useful for cancelling the execution.

// Operators: are pure functions that enable a functional programming style of dealing with collections with operations
// like map, filter, concat, reduce, etc.

// Subject: is the equivalent to an EventEmitter, and the only way of multicasting a value or event to multiple Observers.

// Schedulers: are centralized dispatchers to control concurrency, allowing us to coordinate when computation happens
// on e.g. setTimeout or requestAnimationFrame or others.

// Normal approach

document.addEventListener('click', () => console.log('Clicked!'));

// RxJS approach with Observables

import { fromEvent } from 'rxjs';

fromEvent(document, 'click').subscribe(() => console.log('Clicked!'));

// impure function where ANYWHERE in the code, state can be messed with
let count = 0;
document.addEventListener('click', () =>
  console.log(`Clicked ${++count} times`)
);

// RxJS helps isolate state so it is managed by RxJS
// scan works like reduce
import { fromEvent } from 'rxjs';
import { scan } from 'rxjs/operators';

fromEvent(document, 'click')
  .pipe(scan((count) => count + 1, 0))
  .subscribe((count) => console.log(`Clicked ${count} times`));

// Vanilla JS for allowing only one click per second

let count = 0;
let rate = 1000;
let lastClick = Date.now() - rate;
document.addEventListener('click', () => {
  if (Date.now() - lastClick >= rate) {
    console.log(`Clicked ${++count} times`);
    lastClick = Date.now();
  }
});

// RxJS solution

import { fromEvent } from 'rxjs';
import { throttleTime, scan } from 'rxjs/operators';

fromEvent(document, 'click')
  .pipe(
    throttleTime(1000),
    scan((count) => count + 1, 0)
  )
  .subscribe((count) => console.log(`Clicked ${count} times`));

// adding current mouse x position in Vanilla JS for on click

let count = 0;
const rate = 1000;
let lastClick = Date.now() - rate;
document.addEventListener('click', (event) => {
  if (Date.now() - lastClick >= rate) {
    count += event.clientX;
    console.log(count);
    lastClick = Date.now();
  }
});

// RxJS

import { fromEvent } from 'rxjs';
import { throttleTime, map, scan } from 'rxjs/operators';

fromEvent(document, 'click')
  .pipe(
    throttleTime(1000),
    map((event) => event.clientX),
    scan((count, clientX) => count + clientX, 0)
  )
  .subscribe((count) => console.log(count));
