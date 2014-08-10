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
 * @param  {Number} x1 From X coordinate.
 * @param  {Number} y1 From Y coordinate.
 * @param  {Number} x2 To X coordinate.
 * @param  {Number} y1 To Y coordinate.
 * @return {Array|Boolean}
 */
Map.prototype.dda = function (x1, y1, x2, y1) {
	// TODO
};

return Map;

});