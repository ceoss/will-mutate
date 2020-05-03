export const proxify = (object, {deep = false} = {}) => {
	if (!(object instanceof Object)) return object;
	
	const triggeredByFunction = true; // TODO: this is for stack trace shit

	return new Proxy(object, {
		/*
			Get - Deep *lennyface*
		*/
		getOwnPropertyDescriptor() {
			const realDescriptor = Reflect.getOwnPropertyDescriptor(...arguments);
			return deep ? proxify(realDescriptor) : realDescriptor;
		},
		get() {
			const realGet = Reflect.get(...arguments);
			return deep ? proxify(realGet) : realGet;
		},


		/* 
			Set - Errors *sadface*
		*/
		set() {
			if (triggeredByFunction) throw new Error('Poop!');
			return Reflect.set(...arguments);
		},
		setPrototypeOf() {
			if (triggeredByFunction) throw new Error('Poop!');
			return Reflect.setPrototypeOf(...arguments);
		}
	});
};

/*
Needs to be be able to detect:

defineProperty()
getOwnPropertyDescriptor()
construct (new Class)
deletion
symbol mutation
Prototype changes
Mutations to it (with an option likely)
setPrototypeOf()

*/