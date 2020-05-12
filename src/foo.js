const global = {prop: "test"};

$shouldNotMutate(["foo"]);
const foo = (foo) => {
	foo.prop = "pie";
};

$shouldNotMutate(["foo"]);
function bar(foo) {
	foo.prop = "Test";
}

/**
 * This does not currently work
 */
$shouldNotMutate(["foo"]);
const pizza = foo => console.log(foo);

foo(global);
bar(global);