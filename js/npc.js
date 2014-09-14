define(['character', 'log'], function (Character) {

var NPC = function (options) {
	Character.call(this, options);
};

NPC.prototype = new Character({});

NPC.prototype.act = function () {
	if(!this._isAlive) return;

	Character.prototype.act.call(this);

	this.updateSurroundings();
	this.updateMemory();
	
	if(this.canSee(this._data.player)) {
		this.updateTravelPath(this._data.player);
	}

	if(this.travel()) {
		this.color = 'orange';
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

NPC.prototype.move = function (direction) {
	// If move command was successful, play all queued animations.
	if(Character.prototype.move.call(this, direction)) {
		this._isActing = false;
	}
};

return NPC;

});