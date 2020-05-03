const looksLike = require('./looks-like');
const t = require('@babel/types');
const { default: traverse } = require('@babel/traverse');
const parser = require('@babel/parser');
const fs = require('fs');
const proxyCode = fs.readFileSync(`${__dirname}/proxy.js`, 'utf8');

const proxyAST = parser.parse(proxyCode);

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

								const notMutateArgs = path.node.expression.arguments;
								
								let inBodyArgsToProxy = [];
								if (notMutateArgs.length) {
									// We expect the first item in the array to be an array of strings
									inBodyArgsToProxy = notMutateArgs[0].elements.map(node => node.value)
								}

								debugger;

								Programs.set(programPath.node, true);

								// Treat the function as a "decorator" for a function. AKA get the function immediately
								// After the function itself
								const functionNodePath = path.getSibling(path.key + 1);

								// Traverse the path to get the "BlockStatement" so we can mutate the code on it's own
								traverse(functionNodePath.node, {
									noScope: true,
									enter(path) {
										if (path.node.type === 'BlockStatement') {
											console.log('WELCOME TO THE FUNCTION BODY OF THE $shouldNotMutate "Decorator');
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
          /**
           * If the Program has any utilization of the $shouldNotMutate, then we'll inject the code from the
           * proxy.js file to then be able to use that function in the AST
           */
          if (val) {
            programPath.node.body = [...proxyAST.program.body, ...programPath.node.body];
          }
				},
			},
		},
	};
};
