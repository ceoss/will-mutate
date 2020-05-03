const proxify = require("../proxy");


describe("Proxy util", () => {
	let target;
	beforeEach(() => {
		const nakedTarget = Object.assign(
			Object.create({protoProp: "old"}),
			{
				prop: "old",
				obj: {
					prop: "old"
				},
				classy: class {
					constructor() {}
				}
			}
		);
		Object.defineProperty(nakedTarget, "accessor", {
			set() {},
			get() {return {};}
		});
		target = proxify(
			nakedTarget,
			{deep: true, prototype: true}
		);
	})
	test("to throw when assigning a prop", async () => {
		expect(() => {
			target.prop = "New";
		}).toThrow(); // TODO: assert exact error
	});
});


// new target.classy(); // TODO: SHOULD NOT ERROR (read-only prop issues)
// target.accessor = "new"; // Errors
// delete target.prop; // Errors
// target.obj.prop = "new"; // Errors when `deep`
// Object.defineProperty(target, "prop", {value: "new"}); // Errors
// Object.getPrototypeOf(target).protoProp = "new"; // Errors when `prototype`
// Object.getOwnPropertyDescriptor(target, "obj").value.prop = "new"; // Errors when `deep`;
// Object.getOwnPropertyDescriptor(target, "accessor"); // TODO: SHOULD NOT ERROR (read-only prop issues)
// Object.getOwnPropertyDescriptor(target, "accessor").set("new"); // TODO: make error (accessor apply trap proxying)
// Object.getOwnPropertyDescriptor(target, "accessor").set.prop = "new"; // TODO: make error (accessor apply trap proxying)
// Object.getOwnPropertyDescriptor(target, "accessor").get().prop = "new"; // TODO: make error (accessor apply trap proxying)
// Object.setPrototypeOf(target, {}); // Errors when `prototype`
// Object.preventExtensions(target.prop); // Errors
