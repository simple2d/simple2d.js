# Simple 2D for the Web

[![npm](https://img.shields.io/npm/v/simple2d.svg?maxAge=2592000)](https://www.npmjs.com/package/simple2d)

Simple2D.js is intended to be an exact port of the native [Simple 2D](github/simple2d/simple2d), written in JavaScript targeting modern browsers supporting WebGL. The API and feature set aims to be identical to the native version, as much as possible. Simple2D.js may differ only to conform to some JavaScript conventions, or to address features and limitations of the web browser.

## Building

Build, lint, and minify using [Grunt](http://gruntjs.com):

```bash
npm install -g grunt-cli
npm install
grunt
```

The [Google Closure Compiler](https://developers.google.com/closure/compiler/) is used to optimize and minify. The compiler is written in Java, so make sure the `java` command is available. To install Java on MacOS, we recommend using [Homebrew Cask](http://caskroom.io):

```bash
brew tap caskroom/cask
brew cask install java
```

## Tests

First, build the library using `grunt`, then open an HTML test file from the [`tests/`](tests/) directory in a browser.
