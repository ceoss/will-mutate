const globalVariable = {
  prop: "test"
};

const foo = (foo, other) => {
  foo.prop = "pie";
  other.prop = "Don't change me";
};

function bar(foo, other) {
  foo.prop = "Test";
  other.prop = "Don't change me";
}
/**
 * This does not currently work
 */


const pizza = foo => JSON.parse("{}");

foo(globalVariable);
bar(globalVariable);
