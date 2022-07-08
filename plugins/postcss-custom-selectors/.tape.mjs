import postcssTape from '../../packages/postcss-tape/dist/index.mjs';
import plugin from 'postcss-custom-selectors';

postcssTape(plugin)({
	'basic': {
		message: 'supports basic usage'
	},
	'basic:preserve': {
		message: 'supports { preserve: true } usage',
		options: {
			preserve: true
		}
	},
	'examples/example': {
		message: 'minimal example',
	},
	'examples/example:preserve': {
		message: 'minimal example',
		options: {
			preserve: true
		}
	},
	'complex': {
		message: 'supports complex usage'
	},
	'safety': {
		message: 'supports safe tag ordering (.foo:--h1 becomes h1.foo instead of .fooh1)'
	},
});
