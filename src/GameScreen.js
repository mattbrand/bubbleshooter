import ui.View;
import ui.ImageView;
import ui.TextView;
import src.GridView as GridView;
import src.Shooter as Shooter;
import src.Shot as Shot;
import src.NextView as NextView;
import src.SoundController as SoundController;

var MIN_CLUSTER_SIZE = 3;
var BLANK_BUBBLE = -1;
var NO_BUBBLE = -2;
var CLUSTER_FALL_Y = 80;
var CLUSTER_POINTS = 5;
var SHOT_COUNT_TO_NEW_ROW = 5;
var MAX_BUBBLE_TYPE = 4;
var BUBBLE_SIZE = 40;
var DEBUG = false;

var spaceImgStr = "resources/images/space.png";

var score = 0;
var currentType = -1;
var nextType = -1;
var gameState = 0; // 0 == aiming, 1 = shooting, 2 = finding matches, 3 = falling bubbles, 4 = shifting
var shotCount = 0;
var clusterFallY = 0;
var sound;

exports = Class(ui.View, function (supr) {
	this.init = function (opts) {
		opts = merge(opts, {
			x: 0,
			y: 0,
			width: 320,
			height: 570,
		});

		supr(this, 'init', [opts]);

		this.build();
	};

	// main view building function
	this.build = function() {
		// set up listener for start game event
		this.on("app:start", startGameFlow.bind(this));

		// set up reference to sound controller
		sound = SoundController.getSound();

		// add space bg
		this._bg = new ui.ImageView({
			superview: this,
			x: 0,
			y: 0,
      image: spaceImgStr,
			width: 320,
			height: 570
		});

		// add the view that holds the grid positions and the bubbles within it
		this._gridView = new GridView();
		this.addSubview(this._gridView);

		// add thew score view
		this._scoreBoard = new ui.TextView({
			superview: this,
			x: 0,
			y: 485,
			width: 320,
			height: BUBBLE_SIZE,
			autoSize: false,
			size: 34,
			verticalAlign: 'middle',
			horizontalAlign: 'center',
			wrap: false,
			color: '#FFFFFF',
			backgroundColor: '#000000'
		});

		// create the next view, which shows which bubbles come next
		this._nextView = new NextView();
		this.addSubview(this._nextView);
		currentType = getRandomInt(0, MAX_BUBBLE_TYPE);
		this._nextView.setCurrentBubble(currentType);
		nextType = getRandomInt(0, MAX_BUBBLE_TYPE);
		this._nextView.setNextBubble(nextType);

		this.style.width = 320;
		this.style.height = 570;

		// create shooter
		this._shooter = new Shooter();
		this.addSubview(this._shooter);
		this._shot = null;

		// set up aiming view
		this._aimView = new ui.View({
			superview: this,
			x: 0,
			y: 0,
			width: 320,
			height: 480
		});

		this._aiming = false;
		this._lastY = 0;

		// set up aiming touch events
		this._aimView.on('InputStart', bind(this, function(evt, pt) {
			if (gameState == 0) {
				this.setShooterAngle(pt);
				this._aiming = true;
				this._lastY = pt.y;
			}
		}));

		this._aimView.on('InputMove', bind(this, function(evt, pt) {
			if (gameState == 0) {
				if (this._aiming) {
					this.setShooterAngle(pt);
					this._lastY = pt.y;
				}
			}
		}));

		this._aimView.on('InputOut', bind(this, function(evt, pt) {
			if (gameState == 0) {
				if (this._aiming) {
					this._aiming = false;
					if (this._lastY < 470) {
						this.fireShot();
						shotCount++;
						gameState = 1;
					}
				}
			}
		}));

		this.setShooterAngle = function(pt) {
			this._shooter.setAngle(pt);
		};

		// fire a new shot
		this.fireShot = function() {
			sound.play("shoot");
			this._shot = new Shot();
			this._shotX = Math.cos(this._shooter._angle);
			this._shotY = Math.sin(this._shooter._angle);
			this._shot.launch(this._shotX, this._shotY, currentType, this._shot);
			currentType = nextType;
			nextType = getRandomInt(0, MAX_BUBBLE_TYPE);
			this._nextView.setCurrentBubble(currentType);
			this._nextView.setNextBubble(nextType);
			this.addSubview(this._shot);
		};

		this.addToScore = function(points) {
			score += points;
			this.setScoreText();
		};

		this.setScoreText = function() {
			this._scoreBoard.setText("SCORE: " + score);
		};
	};
});

function startGameFlow() {
	this.setScoreText();

	// update to handle gameplay
	GC.app.engine.on('Tick', bind(this, function() {
		// console.log("update running");
		switch (gameState) {
			case 1:
				// check for where the shot hit
				if (this._shot != null) {
					this._shot.move(this._shotX, this._shotY, this._shot);
					if (this._shot._shotImg.style.x > (320 - BUBBLE_SIZE) && this._shotX < 0) {
						this._shotX *= -1;
					}
					else if (this._shot._shotImg.style.x < 0 && this._shotX > 0) {
						this._shotX *= -1;
					}

					if (this._shot._shotImg.style.y < 0) {
						var nextGameState = this._gridView.snapShotToGrid(this._shot);
						this._shot.removeFromSuperview();
						this._shot = null;
						gameState = 2;
						break;
					}

					// check for overlaps
					for (var i=0; i<this._gridView._grid.length; i++) {
						for (var j=0; j<this._gridView._grid[i].length; j++) {
							var gridPos = this._gridView._grid[i][j];
							if (gridPos._type == BLANK_BUBBLE || gridPos._type == NO_BUBBLE)
								continue;

							if (circleIntersection(gridPos.style.x + BUBBLE_SIZE / 2, gridPos.style.y + BUBBLE_SIZE / 2, BUBBLE_SIZE / 2,
																		 this._shot._shotImg.style.x + BUBBLE_SIZE / 2, this._shot._shotImg.style.y + BUBBLE_SIZE / 2, BUBBLE_SIZE / 2)) {
								var nextGameState = this._gridView.snapShotToGrid(this._shot);
								this._shot.removeFromSuperview();
								this._shot = null;
								gameState = nextGameState;
 								break;
							}
						}
						if (this._shot == null)
							break;
					}
				}
				break;
			case 2:
				// check for a cluster to remove
				var cluster = this._gridView.findCluster(this._gridView._newGridPos, true, true);
				if (cluster.length >= MIN_CLUSTER_SIZE) {
					// play pops sound
					sound.play("pops");
					//add to score
					this.addToScore(cluster.length * CLUSTER_POINTS);
					if (DEBUG)
						console.log("found cluster size " + cluster.length);
					for (var i=0; i<cluster.length; i++) {
						if (DEBUG)
							console.log(cluster[i]._i + ", " + cluster[i]._j + " --- " + cluster[i]._type);
						cluster[i]._type = -1;
						cluster[i].deleteBubble();
						// cluster[i].bubble.removeFromSuperview();
						cluster[i]._bubble = null;
					}

					// find floating bubbles
					var floatingClusters = this._gridView.findFloatingClusters();
					if (floatingClusters.length > 0) {
						this._floatingBubbles = [];
						for (var i=0; i<floatingClusters.length; i++) {
							for (var j=0; j<floatingClusters[i].length; j++) {
								floatingClusters[i][j]._type = -1;
								if (floatingClusters[i][j]._bubble != null)
									this._floatingBubbles.push(floatingClusters[i][j]._bubble);
								floatingClusters[i][j]._bubble = null;
								// add to score
								this.addToScore(1);
							}
						}
						clusterFallY = 0;
						gameState = 3;
					}
					else
						gameState = 4;
				}
				else {
					gameState = 4;
				}
				break;
			case 3:
				// handle floating bubbles
				if (this._floatingBubbles.length > 0 && clusterFallY < CLUSTER_FALL_Y) {
					for (var i=0; i<this._floatingBubbles.length; i++) {
						this._floatingBubbles[i].moveY(BUBBLE_SIZE / 8);
					}
					clusterFallY += BUBBLE_SIZE / 8;

					if (clusterFallY >= CLUSTER_FALL_Y) {
						for (var i=0; i<this._floatingBubbles.length; i++) {
							sound.play("pop");
							this._floatingBubbles[i]._bubbleImg.removeFromSuperview();
						}
						this._floatingBubbles = [];
						gameState++;
					}
				}
				break;
			case 4:
				// check if a new row is to be added to the grid
				if (shotCount % SHOT_COUNT_TO_NEW_ROW == 0) {
					this._gridView.shiftGrid();
				}
				if (DEBUG)
					this._gridView.displayGridDebug();

				// end game state
				if (this._gridView.checkForBubblesInLastRow()) {
					gameState = 5;
					endGameFlow.call(this);
					return;
				}
				// or start new turn
				else {
					gameState = 0;
				}
				break;
		}
	}));
}

// begin ending the game, displays game over and emits end event
function endGameFlow() {
	this.setScoreText();
	this._nextView.displayGameOver();
	setTimeout(emitEndEvent.bind(this), 2000);
}

// tell the main app to switch back to the title screen
function emitEndEvent() {
	this.emit("gamescreen:end");
	resetGame.call(this);
}

// reset all game data and remove all views
function resetGame() {
	score = 0;
	gameState = 0;

	this._bg.removeFromSuperview();

	this._gridView.removeFromSuperview();

	if (this._shot != null) {
		this._shot.removeFromSuperview();
		this._shot = null;
	}

	this._aimView.removeFromSuperview();

	this._shooter.removeFromSuperview();
	this._shooter = null;
	this._nextView.removeFromSuperview();
	this._scoreBoard.removeFromSuperview();

	this.build();
}

// utilities
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function circleIntersection(x1, y1, r1, x2, y2, r2) {
    var dx = x1 - x2;
    var dy = y1 - y2;
    var len = Math.sqrt(dx * dx + dy * dy);

    if (len < r1 + r2)
        return true;
    return false;
}
