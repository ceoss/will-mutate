const global = {prop: "test"};

$shouldNotMutate(poop);
const foo = (poop) => {
	poop.prop = "pie";
};

$shouldNotMutate(poop);
function bar(poop) {
	poop.prop = 'Test';
}

/**
 * This does not currently work
 */
$shouldNotMutate(poop);
const pizza = a => console.log(a);

foo(global);
bar(global);