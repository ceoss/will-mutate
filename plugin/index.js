const looksLike = require('./looks-like');
const t = require('@babel/types');

module.exports = () => {
  return {
    name: 'useTranslateTransform',
    visitor: {
      CallExpression(path) {
        const isFunc = looksLike(path, {
          node: {
            type: "CallExpression",
            callee: {
              name: "shouldNotMutate"
            }
          }
        });

        if (!isFunc) return;

        debugger;

        path
          .replaceWith(t.stringLiteral("changedString"));
      }
    }
  };
};