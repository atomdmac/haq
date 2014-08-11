define(
['jaws', 'states/state-play-controls', 'data/settings', 'fog-viewport'], 
function (jaws, controls, settings, FogViewport) {

return function () {

	var _data, _viewport, _controls;

	this.setup = function (data) {
		_data = data;
		_data.viewport = _viewport = new FogViewport({
			width: jaws.width,
			height: jaws.height,
			max_x: _data.map.size[0] * settings.map.tile.width,
			max_y: _data.map.size[1] * settings.map.tile.height});

		// Implement user controls.
		jaws.switchGameState(new controls(), {}, _data);
	};

	this.update = function () {};

	this.draw = function () {
		jaws.fill('#000000');
		_viewport.centerAround(_data.player);
		_viewport.drawTileMap2(_data.map, _data.player);
		_viewport.draw(_data.player);
		if(_data.player.canSee(_data.npc))_viewport.draw(_data.npc);
	};
};

});