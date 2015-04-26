define(['character', 'log'], function (Character) {

var NPC = function (options) {

	// Define character parameters for NPCs
	options.strength     = 10;
	options.dexterity    = 10;
	options.constitution = 10;
	options.intelligence = 10;
	options.wisdom       = 10;
	options.charisma     = 10;
	options.hitDie       = 5;

	Character.call(this, options);
};

NPC.prototype = Object.create(Character.prototype);

NPC.prototype.act = function () {
	if(!this._isAlive) return;

	Character.prototype.act.call(this);

	this.updateSurroundings();
	this.updateMemory();
	
	if(this.canSee(this._data.player) && this._data.player.isAlive()) {
		this.updateTravelPath(this._data.player);
	}

	// Move toward the player.
	if(this.travel()) {
		this.color = 'orange';
	}

	// We're right next to the player.  Attack 'em!
	else if(this._data.map.isAdjacent(this, this._data.player)) {
		this.moveTo(this._data.player);
	}

	// Nothing interesting is going on.  Wander around.
	else {
		this.color = '#0000ff';
		this.wander();
	}

	// TODO: Make NPCs do other stuff besides wander around.
};

NPC.prototype.move = function (direction) {
	// If move command was successful, play all queued animations.
	if(Character.prototype.move.call(this, direction)) {
		this._isActing = false;
	}
};

NPC.prototype.kill = function () {
	this.color = '#0000ff';
	Character.prototype.kill.call(this);
};

return NPC;

});