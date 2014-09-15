define(
['jaws', 'data/settings', 'actor', 'log', 'lib/signals'],
function (jaws, settings, Actor, Log, Signals) {

function _roll (sides) {
	return Math.round(Math.random() * (sides || 20));
}

function Character (options) {

	Actor.call(this, options);

	// Add stats component.
	var stats = this.stats = {};

	// Populate stats from options / defaults.
	stats._currentHealth    = options.health    || 100;
	stats._maxHealth = options.maxHealth || 100;
	stats._agility   = options.agility   || 10;
	stats._smarts    = options.smarts    || 10;
	stats._spirit    = options.spirit    || 10;
	stats._strength  = options.strength  || 10;
	stats._vigor     = options.vigor     || 10;

	var abilities = this._abilities = {};
	
	abilities.strength     = options.strength     || 15;
	abilities.dexterity    = options.dexterity    || 14;
	abilities.constitution = options.constitution || 13;
	abilities.intelligence = options.intelligence || 12;
	abilities.wisdom       = options.wisdom       || 10;
	abilities.charisma     = options.charisma     || 8;

	this._hitDie = options.hitDie || 10;

	// Init and calculate modifiers.
	this._modifiers = {};
	this.calculateModifiers();

	// Init and calculate health/hit points.
	this._currentHealth = this.getMaxHealth() + this._modifiers.constitution;
	this._isAlive = true;

	// Signal objects for alerting parent objects of events.
	this.signals = {
		attacked: new Signals.Signal(),
		hit     : new Signals.Signal(),
		missed  : new Signals.Signal(),
		damaged : new Signals.Signal(),
		died    : new Signals.Signal(),
		moved   : new Signals.Signal(),
		saw     : new Signals.Signal()
	};

	// TODO: Add inventory component.
	// TODO: Add stats component.
}

Character.prototype = new Actor({});

Character.prototype.draw = function () {
	Actor.prototype.draw.call(this);

	var context = this.context,
		centerX = this.width / 2,
		centerY = this.height / 2,
		radius  = 3;
	
	context.save();
	context.translate(this.x, this.y);

	// Display current hitpoints on Character.
	if(this._isAlive) {
		context.font = '10pt Arial';
		context.fillStyle = "white";
		context.textAlign = "center";
		context.textBaseline = 'middle';
	  	context.fillText(this._currentHealth, centerX, centerY);
	}

  	// Mark with a circle if dead.
	else {
	    context.beginPath();
		context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
		context.fillStyle = 'red';
		context.fill();
	}
	
	context.restore();

};

Character.prototype.moveTo = function (xTile, yTile) {
	if(typeof xTile === 'object') yTile = xTile.yTile, xTile = xTile.xTile;

	var destinationTile = {xTile: xTile, yTile: yTile};

	var target = this.checkCollisions(destinationTile);

	if(target.length) {
		this.doAttack(target[0], {
			weapon: 'sword',
			type  : 'slashing',
			damage: 10
		});
		return false;
	} else {
		return Actor.prototype.moveTo.call(this, destinationTile);
	}
};

/**
 * Cause the Character to attempt to apply damage to another Character as
 * described by the 'details' argument.
 * @param  {Character} target
 * @param  {Object}    details An Object describing the attack type, weapon used, etc.
 * @return {Boolean}        TRUE if the attack hits, FALSE if it misses.
 */
Character.prototype.doAttack = function (target, details) {
	var hitCheck = _roll() + this._modifiers.dexterity,
		damage   = _roll(this._hitDie) + this._modifiers.strength;

	// Alert listenrs that attack occured.
	this.signals.attacked.dispatch(this, target, details);
	
	if(target.isHit(hitCheck)) {
		
		// Alert listeners that hit was successful.
		this.signals.hit.dispatch(this, target, details);

		// Apply damage to target entity.
		target.takeDamage({
			source: this,
			damage: damage,
			type  : 'slashing'
		});
		
		this._isActing = false;

		return true;
	} 

	else {

		// Alert listeners that hit was unnsuccessful.
		this.signals.missed.dispatch(this, target, details);

		this._isActing = false;

		return false;
	}
};

// Details = {target: Character, damage: Number, type: String}
Character.prototype.takeDamage = function (details) {
	this._currentHealth -= details.damage;

	// Alert listeners that we were damaged.
	this.signals.damaged.dispatch(this, details);

	if(this._currentHealth < 0) {
		this.kill();
	}
};

// Details = {source: Object, deltaHealth: Number}
// TODO: Should heal() be rest()?
Character.prototype.heal = function (details) {
	// TODO
};

Character.prototype.getHealth = function () {
	return this._currentHealth;
};

Character.prototype.getMaxHealth = function () {
	return this._hitDie + this._modifiers.constitution;
};

Character.prototype.isHit = function (hitCheck) {
	var savingThrow = _roll() + this._modifiers.dexterity;
	if(hitCheck < savingThrow) {
		return true;
	} else {
		return false;
	}
};

Character.prototype.calculateModifiers = function () {
	for(var a in this._abilities) {
		this._modifiers[a] = Math.floor((this._abilities[a] - 10) / 2);
	}
};

Character.prototype.isAlive = function () {
	return this._isAlive;
};

/**
 * Destory the Character.  This will typically be called when the Character's HP
 * drops to or below 0;
 * @return {Void};
 */
Character.prototype.kill = function () {
	// Alert listeners that we have died.
	this.signals.died.dispatch(this);

	this._isAlive = false;
	this.isPassable = true;
};

// Return interface.
return Character;

});