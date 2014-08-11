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
				_data.player.move('W');
			}
			// Move right
			else if(gamepad.axes[5] === 1) {
				_data.player.move('E');
			}
			// Move up.
			else if(gamepad.axes[6] === -1) {
				_data.player.move('N');
			}
			// Move down
			else if(gamepad.axes[6] === 1) {
				_data.player.move('S');
			}

			// Wait.
			else if(gamepad.buttons[4].pressed) {
				_data.player.wait();
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

		// Wait.
		else if(jaws.pressed('.')) {
			_data.player.wait();
		}

	};

	this.setup = function (data) {
		_data = data;
		_previousState = jaws.previous_game_state;
	};

	this.update = function () {
		if(!Animator.isPlaying()) {
			if(_data.player.isActing()) {
				_checkInput();
			} else {
				var safety = 0, safetyMax = 20;
				while(!_data.player.isActing()) {
					if(safety > safetyMax) break;
					var actor = _data.scheduler.next();
					actor.act();
				}
			}
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