define(
['jaws', 'states/state-play-controls', 'data/settings'], 
function (jaws, controls, settings) {

return function () {

	var _data, _viewport, _controls;

	this.setup = function (data) {
		_data = data;
		_data.viewport = _viewport = new jaws.Viewport({
			width: jaws.width,
			height: jaws.height,
			max_x: _data.map.size[0] * settings.map.tile.width,
			max_y: _data.map.size[1] * settings.map.tile.height});

		// Implement user controls.
		jaws.switchGameState(new controls(), {}, _data);
	};

	this.update = function () {
		// TODO
	};

	this.draw = function () {
		_viewport.centerAround(_data.player);
		_viewport.drawTileMap(_data.map);
		_viewport.draw(_data.player);
	};
};

});