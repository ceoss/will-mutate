const looksLike = require('./looks-like');
const t = require('@babel/types');
const { default: traverse } = require('@babel/traverse');

module.exports = () => {
	return {
		name: 'willMutate',
		visitor: {
			ExpressionStatement(path) {
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

        // Treat the function as a "decorator" for a function. AKA get the body
				const functionNodePath = path.getSibling(path.key + 1);

				traverse(functionNodePath.node, {
					noScope: true,
					enter(path) {
						if (path.node.type === 'BlockStatement') {
							console.log('HELLO 2');
							// debugger;
						}
					},
        });
        
			},
		},
	};
};
