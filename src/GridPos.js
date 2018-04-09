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
		this.type = type;
	};

	this.setBubble = function(bubble) {
		this.bubble = bubble;
	};

	this.deleteBubble = function() {
		if (this.bubble != null) {
			this.bubble.removeFromSuperview();
			this.bubble = null;
		}
	};

	this.shiftDown = function() {
		this.style.y += (BUBBLE_SIZE * 0.85);
		if (this.bubble != null)
			this.bubble.shiftDown();
	};

	this.setTypeAndPosition = function(i, j, type, useYOffset) {
		this.i = i;
		this.j = j;
		this.type = type;
		this.checked = false;
		this.removed = false;

		var xPos = i * BUBBLE_SIZE;
		if (useYOffset) {
			xPos += BUBBLE_SIZE / 2;
		}
		var yPos = j * (BUBBLE_SIZE * 0.85);
		this.style.x = xPos;
		this.style.y = yPos;
	};
});
