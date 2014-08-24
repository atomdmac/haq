define(['lib/frame-tween'], function (FrameTween) {

return new function () {

	var _queue = [],
		_duration = 5,
		_index,
		_isPlaying = false;

	this.isPlaying = function () {
		return _isPlaying;
	};

	this.add = function (target, from, to) {
		_queue.push(
			new FrameTween(target, from, to, _duration)
		);
	};

	this.delay = function (duration) {
		duration = duration || _duration;
		_queue.push(
			new FrameTween({none:0}, {none:0}, {none:duration}, _duration)
		);
	};

	this.play = function () {
		_index = 0;
		_isPlaying = true;
	};

	this.pause = function () {
		_isPlaying = false;
	};

	this.clear = function () {
		_isPlaying = false;
		_queue = [];
	};

	this.tick = function () {
		if(_isPlaying) {
			/*if(!_queue[_index].tick()) {
				_index++;
			}*/
			for(var i=_queue.length-1; i>-1; i--) {
				if(!_queue[i].tick()) {
					_queue.splice(i, 1);
				}
			}
		}

		if(!_queue.length) this.clear();
	};

};

});