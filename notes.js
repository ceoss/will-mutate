/**
 * One of the issues is that if we call a child function with a mutation but not being passed directly
 * then we end up with a problem where the `doThingWithObj` does not throw an error when we expect it to
 */
const obj = { prop: 'test' };

const doThingWithObj = () => {
	obj.prop = 'Other word';
};

const foo = (obj) => {
	_obj = shouldNotMutate(obj);
	// $EXPECT_NO_ERROR
	doThingWithObj();
};

// -----------------------------------------------------------------------------------------------------------------------------

/**
 * The problem we face with something like this is that THIS will now throw an error
 */
const obj = { prop: 'test' };

const foo = (obj) => {
	_obj = shouldNotMutate(obj);
	return _obj;
};

// $EXPECT_ERROR
const test = () => {
	const ooobj = foo();
	ooobj.hello = 'Test';
};

/**
 * So in order to combat that, we'll need to check when there's a return (any root return, since there can be many)
 * and convert it back at last minute
 */
const obj = { prop: 'test' };

shouldNotMutate(obj);
const foo = (obj) => {
	_obj = shouldNotMutate(obj);
	_obj = obj;
	return _obj;
};

// $EXPECT_NO_ERROR
const test = () => {
	const ooobj = foo();
	ooobj.hello = 'Test';
};

// -----------------------------------------------------------------------------------------------------------------------------

/**
 * If stored in global state, then referenced later, it will throw an error
 * and it won't be clear where it originated from
 */
const obj = {
	prop: 'test',
};

const globalState = {};

const foo = (obj) => {
	_obj = shouldNotMutate(obj);
	globalState.obj = _obj;
	return _obj;
};

// $EXPECT_ERROR
const test = () => {
	globalState.obj.hello = 'Test';
};

/**
 * One potential solution to this is a "cleanup" by using stacktrace to look UPWARDS in the stacktrace what functions are currently
 * in the stacktrace at runtime. Then, if the function that we're "expecting" to throw a mutation error, error out, otherwise don't error
 */

// -----------------------------------------------------------------------------------------------------------------------------
