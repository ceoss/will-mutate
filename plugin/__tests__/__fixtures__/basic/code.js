const global = {prop: "test"};

$shouldNotMutate(['foo']);
const foo = (foo, other) => {
    foo.prop = "pie";
    other.prop = "Don't change me"
};

$shouldNotMutate(['foo']);
function bar(foo, other) {
    foo.prop = 'Test';
    other.prop = "Don't change me"
}

/**
 * This does not currently work
 */
$shouldNotMutate(['foo']);
const pizza = foo => console.log(foo);

foo(global);
bar(global);
