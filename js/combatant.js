define(
['jaws', 'data/settings', 'tile-sprite'],
function (jaws, settings, TileSprite) {

function Combatant (options) {
	TileSprite.call(this, options);

	this._health    = options.health    || 100;
	this._maxHealth = options.maxHealth || 100;
}

Combatant.prototype = new TileSprite({});

/**
 * Cause the Combatant to attempt to apply damage to another Combatant as
 * described by the 'details' argument.
 * @param  {Combatant} target
 * @param  {Object}    details An Object describing the attack type, weapon used, etc.
 * @return {Boolean}        TRUE if the attack hits, FALSE if it misses.
 */
Combatant.prototype.attack = function (target, details) {
	// TODO
};

// Details = {target: Combatant, damage: Number, type: String}
Combatant.prototype.damage = function (details) {
	// TODO
};

// Details = {source: Object, deltaHealth: Number}
Combatant.prototype.heal = function (details) {
	// TODO
};

Combatant.prototype.getHealth = function () {
	return this._health;
};

Combatant.prototype.getMaxHealth = function () {
	return this._maxHealth;
};

/**
 * Destory the Combatant.  This will typically be called when the Combatant's HP
 * drops to or below 0;
 * @return {Void}
 */
Combatant.prototype.destroy = function () {
	// TODO
};

});