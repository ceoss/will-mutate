// https://github.com/mattphillips/babel-plugin-console/blob/master/src/utils/looks-like.js
const looksLike = (a, b) => {
	return (
		a &&
		b &&
		Object.keys(b).every((bKey) => {
			const bValue = b[bKey];
			const aValue = a[bKey];
			if (typeof bValue === "function") {
				return bValue(aValue);
			}
			return isPrimitive(bValue) ? bValue === aValue : looksLike(aValue, bValue);
		})
	);
};

const isPrimitive = (value) => value == null || /^[bns]/.test(typeof value);

const isModuleExports = node => looksLike(node, {
	type: "ExpressionStatement",
	expression: {
		left: {
			object: {
				name: "module",
			},
			property: {
				name: "exports",
			},
		},
	},
});

module.exports = {
	looksLike,
	isModuleExports,
};
