define(
['jaws', 'rot', 'data/settings', 'tile-sprite'],
function (jaws, rot, settings, TileSprite) {

var Map = function (options) {
	jaws.TileMap.call(this, options);
};

Map.prototype = new jaws.TileMap({});

Map.prototype.pxToTile = function (x, y) {
	if(typeof x === 'object') x = x.xTile, y = x.yTile;
	return {
		xTile: Math.floor(x / settings.map.tile.width),
		yTile: Math.floor(y / settings.map.tile.height)
	};
};

Map.prototype.tileToPx = function (xTile, yTile) {
	if(typeof xTile === 'object') yTile = xTile.yTile, xTile = xTile.xTile;
	return {
		x: xTile * settings.map.tile.width,
		y: yTile * settings.map.tile.height
	};
};

Map.prototype.inBounds = function (xTile, yTile) {
	if(typeof xTile === 'object') yTile = xTile.yTile, xTile = xTile.xTile;
	if(xTile<0) return false;
	if(yTile<0) return false;
	if(xTile>this.size[0]) return false;
	if(yTile>this.size[1]) return false;
	return true;
};

Map.prototype.isPassable = function (xTile, yTile) {
	if(typeof xTile === 'object') yTile = xTile.yTile, xTile = xTile.xTile;
	var items = this.cell(xTile, yTile);
	for(var i in items) {
		if(items[i].isPassable === false) {
			return false;
		}
	}
	return true;
};

Map.prototype.isCollidable = function (xTile, yTile) {
	if(typeof xTile === 'object') yTile = xTile.yTile, xTile = xTile.xTile;
	// TODO
};

Map.prototype.isTransparent = function (xTile, yTile) {
	if(typeof xTile === 'object') yTile = xTile.yTile, xTile = xTile.xTile;
	var items = this.cell(xTile, yTile);
	for(var i in items) {
		if(items[i].isTransparent === false) {
			return false;
		}
	}
	return true;
};

Map.prototype.containsActor = function (xTile, yTile) {
	// TODO
};

Map.prototype.containsItem = function (xTile, yTile) {
	// TODO
};

Map.prototype.getRelative = function (target, direction, distance) {
	if(!target || !direction) return;
	distance = distance || 1;

	var xTile = target.xTile,
		yTile = target.yTile,
		xOffset = 0,
		yOffset = 0;

	switch(direction) {
		case 'N':
			yOffset = -1;
			break;
		case 'E':
			xOffset = 1;
			break;
		case 'S':
			yOffset = 1;
			break;
		case 'W':
			xOffset = -1;
			break;
	}

	xTile += xOffset * distance;
	yTile += yOffset * distance;

	if(this.inBounds(xTile, yTile)) {
		return {
			xTile: xTile,
			yTile: yTile
		};
	} else {
		return undefined;
	}
};

// TODO: Finish Map.getAdjacent;
Map.prototype.getAdjacent = function (xTile, yTile) {
	var directions = rot.DIRS['4'];
	for(var i=0, ilen=directions.length; i<ilen; i++) {
		if(this.inBounds(directions[i][0], directions[i][1])) {
			return;
		}
	}

};

Map.prototype.getMoveableDirections = function (xTile, yTile) {
	// TODO
};

Map.prototype.getDistance = function (target1, target2) {
	// TODO
};

/**
 * Return an array of cells that represent a path from x1,y1 to x2,y2 if such a
 * path exists.  Else, return the boolean value FALSE.
 *
 * Credit is due here: http://stackoverflow.com/questions/4672279/bresenham-algorithm-in-javascript
 * 
 * @param  {TileSprite} The starting tile (should have xTile/yTile properties).
 * @param  {TileSprite} The ending tile (should have xTile/yTile properties).
 * @return {Array|Boolean}
 */
Map.prototype.lineOfSight = function (target1, target2) {
	var x0 = target1.xTile,
		y0 = target1.yTile,
		x1 = target2.xTile,
		y1 = target2.yTile,
		path = [];

	var dx = Math.abs(x1-x0);
	var dy = Math.abs(y1-y0);
	var sx = (x0 < x1) ? 1 : -1;
	var sy = (y0 < y1) ? 1 : -1;
	var err = dx-dy;

	while(true){
		// If appropriate, add cell to path.
		if(this.inBounds(x0, y0) && this.isTransparent(x0, y0)) {
			path.push({xTile: x0, yTile: y0});
		} else {
			return false;
		}

		if ((x0==x1) && (y0==y1)) break;
		var e2 = 2*err;
		if (e2 >-dy){ err -= dy; x0  += sx; }
		if (e2 < dx){ err += dx; y0  += sy; }
	}
	return path;
};

// TODO: Make maximum fovRadius equal to the viewport size.
Map.prototype.getSurroundings = function (xTile, yTile, fovRadius) {
	if(typeof xTile === 'object') fovRadius = xTile.getFovRadius, yTile = xTile.yTile, xTile = xTile.xTile;

	// Return data placeholders.
	var surroundings = {},
	// Used for callback scoping.
		self = this;

	// Callback for determining if a given tile allows light to pass.
	function __canPassLight (xTile, yTile) {
		if(xTile > self.size[0] -1) return false;
		if(yTile > self.size[1] -1) return false;
		if(xTile < 0) return false;
		if(yTile < 0) return false;

		var items = self.cell(xTile, yTile);
		for(var i=0,ilen=items.length; i<ilen; i++) {
			if(!items[i].isTransparent) return false;
		}
		return true;
	}

	// Callback for each cell as visibility is determined.
	function __onComputeVisibility(xTile, yTile, radius, visibility) {
		if(visibility) {
			surroundings[xTile + "_" + yTile] = self.cell(xTile, yTile);
		}
	}

	// Compute visibility.
	var fov = new ROT.FOV.PreciseShadowcasting( __canPassLight );
	fov.compute(xTile, yTile, fovRadius, __onComputeVisibility);

	return surroundings;
};

return Map;

});