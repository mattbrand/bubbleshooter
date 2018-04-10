/*
  name: NextView.js
  description: displays the current and next player shot. also gets used to display a game over state
*/

import ui.View;
import ui.ImageView;
import ui.TextView;

var PANEL_Y = 520;
var PANEL_HEIGHT = 50;
var BUBBLE_SIZE = 40;
var CURRENT_X = 265;
var CURRENT_Y = 525;
var NEXT_X = 105;
var NEXT_Y = 525;
var bubbleImgStr = "resources/images/blue_gem.png";
var bubblePurpleImgStr = "resources/images/purple_gem.png";
var bubbleYellowImgStr = "resources/images/yellow_gem.png";
var bubbleRedImgStr = "resources/images/red_gem.png";
var bubbleLightImgStr = "resources/images/green_gem.png";

exports = Class(ui.View, function (supr) {
	this.init = function (opts) {
		opts = merge(opts, {
			width:	320,
			height: PANEL_HEIGHT
		});

    supr(this, 'init', [opts]);

    this.build();
  };

	// builds the 2 texts and images to use to display the player's next and current shot types
  this.build = function() {
    this._currentPanel = new ui.TextView({
			superview: this,
			x: 160,
			y: PANEL_Y,
			width: 160,
			height: PANEL_HEIGHT,
			autoSize: false,
			size: 32,
			verticalAlign: 'middle',
			horizontalAlign: 'left',
			wrap: false,
			color: '#FFFFFF',
			backgroundColor: '#000000'
		});

    this._currentPanel.setText("CURR");

    this._nextPanel = new ui.TextView({
			superview: this,
			x: 0,
			y: PANEL_Y,
			width: 160,
			height: PANEL_HEIGHT,
			autoSize: false,
			size: 32,
			verticalAlign: 'middle',
			horizontalAlign: 'left',
			wrap: false,
			color: '#FFFFFF',
			backgroundColor: '#000000'
		});

    this._nextPanel.setText("NEXT");
  };

	// sets the type for the current bubble, which is the one about to be shot
  this.setCurrentBubble = function(type) {
    if (this._currentBubbleImg != null) {
      this._currentBubbleImg.removeFromSuperview();
      this._currentBubbleImg = null;
    }
    var imageStr = "";
    switch (type) {
			case 0:
				imageStr = bubbleImgStr;
				break;
			case 1:
				imageStr = bubblePurpleImgStr;
				break;
			case 2:
				imageStr = bubbleYellowImgStr;
				break;
			case 3:
				imageStr = bubbleRedImgStr;
				break;
			case 4:
				imageStr = bubbleLightImgStr;
				break;
		}
    this._currentBubbleImg = new ui.ImageView({
			superview: this,
			x: CURRENT_X,
			y: CURRENT_Y,
      image: imageStr,
			width: BUBBLE_SIZE,
			height: BUBBLE_SIZE
		});
    this.addSubview(this._currentBubbleImg);
  };

	// sets the type for the next bubble, which is the one to be shot next
  this.setNextBubble = function(type) {
    if (this._nextBubbleImg != null) {
      this._nextBubbleImg.removeFromSuperview();
      this._nextBubbleImg = null;
    }
    var imageStr = "";
    switch (type) {
			case 0:
				imageStr = bubbleImgStr;
				break;
			case 1:
				imageStr = bubblePurpleImgStr;
				break;
			case 2:
				imageStr = bubbleYellowImgStr;
				break;
			case 3:
				imageStr = bubbleRedImgStr;
				break;
			case 4:
				imageStr = bubbleLightImgStr;
				break;
		}
    this._nextBubbleImg = new ui.ImageView({
			superview: this,
			x: NEXT_X,
			y: NEXT_Y,
      image: imageStr,
			width: BUBBLE_SIZE,
			height: BUBBLE_SIZE
		});
    this.addSubview(this._nextBubbleImg);
  };

	// changes the bottom display text to say Game Over
  this.displayGameOver = function() {
    this._nextPanel.setText("Game ");
    this._currentPanel.setText("Over!");
    this._currentBubbleImg.style.opacity = 0;
    this._nextBubbleImg.style.opacity = 0;
  };

	// resets the bottom display info
  this.reset = function() {
    this._currentPanel.setText("Curr:");
    this._nextPanel.setText("Next:");
    this._currentBubbleImg.style.opacity = 1;
    this._nextBubbleImg.style.opacity = 1;
  };
});
