/*
  name: Bubble.js
  description: displays a bubble
*/

import ui.View;
import ui.ImageView;
import ui.resource.Image as Image;

var BUBBLE_SIZE = 40;

var bubbleImg = new Image({url: "resources/images/blue_gem.png"});
var bubblePurpleImg = new Image({url: "resources/images/purple_gem.png"});
var bubbleYellowImg = new Image({url: "resources/images/yellow_gem.png"});
var bubbleRedImg = new Image({url: "resources/images/red_gem.png"});
var bubbleLightImg = new Image({url: "resources/images/green_gem.png"});

exports = Class(ui.View, function (supr) {
	this.init = function (opts) {
		opts = merge(opts, {
			width:	BUBBLE_SIZE,
			height: BUBBLE_SIZE
		});

		supr(this, 'init', [opts]);
	};

	// create the image view of the bubble, based on the type of the grid position the bubble is to be instantiated in
  this.createBubbleImage = function(gridPos) {
		this._i = gridPos._i;
		this._j = gridPos._j;
		this._type = gridPos._type;

		var image = null;
		var opacity = 1;
		switch (gridPos._type) {
			case 0:
				image = bubbleImg;
				break;
			case 1:
				image = bubblePurpleImg;
				break;
			case 2:
				image = bubbleYellowImg;
				break;
			case 3:
				image = bubbleRedImg;
				break;
			case 4:
				image = bubbleLightImg;
				break;
		}
		this._bubbleImg = new ui.ImageView({
			superview: this,
			x: gridPos.style.x,
			y: gridPos.style.y,
      image: image,
			width: BUBBLE_SIZE,
			height: BUBBLE_SIZE
		});
    // console.log("adding bubble type " + this.type + " at " + x + ". " + y);
    this.addSubview(this._bubbleImg);
	};

	// shift the bubble down - used when shifting the grid
  this.shiftDown = function() {
    this._bubbleImg.style.y += BUBBLE_SIZE * 0.85
  };

	// move the bubble - used when bubbles fall when they are not attached to the top of the screen
	this.moveY = function(yDiff) {
		this._bubbleImg.style.y += yDiff;
	};
});
