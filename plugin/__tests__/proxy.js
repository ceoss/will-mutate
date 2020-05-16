const proxify = require("../proxy");


describe("Proxy util", () => {
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
				obj: {
					prop: "old",
				},
				classy: class {
					constructor() {}
				},
			}
		);
		Object.defineProperty(nakedTarget, "readOnly", {
			value: "Don't write to me please",
		});
		Object.defineProperty(nakedTarget, "accessor", {
			set() {},
			get() {return {};},
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
	test("to return non-objects untouched", async () => {
		["Test", Infinity, 0, null, undefined, true].forEach((target) => {
			expect(proxify(target)).toEqual(target);
		});
	});

	/*
		Basic mutation failure
	*/
	test("to throw when assigning a prop (always)", async () => {
		targets.all.forEach((target) => {
			expect(() => {
				target.prop = "New";
			}).toThrow("Mutation assertion failed. `set` trap triggered on `target.prop`.");
		});
	});
	test("to throw when assigning to a new sub prop (deep)", async () => {
		expect(() => {
			targets.deep.obj.new = "New";
		}).toThrow("Mutation assertion failed. `set` trap triggered on `target.obj.new`.");
	});
	test("to not throw when assigning to a new sub prop (shallow)", async () => {
		expect(() => {
			targets.shallow.obj.new = "New";
		}).not.toThrow();
	});
	test("to not throw when assigning to a prop on the prototype (deep, no proto)", async () => {
		expect(() => {
			Object.getPrototypeOf(targets.deep).protoProp = "New";
		}).not.toThrow();
	});
	test("to throw when assigning to a prop on the prototype (deep, proto)", async () => {
		expect(() => {
			Object.getPrototypeOf(targets.deepProto).protoProp = "New";
		}).toThrow("Mutation assertion failed. `set` trap triggered on `target.__proto__.protoProp`.");
	});
	test("to not throw when assigning to a prop on the prototype (shallow, proto)", async () => {
		expect(() => {
			Object.getPrototypeOf(targets.proto).protoProp = "New";
		}).not.toThrow();
	});
	test("to throw when assigning to a sub prop on the prototype (deep, proto)", async () => {
		expect(() => {
			Object.getPrototypeOf(targets.deepProto).protoObj.protoProp = "New";
		}).toThrow("Mutation assertion failed. `set` trap triggered on `target.__proto__.protoObj.protoProp`.");
	});
	test("to not throw when assigning to a sub prop on the prototype (shallow, proto)", async () => {
		expect(() => {
			Object.getPrototypeOf(targets.proto).protoObj.protoProp = "New";
		}).not.toThrow();
	});

	/*
		Assert that the dummy target and getting is working okie dokie
	*/
	test("to not throw when accessing read-only props multiple times (always)", async () => {
		targets.all.forEach((target) => {
			expect(() => {
				target.readOnly;
				target.readOnly;
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
	test("to throw throw the same error when caught and retried", async () => {
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
	test("to work with other proxies as the target", async () => {
		const proxyProxy = proxify(new Proxy({test: "test"}, {}), {deep: true});
		expect(proxyProxy.test).toEqual("test");
		expect(() => {
			proxyProxy.test = "new";
		}).toThrow("Mutation assertion failed. `set` trap triggered on `target.test`.");
	});
	test("to work with functions as the target", async () => {
		const proxyFunc = proxify(function funcName () {return "funcName";}, {deep: true});
		expect(proxyFunc()).toEqual("funcName");
		expect(() => {
			proxyFunc.test = "new";
		}).toThrow("Mutation assertion failed. `set` trap triggered on `funcName.test`.");
	});
	test("to work with classes as the target", async () => {
		const TestClass = class {
			instanceBoi() {
				return "instanceBoi";
			}
			static staticBoi() {
				return "staticBoi";
			}
		};
		const proxyClass = proxify(TestClass, {deep: true});
		expect(proxyClass.staticBoi()).toEqual("staticBoi");
		expect((new proxyClass()).instanceBoi()).toEqual("instanceBoi");
		expect(() => {
			proxyClass.staticBoi.test = "new";
		}).toThrow("Mutation assertion failed. `set` trap triggered on `TestClass.staticBoi.test`.");
	});
	test("to work with arrays as the target", async () => {
		const array = ["test", {}];
		array["other prop with #$#@*$("] = "I found out I was one line away from 100% code cov and this is fun";
		const proxyArray = proxify(array, {deep: true});
		expect(proxyArray[0]).toEqual("test");
		expect(proxyArray[1]).toEqual({});
		expect(() => {
			proxyArray["other prop with #$#@*$("] = "why is 100% considered good? it doesn't mean anything lol";
		}).toThrow("Mutation assertion failed. `set` trap triggered on `target[\"other prop with #$#@*$(\"]`.");
	});

	/*
		getOwnPropertyDescriptor edge cases
	*/
	test("to throw when using a setter via getOwnPropertyDescriptor (deep)", async () => {
		expect(() => {
			Object.getOwnPropertyDescriptor(targets.deep, "accessor").set("new");
		}).toThrow("Mutation assertion failed. `apply` trap triggered on `target.accessor.descriptor.set()`.");
	});
	test("to throw when using a setter via getOwnPropertyDescriptor (shallow)", async () => {
		expect(() => {
			Object.getOwnPropertyDescriptor(targets.shallow, "accessor").set("new");
		}).toThrow("Mutation assertion failed. `apply` trap triggered on `target.accessor.descriptor.set()`.");
	});
	test("to throw when setting after using a getter via getOwnPropertyDescriptor (deep)", async () => {
		expect(() => {
			Object.getOwnPropertyDescriptor(targets.deep, "accessor").get().prop = "new";
		}).toThrow("Mutation assertion failed. `set` trap triggered on `target.accessor.descriptor.get().prop`.");
	});
	test("to throw when setting a new prop on an accessor via getOwnPropertyDescriptor (deep)", async () => {
		expect(() => {
			Object.getOwnPropertyDescriptor(targets.deep, "accessor").set.prop = "new";
		}).toThrow("Mutation assertion failed. `set` trap triggered on `target.accessor.descriptor.set.prop`.");
	});
	test("to not throw when setting a new prop on an accessor via getOwnPropertyDescriptor (shallow)", async () => {
		expect(() => {
			Object.getOwnPropertyDescriptor(targets.shallow, "accessor").set.prop = "new";
		}).not.toThrow();
	});
	test("to throw when setting a new prop on a value found via getOwnPropertyDescriptor (deep)", async () => {
		expect(() => {
			Object.getOwnPropertyDescriptor(targets.deep, "obj").value.newProp = "new";
		}).toThrow("Mutation assertion failed. `set` trap triggered on `target.obj.descriptor.value.newProp`.");
	});
	test("to not throw when setting a new prop on a value found via getOwnPropertyDescriptor (shallow)", async () => {
		expect(() => {
			Object.getOwnPropertyDescriptor(targets.shallow, "obj").value.newProp = "new";
		}).not.toThrow();
	});

	/*
		Define property
	*/
	test("to throw when defining a root property (deep)", async () => {
		expect(() => {
			Object.defineProperty(targets.deep, "prop", {value: "new"});
		}).toThrow("Mutation assertion failed. `defineProperty` trap triggered on `target.prop`.");
	});
	test("to throw when defining a root property (shallow)", async () => {
		expect(() => {
			Object.defineProperty(targets.shallow, "prop", {value: "new"});
		}).toThrow("Mutation assertion failed. `defineProperty` trap triggered on `target.prop`.");
	});
	test("to throw when defining a sub property (deep)", async () => {
		expect(() => {
			Object.defineProperty(targets.deep.obj, "prop", {value: "new"});
		}).toThrow("Mutation assertion failed. `defineProperty` trap triggered on `target.obj.prop`.");
	});
	test("to throw when defining a sub property (shallow)", async () => {
		expect(() => {
			Object.defineProperty(targets.shallow.obj, "prop", {value: "new"});
		}).not.toThrow();
	});

	/*
		Delete
	*/
	test("to throw when deleting a root property", async () => {
		expect(() => {
			delete targets.deep.prop;
		}).toThrow("Mutation assertion failed. `deleteProperty` trap triggered on `target.prop`.");
	});
	test("to throw when deleting a root property (shallow)", async () => {
		expect(() => {
			delete targets.shallow.prop;
		}).toThrow("Mutation assertion failed. `deleteProperty` trap triggered on `target.prop`.");
	});
	test("to throw when deleting a sub property", async () => {
		expect(() => {
			delete targets.deep.obj.prop;
		}).toThrow("Mutation assertion failed. `deleteProperty` trap triggered on `target.obj.prop`.");
	});
	test("to not throw when deleting a sub property (shallow)", async () => {
		expect(() => {
			delete targets.shallow.obj.prop;
		}).not.toThrow();
	});

	/*
		Accessors
	*/
	test("to throw when setting an accessor property", async () => {
		expect(() => {
			targets.deep.accessor = "new";
		}).toThrow("Mutation assertion failed. `set` trap triggered on `target.accessor`.");
	});
	test("to throw when setting an accessor property (shallow)", async () => {
		expect(() => {
			targets.shallow.accessor = "new";
		}).toThrow("Mutation assertion failed. `set` trap triggered on `target.accessor`.");
	});
	test("to throw when setting an accessor's sub property", async () => {
		expect(() => {
			targets.deep.accessor.newProp = "new";
		}).toThrow("Mutation assertion failed. `set` trap triggered on `target.accessor.newProp`.");
	});
	test("to not throw when setting an accessor's sub property (shallow)", async () => {
		expect(() => {
			targets.shallow.accessor.newProp = "new";
		}).not.toThrow();
	});

	/*
		Prevent Extensions
	*/
	test("to throw when preventing extensions on the target (deep)", async () => {
		expect(() => {
			Object.preventExtensions(targets.deep);
		}).toThrow("Mutation assertion failed. `preventExtensions` trap triggered on `target`.");
	});
	test("to throw when preventing extensions on the target (shallow)", async () => {
		expect(() => {
			Object.preventExtensions(targets.shallow);
		}).toThrow("Mutation assertion failed. `preventExtensions` trap triggered on `target`.");
	});
	test("to throw when preventing extensions on a property (deep)", async () => {
		expect(() => {
			Object.preventExtensions(targets.deep.obj);
		}).toThrow("Mutation assertion failed. `preventExtensions` trap triggered on `target.obj`.");
	});
	test("to not throw when preventing extensions on a property (shallow)", async () => {
		expect(() => {
			Object.preventExtensions(targets.shallow.obj);
		}).not.toThrow();
	});

	/*
		Set prototype
	*/
	test("to throw when setting a new prototype on a property (deep, proto)", async () => {
		expect(() => {
			Object.setPrototypeOf(targets.deepProto.obj, {"I'm a bad boy": () => {}});
		}).toThrow("Mutation assertion failed. `setPrototypeOf` trap triggered on `target.obj.__proto__`.");
	});
	test("to not throw when setting a new prototype on a property (deep, not proto)", async () => {
		expect(() => {
			Object.setPrototypeOf(targets.deep.obj, {"I'm a bad boy": () => {}});
		}).not.toThrow();
	});
	test("to throw when setting a new prototype on the target (shallow, proto)", async () => {
		expect(() => {
			Object.setPrototypeOf(targets.proto, {"I'm a bad boy": () => {}});
		}).toThrow("Mutation assertion failed. `setPrototypeOf` trap triggered on `target.__proto__`.");
	});
	test("to not throw when setting a new prototype on the target (deep, not proto)", async () => {
		expect(() => {
			Object.setPrototypeOf(targets.deep, {"I'm a bad boy": () => {}});
		}).not.toThrow();
	});
});
