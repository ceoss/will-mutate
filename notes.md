Can currently detect set mutations on:
- the target's properties
- the target's arguments
- the above but deeply as well (on-the-fly)

Should be able to detect:
- defineProperty()
- getOwnPropertyDescriptor()
- construct (new Class)
- deletion
- symbol mutation
- Prototype changes
	- Mutations to it (with an option likely)
	- setPrototypeOf()

Won't be able to detect unless I make another project:
- Variables, methods, etc
	- This might be cool to do with @decorators in the original file that will only run in a testing env (rewiring, global, etc.), if it's even realistic in the first place
```js
@proxify()
const array = [];
@proxify()
const object = {};

@willNotMutate(object)
@willOnlyMutate(array)
@willMutate(array)
function myFunction () {
	array.push("poop")
}
```
`@willMutate` will be able to compare the function it's decorating and the function it's testing at test runtime. `array` and `object` would be proxified so they could be checked against it.

- Use mutates or mutated?
- Store mutations for assertion aginst them
	- `expect(willMutate(target)(...args)).to.have.mutated.argument(0).oneTime`
	- `expect(willMutate(target)(...args)).to.have.only.mutated.argument(0)`
- mutatesSelf/mutatesTarget
	- Properties
- mutatesThis
	- This may be different that the target (bind, call, etc.)
- mutatesArg(s)
- mutatesLocalVariable, or mutatesOtherObject
	- Impossible without a Babel transform before test runtime, likely very out-of-scope unless using my decorator idea
- mutatesGlobalVariable
	- Possible with reqire/rewire-global, but likely out-of-scope
- mutatesPrototype, symbol, etc
- Recursive option (only for get?)? On the fly or deeply immediately?




---




expect().to.be.true

```js
new Proxy(functionToTest, {
	apply() {
		return Reflect.set(...arguments)
	}
	set() {

		return Reflect.set(...arguments)
	}
})

// Spy-like
const mutationSpy = willMutate(myFunction);
mutationSpy(...args);

// Sinon-like
willMutate(myFunction).calledWith(...args);

// Curry that shit
willMutate(myFunction)(...args);

// Function-like call
willMutate.call(myFunction, ...args);

// Function-like apply
willMutate.apply(myFunction, args);

// Native
expect(
	willMutate(functionName)(...args).[Self/Target|This|Props/Properties|Symbols|Arguments](path?)
).to.be.false;

// Chai
expect(willMutate(functionName)).to[|.only|.not].mutate[Self/Target|This|Props/Properties|Symbols|Arguments].deeply

// Jest

// Decorator
@willNotMutate(...objects, {deep: true})
@willOnlyMutate(...objects, {deep: true})
@willMutate(...objects, {deep: true})
// Ideas
@willAddProperties/@willAppend

// Alternitives
// - checking manually (diffing, would not catch all changes)
// - sealing/freezing an object (deeply, catching error)
```


Uses proxies or object mutation checkers on the parameters. Called using a function where you inject the function and params, or parameter/function/method decorator.

Check property assignment, prototype changes, etc to object typed params (@

Bind methods to another proxy to optionally allow a class or class-like to mutate itself or whatever context it was assigned to. (@shouldntMutateThis)
