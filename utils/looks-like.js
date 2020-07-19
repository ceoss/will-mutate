// https://github.com/mattphillips/babel-plugin-console/blob/master/src/utils/looks-like.js
const looksLike = (a, b) => {
	return (
		a &&
		b &&
		Object.keys(b).every((bKey) => {
			const bVal = b[bKey];
			const aVal = a[bKey];
			if (typeof bVal === "function") {
				return bVal(aVal);
			}
			return isPrimitive(bVal) ? bVal === aVal : looksLike(aVal, bVal);
		})
	);
};

// eslint-disable-next-line eqeqeq
const isPrimitive = (val) => val == undefined || /^[bns]/.test(typeof val);

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
