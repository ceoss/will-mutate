(() => {
	const poop = proxify(
		Object.assign(
			Object.create({
				protoTest: 'old',
			}),
			{
				test: 'old',
				poop: {
					test: 'old',
				},
			}
		),
		{
			deep: true,
			prototype: true,
		}
	);

	// poop.test = "new"; // Errors
	// poop.poop.test = "new"; // Errors when `deep`
	// Object.getPrototypeOf(poop).test = "poop"; // Errors when `prototype`
	// Object.setPrototypeOf(poop, {}); // Errors
})();
