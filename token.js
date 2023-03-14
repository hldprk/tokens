// @ts-check
/** @typedef {import('./state').default} StateType */

import Syntax from './syntax.js';

/** a doubly-linked list of tokens */
export default class Token extends Syntax {

	/** 
	* the type of token matched or to be matched - corresponds to a value in 'Token.Kind'
	* @type {String|null}
	*/ 
	kind = null; 

	/** 
	* what the token matched from the source string
	* @type {String|null}
	*/
	content = null; 
	
	/** 
	* the previous token in the list
	* @type {Token|null}
	*/
	previous = null; // the previous token
	
	/** 
	* the next token in the list
	* @type {Token|null}
	*/
	next = null; // the next token

	/**
	 * object holding all possible token kinds and their names
	 * @type {Object}
	 */
	static Kind = {};

	/**
	 * all possible token kinds' patterns, which are either regex, string, or function
	 * @type {Object}
	 */
	static Pattern = {};

	/** clones from `state.token` if it's kind matches, else throws an error */
	parse(state) {

		if(state.token === null) {

			throw `expected ${this.description}, found end of input`;

		}

		if(state.token.kind === this.kind) {

			this.clone_from(state.token);
			
			try { state.advance(); }

			catch { throw `expected ${this.description}, found end of input`; }

		}

	}

	/**
	 * stitches together a linked-list of tokens from the given array of tokens
	 * @param {Array<Token>} tokens
	 * @returns {Token}
	 */
	static from_array(tokens) {

		for(let i = 0; i < tokens.length; i++) {

			const current = tokens[i];

			if(i > 0) {

				const previous = tokens[i - 1];

				previous.next = current;
				current.previous = previous;

			}

		}

		return tokens[0];

	}

	/**
	 * appends a new token to the end of this token list
	 * @param {Token} other 
	 * @returns {Token}
	 */
	append(other) {

		other.previous = this.tail;
		this.tail.next = other;
		return other;

	}

	/**
	 * returns the first token in the list
	 * @returns {Token}
	*/
	get head() {

		return this.array[0];

	}

	/**
	 * returns the first token in the list
	 * @returns {Token}
	*/	
	get tail() {

		return this.array[this.array.length - 1];

	}

	/**
	 * collects all tokens in the list into an array, starting with `this.head`
	 * @returns {Array<Token>}
	 */
	get array() {

		let result = [];
		let current = this;

		while(current) {

			result.push(current);
			// @ts-ignore
			current = current.next;

		}

		return result;

	}

	/** 
	* the (zero-based) index of this token in it's list
	* @returns {Number}
	*/ 
	get index() {

		let result = 0;
		let current = this;

		while(current) {

			result++;
			// @ts-ignore
			current = current.previous;

		}

		return result;

	}

	get begin() {

		return this;

	}

	get end() {

		return this;

	}
	
	/**
	 * registers a new token kind, adding to `Token.Kind` and `Token.Pattern`,
	 * also returns a class extending `Token` with the given properties
	 * @param {String} kind 
	 * @param {String|RegExp|((StateType)=>String)} pattern 
	 * @param {String} description 
	 * @returns {typeof Token}
	 */
	static register(kind, pattern, description) {

		Token.Kind[kind] = kind;
		Token.Pattern[kind] = pattern;
		
		Token[kind] = class extends Token {

			kind = kind;

			get description() { return description ? description : 'a token'; }

		}

		return Token[kind];

	}

	/** 
	 * returns this token's pattern
	 * @returns {String|RegExp|((StateType)=>String)}
	 */
	get pattern() {

		// @ts-ignore
		return Token.Pattern[this.kind];

	}

	get cloned() {

		// @ts-ignore
		const cloned = new (this.constructor)();

		cloned.kind = this.kind ? this.kind.slice() : null;
		cloned.content = this.content ? this.content.slice() : null;
		cloned.previous = this.previous;
		cloned.next = this.next;

		return cloned;

	}

	clone_from(other) {

		this.kind = other.kind ? other.kind.slice() : null;
		this.content = other.content ? other.content.slice() : null;
		this.previous = other.previous;
		this.next = other.next;

	}

}
