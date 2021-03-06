/*
  name: Application.js
  description: the main driver of the game
*/

//sdk imports
import device;
import ui.StackView as StackView;
//user imports
import src.TitleScreen as TitleScreen;
import src.GameScreen as GameScreen;
import src.SoundController as SoundController;

/* Your application inherits from GC.Application, which is
 * exported and instantiated when the game is run
 */
exports = Class(GC.Application, function() {

	/* Run after the engine is created and the scene graph is in
	 * place, but before the resources have been loaded.
	 */
	this.initUI = function () {
		var titleScreen = new TitleScreen(),
				gameScreen = new GameScreen();

		this.view.style.backgroundColor = '#111111';

		// Create a stackview of size 750, then scale it to fit horizontally
		// Add a new StackView to the root of the scene graph
		var rootView = new StackView({
			superview: this,
			// x: device.width / 2 - 160,
			// y: device.height / 2 - 240,
			x: 0,
			y: 0,
			width: 320,
			height: 570,
			clip: true,
			scale: device.width / 320
		});

		rootView.push(titleScreen);

		var sound = SoundController.getSound();

		/* Listen for an event dispatched by the title screen when
		 * the start button has been pressed. Hide the title screen,
		 * show the game screen, then dispatch a custom event to the
		 * game screen to start the game.
		 */
		titleScreen.on("titlescreen:start", function() {
			sound.play('levelmusic');
			rootView.push(gameScreen);
			gameScreen.emit("app:start");
		});

		/* When the game screen has signalled that the game is over,
		 * show the title screen so that the user may play the game again.
		 */
		gameScreen.on("gamescreen:end", function() {
			sound.stop("levelmusic");
			rootView.pop();
		});
	};

	/* Executed after the asset resources have been loaded.
	 * If there is a splash screen, it's removed.
	 */
	this.launchUI = function() {};
});
