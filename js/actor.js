define(['tile-sprite', 'animator'], function (TileSprite, Animator) {

var Actor = function (config) {

	TileSprite.call(this, config);

	this._name      = config.name  || (new Date() + "");
	this._data      = config.data  || {};
	this._isPlayer  = config.isPlayer || false;
	this._speed     = config.speed || 1;
	this._fovRadius = config.fovRadius || 20;
	this._isActing  = false;
	this._surroundings = {};
	this._mapMemory    = {};
	this._seekTarget = null;
	this._travelPath = [];

	this.isPassable = false;

	this.getSpeed = function () {
		return this._speed;
	};

	this.getFOVRadius = function () {
		this._fovRadius;
	};

	this.isActing = function () {
		return this._isActing;
	};

	this.isPlayer = function () {
		return this._isPlayer;
	};

};

Actor.prototype = Object.create(TileSprite.prototype);

Actor.prototype.getName = function () {
	return this._name;
};

Actor.prototype.act = function () {
	this._isActing = true;
};

Actor.prototype.visibleToPlayer = function () {
	if(this._data && this._data.player && this._data.player.canSee(this.xTile, this.yTile)) return true;
	return false;	
};

Actor.prototype.canSee = function (xTile, yTile) {
	if(typeof xTile === 'object') yTile = xTile.yTile, xTile = xTile.xTile;
	if(this._surroundings[xTile+"_"+yTile]) {
		return true;
	}
	return false;
};

Actor.prototype.updateSurroundings = function () {
	if(this._data.map) {
		this._surroundings = this._data.map.getSurroundings(this.xTile, this.yTile, this._fovRadius);
	}
};

Actor.prototype.canRemember = function (xTile, yTile) {
	if(typeof xTile === 'object') yTile = xTile.yTile, xTile = xTile.xTile;
	if(this._mapMemory[xTile+"_"+yTile]) {
		return true;
	}
	return false;
};

Actor.prototype.updateMemory = function () {
	for(var i in this._surroundings) {
		this._mapMemory[i] = this._surroundings[i];
	}
};

Actor.prototype.wait = function () {
	this._isActing = false;
};

Actor.prototype.checkCollisions = function (xTile, yTile) {
	if(typeof xTile === 'object') yTile = xTile.yTile, xTile = xTile.xTile;
	var actors = this._data.actors,
		collisions = [];
	for(var i=0, ilen = actors.length; i<ilen; i++) {
		if(actors[i] === this) continue;
		if(actors[i].xTile === xTile && actors[i].yTile === yTile && actors[i]._isAlive) {
			collisions.push(actors[i]);
		}
	}
	if(collisions.length) {
		return collisions;
	}
	return false;
};

Actor.prototype.move = function (direction) {
	var map = this._data.map,
		destinationTile = map.getRelative(this, direction),
		destinationCoords;

	return this.moveTo(destinationTile);
};

Actor.prototype.moveTo = function (xTile, yTile) {
	
	var map = this._data.map,
		destinationTile, 
		destinationCoords;
	
	if(typeof xTile === 'object') {
		destinationTile = {
			xTile: xTile.xTile,
			yTile: xTile.yTile
		};
	} else {
		destinationTile = {
			xTile: xTile,
			yTile: yTile
		};
	}

	if(destinationTile && map.isPassable(destinationTile) && !this.checkCollisions(destinationTile)) {
		destinationCoords = map.tileToPx(destinationTile);
		
		this.xTile = destinationTile.xTile;
		this.yTile = destinationTile.yTile;

		// Animate movement.
		Animator.add(this, {x: this.x, y: this.y}, destinationCoords);

		this._isActing = false;

		return true;
	} 

	else {

		return false;
	}
};

Actor.prototype.wander = function () {
	var dirs = ['N', 'E', 'S', 'W'],
		index = Math.floor(Math.random() * 4);

	this.move(dirs[index]);
};

Actor.prototype.seek = function (target) {
	// TODO
};

Actor.prototype.flee = function (target) {
	// TODO
};

/**
 * Attempt to follow the path computed by Actor.updateTravelPath().  If the path
 * is blocked, return FALSE and do nothing.
 * @return {Boolean} Return TRUE if path can be followed currently or FALSE if the path is blocked.
 */
Actor.prototype.travel = function () {
	// If no travel path exists, return false.
	if(!this._travelPath || !this._travelPath.length) return false;
	
	if(this.moveTo(this._travelPath[0])) {
		this._travelPath.shift();
		return true;
	} else {
		return false;
	}
};

/**
 * Compute a path from the Actor's current position to the target tile.
 * @param  {TileSprite} target An object with xTile and yTile properties.
 * @return {Void}              Update the internal _travelPath property that 
 *                             will be used by the Actor.travel() method.
 */
Actor.prototype.updateTravelPath = function (target) {
	var path = this._data.map.getPath(target, this);
	if(path) {
		path.shift();
		this._travelPath = path;
	} else {
		this._travelPath = false;
	}
};

return Actor;

});