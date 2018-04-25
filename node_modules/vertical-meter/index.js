'use strict';

var rateMap = require('rate-map');

var contents = ['⠀', '⣀', '⣤', '⣶', '⣿'];
var MAX = contents.length - 1;

module.exports = function verticalMeter(val) {
	return contents[Math.round(rateMap(val, 0, MAX))];
};
