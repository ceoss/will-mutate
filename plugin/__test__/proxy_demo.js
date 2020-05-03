(() => {
	const foo = proxify(
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

	// foo.test = "new"; // Errors
	// delete foo.test; // Errors
	// foo.foo.test = "new"; // Errors when `deep`
	// Object.getPrototypeOf(foo).test = "foo"; // Errors when `prototype`
	// Object.setPrototypeOf(foo, {}); // Errors when `prototype`
})();
