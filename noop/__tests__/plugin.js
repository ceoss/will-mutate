const path = require("path");
const {create} = require("babel-test");


const {fixtures} = create({
	plugins: [require.resolve("..")],
});

fixtures("noop plugin", path.join(__dirname, "__fixtures__"));
