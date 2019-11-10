// TODO: WeakMap if the plugin system allows for it
export const mutationMap = new WeakMap();

export const recordMutation = function (mutationData) {
	const {currentTarget, oldValue, newValue, path, mutationType} = mutationData;
	console.log(`Mutation (${mutationType}) at ${path} from ${oldValue} to ${newValue}`, currentTarget);
	let mutations = mutationMap.get(currentTarget);
	if (!mutations) {
		mutations = [];
		mutationMap.set(currentTarget, mutations);
	}
	mutations.push(mutationData);
};

// TODO: bind and attach this method to the resulting curried funciton (the call to this module)
export const clearMutations = function (target) {
	mutationMap.delete(target);
};

export const propPath = function (path, property) {
	if (/^[a-zA-Z_$][\w$]*$/.test(property)) {
		return `${path}.${property}`;
	} else if (/^\d$/.test(property)) {
		return `${path}[${property}]`;
	} else {
		return `${path}["${property}"]`;
	}
};

// TODO: recursive option
// TODO: extend options instead of default
export const proxify = function (target, options = {path: "currentTarget", targetOrigin: "self"}) {
	// If the target won't be able to be mutated/proxified
	// TODO: check that this works with all proxifable objects
	if (!(target instanceof Object)) {
		return target;
	}
	options.currentTarget = options.currentTarget || target;
	const {path, currentTarget} = options;
	console.log(`Created a proxy for ${path}`);
	const handler = {
		apply(target, thisArg, argumentsList) {
			// TODO: proxy this if not in a set of proxies that we control?
			const argumentsListProxies = argumentsList.map(
				(value, index) => {
					return proxify.call(
						this,
						value,
						Object.assign({}, options, {
							path: path + `(${index})`,
							targetOrigin: "argument",
							targetKey: index,
						}),
					);
				}
			);
			return Reflect.apply(target, thisArg, argumentsListProxies);
		},
		set(target, property, value, receiver) {
			recordMutation({
				target,
				property,
				oldValue: Reflect.get(target, property, receiver),
				newValue: value,
				receiver,
				path: propPath(path, property),
				currentTarget,
				mutationType: "set",
			});
			// TODO: incorperate receiver
			return Reflect.set(target, property, value, receiver);
		},
		get(target, property, receiver) {
			// TODO: implement
			if (typeof property === "symbol" || property === "toString") {
				return Reflect.get(target, property, receiver);
			}
			// Return a proxy of the actual stored value
			return proxify.call(
				this,
				// Get the original value
				Reflect.get(target, property, receiver),
				// Copy the options, update the path
				Object.assign({}, options, {
					path: propPath(path, property),
					targetOrigin: "property",
					targetKey: property,
				}),
			);
		},
	};

	return new Proxy(target, handler);
};
