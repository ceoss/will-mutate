const proxify = require("../proxify");


describe("Proxify util", () => {
	const targets = {};
	let nakedTarget;
	beforeEach(() => {
		nakedTarget = Object.assign(
			Object.create({
				protoProp: "old",
				protoObj: {
					protoProp: "old",
				},
			}),
			{
				prop: "old",
				array: ["old"],
				obj: {
					prop: "old",
				},
				classy: class {
					constructor () {}
				},
			}
		);
		Object.defineProperty(nakedTarget, "readOnly", {
			value: "Don't write to me please",
		});
		Object.defineProperty(nakedTarget, "accessor", {
			set () {},
			get () {return {};},
		});

		targets.deepProto = proxify(
			nakedTarget,
			{deep: true, prototype: true},
		);
		targets.deep = proxify(
			nakedTarget,
			{deep: true, prototype: false},
		);
		targets.proto = proxify(
			nakedTarget,
			{deep: false, prototype: true},
		);
		targets.shallow = proxify(
			nakedTarget,
			// Default settings
		);
		targets.all = [
			targets.shallow,
			targets.deep,
			targets.proto,
			targets.deepProto,
		];
	});


	/*
		No-op non-object
	*/
	test("to return non-objects untouched", () => {
		// eslint-disable-next-line unicorn/prefer-number-properties
		["Test", Infinity, 0, null, undefined, true].forEach((target) => {
			expect(proxify(target)).toEqual(target);
		});
	});

	/*
		Basic mutation failure
	*/
	test("to throw when assigning a prop (always)", () => {
		targets.all.forEach((target) => {
			expect(() => {
				target.prop = "New";
			}).toThrow("Mutation assertion failed. `set` trap triggered on `target.prop`.");
		});
	});
	test("to throw when assigning to a new sub prop (deep)", () => {
		expect(() => {
			targets.deep.obj.new = "New";
		}).toThrow("Mutation assertion failed. `set` trap triggered on `target.obj.new`.");
	});
	test("to not throw when assigning to a new sub prop (shallow)", () => {
		expect(() => {
			targets.shallow.obj.new = "New";
		}).not.toThrow();
	});
	test("to not throw when assigning to a prop on the prototype (deep, no proto)", () => {
		expect(() => {
			Object.getPrototypeOf(targets.deep).protoProp = "New";
		}).not.toThrow();
	});
	test("to throw when assigning to a prop on the prototype (deep, proto)", () => {
		expect(() => {
			Object.getPrototypeOf(targets.deepProto).protoProp = "New";
		}).toThrow("Mutation assertion failed. `set` trap triggered on `target.__proto__.protoProp`.");
	});
	test("to not throw when assigning to a prop on the prototype (shallow, proto)", () => {
		expect(() => {
			Object.getPrototypeOf(targets.proto).protoProp = "New";
		}).not.toThrow();
	});
	test("to throw when assigning to a sub prop on the prototype (deep, proto)", () => {
		expect(() => {
			Object.getPrototypeOf(targets.deepProto).protoObj.protoProp = "New";
		}).toThrow("Mutation assertion failed. `set` trap triggered on `target.__proto__.protoObj.protoProp`.");
	});
	test("to not throw when assigning to a sub prop on the prototype (shallow, proto)", () => {
		expect(() => {
			Object.getPrototypeOf(targets.proto).protoObj.protoProp = "New";
		}).not.toThrow();
	});

	/*
		Native method mutations
	*/
	test("to throw when pushing to an array target (shallow)", () => {
		expect(() => {
			proxify(["old"]).push("New");
		}).toThrow("Mutation assertion failed. `set` trap triggered on `target[1]`.");
	});
	test("to throw when pushing to an array prop (deep)", () => {
		expect(() => {
			targets.deep.array.push("New");
		}).toThrow("Mutation assertion failed. `set` trap triggered on `target.array[1]`.");
	});
	test("to throw when popping an array target (shallow)", () => {
		expect(() => {
			proxify(["old"]).pop();
		}).toThrow("Mutation assertion failed. `deleteProperty` trap triggered on `target[0]`.");
	});
	// EDGECASE - This error isn't the clearest
	test("to throw when unshifting an array target (shallow)", () => {
		expect(() => {
			proxify(["old"]).unshift();
		}).toThrow(
			// Testing edgcases is fun, I had no idea the native code mutated `.length` first
			// That's in my top ten useless things to know for a job interview 🤔😹
			"Mutation assertion failed. `set` trap triggered on `target.length`."
		);
	});
	test("to throw when shifting an array target (shallow)", () => {
		expect(() => {
			proxify(["old"]).shift();
		}).toThrow("Mutation assertion failed. `deleteProperty` trap triggered on `target[0]`.");
	});
	test("to throw when reversing an array target (shallow)", () => {
		expect(() => {
			proxify([1, 2, 3]).reverse();
		}).toThrow("Mutation assertion failed. `set` trap triggered on `target[0]`.");
	});
	test("to throw when sorting an array target (shallow)", () => {
		expect(() => {
			proxify([1, 3, 2]).sort();
		// See https://github.com/ota-meshi/eslint-plugin-regexp/issues/445
		// eslint-disable-next-line unicorn/better-regex
		}).toThrow(/Mutation assertion failed\. `set` trap triggered on `target\[\d\]`\./);
	});
	test("to throw when splicing an array target (shallow)", () => {
		expect(() => {
			proxify([1, "Bye-bye!", 2, 3]).splice(1, 1);
		}).toThrow("Mutation assertion failed. `set` trap triggered on `target[1]`.");
	});
	test("to throw when copying within an array target (shallow)", () => {
		expect(() => {
			proxify([1, 2, 3]).copyWithin([1, 2, 3], 1, 2);
		}).toThrow("Mutation assertion failed. `set` trap triggered on `target[0]`.");
	});
	test("to throw when filling an array target (shallow)", () => {
		expect(() => {
			proxify(Array.from({length: 10})).fill("Filler? I hardly know her.", 2);
		}).toThrow("Mutation assertion failed. `set` trap triggered on `target[2]`.");
	});
	test("to throw when using Object.assign (shallow)", () => {
		expect(() => {
			Object.assign(targets.shallow, {newProp: "New"});
		}).toThrow("Mutation assertion failed. `set` trap triggered on `target.newProp`.");
	});

	/*
		Assert that the dummy target and getting is working okie dokie
	*/
	test("to not throw when accessing read-only props multiple times (always)", () => {
		targets.all.forEach((target) => {
			expect(() => {
				/* eslint-disable no-unused-expressions */
				// Side-effects-only
				target.readOnly;
				target.readOnly;
				/* eslint-enable no-unused-expressions */
				Object.getOwnPropertyDescriptor(target, "readOnly");
				Object.getOwnPropertyDescriptor(target, "readOnly");
				Object.getOwnPropertyDescriptor(target, "accessor");
				Object.getOwnPropertyDescriptor(target, "accessor");
				new target.classy();
				new target.classy();
			}).not.toThrow();
		});
	});

	/*
		Assert that the `internalPath` clears when caught
	*/
	test("to throw throw the same error when caught and retried", () => {
		expect(() => {
			targets.deep.obj.prop = "New";
		}).toThrow("Mutation assertion failed. `set` trap triggered on `target.obj.prop`.");
		expect(() => {
			targets.deep.obj.prop = "New";
		}).toThrow("Mutation assertion failed. `set` trap triggered on `target.obj.prop`.");
		expect(() => {
			targets.deep.obj.prop = "New";
		}).toThrow("Mutation assertion failed. `set` trap triggered on `target.obj.prop`.");
	});

	/*
		Less common target objects
	*/
	test("to work with other proxies as the target", () => {
		const proxyProxy = proxify(new Proxy({test: "test"}, {}), {deep: true});
		expect(proxyProxy.test).toBe("test");
		expect(() => {
			proxyProxy.test = "new";
		}).toThrow("Mutation assertion failed. `set` trap triggered on `target.test`.");
	});
	test("to work with functions as the target", () => {
		const proxyFunction = proxify(function functionName () {return "functionName";}, {deep: true});
		expect(proxyFunction()).toBe("functionName");
		expect(() => {
			proxyFunction.test = "new";
		}).toThrow("Mutation assertion failed. `set` trap triggered on `functionName.test`.");
	});
	test("to work with classes as the target", () => {
		const TestClass = class {
			instanceBoi () {
				return "instanceBoi";
			}
			static staticBoi () {
				return "staticBoi";
			}
		};
		const proxyClass = proxify(TestClass, {deep: true});
		expect(proxyClass.staticBoi()).toBe("staticBoi");
		expect((new proxyClass()).instanceBoi()).toBe("instanceBoi");
		expect(() => {
			proxyClass.staticBoi.test = "new";
		}).toThrow("Mutation assertion failed. `set` trap triggered on `TestClass.staticBoi.test`.");
	});
	test("to work with arrays as the target", () => {
		const array = ["test", {}];
		array["other prop with #$#@*$("] = "I found out I was one line away from 100% code cov and this is fun";
		const proxyArray = proxify(array, {deep: true});
		expect(proxyArray[0]).toBe("test");
		expect(proxyArray[1]).toEqual({});
		expect(() => {
			proxyArray["other prop with #$#@*$("] = "why is 100% considered good? it doesn't mean anything lol";
		}).toThrow("Mutation assertion failed. `set` trap triggered on `target[\"other prop with #$#@*$(\"]`.");
	});

	/*
		getOwnPropertyDescriptor edge cases
	*/
	test("to throw when using a setter via getOwnPropertyDescriptor (deep)", () => {
		expect(() => {
			Object.getOwnPropertyDescriptor(targets.deep, "accessor").set("new");
		}).toThrow("Mutation assertion failed. `apply` trap triggered on `target.accessor.descriptor.set()`.");
	});
	test("to throw when using a setter via getOwnPropertyDescriptor (shallow)", () => {
		expect(() => {
			Object.getOwnPropertyDescriptor(targets.shallow, "accessor").set("new");
		}).toThrow("Mutation assertion failed. `apply` trap triggered on `target.accessor.descriptor.set()`.");
	});
	test("to throw when setting after using a getter via getOwnPropertyDescriptor (deep)", () => {
		expect(() => {
			Object.getOwnPropertyDescriptor(targets.deep, "accessor").get().prop = "new";
		}).toThrow("Mutation assertion failed. `set` trap triggered on `target.accessor.descriptor.get().prop`.");
	});
	test("to throw when setting a new prop on an accessor via getOwnPropertyDescriptor (deep)", () => {
		expect(() => {
			Object.getOwnPropertyDescriptor(targets.deep, "accessor").set.prop = "new";
		}).toThrow("Mutation assertion failed. `set` trap triggered on `target.accessor.descriptor.set.prop`.");
	});
	test("to not throw when setting a new prop on an accessor via getOwnPropertyDescriptor (shallow)", () => {
		expect(() => {
			Object.getOwnPropertyDescriptor(targets.shallow, "accessor").set.prop = "new";
		}).not.toThrow();
	});
	test("to throw when setting a new prop on a value found via getOwnPropertyDescriptor (deep)", () => {
		expect(() => {
			Object.getOwnPropertyDescriptor(targets.deep, "obj").value.newProp = "new";
		}).toThrow("Mutation assertion failed. `set` trap triggered on `target.obj.descriptor.value.newProp`.");
	});
	test("to not throw when setting a new prop on a value found via getOwnPropertyDescriptor (shallow)", () => {
		expect(() => {
			Object.getOwnPropertyDescriptor(targets.shallow, "obj").value.newProp = "new";
		}).not.toThrow();
	});

	/*
		Define property
	*/
	test("to throw when defining a root property (deep)", () => {
		expect(() => {
			Object.defineProperty(targets.deep, "prop", {value: "new"});
		}).toThrow("Mutation assertion failed. `defineProperty` trap triggered on `target.prop`.");
	});
	test("to throw when defining a root property (shallow)", () => {
		expect(() => {
			Object.defineProperty(targets.shallow, "prop", {value: "new"});
		}).toThrow("Mutation assertion failed. `defineProperty` trap triggered on `target.prop`.");
	});
	test("to throw when defining a sub property (deep)", () => {
		expect(() => {
			Object.defineProperty(targets.deep.obj, "prop", {value: "new"});
		}).toThrow("Mutation assertion failed. `defineProperty` trap triggered on `target.obj.prop`.");
	});
	test("to throw when defining a sub property (shallow)", () => {
		expect(() => {
			Object.defineProperty(targets.shallow.obj, "prop", {value: "new"});
		}).not.toThrow();
	});

	/*
		Delete
	*/
	test("to throw when deleting a root property", () => {
		expect(() => {
			delete targets.deep.prop;
		}).toThrow("Mutation assertion failed. `deleteProperty` trap triggered on `target.prop`.");
	});
	test("to throw when deleting a root property (shallow)", () => {
		expect(() => {
			delete targets.shallow.prop;
		}).toThrow("Mutation assertion failed. `deleteProperty` trap triggered on `target.prop`.");
	});
	test("to throw when deleting a sub property", () => {
		expect(() => {
			delete targets.deep.obj.prop;
		}).toThrow("Mutation assertion failed. `deleteProperty` trap triggered on `target.obj.prop`.");
	});
	test("to not throw when deleting a sub property (shallow)", () => {
		expect(() => {
			delete targets.shallow.obj.prop;
		}).not.toThrow();
	});

	/*
		Accessors
	*/
	test("to throw when setting an accessor property", () => {
		expect(() => {
			targets.deep.accessor = "new";
		}).toThrow("Mutation assertion failed. `set` trap triggered on `target.accessor`.");
	});
	test("to throw when setting an accessor property (shallow)", () => {
		expect(() => {
			targets.shallow.accessor = "new";
		}).toThrow("Mutation assertion failed. `set` trap triggered on `target.accessor`.");
	});
	test("to throw when setting an accessor's sub property", () => {
		expect(() => {
			targets.deep.accessor.newProp = "new";
		}).toThrow("Mutation assertion failed. `set` trap triggered on `target.accessor.newProp`.");
	});
	test("to not throw when setting an accessor's sub property (shallow)", () => {
		expect(() => {
			targets.shallow.accessor.newProp = "new";
		}).not.toThrow();
	});

	/*
		Prevent Extensions
	*/
	test("to throw when preventing extensions on the target (deep)", () => {
		expect(() => {
			Object.preventExtensions(targets.deep);
		}).toThrow("Mutation assertion failed. `preventExtensions` trap triggered on `target`.");
	});
	test("to throw when preventing extensions on the target (shallow)", () => {
		expect(() => {
			Object.preventExtensions(targets.shallow);
		}).toThrow("Mutation assertion failed. `preventExtensions` trap triggered on `target`.");
	});
	test("to throw when preventing extensions on a property (deep)", () => {
		expect(() => {
			Object.preventExtensions(targets.deep.obj);
		}).toThrow("Mutation assertion failed. `preventExtensions` trap triggered on `target.obj`.");
	});
	test("to not throw when preventing extensions on a property (shallow)", () => {
		expect(() => {
			Object.preventExtensions(targets.shallow.obj);
		}).not.toThrow();
	});

	/*
		Set prototype
	*/
	test("to throw when setting a new prototype on a property (deep, proto)", () => {
		expect(() => {
			Object.setPrototypeOf(targets.deepProto.obj, {"I'm a bad boy": () => {}});
		}).toThrow("Mutation assertion failed. `setPrototypeOf` trap triggered on `target.obj.__proto__`.");
	});
	test("to not throw when setting a new prototype on a property (deep, not proto)", () => {
		expect(() => {
			Object.setPrototypeOf(targets.deep.obj, {"I'm a bad boy": () => {}});
		}).not.toThrow();
	});
	test("to throw when setting a new prototype on the target (shallow, proto)", () => {
		expect(() => {
			Object.setPrototypeOf(targets.proto, {"I'm a bad boy": () => {}});
		}).toThrow("Mutation assertion failed. `setPrototypeOf` trap triggered on `target.__proto__`.");
	});
	test("to not throw when setting a new prototype on the target (deep, not proto)", () => {
		expect(() => {
			Object.setPrototypeOf(targets.deep, {"I'm a bad boy": () => {}});
		}).not.toThrow();
	});
});
