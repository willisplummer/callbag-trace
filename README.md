# callbag-trace

Callbag operator for debugging that allows you to pass in a function (e.g. console.log) that will be called on each value as it is passed through.

`yarn --dev add callbag-trace`

##example

```
const trace = require('callbag-trace');
const {forEach, fromEvent, map, filter, pipe} = require('callbag-basics');

const accum = []

pipe(
  fromEvent(document, 'click'),
  filter(ev => ev.target.tagName === 'BUTTON'),
  trace(console.log),
  map(ev => ev.target.id),
  forEach(id => accum.push(id))
)
```
