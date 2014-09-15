define(
['rot'], 
function (ROT) {

function Log () {
	// Attempt to set default output element.
	this._el = document.getElementById('log');
}

Log.prototype.setElement = function (element) {
	this._el = element;
};

Log.prototype.msg = function (msg) {
	if(msg.forEach) {
		msg.forEach(this.msg(msg, subject));
	} else {
		this._el.innerHTML  = this._el.innerHTML + msg + '<br />';
		this._el.scrollTop = this._el.scrollHeight;
	}
};

return new Log();

});