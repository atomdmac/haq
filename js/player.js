define(['actor', 'animator'], function (Actor, Animator) {

var Player = function (options) {
	Actor.call(this, options);
};

Player.prototype = new Actor({});

Player.prototype.act = function () {
	Actor.prototype.act.call(this);
	this.updateSurroundings();
	this.updateMemory();
};

Player.prototype.wait = function () {
	Actor.prototype.wait.call(this);
	Animator.play();
};

Player.prototype.move = function (direction) {
	// If move command was successful, play all queued animations.
	if(Actor.prototype.move.call(this, direction)) {
		Animator.play();
	}
};

return Player;

});