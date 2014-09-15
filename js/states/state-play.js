define(
['jaws', 'states/state-play-controls', 'data/settings', 'fog-viewport', 'log'], 
function (jaws, controls, settings, FogViewport, Log) {

return function () {

	var _data, _viewport, _controls;

	this.setup = function (data) {
		_data = data;
		_data.viewport = _viewport = new FogViewport({
			width: jaws.width,
			height: jaws.height,
			max_x: _data.map.size[0] * settings.map.tile.width,
			max_y: _data.map.size[1] * settings.map.tile.height});

		_data.player.act();

		for(var i=0; i<_data.actors.length; i++) {
			_data.actors[i].signals.attacked.add(_onAttacked);
			_data.actors[i].signals.hit.add(_onHit);
			_data.actors[i].signals.missed.add(_onMissed);
			_data.actors[i].signals.damaged.add(_onDamaged);
			_data.actors[i].signals.died.add(_onDied);
			_data.actors[i].signals.moved.add(_onMoved);
			_data.actors[i].signals.saw.add(_onSaw);
		}

		// Implement user controls.
		jaws.switchGameState(new controls(), {}, _data);
	};

	function _onAttacked (attacker, target, details) {
		if(attacker.visibleToPlayer()) Log.msg(attacker.getName() + ' attacks ' + target.getName() + '!');
	}

	function _onHit (attacker, target, details) {
		if(attacker.visibleToPlayer()) Log.msg(attacker.getName() + ' hits ' + target.getName() + '!');
	}

	function _onMissed (attacker, target, details) {
		if(attacker.visibleToPlayer()) Log.msg(attacker.getName() + ' missed ' + target.getName() + '!');
	}

	function _onDamaged (target, details) {
		if(target.visibleToPlayer()) Log.msg(target.getName() + ' takes ' + details.damage + ' points of damage.');
	}

	function _onDied (target) {
		if(target.visibleToPlayer()) Log.msg(target.getName() + ' has been slain!');
	}

	function _onMoved (target) {
		// TODO
	}

	function _onSaw (observer, target) {
		if(target.isPlayer()) Log.msg(observer.getName() + ' spots ' + target.getName());
	}

	this.update = function () {
		_data.npcs.sort( function (a, b) {
			if(a.isAlive() && !b.isAlive()) return  1;
			if(!a.isAlive() && b.isAlive()) return -1;
			return 0;
		});
	};

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

		// Draw NPCs
		for(var i=0, ilen=_data.npcs.length; i<ilen; i++) {
			if(_data.player.canSee(_data.npcs[i])) _viewport.draw(_data.npcs[i]);
			if(settings.npc.drawPaths) _drawNpcPaths(_data.npcs[i]);
		}

		// Draw player.
		_viewport.draw(_data.player);
	};
};

});