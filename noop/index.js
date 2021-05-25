const {default: traverse} = require("@babel/traverse");
const {looksLike} = require("../utils/looks-like");


module.exports = () => {
	return {
		name: "willMutate",
		visitor: {
			Program: {
				enter (programPath) {
					traverse(programPath.node, {
						noScope: true,
						enter (decoratorPath) {
							/**
							 * Look for all $shouldNotMutate functions
							 */
							if (decoratorPath.node.type === "ExpressionStatement") {
								const isFunction = looksLike(decoratorPath, {
									node: {
										type: "ExpressionStatement",
										expression: {
											callee: {
												name: "$shouldNotMutate",
											},
										},
									},
								});

								if (!isFunction) return;

								decoratorPath.remove();
							}
						},
					});
				},
			},
		},
	};
};
