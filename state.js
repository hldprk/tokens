// @ts-check
/** @typedef {import('./token').default} TokenType */

import Token from "./token.js";

/** a wrapper for state relevant to parsing */
export default class State {

	/**
	 * the current token being parsed
	 * @type {TokenType|null}
	*/
	token = null;

	/** 
	 * extra information relevant to parsing conserved while cloning
	 * @type {Object}
	 */
	information = {};

	/**
	 * 
	 * @param {String} string 
	 * @param {Object|undefined} information
	 * @returns 
	 */
	constructor(string, information) {

		if(information) { this.information = information; }
		if(!string) { return; }

		// 'this.information.remainder' is the not-yet tokenized portion of 'string'
		this.information.remainder = string;

		// by default information stores a one-based line number 'line'
		this.information.line = 1;

		const kinds = Object.values(Token.Kind);

		outer:
		while(this.information.remainder.length) {

			for(const kind of kinds) {

				const match = this.match(kind);
				
				if(match) {

					// 'line' advances by the number of newlines in the match
					this.information.line +=  match.split(/\n/g).length - 1;

					const token = new Token();
					
					token.kind = kind;
					token.content = match;

					if(this.token) { this.token.append(token) }
					else { this.token = token }

					// a zero-length token still advances tokenization by one character
					const length = match.length ? match.length : 1;

					this.information.remainder = this.information.remainder.substring(length);

					continue outer;

				}

			}

			// all token kinds failed to match 'remainder'
			throw `couldn't match a token`
	
		}

		// remainder isn't needed after tokenizing
		delete this.information.remainder;

	}

	/**
	 * returns a clone of `this`
	 * @returns {State}
	 */
	get cloned() {

		// @ts-ignore
		const clone = new State(null, {});

		clone.token = this.token ? this.token.cloned : null;
		
		const json = JSON.stringify(this.information);
		const parsed = JSON.parse(json);

		clone.information = parsed;

		return clone;

	}

	/**
	 * transforms `this` into a clone of `other`
	 * @param {State} other
	 * @returns {void} 
	*/ 
	clone_from(other) {
		
		this.token = other.token;

		const json = JSON.stringify(other.information);
		const parsed = JSON.parse(json);

		this.information = parsed;

	}

	/**
	 * advances `this.token`
	 * @returns {void} 
	*/
	advance() {

		if(this.token) { this.token = this.token.next; }

		else { throw `can't advance past end of input`; }
		
	}

	/**
	 * matches and returns the next portion of `this.information.remainder` based on `kind`
	 * @param {String} kind
	*/
	match(kind) {

		const remainder = this.information.remainder;

		const pattern = Token.Pattern[kind];

		const is_string = typeof pattern === 'string' || pattern instanceof String;
		
		// pattern can be a regular expression, a string, or '(state) => undefined'
		if(pattern instanceof RegExp) {
			
			const index = remainder.search(pattern);

			if(index !== 0) { return null; }

			return remainder.match(pattern)[0];
			
		}
		
		else if(is_string) {
			
			return remainder.startsWith(pattern) ? pattern : null;
			
		}

		else if(pattern instanceof Function) {

			return pattern(this);

		}

		return null;
		
	}

}