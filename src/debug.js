// const test = function () {console.log(...arguments);};

// @test()
// class Test {
// 	constructor() {
// 	}
// }

// console.log(new Test())

import {proxify} from "./observer";

setInterval(() => {
	const test = proxify({
		prop: {},
		func: (arg1) => {arg1.poop = "changed"},
	});
	/*
		[during call to `proxify`]=> Created a proxy for target
	*/

	test.prop.test = 2;
	/*
		[durring accessing of `test.prop`] => Created a proxy for target["prop"]
		[durring assigning of `test.prop.test`] => Mutation at target["prop"]["test"]
	*/

	test.func({poop: "don't change me pls"})
	/*
		[durring accessing `test.func`] => Created a proxy for target["func"]
		[durring call to `test.func`, before passing to it] => Created a proxy for target["func"](arg: 0)
		[durring call to `test.func`, during the execution of it] => Mutation at target["func"](arg: 0)["poop"]
	*/
}, 1000)
