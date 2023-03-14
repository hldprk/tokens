
import Choice from './choice.js'
import Sequence from "./sequence.js";
import State from './state.js';
import Token from "./token.js";

const Number = Token.register('Number', /\d+/, 'a number');
const Whitespace = Token.register('Whitespace', /[ \t]+/, 'a whitespace');
const Operator = Token.register('Operator', /[\+\*]/, 'an operator');

class Expression extends Sequence {

	left = new Number();
	operator = new Operator();
	right = new Expression.Right();

	static get Right() {

		return class Right extends Choice {

			static choices = [Expression, Number];

		}


	}
	
}

let state = new State('1+2*3');

let expression = new Expression();

expression.parse(state);

console.log('ok!');