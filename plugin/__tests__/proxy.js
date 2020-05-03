const proxify = require('../proxy');


describe("Proxy util", () => {
	let foo;
	beforeEach(() => {
		foo = proxify(
			Object.assign(Object.create({
				protoTest: "old"
			}), {
				test: "old",
				foo: {
					test: "old"
				}
			}), {
				deep: true,
				prototype: true
			}
		);
	})
	test("to throw when assigning a prop", async () => {
		expect(() => {
			foo.test = "New"
		}).toThrow();
	});
});

// foo.test = "new"; // Errors
// delete foo.test; // Errors
// foo.foo.test = "new"; // Errors when `deep`
// Object.getPrototypeOf(foo).test = "foo"; // Errors when `prototype`
// Object.setPrototypeOf(foo, {}); // Errors when `prototype`

