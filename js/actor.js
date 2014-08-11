define(['tile-sprite', 'animator'], function (TileSprite, Animator) {

var Actor = function (config) {

	TileSprite.call(this, config);

	this._data      = config.data  || {};
	this._speed     = config.speed || 1;
	this._fovRadius = config.fovRadius || 50;
	this._isActing  = false;
	this._surroundings = {};
	this._mapMemory    = {};

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

Actor.prototype.move = function (direction) {
	var map = this._data.map,
		destinationTile = map.getRelative(this, direction),
		destinationCoords;

	if(destinationTile && map.isPassable(destinationTile)) {
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

Actor.prototype.track = function (target) {
	// TODO
};

Actor.prototype.travel = function (target) {
	// TODO
};

return Actor;

});