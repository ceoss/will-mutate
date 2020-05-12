const global = {prop: "test"};

const foo = (foo) => {
	foo.prop = "pie";
};

function bar(foo) {
	foo.prop = "Test";
}

const pizza = foo => JSON.parse("{}");

foo(global);
bar(global);
