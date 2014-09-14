define(
['jaws', 'data/settings', 'tile-sprite'],
function (jaws, settings) {

function Combatant (target, options) {

	var combat = target.combat = {};

	// Populate stats from options / defaults.
	combat._health    = options.health    || 100;
	combat._maxHealth = options.maxHealth || 100;
	combat._onKill    = options.onKill    || function () {};

	combat.attack       = _attack;
	combat.damage       = _damage;
	combat.heal         = _heal;
	combat.getHealth    = _getHealth;
	combat.getMaxHealth = _getMaxHealth;
	combat.kill         = _kill;
}

/**
 * Cause the Combatant to attempt to apply damage to another Combatant as
 * described by the 'details' argument.
 * @param  {Combatant} target
 * @param  {Object}    details An Object describing the attack type, weapon used, etc.
 * @return {Boolean}        TRUE if the attack hits, FALSE if it misses.
 */
function _attack (target, details) {
	// TODO
}

// Details = {target: Combatant, damage: Number, type: String}
function _damage (details) {
	// TODO
}

// Details = {source: Object, deltaHealth: Number}
function _heal (details) {
	// TODO
}

function _getHealth () {
	return this._health;
}

function _getMaxHealth () {
	return this._maxHealth;
}

/**
 * Destory the Combatant.  This will typically be called when the Combatant's HP
 * drops to or below 0;
 * @return {Void}
 */
function _kill () {
	// TODO
}

// Return interface.
return Combatant;

});