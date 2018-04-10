import ui.View;
import ui.ImageView;
import ui.resource.Image as Image;
import src.SoundController as SoundController;

var SHOOTER_SIZE = 40;
var START_X = 140;
var START_Y = 435;
var MIN_ANGLE = 300;
var MAX_ANGLE = 60;

var shooterImg = new Image({url: "resources/images/spaceship.png"});

exports = Class(ui.View, function (supr) {
	this.init = function (opts) {
		opts = merge(opts, {
			width:	SHOOTER_SIZE,
			height: SHOOTER_SIZE
		});

		supr(this, 'init', [opts]);

		this._angle = 0;
    this.build();
	};

  this.build = function() {
		this._shooterImg = new ui.ImageView({
			superview: this,
			image: shooterImg,
			x: START_X,
			y: START_Y,
			width: SHOOTER_SIZE,
			height: SHOOTER_SIZE,
			anchorX: SHOOTER_SIZE / 2,
			anchorY: SHOOTER_SIZE / 2
		});
  };

	this.setAngle = function(pt) {
		var xDiff = (START_X + (SHOOTER_SIZE / 2)) - pt.x;
		var yDiff = START_Y - pt.y;
		var angle = Math.atan2(yDiff, xDiff);

		var degAngle = radToDeg(angle);
		degAngle -= 90;
		if (degAngle < 0) {
    	degAngle += 360;
    }
		if (degAngle > MAX_ANGLE && degAngle < 180)
			degAngle = MAX_ANGLE;
		if (degAngle < MIN_ANGLE && degAngle >= 180)
			degAngle = MIN_ANGLE;
		this._shooterImg.style.r = degToRad(degAngle);
		this._angle = angle;

		function radToDeg(angle) {
    	return angle * (180 / Math.PI);
		}

		function degToRad(angle) {
			return angle * Math.PI / 180;
		}
	};
});
