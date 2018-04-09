import ui.View;
import ui.ImageView;
import ui.resource.Image as Image;
import src.soundcontroller as soundcontroller;

var shooterImg = new Image({url: "resources/images/spaceship.png"});
var shooterSize = 40;
var startX = 140;
var startY = 475;

exports = Class(ui.View, function (supr) {
	this.init = function (opts) {
		opts = merge(opts, {
			width:	shooterSize,
			height: shooterSize
		});

		supr(this, 'init', [opts]);

		this._angle = 0;
    this.build();
	};

  this.build = function() {
		this._shooterImg = new ui.ImageView({
			superview: this,
			image: shooterImg,
			x: startX,
			y: startY,
			width: shooterSize,
			height: shooterSize,
			anchorX: shooterSize / 2,
			anchorY: shooterSize / 2
		});
  };

	this.setAngle = function(pt) {
		var xDiff = (startX + (shooterSize / 2)) - pt.x;
		var yDiff = startY - pt.y;
		var angle = Math.atan2(yDiff, xDiff);

		var degAngle = radToDeg(angle);
		degAngle -= 90;
		if (degAngle < 0) {
    	degAngle += 360;
    }
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
