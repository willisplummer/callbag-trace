const test = require('tape');
const makeMockCallbag = require('callbag-mock');
const trace = require('./index');

test('it calls func on values and then passes them down', t => {
  let history = [];
  let logger = []
  const report = (name,dir,t,d) => t !== 0 && d !== undefined && history.push([name,dir,t,d]);

  const source = makeMockCallbag('source', true);
  const traceLog = trace(d => logger.push(d));
  const sink = makeMockCallbag('sink', report);

  traceLog(source)(0, sink);

  source.emit(1, 'bar');
  source.emit(1, 'baz');
  source.emit(2, 'error');

  t.deepEqual(history, [
    ['sink', 'body', 1, 'bar'],
    ['sink', 'body', 1, 'baz'],
    ['sink', 'body', 2, 'error'],
  ], 'sink gets seed and subsequent data');

  t.deepEqual(logger, ['bar', 'baz'], 'trace calls func on data as it passes');

  t.end();
});

test('it passes requests back up', t => {
  let history = [];
  const report = (name,dir,t,d) => t !== 0 && history.push([name,dir,t,d]);

  const source = makeMockCallbag('source', report, true);
  const traceLog = trace(console.log);
  const sink = makeMockCallbag('sink', report);

  traceLog(source)(0, sink);

  sink.emit(1);
  sink.emit(2);

  t.deepEqual(history, [
    ['source', 'talkback', 1, undefined],
    ['source', 'talkback', 2, undefined],
  ], 'source gets requests from sink');

  t.end();
});
