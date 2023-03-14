
`tokens` is a recursive descent parsing library where class structure defines a syntax tree.
# Usage
```js
const Number = Token.register('Number', /\d+/, 'a number');
const Whitespace = Token.register('Whitespace', /[ \t]+/, 'a whitespace');
const Operator = Token.register('Operator', /[\+\*\\\-]/, 'an operator');

class Expression extends Sequence {

	left = new Number();
	operator = new Operator();
	right = new Expression.Right();

	static Right = class extends Choice {

		static choices = [Expression, Number];

	}

}

let state = new State('1 + 2 * 3');

let expression = new Expression();

expression.parse(state);

```
In this example:

* `Token.register` defines `Number`, `Whitespace`, and `Number` tokens, which makes them available while tokenizing.
* `Expression` defines the syntax tree for a binary expression, which can be parsed from a `State` object initialised by some input string.
