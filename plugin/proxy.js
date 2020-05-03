const proxify = (target, options = {}) => {
	// Early return for non-objects
	if (!(target instanceof Object)) return target;

	// Options
	const {deep = false, prototype = false} = options;

	// Naming properties for mutation tracing in errors
	let {
		name = (typeof target.name === "string" && target.name),
		path = "target"
	} = options;
	if (name !== "undefined" && name !== false) path += `.${name}`;

	// If the proxy trap was triggered by the function to test
	// TODO: implement, possibly make optional?
	const triggeredByFunction = true;

	// Proxy handler
	const handler = {
		// Accessor edge case traps
		getOwnPropertyDescriptor(target, prop) {
			const descriptor = old = Reflect.getOwnPropertyDescriptor(...arguments);
			if (!descriptor) return;
			const isValueDesc = "value" in descriptor;

			if (deep) {
				if (isValueDesc) {
					descriptor.value = proxify(descriptor.value, {...options, path, name: prop});
				} else {
					// descriptor.set = proxify(descriptor.set, {...options, path, name: prop}); // TODO: apply traps
					// descriptor.get = proxify(descriptor.get, {...options, path, name: prop}); // TODO: apply traps
				}
			} else if (!isValueDesc) {
				// descriptor.set = descriptor.set && new Proxy(descriptor.set, descriptorSetHandler); // TODO: apply traps
			}

			return descriptor; // TODO: make able to return read-only props
		},
	};

	// Getting traps for deep mutation assertions
	const addDeepGetTrap = (trap) => {
		handler[trap] = function (target, prop) {
			if (trap === "getPrototypeOf") prop = "__proto__";
			const real = Reflect[trap](...arguments);
			return proxify(real, {...options, path, name: prop});
		};
	};
	deep && addDeepGetTrap("get"); // Covered by getOwnPropertyDescriptor, but is more specific // TODO: interfering when read-olny
	prototype && addDeepGetTrap("getPrototypeOf");

	// Mutation traps for erroring
	const addSetTrap = (trap) => {
		handler[trap] = function (target, prop) {
			// Naming properties for mutation tracing in errors
			if (trap !== "preventExtensions") {
				if (trap === "setPrototypeOf") prop = "__proto__";
				path += `.${prop}`;
			}

			if (triggeredByFunction) throw new Error(`Mutation assertion failed. \`${trap}\` trap triggered on \`${path}\`.`);
			return Reflect[trap](...arguments);
		};
	};
	addSetTrap("set"); // Covered by defineProperty, but is more specific
	addSetTrap("defineProperty");
	addSetTrap("deleteProperty");
	prototype && addSetTrap("setPrototypeOf");
	addSetTrap("preventExtensions");

	return new Proxy(target, handler);
};

module.exports = proxify;
