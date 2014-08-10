define(
['jaws', 'radio', 'data/settings', 'animator'], 
function (jaws, radio, settings, Animator) {

return function () {

	var _data, viewport, gamepad, _previousState;

	var _checkInput = function () {
		if (!gamepad && jaws.gamepads[0]) {
			gamepad = jaws.gamepads[0]; // Only use first gamepad for now...
		}

		if(gamepad) {
			// Move left
			if(gamepad.axes[5] == -1) {
				// lock();
				_data.player.move('W');
			}

			if(gamepad.axes[5] === 1) {
				// lock();
				_data.player.move('E');
			}
			// Move up.
			if(gamepad.axes[6] === -1) {
				// lock();
				_data.player.move('N');
			}
			// Move down
			if(gamepad.axes[6] === 1) {
				// lock();
				_data.player.move('S');
			}
		}

		// Keyboard
		// Move left
		if(jaws.pressed('left')) {
			_data.player.move('W');
		}

		else if(jaws.pressed('right')) {
			_data.player.move('E');
		}
		// Move up.
		else if(jaws.pressed('up')) {
			_data.player.move('N');
		}
		// Move down
		else if(jaws.pressed('down')) {
			_data.player.move('S');
		}

	};

	this.setup = function (data) {
		_data = data;
		_previousState = jaws.previous_game_state;
	};

	
	_locked = false;
	var lock = function () {
		_locked = true;
		setTimeout(function () {
			_locked = false;
		}, 100);
	};

	this.update = function () {
		if(!Animator.isPlaying()) {
			_checkInput();
		} else {
			Animator.tick();
			_previousState.update();
		}
	};

	this.draw = function () {
		if(Animator.isPlaying) _previousState.draw();
	};

};

});