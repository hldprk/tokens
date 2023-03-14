// @ts-check
/** @typedef {import('./syntax').default} SyntaxType */
/** @typedef {import('./state').default} State */
/** @typedef {import('./token').default} Token */

import Syntax from './syntax.js';

// a syntax node with one child chosen from a list of possible 'Syntax' children
// given by 'this.constructor.choices'
export default class Choice extends Syntax {

	/**
	* the first successfully parsed choice
	* @type {SyntaxType|null} 
	*/
	chosen = null;

	parse(state) {

		const clone = state.cloned;
		
		// @ts-ignore
		for(const choice_class of this.constructor.choices) {

			const choice = new choice_class();
			
			try {

				choice.parse(state);

				this.chosen = choice instanceof Choice ? choice.chosen : choice;
	
				return;

			}

			catch { state.clone_from(clone); };

		}

		throw `expected ${this.description}, found '${state.token.description}'`;
		
	}

	/** 
	 * returns children of `this.choice`
	 * @returns {Array<Syntax>}
	*/
	get children() {

		return this.chosen ? this.chosen.children : [];

	}

	/** 
	 * returns array of `Syntax` classes that to be parsed
	 * @returns {Array<typeof Syntax>}
	*/
	static get choices() {

		return [];

	}

	clone_from(other) {

		const cloned = other.cloned;

		this.chosen = cloned.chosen;

	}

	get begin() {

		return this.chosen ? this.chosen.begin : null;

	}

	get end() {

		return this.chosen ? this.chosen.end : null;

	}

}