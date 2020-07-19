const path = require("path");
const {create} = require("babel-test");


const {fixtures} = create({
	plugins: [require.resolve("..")],
});

fixtures("will-mutate plugin", path.join(__dirname, "__fixtures__"));
