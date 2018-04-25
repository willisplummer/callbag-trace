# load-from-cwd-or-npm

[![NPM version](https://img.shields.io/npm/v/load-from-cwd-or-npm.svg)](https://www.npmjs.com/package/load-from-cwd-or-npm)
[![Build Status](https://travis-ci.org/shinnn/load-from-cwd-or-npm.svg?branch=master)](https://travis-ci.org/shinnn/load-from-cwd-or-npm)
[![Build status](https://ci.appveyor.com/api/projects/status/fgiptpa87nh51g0v/branch/master?svg=true)](https://ci.appveyor.com/project/ShinnosukeWatanabe/load-from-cwd-or-npm/branch/master)
[![Coverage Status](https://img.shields.io/coveralls/shinnn/load-from-cwd-or-npm.svg)](https://coveralls.io/github/shinnn/load-from-cwd-or-npm?branch=master)

Load a module from either CWD or [`npm` CLI](https://github.com/npm/npm) directory

```javascript
const loadFromCwdOrNpm = require('load-from-cwd-or-npm');

// $ npm ls validate-npm-package-name
// > └── (empty)

(async () => {
  require('validate-npm-package-name'); // throws a `MODULE_NOT_FOUND` error
  const RegistryClient = await loadFromCwdOrNpm('validate-npm-package-name'); // doesn't throw
})();
```

## Installation

[Use npm.](https://docs.npmjs.com/cli/install)

```
npm install load-from-cwd-or-npm
```

## API

```javascript
const loadFromCwdOrNpm = require('load-from-cwd-or-npm');
```

### loadFromCwdOrNpm(*moduleId*, [*compareFn*])

*moduleId*: `string` (a module ID without path separators (`/`, `\\`))  
*compareFn*: `Function` (a function to compare two package versions)  
Return: `Promise<any>`

It loads a module with the given module ID from either of these two directories:

1. [`node_modules`](https://docs.npmjs.com/files/folders#node-modules) in the [current working directory](https://nodejs.org/api/process.html#process_process_cwd)
2. `node_modules` in the directory where [`npm` CLI](https://github.com/npm/npm) is installed

If the module ins't installed in CWD but included in the [npm CLI dependencies](https://github.com/npm/npm/blob/d48783c339ca8d47a12685b38f2b1ac540e5bf7f/package.json#L33-L99), it loads the module from npm CLI directory.

```javascript
// $ npm ls nopt
// > └── (empty)

loadFromCwdOrNpm('nopt').then(nopt => {
  nopt; //=> {[Function: nopt], clean: [Function: clean] ...}
});
```

If the module ins't included in the npm CLI dependencies but installed in CWD, it loads the module from CWD.

```javascript
// $ npm ls eslint
// > └── eslint@2.13.1

// npm doesn't depend on `eslint` module.
loadFromCwdOrNpm('eslint').then(eslint => {
  eslint; //=> {linter: EventEmitter { ... }, ...}
});
```

If the module exists in both directories, it compares their [package versions](https://docs.npmjs.com/files/package.json#version) and loads the newer one.

```javascript
// $ npm ls rimraf
// > └── rimraf@1.0.0

loadFromCwdOrNpm('rimraf').then(rimraf => {
  rimraf; // Loaded from npm CLI directory because the CWD version is older
});
```

The returned promise will be [fulfilled](http://promisesaplus.com/#point-26) with the loaded module, or [rejected](http://promisesaplus.com/#point-30) when it fails to find the module from either directories.

#### compareFn(*cwdPackageVersion*, *npmPackageVersion*)

Default: [node-semver](https://github.com/npm/node-semver)'s [`gte`](https://github.com/npm/node-semver#comparison) method

Used as a comparison function when a module with the given ID exists in both directories.

It takes two `String` arguments, package versions of the CWD one and the npm dependency one. the former will be loaded when `compareFn` returns `true`, otherwise the latter will be loaded.

```javascript
const loadFromCwdOrNpm = require('load-from-cwd-or-npm');
const semver = require('semver');

loadFromCwdOrNpm('rimraf', semver.lt);
// inverse to the default behavior (the older will be loaded)
```

## License

Copyright (c) 2015 - 2017 [Shinnosuke Watanabe](https://github.com/shinnn)

Licensed under [the MIT License](./LICENSE).
