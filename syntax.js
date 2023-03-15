// @ts-check
/** @typedef {import('./state').default} State */
/** @typedef {import('./token').default} Token */

/** a node of a syntax tree */
export default class Syntax {

	/** 
	 * returns the first token in this branch
	 * @returns {Token|null}
	 */
	get begin() {
		
		return null;
		
	}
	
	/** 
	 * returns the last token in this branch
	 * @returns {Token|null}
	 */	
	get end() {

		return null;

	}

	/** 
	* advances `state` and fills this syntax tree
	* @param {State} state
	* @returns {void} 
	*/
	parse(state) {
		
		throw '\'Syntax.parse\' must be overriden!'

	}

	/**
	* either parses from `state` or calls `handle` if parsing throws an error
	* @param {State} state
	* @param {(state: State, error?: any) => void} handle 
	*/
	parse_or(state, handle) {

		const clone = state.cloned;

		try { this.parse(state); }

		catch(error) {

			state.clone_from(clone);

			if(handle) { handle(state, error); }

		}

	}

	/** 
	* returns whether this class can parse from `state`
	* @param {State} state
	* @returns {boolean} 
	*/
	static can_parse(state) {

		const syntax = new this();
		const cloned = state.cloned;

		try {

			syntax.parse(cloned);
			return true;

		} 

		catch { return false; }
		
	}
	
	/** 
	* returns a description of this syntax element
	* @returns {string|String} 
	*/
	get description() {

		return 'a syntax element'

	}

	/** 
	* makes this object a clone of `other`
	* @param {Syntax} other
	* @returns {void} */
	clone_from(other) {

		for(const [key, value] of Object.entries(other)) {

			if(value instanceof Syntax) { this[key].clone_from(value) }

			else { this[key] = value; }

		}

	} 
	
	/** 
	* returns a clone of this object
	* @returns {State} state 
	*/
	get cloned() {

		// @ts-ignore
		const cloned = new (this.constructor)();

		for(const [key, value] of Object.entries(this)) {

			if(value instanceof Syntax) { cloned[key] = value.cloned }
			else { cloned[key] = value; }

		}

		return cloned;

	}

	/** 
	 * children of this syntax tree 
	 * @returns {Array<Syntax>}
	*/
	get children() {

		return [];

	}

	/**
	 * secondary parsing pass - does nothing unless overriden
	 * @param {State} state 
	 */
	after(state) {

		return;

	}

}