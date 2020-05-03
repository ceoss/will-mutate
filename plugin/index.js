const looksLike = require('./looks-like');
const t = require('@babel/types');
const { default: traverse } = require('@babel/traverse');

/**
 * The "Map" of if the "./proxy.js" code should be injected to the top of the Program
 */
const Programs = new WeakMap();

module.exports = () => {
	return {
		name: 'willMutate',
		visitor: {
			/**
			 * We need to traverse the "Program" so we can know if we need to inject
			 * the Proxy handler or not.
			 */
			Program: {
				enter(programPath) {
					traverse(programPath.node, {
						noScope: true,
						enter(path) {
							/**
							 * Look for all $shouldNotMutate functions
							 */
							if (path.node.type === 'ExpressionStatement') {
								const isFunc = looksLike(path, {
									node: {
										type: 'ExpressionStatement',
										expression: {
											callee: {
												name: '$shouldNotMutate',
											},
										},
									},
								});

								if (!isFunc) return;

								Programs.set(programPath.node, true);

								// Treat the function as a "decorator" for a function. AKA get the function immediately
								// After the function itself
								const functionNodePath = path.getSibling(path.key + 1);

								// Traverse the path to get the "BlockStatement" so we can mutate the code on it's own
								traverse(functionNodePath.node, {
									noScope: true,
									enter(path) {
										if (path.node.type === 'BlockStatement') {
											console.log('HELLO 2');
											// debugger;
										}
									},
								});
							}
						},
					});
				},
				exit(programPath) {
					const val = Programs.get(programPath.node);
					console.log('PLEASE ONLY RUN ONCE', val);
				},
			},
		},
	};
};
