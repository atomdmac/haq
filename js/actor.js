define(['tile-sprite', 'animator'], function (TileSprite, Animator) {

var Actor = function (config) {

	TileSprite.call(this, config);

	// Make sure essential properties have values.
	if(typeof config.data !== 'object') throw 'Actor must be given a "data" attribute.';

	this._data     = config.data  || {};
	this._speed    = config.speed || 1;
	this._isActing = false;

	this.getSpeed = function () {
		return _speed;
	};

	this.isActing = function () {
		return _isActing;
	};

};

Actor.prototype = new TileSprite({});

Actor.prototype.act = function () {
	_isActing = true;
};

Actor.prototype.move = function (direction) {
	var map = this._data.map,
		destinationTile = map.getRelative(this, direction),
		destinationCoords;

	if(destinationTile && map.isPassable(destinationTile)) {
		destinationCoords = map.tileToPx(destinationTile);

		// this.x = destinationCoords.x;
		// this.y = destinationCoords.y;
		
		this.xTile = destinationTile.xTile;
		this.yTile = destinationTile.yTile;

		// Animate movement.
		Animator.add(this, {x: this.x, y: this.y}, destinationCoords);
		Animator.play();
	} 

	else {
		console.log('Invalid move.  You need to implement a proper log, my friend.');
	}
};

return Actor;

});