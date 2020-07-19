import path from "path";
import {create} from "babel-test";


const {fixtures} = create({
	plugins: [require.resolve("..")],
});

fixtures("will-mutate plugin", path.join(__dirname, "__fixtures__"));
