define(
['jaws', 'rot', 'data/settings', 'map', 'states/state-play', 'tile-sprite', 'player', 'npc'], 
function (jaws, rot, settings, Map, PlayState, TileSprite, Player, NPC) {

return function () {

	var _data;

	this.setup = function (data) {
		_data = data;
		
		// Show a loading screen.
		jaws.clear();
		jaws.draw(
			new jaws.Text({
				text: "Loading...",
				color: "#000000",
				x: 100,
				y: 100
			})
		);

		var newMapSize = {
			width : Math.round(ROT.RNG.getUniform() * (settings.map.width.max - settings.map.width.min)) + settings.map.width.min,
			height: Math.round(ROT.RNG.getUniform() * (settings.map.height.max - settings.map.height.min)) + settings.map.height.min
		};

		// Generate the map data.
		var mapGen = new ROT.Map.Digger(newMapSize.width,newMapSize.height),
			map = new Map({
				cell_size: [settings.map.tile.width, settings.map.tile.height],
				size     : [newMapSize.width, newMapSize.height]
			});

		function _createMap(x, y, type) {
			var tile = new TileSprite({
				color : type ? '#000000' : '#ffffff',
				xTile : x,
				yTile : y,
				width : settings.map.tile.width,
				height: settings.map.tile.height,
				isPassable   : type ? false : true,
				isTransparent: type ? false : true
			});
			map.push(tile);
		}

		mapGen.create(_createMap);

		// TODO: Don't always drop entities in center of room.
		// TODO: Check to make sure entity spawn doesn't collide with other entity spawns
		// TODO: Don't always drop entities in first room.
		function _chooseEntitySpawn(mapGen) {
			var rooms = mapGen.getRooms(),
				index = Math.floor(Math.random() * rooms.length),
				room  = rooms[index],
				left  = room.getLeft() + 1,
				right = room.getRight() - 1,
				top   = room.getTop() + 1,
				bottom= room.getBottom() - 1;
				xTile = Math.floor(Math.random() * (right - left  ) + left) + 1,
				yTile = Math.floor(Math.random() * (top   - bottom) + top ) + 1;
			return {	
				xTile: xTile,
				yTile: yTile
			};
		}

		var playerSpawn = _chooseEntitySpawn(mapGen);

		// Set up data structure that will be shared between game states.
		_data.map       = map;
		_data.scheduler = new ROT.Scheduler.Simple();
		_data.engine    = new ROT.Engine(_data.scheduler);
		_data.viewport  = new jaws.Viewport({
			width : settings.view.width,
			height: settings.view.height
		});
		_data.player    = new Player({
			color: 'green',
			width: settings.map.tile.width,
			height: settings.map.tile.height,
			xTile: playerSpawn.xTile,
			yTile: playerSpawn.yTile,
			data: _data
		});
		_data.npcs = [];

		// Generate some NPCs.
		(function () {
			for(var i=0; i<8; i++) {
				var spawnPoint = _chooseEntitySpawn(mapGen);
				_data.npcs.push(
					new NPC({
						width: settings.map.tile.width,
						height: settings.map.tile.height,
						xTile: spawnPoint.xTile,
						yTile: spawnPoint.yTile,
						data : _data,
						color: 'blue'
					})
				);
			}
		})();

		_data.actors = _data.npcs.concat(_data.player);

		// Add actors to the scheduler.
		for(var i=0, ilen=_data.actors.length; i<ilen; i++) {
			_data.scheduler.add(_data.actors[i], true);
		}

		jaws.switchGameState(new PlayState(), {}, _data);
	};

	this.update = function () {
		// TODO
	};

	this.draw = function () {
		// TODO
	};

};

});