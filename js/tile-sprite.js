define(['jaws', 'data/settings'], function (jaws, settings) {

var TileSprite = function (config) {
	// If TileX/Y are given, convert x/y screen coords.
	if(typeof config.xTile === 'number') {
		config.x = config.xTile * settings.map.tile.width;
	}
	if(typeof config.yTile === 'number') {
		config.y = config.yTile * settings.map.tile.height;
	}

	jaws.Sprite.call(this, config);

	this.xTile = config.xTile || 0;
	this.yTile = config.yTile || 0;
	this.isPassable    = config.isPassable;
	this.isTransparent = config.isTransparent;
};

TileSprite.prototype = new jaws.Sprite({});

return TileSprite;

});