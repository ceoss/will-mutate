const proxify = require("../proxy");


describe("Proxy util", () => {
	let target;
	beforeEach(() => {
		const nakedTarget = Object.assign(
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
		target = proxify(
			nakedTarget,
			{deep: true, prototype: true}
		);
	});
	test("to throw when assigning a prop", async () => {
		expect(() => {
			target.prop = "New";
		}).toThrow("Mutation assertion failed. `set` trap triggered on `target.prop`.");
	});
	test("to not throw when accessing read-only props multiple times", async () => {
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


// target.accessor = "new"; // Errors
// delete target.prop; // Errors
// target.obj.prop = "new"; // Errors when `deep`
// Object.defineProperty(target, "prop", {value: "new"}); // Errors
// Object.getPrototypeOf(target).protoProp = "new"; // Errors when `prototype`
// Object.getOwnPropertyDescriptor(target, "obj").value.prop = "new"; // Errors when `deep`;
// Object.getOwnPropertyDescriptor(target, "accessor").set("new"); // TODO: [>=1] before publishing stable - make error (accessor apply trap proxying)
// Object.getOwnPropertyDescriptor(target, "accessor").set.prop = "new"; // TODO: [>=1] before publishing stable - make error (accessor apply trap proxying)
// Object.getOwnPropertyDescriptor(target, "accessor").get().prop = "new"; // TODO: [>=1] before publishing stable - make error (accessor apply trap proxying)
// Object.setPrototypeOf(target, {}); // Errors when `prototype`
// Object.preventExtensions(target.prop); // Errors
// TODO: [>=1] before publishing stable - add tests to find the limitations of the proxy, dummytarget, etc.
