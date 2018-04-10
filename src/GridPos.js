/*
  name: GridPos.js
  description: stores one grid location and a reference to the bubble that gets instantiated on it
*/

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

	// set the type of the grid position - used when the initial grid is created, or when a player shot hits and empty spot
	this.setType = function(type) {
		this._type = type;
	};

	// sets a reference to the bubble associated with the grid location
	this.setBubble = function(bubble) {
		this._bubble = bubble;
	};

	// deletes the bubble associated with the grid location
	this.deleteBubble = function() {
		if (this._bubble != null) {
			this._bubble.removeFromSuperview();
			this._bubble = null;
		}
	};

	// shifts the grid location down one - used when the grid shifts
	this.shiftDown = function() {
		this.style.y += (BUBBLE_SIZE * 0.85);
		if (this._bubble != null)
			this._bubble.shiftDown();
	};

	// sets the data for the grid position from the input parameters
	this.setTypeAndPosition = function(i, j, type, useYOffset) {
		this._i = i;
		this._j = j;
		this._type = type;
		this._checked = false;

		var xPos = i * BUBBLE_SIZE;
		if (useYOffset) {
			xPos += BUBBLE_SIZE / 2;
		}
		var yPos = j * (BUBBLE_SIZE * 0.85);
		this.style.x = xPos;
		this.style.y = yPos;
	};
});
