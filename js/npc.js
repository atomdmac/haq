define(['actor'], function (Actor) {

var NPC = function (options) {
	Actor.call(this, options);
};

NPC.prototype = new Actor({});

NPC.prototype.act = function () {
	Actor.prototype.act.call(this);

	this.updateSurroundings();
	this.updateMemory();
	
	if(this.canSee(this._data.player)) {
		this.seek(this._data.player);
	}

	if(this._seekPath.length) {
		this.color = '#ff0000';
	} else {
		this.color = '#0000ff';
		this.wander();
	}
	// TODO: Allow JawsJS library to handle re-coloring without having to reset a Sprite's canvas/context. 
	var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
	canvas.width = this.width;
  	canvas.height = this.height;
    context.fillStyle = this.color;
    context.fillRect(0, 0, this.width, this.height);
    this.image = canvas;

	// TODO: Make NPCs do other stuff besides wander around.
};

return NPC;

});