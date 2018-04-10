import ui.View;
import src.Bubble as Bubble;

var BUBBLE_SIZE = 40;

exports = Class(ui.View, function (supr) {
	this.init = function (opts) {
		opts = merge(opts, {
			width:	BUBBLE_SIZE,
			height: BUBBLE_SIZE
		});

		supr(this, 'init', [opts]);
	};

	this.setType = function(type) {
		this._type = type;
	};

	this.setBubble = function(bubble) {
		this._bubble = bubble;
	};

	this.deleteBubble = function() {
		if (this._bubble != null) {
			this._bubble.removeFromSuperview();
			this._bubble = null;
		}
	};

	this.shiftDown = function() {
		this.style.y += (BUBBLE_SIZE * 0.85);
		if (this._bubble != null)
			this._bubble.shiftDown();
	};

	this.setTypeAndPosition = function(i, j, type, useYOffset) {
		this._i = i;
		this._j = j;
		this._type = type;
		this._checked = false;
		this._removed = false;

		var xPos = i * BUBBLE_SIZE;
		if (useYOffset) {
			xPos += BUBBLE_SIZE / 2;
		}
		var yPos = j * (BUBBLE_SIZE * 0.85);
		this.style.x = xPos;
		this.style.y = yPos;
	};
});
