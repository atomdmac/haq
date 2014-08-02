require.config({
	baseUrl: 'js',
	paths: {
		'jaws'  : 'lib/jaws/jaws',
		'radio' : 'lib/radio/radio'
	},
	shim: {
		'jaws': {
			exports: 'jaws'
		}
	}
});

require(['jaws', 'radio'], function (jaws, radio) {
	console.log('Loaded dependencies: ', jaws, radio);
});