define(['jaws', 'radio', 'data/settings'], function (jaws, radio, settings) {

return function () {

	var _data, viewport, gamepad, _previousState;

	var _checkInput = function () {
		if (!gamepad && jaws.gamepads[0]) {
			gamepad = jaws.gamepads[0]; // Only use first gamepad for now...
		}

		if(gamepad) {
			// Move left
			if(gamepad.axes[5] == -1) {
				console.log('left');
				lock();
				_data.player.move('W');
			}

			if(gamepad.axes[5] === 1) {
				console.log('right');
				lock();
				_data.player.move('E');
			}
			// Move up.
			if(gamepad.axes[6] === -1) {
				console.log('up');
				lock();
				_data.player.move('N');
			}
			// Move down
			if(gamepad.axes[6] === 1) {
				console.log('down');
				lock();
				_data.player.move('S');
			}
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
		if(!_locked) _checkInput();
		_previousState.update();
	};

	this.draw = function () {
		_previousState.draw();
	};

};

});