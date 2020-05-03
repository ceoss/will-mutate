const poop = {prop: "test"};

shouldNotMutate(poop);
const foo = () => {
	poop.prop = "pie";
};
