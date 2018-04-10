import ui.View;
import ui.ImageView;
import ui.resource.Image as Image;

var PARTICLE_SIZE = 40;

var explosionImg = new Image({url: "resources/images/explosion.png"});

exports = Class(ui.View, function (supr) {
	this.init = function(opts) {
		opts = merge(opts, {
			width:	320,
			height: 570
		});

		supr(this, 'init', [opts]);

    this._particles = [];
	};

  this.updateParticles = function() {
    for (var i=this._particles.length - 1; i>=0; i--) {
      if (this._particles[i] != null) {
        this._particles[i].style.scale -= 0.1;
        if (this._particles[i].style.scale <= 0) {
          this._particles[i].removeFromSuperview();
          this._particles.splice(i, 1);
        }
      }
    }
  };

  this.addExplosion = function(x, y) {
    var explosion = new ui.ImageView({
			superview: this,
			x: x + (PARTICLE_SIZE / 2),
			y: y + (PARTICLE_SIZE / 2),
      image: explosionImg,
			width: PARTICLE_SIZE,
			height: PARTICLE_SIZE,
      anchorX: 0.5,
      anchorY: 0.5
		});
    explosion.time = 1;

    this._particles.push(explosion);
  };
})
