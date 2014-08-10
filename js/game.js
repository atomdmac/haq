require.config({
	baseUrl: 'js',
	paths: {
		'jaws'  : 'lib/jaws/jaws',
		'radio' : 'lib/radio/radio',
		'rot'   : 'lib/rot',
		'data/settings': '../data/settings'
	},
	shim: {
		'jaws': {
			exports: 'jaws'
		},
		'rot': {
			explors: 'ROT'
		}
	}
});

require(
['jaws', 'radio', 'states/state-load', 'data/settings'], 
function (jaws, radio, LoadState, settings) {
	jaws.init({
		width : settings.view.width,
		height: settings.view.height
	});
	jaws.start( new LoadState(), {}, {});

});