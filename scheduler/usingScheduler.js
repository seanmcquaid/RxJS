// You may have already used schedulers in your RxJS code without explicitly stating the type of schedulers to be used.

// This is because all Observable operators that deal with concurrency have optional schedulers.
// If you do not provide the scheduler, RxJS will pick a default scheduler by using the principle of least concurrency.
// This means that the scheduler which introduces the least amount of concurrency that satisfies the needs of the operator is chosen.
// For example, for operators returning an observable with a finite and small number of messages, RxJS uses no Scheduler, i.e. null or undefined.
// For operators returning a potentially large or infinite number of messages, queue Scheduler is used.
// For operators which use timers, async is used.

// Because RxJS uses the least concurrency scheduler, you can pick a different scheduler if you want to introduce concurrency for performance purpose.
// To specify a particular scheduler, you can use those operator methods that take a scheduler, e.g., from([10, 20, 30], asyncScheduler).

// Use subscribeOn to schedule in what context will the subscribe() call happen.
// By default, a subscribe() call on an Observable will happen synchronously and immediately.
// However, you may delay or schedule the actual subscription to happen on a given Scheduler, using the instance operator subscribeOn(scheduler), where scheduler is an argument you provide.

// Use observeOn to schedule in what context will notifications be delivered.
// As we saw in the examples above, instance operator observeOn(scheduler) introduces a mediator Observer between the source Observable and the destination Observer, where the mediator schedules calls to the destination Observer using your given scheduler.

// Instance operators may take a Scheduler as argument.

// Time-related operators like bufferTime, debounceTime, delay, auditTime, sampleTime, throttleTime, timeInterval, timeout, timeoutWith, windowTime all take a Scheduler as the last argument, and otherwise operate by default on the asyncScheduler.

// Other instance operators that take a Scheduler as argument: cache, combineLatest, concat, expand, merge, publishReplay, startWith.

// Notice that both cache and publishReplay accept a Scheduler because they utilize a ReplaySubject. The constructor of a ReplaySubjects takes an optional Scheduler as the last argument because ReplaySubject may deal with time, which only makes sense in the context of a Scheduler.
// By default, a ReplaySubject uses the queue Scheduler to provide a clock.
