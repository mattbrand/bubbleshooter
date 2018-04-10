/*
  name: TitleScreen.js
  description: consists of a bg image, the player taps anywhere on it to start the game
*/

import ui.View;
import ui.ImageView;

exports = Class(ui.ImageView, function (supr) {
	this.init = function (opts) {
		opts = merge(opts, {
			x: 0,
			y: 0,
			image: "resources/images/title_screen.png"
		});

		supr(this, 'init', [opts]);

		this.build();
	};

	this.build = function() {

		// the start button takes up the entire screen in order for the player to tap anywhere
		var startbutton = new ui.View({
			superview: this,
			x: 0,
			y: 0,
			width: 320,
			height: 570
		});

		// event to listen for the start
		startbutton.on('InputSelect', bind(this, function () {
			this.emit('titlescreen:start');
		}));
	};
});
