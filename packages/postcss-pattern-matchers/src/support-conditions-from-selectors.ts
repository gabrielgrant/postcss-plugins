import valueParser from 'postcss-value-parser';
import { selectorMatchers as matchers } from './selector-matchers';
import { matches } from './match';

export function supportConditionsFromSelector(value: string): Array<string> {
	const supportConditions: Array<string> = [];

	const relevantMatchers = [];

	matchers.forEach((matcher) => {
		if (value.indexOf(matcher.sniff) > -1) {
			relevantMatchers.push(matcher);
		}
	});

	if (!relevantMatchers.length) {
		return supportConditions;
	}

	try {
		const ast = valueParser(value);
		ast.walk((node) => {
			try {
				node['dimension'] = valueParser.unit(node.value);
			} finally {
				if (node['dimension'] === false) {
					delete node['dimension'];
				}
			}

			for (let i = 0; i < relevantMatchers.length; i++) {
				const selectorMatchers = relevantMatchers[i];

				for (let j = 0; j < selectorMatchers.matchers.length; j++) {
					const matcherAST = selectorMatchers.matchers[j];
					// Matchers are ordered from most specific to least.
					// Only one needs to match.
					if (matches(matcherAST, node)) {
						supportConditions.push(selectorMatchers.supports);
						return;
					}
				}
			}
		});

	} catch (e) {
		/* ignore */
	}

	return Array.from(new Set(supportConditions)); // list with unique items.
}
