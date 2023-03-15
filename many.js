// @ts-check

import Syntax from "./syntax.js";
import Nothing from "./nothing.js";
import Choice from "./choice.js";

/** `Many` repeatedly parses and collects a specified `Syntax` class into `this.elements` */
export default class Many extends Syntax {

	/** 
	 * array of parsed elements
	 * @type {Array<Syntax>}
	 */
	elements = [];
	
	parse(state) {

		const First = this.First;
		const Last = this.Last;

		let first = new First();
		let last = new Last();

		first.parse_or(state, () => {
			
			throw `expected ${first.description} while parsing ${this.description} - found ${state.token.description}`;
		
		});

		while(state.token) { 

			// if 'last' can parse, parse it and break
			if(Last.can_parse(state)) {

				last.parse(state);
				break;

			}
			
			const Before = this.Before;
			let before = new Before();
			
			const Element = this.Element;
			let element = new Element();
			
			// parse 'before' or ...
			before.parse_or(state, (cause) => {

				throw `expected ${before.description} before ${element.description} - found ${state.token.description}`;

			});
			

			// parse 'element' or...
			element.parse_or(state, () => {

				throw `expected ${element.description} while parsing ${this.description}`;
				
			});
					
			// if 'element' is 'Choice', push 'element.chosen' instead
			element = element instanceof Choice ? element.chosen : element;
			
			this.elements.push(element);
			
		}

	}

	/**
	 * returns a class to parse at the start of parsing
	 * @returns {typeof Syntax}
	*/
	get First() {

		return Nothing;

	}

	/**
	 * returns a class to parse at the end of parsing
	 * @returns {typeof Syntax}
	*/	
	get Last() {

		return Nothing;

	}
	
	/**
	 * returns a class to parse before each element
	 * @returns {typeof Syntax}
	*/		
	get Before() {

		return Nothing;

	}

	/**
	 * returns a class to repeatedly parse and push to `this.elements`
	 * @returns {typeof Syntax}
	*/
	get Element() {

		return Nothing;

	}

	after(state) {

		this.elements.forEach(e => e.after(state));

	}

}
