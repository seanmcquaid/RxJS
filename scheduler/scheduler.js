// What is a Scheduler?

// A scheduler controls when a subscription starts and when notifications are delivered.
// It consists of three components.

// A Scheduler is a data structure. It knows how to store and queue tasks based on priority or other criteria.

// A Scheduler is an execution context. It denotes where and when the task is executed (e.g. immediately, or in another callback mechanism such as setTimeout or process.nextTick, or the animation frame).

// A Scheduler has a (virtual) clock. It provides a notion of "time" by a getter method now() on the scheduler. Tasks being scheduled on a particular scheduler will adhere only to the time denoted by that clock.

// A Scheduler lets you define in what execution context will an Observable deliver notifications to its Observer.

// In the example below, we take the usual simple Observable that emits values 1, 2, 3 synchronously, and use the operator observeOn to specify the async scheduler to use for delivering those values.

var observable = new Observable((proxyObserver) => {
  proxyObserver.next(1);
  proxyObserver.next(2);
  proxyObserver.next(3);
  proxyObserver.complete();
}).pipe(observeOn(asyncScheduler));

var finalObserver = {
  next(x) {
    console.log('got value ' + x);
  },
  error(err) {
    console.error('something wrong occurred: ' + err);
  },
  complete() {
    console.log('done');
  },
};

console.log('just before subscribe');
observable.subscribe(finalObserver);
console.log('just after subscribe');
