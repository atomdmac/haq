define(['character', 'animator', 'log'], function (Character, Animator) {

var Player = function (options) {
	options.isPlayer = true;
	Character.call(this, options);
};

Player.prototype = new Character({});

Player.prototype.act = function () {
	Character.prototype.act.call(this);
	this.updateSurroundings();
	this.updateMemory();
};

Player.prototype.wait = function () {
	Character.prototype.wait.call(this);
	this._isActing = false;
};

Player.prototype.move = function (direction) {
	// If move command was successful, play all queued animations.
	if(Character.prototype.move.call(this, direction)) {
		this._isActing = false;
	}
};

return Player;

});