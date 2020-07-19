import path from "path";
import {create} from "babel-test";


const {fixtures} = create({
	plugins: [require.resolve("..")],
});

fixtures("noop plugin", path.join(__dirname, "__fixtures__"));
