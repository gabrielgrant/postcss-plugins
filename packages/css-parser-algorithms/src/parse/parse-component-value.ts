import { ParserError } from '../interfaces/error';
import { CSSToken, TokenType } from '@csstools/css-tokenizer';
import { consumeComponentValue } from '../consume/consume-component-block-function';

export function parseComponentValue(tokens: Array<CSSToken>, options?: { onParseError?: (error: ParserError) => void }) {
	const ctx = {
		onParseError: options?.onParseError ?? (() => { /* noop */ }),
	};

	const tokensCopy = [
		...tokens,
	];

	// We expect the last token to be an EOF token.
	// Passing slices of tokens to this function can easily cause the EOF token to be missing.
	if (tokensCopy[tokensCopy.length - 1][0] !== TokenType.EOF) {
		tokensCopy.push([
			TokenType.EOF,
			'',
			tokensCopy[tokensCopy.length - 1][2],
			tokensCopy[tokensCopy.length - 1][3],
			undefined,
		]);
	}

	const result = consumeComponentValue(ctx, tokensCopy);
	if (tokensCopy[Math.min(result.advance, tokensCopy.length - 1)][0] === TokenType.EOF) {
		return result.node;
	}

	ctx.onParseError({
		message: 'Expected EOF after parsing a component value.',
		start: tokens[0][2],
		end: tokens[tokens.length - 1][3],
		state: [
			'5.3.9. Parse a component value',
			'Expected EOF',
		],
	});
}

