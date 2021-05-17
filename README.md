<div align="center">

<img alt="Will Mutate icon" width="128" height="128" align="center" src=".github/icon.png"/>

# Will Mutate

**Runtime test to that detects mutations to objects**

[![npm version](https://badgen.net/npm/v/will-mutate?icon=npm)](https://www.npmjs.com/package/will-mutate)
[![check status](https://badgen.net/github/checks/ceoss/will-mutate/main?icon=github)](https://github.com/ceoss/will-mutate/actions)
[![license: MIT](https://badgen.net/badge/license/MIT/blue)](/LICENSE)

</div>

## Description

Detect when and where mutations occur in your code. It may seem cool, but it's not a replacement for strict typings or tests. It is currently a proof-of-concept and a debugging tool.

> Why did this property change?! I didn't do that!!!

## Features

- Detect any proxy-compatible mutation as it happens
- Throws a stack trace of the code that caused the mutation
- Includes a property path to the mutation in the object

## Usage as a Utility Function

### Installation

```bash
npm install will-mutate
```

### Code

```js
const proxify = require("will-mutate/proxify");

function foo () {
    // Setup
    const target = {
        array: [],
    };
    const targetProxy = proxify(target, {deep: true});
    // Mutation
    targetProxy.array.push("Test");
}
// Run
foo();
```

[**_Run this example on RunKit_**](https://runkit.com/evelynhathaway/5f2cb72f91359e00139bb1fd)

### Errors

The below error is taken from running the above code snippet. You can see that the `array` property was pushed to.

The native code for `.push()` assigns `"Test"` to the first index, so we see an error from the `set` (assignment operator) trap inside the `foo` function in the `foo.js` module.

```bash
Error: Mutation assertion failed. `set` trap triggered on `target.array[0]`.
    at Object.handler.<computed> [as set] (proxify.js:152:10)
    at Proxy.push (<anonymous>)
    at Object.handler.<computed> [as apply] (proxify.js:175:24)
    at foo (foo.js:10:20)
    at Object.<anonymous> (foo.js:13:1)
```

### API

#### `proxyify(target, [options])`

Create a Will Mutate mutation proxy for a target object.

**Returns**: `Proxy` - The function or object passed as `target` but as an ES6 Proxy

| Parameter | Type                              | Description                                                 |
| --------- | --------------------------------- | ----------------------------------------------------------- |
| target    | `Function` \| `Object` \| `Array` | Function, array, or other object to watch mutations on      |
| [options] | `Object`                          | Options that controls how the proxy acts and when it errors |

##### `options`

| Option    | Type      | Default | Description                                                 |
| --------- | --------- | ------- | ----------------------------------------------------------- |
| deep      | `boolean` | `false` | If the proxy should recursively wrap the entire object      |
| prototype | `boolean` | `false` | If the proxy should recursively wrap the object's prototype |

## Usage as a Babel Plugin

### Installation

```bash
npm install will-mutate @babel/core@^7.0.0 --save-dev
```

### Code

Add the `$shouldNotMutate` function call directly above any function declaration or expression with the name of any variable in-scope at the beginning of the function body.

```js
// In this example, we're asserting that the argument `foo` will not mutate
$shouldNotMutate(["foo"]);
function bar (foo, other) {
    foo.prop = "Test";
    other.prop = "Don't change me";
}
```

### Errors

The below error is taken from running the above code snippet with `node ./bar.js` after compilation with Babel. You can see that the `prop` property was changed using `set` (assignment operator) inside the `bar` function in the `bar.js` module.

```bash
Error: Mutation assertion failed. `set` trap triggered on `target.prop`.
    at Object.handler.<computed> [as set] (bar.js:148:13)
    at bar (bar.js:194:31)
    at Object.<anonymous> (bar.js:211:1)
```

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

## Understanding Traps

If you see a trap you do not understand, [MDN has a list of proxy traps](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Proxy/Proxy#Handler_functions) where you can understand the conditions it will trigger under. Every trap related to mutations is implemented.

## Alternatives

- TypeScript or Flow typings
- [mutation-sentinel](https://github.com/flexport/mutation-sentinel)

## License

Copyright Evelyn Hathaway and Corbin Crutchley, [MIT License](/LICENSE)
