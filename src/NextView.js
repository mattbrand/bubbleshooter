import ui.View;
import ui.ImageView;
import ui.TextView;

var PANEL_Y = 520;
var PANEL_HEIGHT = 50;
var BUBBLE_SIZE = 40;
var CURRENT_X = 85;
var CURRENT_Y = 525;
var NEXT_X = 245;
var NEXT_Y = 525;
var bubbleImgStr = "resources/images/bubble.png";
var bubblePurpleImgStr = "resources/images/bubble_purple.png";
var bubbleYellowImgStr = "resources/images/bubble_yellow.png";
var bubbleRedImgStr = "resources/images/bubble_red.png";

exports = Class(ui.View, function (supr) {
	this.init = function (opts) {
		opts = merge(opts, {
			width:	320,
			height: PANEL_HEIGHT
		});

    supr(this, 'init', [opts]);

    this.build();
  };

  this.build = function() {
    this._currentPanel = new ui.TextView({
			superview: this,
			x: 0,
			y: PANEL_Y,
			width: 160,
			height: PANEL_HEIGHT,
			autoSize: false,
			size: 34,
			verticalAlign: 'middle',
			horizontalAlign: 'left',
			wrap: false,
			color: '#FFFFFF',
			backgroundColor: '#222222'
		});

    this._currentPanel.setText("Curr:");

    this._nextPanel = new ui.TextView({
			superview: this,
			x: 160,
			y: PANEL_Y,
			width: 160,
			height: PANEL_HEIGHT,
			autoSize: false,
			size: 34,
			verticalAlign: 'middle',
			horizontalAlign: 'left',
			wrap: false,
			color: '#FFFFFF',
			backgroundColor: '#222222'
		});

    this._nextPanel.setText("Next:");
  };

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

  this.displayGameOver = function() {
    this._currentPanel.setText("Game ");
    this._nextPanel.setText("Over!");
    this._currentBubbleImg.removeFromSuperview();
    this._nextBubbleImg.removeFromSuperview();
  };
});
