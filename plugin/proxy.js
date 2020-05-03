const proxify = (object, options = {}) => {
	const {
		deep = false, prototype = false
	} = options;
	if (!(object instanceof Object)) return object;

	const triggeredByFunction = true; // TODO: this is for stack trace shit

	return new Proxy(object, {
		// Other proxy traps have other edgecases

		/*
			Get - Deep *lennyface*
		*/
		// TODO: This has a BUNCH of edgecases involving getting/setting from the result of the desc.
		// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptor
		getOwnPropertyDescriptor() {
			const realDescriptor = Reflect.getOwnPropertyDescriptor(...arguments);
			return deep ? proxify(realDescriptor, options) : realDescriptor;
		},
		getPrototypeOf() {
			const realPrototypeOf = Reflect.getPrototypeOf(...arguments);
			return prototype ? proxify(realPrototypeOf, options) : realPrototypeOf;
		},
		get() {
			const realGet = Reflect.get(...arguments);
			return deep ? proxify(realGet, options) : realGet;
		},


		/*
			Set - Errors *sadface*
		*/
		set() {
			if (triggeredByFunction) throw new Error('Darn!');
			return Reflect.set(...arguments);
		},
		setPrototypeOf() {
			if (prototype && triggeredByFunction) throw new Error('Darn!');
			return Reflect.setPrototypeOf(...arguments);
		},
		deleteProperty() {
			if (triggeredByFunction) throw new Error('Darn!');
			return Reflect.deleteProperty(...arguments);
		}
	});
};
