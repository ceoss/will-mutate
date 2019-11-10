import {mutationMap, clearMutations} from "./observer";


export default class {
	mutations = [];

	constructor (target, options) {
		this.target = target; //TODO: use?
		this.options = options; //TODO: use?
		this.proxy = proxify.call(this, target, options);
	}

	clear() {
		// TODO: store inside the class?
		clearMutations(this.proxy);
	}

	recordMutation(mutationData) {
		const {currentTarget, oldValue, newValue, path, mutationType} = mutationData;
		console.log(`Mutation (${mutationType}) at ${path} from ${oldValue} to ${newValue}`, currentTarget);
		this.mutations.push(mutationData);
	}

	get self() {

	}
}
