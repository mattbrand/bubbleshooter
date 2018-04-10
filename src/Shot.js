import ui.View;
import ui.ImageView;
import ui.resource.Image as Image;

var SHOT_SIZE = 40;
var START_X = 140;
var START_Y = 460;
var SHOT_SPEED = 7.5;

var bubbleImg = new Image({url: "resources/images/blue_gem.png"});
var bubblePurpleImg = new Image({url: "resources/images/purple_gem.png"});
var bubbleYellowImg = new Image({url: "resources/images/yellow_gem.png"});
var bubbleRedImg = new Image({url: "resources/images/red_gem.png"});
var bubbleLightImg = new Image({url: "resources/images/green_gem.png"});

exports = Class(ui.View, function (supr) {
	this.init = function (opts) {
		opts = merge(opts, {
			width:	SHOT_SIZE,
			height: SHOT_SIZE
		});

		supr(this, 'init', [opts]);
	};

  this._shotImg = null;

	this.launch = function(x, y, type, shot) {
    this._type = type;
    var image = null;
    switch (type) {
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
			case -1:
			case -2:
				image = bubbleImg;
				opacity = 0;
				break;
		}
		this._shotImg = new ui.ImageView({
			superview: shot,
			image: image,
			x: START_X - (x * SHOT_SIZE),
			y: START_Y - (y * SHOT_SIZE),
			width: SHOT_SIZE,
			height: SHOT_SIZE
		});
	}.bind(this);

  this.move = function(x, y) {
    this._shotImg.style.x -= x * SHOT_SPEED;
    this._shotImg.style.y -= y * SHOT_SPEED;
  };

  this.delete = function() {
    this._shotImg.style.scale = 0;
  };
});
