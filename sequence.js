// @ts-check

import Syntax from './syntax.js';
import Choice from './choice.js';

/** a node whose branches (`this.children`) are sequentially parsed */
export default class Sequence extends Syntax {
	
	parse(state) {

		const children = this.children;
	
		// sequentially parsing each child, failing if a child throws an error
		for(const [key, value] of Object.entries(this)) {

			if(!(value instanceof Syntax)) { continue; }

			value.parse_or(state, (s) => {

				const found = s.token ? s.token.description : 'end of input';

				throw `expected ${value.description} while parsing ${this.description} - found ${found}`;

			})
			
			// replacing each 'Choice' child with it's chosen value
			if(value instanceof Choice) {

				this[key] = value.chosen;

			}

		}

		this.after(state);

	}

	get children() {

		return Object.values(this).filter(value => value instanceof Syntax);

	}
	
	get begin() {
		
		return this.children[0].begin;
		
	}
	
	get end() {

		const children = this.children;

		return children[children.length - 1].end;

	}

	after(state) {

		this.children.forEach(child => child.after(state));

	}

}