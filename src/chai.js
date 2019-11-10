// language chain method
Assertion.addMethod("model", function (type) {
	const obj = this._obj;

	// first, our instanceof check, shortcut
	new Assertion(this._obj).to.be.instanceof(Model);

	// second, our type check
	this.assert(
		obj._type === type
		, "expected #{this} to be of type #{exp} but got #{act}"
		, "expected #{this} to not be of type #{act}"
		, type        // expected
		, obj._type   // actual
	);
});
