'use strict';

const inspectWithKind = require('inspect-with-kind');
const isActualContent = require('junk').not;
const readdir = require('graceful-fs').readdir;

const PATH_ERROR = 'Expected a directory path';

module.exports = function readdirClean(dir) {
  return new Promise((resolve, reject) => {
    if (typeof dir !== 'string') {
      throw new TypeError(`${PATH_ERROR} (string), but got ${inspectWithKind(dir)}.`);
    }

    if (dir.length === 0) {
      throw new TypeError(`${PATH_ERROR}, but got '' (empty string).`);
    }

    readdir(dir, (err, paths) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(paths.filter(isActualContent));
    });
  });
};
