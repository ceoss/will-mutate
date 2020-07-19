<div align="center">

<img alt="Will Mutate icon" width="128" height="128" align="center" src=".github/icon.png"/>

# Will Mutate

**Runtime test to that detects mutations to objects**

[![npm version](https://badgen.net/npm/v/will-mutate?icon=npm)](https://www.npmjs.com/package/will-mutate)
[![check status](https://badgen.net/github/checks/ceoss/will-mutate/master?icon=github)](https://github.com/ceoss/will-mutate/actions)
[![license: MIT](https://badgen.net/badge/license/MIT/blue)](/LICENSE)

</div>

## Description

Detect when and where mutations occur in your code. It may seem cool, but it's not a replacement for strict typings or tests. It is currently a proof-of-concept and a debugging tool.

> Why did this property change?! I didn't do that!!!

## Features

- Detect any proxy-compatible mutation as it happens
- Throws a stack trace of the code that caused the mutation
- Includes a property path to the mutation in the object

## Installation

```bash
npm install will-mutate @babel/core@^7.0.0 --save-dev
```

## Usage

Add the `$shouldNotMutate` function call directly above any function declaration or expression with the name of any variable in-scope at the beginning of the function body.

### Code

```js
// In this example, we're asserting that the argument `foo` will not mutate
$shouldNotMutate(["foo"]);
function bar (foo, other) {
    foo.prop = "Test";
    other.prop = "Don't change me";
}
```

#### Errors

The below error is taken from running the above code snippet with `node ./bar.js` after compilation with Babel. You can see that the `prop` property was changed using `set` (assignment operator) inside the `bar` function in the `bar.js` module.


```bash
Error: Mutation assertion failed. `set` trap triggered on `target.prop`.
    at Object.handler.<computed> [as set] (bar.js:148:13)
    at bar (bar.js:194:31)
    at Object.<anonymous> (bar.js:211:1)
```

If you see a trap you do not understand, [MDN has a list of proxy traps](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Proxy/Proxy#Handler_functions) where you can understand the conditions it will trigger under. Every trap related to mutations is implemented.

### Babel Config

You must also add Will Mutate to your Babel config. If you intend to leave the functions in your codebase you can use `noop` to run whenever you do not want runtime errors (e.g. production).

`babel.config.js`

```js
module.exports = {
    plugins: [
        process.env.NODE_ENV === "development"
            ? "will-mutate"
            : "will-mutate/noop",
    ],
};
```

## License

Copyright Evelyn Hathaway and Corbin Crutchley, [MIT License](/LICENSE)
