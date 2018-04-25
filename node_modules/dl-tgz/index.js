'use strict';

const createGunzip = require('zlib').createGunzip;

const dlTar = require('dl-tar');
const isPlainObj = require('is-plain-obj');
const Observable = require('zen-observable');

module.exports = function dlTgz(url, dest, options) {
  if (isPlainObj(options)) {
    if (options.tarTransform !== undefined) {
      return new Observable(observer => {
        observer.error(new TypeError('dl-tgz doesn\'t support `tarTransform` option.'));
      });
    }

    return dlTar(url, dest, Object.assign({}, options, {
      tarTransform: createGunzip()
    }));
  }

  return dlTar(url, dest, options || {
    tarTransform: createGunzip()
  });
};
