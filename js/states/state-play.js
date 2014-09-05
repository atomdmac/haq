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

	// Debug draw functions
	function _drawNpcPaths (npc) {
		// Draw NPC paths... please clean this up... dear god...
		if(npc._travelPath && npc._travelPath.length) {
			jaws.context.save();
			jaws.context.translate(-_viewport.x, -_viewport.y);

			var ctx = jaws.context, 
				path = npc._travelPath,
				x, y, w, h;

			for(var q=0; q<npc._travelPath.length; q++) {
				x = path[q].xTile * 16;
				y = path[q].yTile * 16;
				w = 16;
				h = 16;

				ctx.strokeStyle = "pink";
				ctx.lineWidth = 1;
				ctx.beginPath();
				ctx.rect(x, y, w, h);
				ctx.stroke();

			}
			jaws.context.restore();
		}
	}

	this.draw = function () {
		jaws.fill('#000000');
		_viewport.centerAround(_data.player);
		_viewport.drawTileMap2(_data.map, _data.player);
		_viewport.draw(_data.player);

		for(var i=0, ilen=_data.npcs.length; i<ilen; i++) {
			if(_data.player.canSee(_data.npcs[i])) _viewport.draw(_data.npcs[i]);
			if(settings.npc.drawPaths) _drawNpcPaths(_data.npcs[i]);
		}
	};
};

});