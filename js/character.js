define(
['jaws', 'data/settings', 'actor'],
function (jaws, settings, Actor) {

function Character (options) {

	// Add stats component.
	var stats = this.stats = {};

	// Populate stats from options / defaults.
	stats._health    = options.health    || 100;
	stats._maxHealth = options.maxHealth || 100;
	stats._agility   = options.agility   || 10;
	stats._smarts    = options.smarts    || 10;
	stats._spirit    = options.spirit    || 10;
	stats._strength  = options.strength  || 10;
	stats._vigor     = options.vigor     || 10;

	// TODO: Add inventory component.
	// TODO: Add stats component.
}

Character.prototype = new Actor({});

Character.prototype.moveTo = function (xTile, yTile) {
	if(typeof xTile === 'object') yTile = xTile.yTile, xTile = xTile.xTile;

	var target = this._data.map.getActorsAt(destinationTile);

	if(target.length) {
		this.attack(target[0], {
			weapon: 'sword',
			type  : 'slashing',
			damage: 10
		});
	} else {
		Actor.prototype.moveTo.call(this, destinationTile);
	}
};

/**
 * Cause the Character to attempt to apply damage to another Character as
 * described by the 'details' argument.
 * @param  {Character} target
 * @param  {Object}    details An Object describing the attack type, weapon used, etc.
 * @return {Boolean}        TRUE if the attack hits, FALSE if it misses.
 */
Character.prototype.attack = function (target, details) {
	// TODO
};

// Details = {target: Character, damage: Number, type: String}
Character.prototype.damage = function (details) {
	// TODO
};

// Details = {source: Object, deltaHealth: Number}
Character.prototype.heal = function (details) {
	// TODO
};

Character.prototype.getHealth = function () {
	return this._health;
};

Character.prototype.getMaxHealth = function () {
	return this._maxHealth;
};

/**
 * Destory the Character.  This will typically be called when the Character's HP
 * drops to or below 0;
 * @return {Void};
 */
Character.prototype.kill = function () {
	// TODO
};

// Return interface.
return Character;

});