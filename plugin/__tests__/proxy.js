const proxify = require("../proxy");


describe("Proxy util", () => {
	const targets = {};
	let nakedTarget;
	beforeEach(() => {
		nakedTarget = Object.assign(
			Object.create({protoProp: "old"}),
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
			{deep: false, prototype: false},
		);
		targets.all = [
			targets.shallow,
			targets.deep,
			targets.proto,
			targets.deepProto,
		];
	});


	/*
		Basic mutation failure
	*/
	test("to throw when assigning a prop", async () => {
		targets.all.forEach((target) => {
			expect(() => {
				target.prop = "New";
			}).toThrow("Mutation assertion failed. `set` trap triggered on `target.prop`.");
		});
	});

	/*
		Assert that the dummy target and getting is working okie dokie
	*/
	test("to not throw when accessing read-only props multiple times", async () => {
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
		getOwnPropertyDescriptor edge cases
	*/
	test("to throw when using a setter via getOwnPropertyDescriptor", async () => {
		expect(() => {
			Object.getOwnPropertyDescriptor(targets.deep, "accessor").set("new");
		}).toThrow();
	});
	test("to throw when setting after getting via getOwnPropertyDescriptor", async () => {
		expect(() => {
			Object.getOwnPropertyDescriptor(targets.deep, "accessor").get().prop = "new";
		}).toThrow();
	});
	test("to not throw when setting a new prop on an accessor via getOwnPropertyDescriptor (shallow)", async () => {
		expect(() => {
			Object.getOwnPropertyDescriptor(targets.shallow, "accessor").set.prop = "new";
		}).not.toThrow();
	});
	test("to throw when setting a new prop on an accessor via getOwnPropertyDescriptor", async () => {
		expect(() => {
			Object.getOwnPropertyDescriptor(targets.deep, "accessor").set.prop = "new";
		}).toThrow("Mutation assertion failed. `set` trap triggered on `target[\"set(accessor)\"].prop`.");
	});
});


// target.accessor = "new"; // Errors
// delete target.prop; // Errors
// target.obj.prop = "new"; // Errors when `deep`
// Object.defineProperty(target, "prop", {value: "new"}); // Errors
// Object.getPrototypeOf(target).protoProp = "new"; // Errors when `prototype`
// Object.getOwnPropertyDescriptor(target, "obj").value.prop = "new"; // Errors when `deep`;
// Object.setPrototypeOf(target, {}); // Errors when `prototype`
// Object.preventExtensions(target.prop); // Errors
// TODO: [>=1] before publishing stable - add tests to find the limitations of the proxy, dummytarget, etc.
// TODO: [>=1] before publishing stable - add inverted tests
