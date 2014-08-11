define(['actor'], function (Actor) {

var NPC = function (options) {
	Actor.call(this, options);
};

NPC.prototype = new Actor({});

NPC.prototype.act = function () {
	Actor.prototype.act.call(this);

	// TODO: Make NPCs do other stuff besides wander around.
	this.wander();
};

return NPC;

});