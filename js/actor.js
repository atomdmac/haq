define(['tile-sprite', 'animator'], function (TileSprite, Animator) {

var Actor = function (config) {

	TileSprite.call(this, config);

	this._data      = config.data  || {};
	this._speed     = config.speed || 1;
	this._fovRadius = config.fovRadius || 20;
	this._isActing  = false;
	this._surroundings = {};
	this._mapMemory    = {};
	this._seekTarget = null;
	this._seekPath   = [];

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

};

Actor.prototype = new TileSprite({});

Actor.prototype.act = function () {
	this._isActing = true;
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
		if(actors[i].xTile === xTile && actors[i].yTile === yTile) {
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
		console.log('Invalid move.  You need to implement a proper log, my friend.');
		return false;
	}
};

Actor.prototype.wander = function () {
	var dirs = ['N', 'E', 'S', 'W'],
		index = Math.floor(Math.random() * 4);

	this.move(dirs[index]);
};

Actor.prototype.seek = function (target) {
	if(target && this._seekTarget !== target) {
		var path = this._data.map.lineOfSight(this, target);
		if(path) {
			// Remove cell that Actor currently resides in.
			path.shift();
			this._seekPath = path;
		}
	}

	if(this._seekPath.length && this._data.map.isPassable(this._seekPath[0])) {
		var destinationTile = this._seekPath.shift(),
			destinationCoords = this._data.map.tileToPx(destinationTile); 

		this.xTile = destinationTile.xTile;
		this.yTile = destinationTile.yTile;

		// Animate movement.
		Animator.add(this, {x: this.x, y: this.y}, destinationCoords);

		return true;
	} else {
		return false;
	}
};

Actor.prototype.flee = function (target) {
	// TODO
};

Actor.prototype.travel = function (target) {
	// TODO
};

return Actor;

});