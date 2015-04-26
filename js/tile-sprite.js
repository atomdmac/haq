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

	this.originalImage = this.copyImage(this.image);
	this.invisibleImage = this.darkenImage(this.image);
};

TileSprite.prototype = Object.create(jaws.Sprite.prototype);

// Helper method for copying image data.
TileSprite.prototype.copyImage = function (image) {
	var copy = document.createElement('canvas'),
		ctx  = copy.getContext('2d');
	copy.width = image.width;
	copy.height = image.height;

	ctx.drawImage(this.image, 0, 0);
	return copy;
};

TileSprite.prototype.darkenImage = function (image) {
	var copy = this.copyImage(image),
		ctx  = copy.getContext('2d');
	ctx.save();
	ctx.globalAlpha = 0.5;
	ctx.fillStyle = '#000';
	ctx.beginPath();
	ctx.rect(0, 0, copy.width, copy.height);
	ctx.fill();
	ctx.globalAlpha = 1;
	ctx.restore();
	return copy;
};

TileSprite.prototype.setVisibility = function (amount) {
	if(amount === 1) {
		this.setImage(this.originalImage);
	} else {
		this.setImage(this.invisibleImage);
	}
};

return TileSprite;

});