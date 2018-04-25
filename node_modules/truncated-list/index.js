'use strict';

const inspect = require('util').inspect;

const inspectWithKind = require('inspect-with-kind');

const ERR = 'Expected every value of the given iterable object to be a string';
const NUM_ERR = 'Expected a maximum number of list items (positive integer)';

function createListItem(line) {
  return `* ${line}`;
}

module.exports = function abbreviatedList(lines, max) {
  if (!lines || typeof lines !== 'object' || typeof lines[Symbol.iterator] !== 'function') {
    throw new TypeError(`Expected an iterable object except for string, but got ${
      inspectWithKind(lines)
    }.`);
  }

  if (typeof max !== 'number') {
    throw new TypeError(`${NUM_ERR}, but got a non-number value ${inspectWithKind(max)}.`);
  }

  if (max <= 0) {
    throw new TypeError(`${NUM_ERR}, but got a non-positive value ${max}.`);
  }

  if (!Number.isFinite(max)) {
    throw new TypeError(`${NUM_ERR}, but got ${max}.`);
  }

  if (max > Number.MAX_SAFE_INTEGER) {
    throw new TypeError(`${NUM_ERR}, but got a too large number.`);
  }

  if (!Number.isInteger(max)) {
    throw new TypeError(`${NUM_ERR}, but got a non-integer number ${max}.`);
  }

  const arr = Array.from(lines);

  for (const line of arr) {
    if (typeof line !== 'string') {
      throw new TypeError(`${ERR}, but included ${inspectWithKind(line)}.`);
    }

    if (line.length === 0) {
      throw new Error(`${ERR.replace('a string', 'a non-empty string')}, but included '' (empty string).`);
    }

    if (line.indexOf('\n') !== -1) {
      throw new Error(`${ERR.replace('a string', 'a single-line string')}, but included a multiline string ${
        inspect(line)
      }.`);
    }
  }

  const surplus = arr.length - max;

  if (surplus <= 0) {
    return arr.map(createListItem).join('\n');
  }

  return `${arr.slice(0, max).map(createListItem).join('\n')}\n  ... and ${surplus} more`;
};
