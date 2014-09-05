define(['jaws'], function (jaws) {

var FogViewport = function (options) {
	jaws.Viewport.call(this, options);
};

FogViewport.prototype = new jaws.Viewport({});

FogViewport.prototype.drawTileMap2 = function(tileMap, player) {
	var sprites = tileMap.atRect({ x: this.x, y: this.y, right: this.x + this.width, bottom: this.y + this.height });
    this.apply( function() {
    	for(var i=0; i < sprites.length; i++) {
    		if(player.canSee(sprites[i].xTile, sprites[i].yTile)) {
    			sprites[i].alpha = 1;
    			sprites[i].draw();
    		}

    		else if(player.canRemember(sprites[i].xTile, sprites[i].yTile)) {
    			sprites[i].alpha = 0.5;
                sprites[i].draw();
            }
            // sprites[i].draw();
        }
    });
};

return FogViewport;

});