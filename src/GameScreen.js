import animate;
import ui.View;
import ui.ImageView;
import ui.TextView;
import src.GridPos as GridPos;
import src.Bubble as Bubble;
import src.Shooter as Shooter;
import src.Shot as Shot;
import src.NextView as NextView;

var MIN_CLUSTER_SIZE = 3;
var BLANK_BUBBLE = -1;
var NO_BUBBLE = -2;
var GRID_ROWS = 13;
var GRID_COLUMNS = 8;
var START_ROWS = 5;
var BUBBLE_SIZE = 40;
var DEBUG = false;

var score = 0;
var high_score = 19;
var game_on = false;
var currentType = -1;
var nextType = -1;
var game_length = 20000;
var countdown_secs = game_length / 1000;
var lang = 'en';
var gameState = 0; // 0 == aiming, 1 = shooting, 2 = finding matches, 3 = falling bubbles, 4 = shifting
var shotCount = 0;

exports = Class(ui.View, function (supr) {
	this.init = function (opts) {
		opts = merge(opts, {
			x: 0,
			y: 0,
			width: 320,
			height: 480,
		});

		supr(this, 'init', [opts]);

		this.build();

		// console.log(this.findCluster(0, 0).length);

		// console.log(this.findMatchBubbles(0, 0));

		// console.log(this.findNeighbors(7, 0));
		// this.shiftGrid();
		// this.testBuild();
		// this.testBuild2();

		/*
		for (var i=0; i<this._grid.length; i++) {
			for (var j=0; j<this._grid[i].length; j++) {
				console.log(i + ", " + j + " === " + this._grid[i][j].i + ", " + this._grid[i][j].j)
			}
		}
		*/
	};

	this.addBubble = function(gridPos) {
	// this.addBubble = function(i, j, x, y, type) {
		var bubble = new Bubble();
		bubble.createBubbleImage(gridPos);
		gridPos.setBubble(bubble);
		this.addSubview(bubble);
		this._bubbles.push(bubble);
	};

	this.build = function() {

		this.on('app:start', startGameFlow.bind(this));

		this._scoreBoard = new ui.TextView({
			superview: this,
			x: 0,
			y: 0,
			width: 320,
			height: BUBBLE_SIZE,
			autoSize: false,
			size: 34,
			verticalAlign: 'middle',
			horizontalAlign: 'center',
			wrap: false,
			color: '#FFFFFF',
			backgroundColor: '#222222'
		});

		this._nextView = new NextView();
		this.addSubview(this._nextView);
		currentType = getRandomInt(0, 3);
		this._nextView.setCurrentBubble(currentType);
		nextType = getRandomInt(0, 3);
		this._nextView.setNextBubble(nextType);

		this._scoreBoard.setText("Score: 0");

		this.style.width = 320;
		this.style.height = 480;
		this._grid = new Array();

		for (var i=0; i<GRID_COLUMNS; i++) {
			var arrayRow = [];
			for (var j=0; j<GRID_ROWS; j++) {
				var gridPos = new GridPos();
				var type = getRandomInt(0, 3);
				var useYOffset = false;
				if (j % 2 == 1)
					useYOffset = true;
				if (j % 2 == 1 && (i == (GRID_COLUMNS - 1)))
					type = NO_BUBBLE;
				else if (j >= START_ROWS)
					type = BLANK_BUBBLE;
				gridPos.setTypeAndPosition(i, j, type, useYOffset);
				this.addSubview(gridPos);
				arrayRow.push(gridPos);
			}
			this._grid.push(arrayRow);
		}

		this._bubbles = new Array();
		for (var i=0; i<GRID_COLUMNS; i++) {
			for (var j=0; j<GRID_ROWS; j++) {
				if (this._grid[i][j].type >= 0) {
					this.addBubble(this._grid[i][j]);
					// this.addBubble(i, j, this._grid[i][j].style.x, this._grid[i][j].style.y, this._grid[i][j].type);
				}
			}
		}
		/*
		for (var i=0; i<GRID_COLUMNS; i++) {
			for (var j=0; j<startRows; j++) {
				console.log(i + ", " + j + " --- " + this._grid[i][j].style.x + ", " + this._grid[i][j].style.y + " /// " + )
			}
		}
		*/

		this._shooter = new Shooter();
		this.addSubview(this._shooter);
		this._shot = null;

		this._aimView = new ui.View({
			superview: this,
			x: 0,
			y: 0,
			width: 320,
			height: 480
		});

		this._aiming = false;
		this._lastY = 0;

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

		this.fireShot = function() {
			this._shot = new Shot();
			this._shotX = Math.cos(this._shooter._angle);
			this._shotY = Math.sin(this._shooter._angle);
			this._shot.launch(this._shotX, this._shotY, currentType, this._shot);
			currentType = nextType;
			nextType = getRandomInt(0, 3);
			this._nextView.setCurrentBubble(currentType);
			this._nextView.setNextBubble(nextType);
			this.addSubview(this._shot);
		};

		this.hasNeighbors = function(i, j) {
			var openNeighbors = this.findOpenNeighbors(i, j);
			// console.log(openNeighbors.length);
			if (openNeighbors.length > 0) {
				for (var i=0; i<openNeighbors.length; i++) {
					if (this._grid[openNeighbors[i][0]][openNeighbors[i][1]].type >= 0)
						return true;
				}
			}
			return false;
		};

		this.inOddRow = function(row) {
			if (row < START_ROWS) {
				if (this._grid[GRID_COLUMNS - 1][row].type == NO_BUBBLE)
					return true;
			}
			return false;
		};

		this.getGridPosition = function(x, y) {
	    var j = Math.floor(y / (BUBBLE_SIZE * 0.85));

	    // Check for offset
	    var xOffset = 0;
			var odd = this.inOddRow(j)
			if (odd)
				xOffset += BUBBLE_SIZE / 2;
	    var i = Math.floor((x + xOffset) / BUBBLE_SIZE);

			if (odd && (i == (GRID_COLUMNS - 1)))
				i -= 1;
	    return { col: i, row: j };
		}

		this.getGridCoordinate = function(col, row) {
	    var x = col * tilewidth;
			if (this.isOddRow(row))
				x += BUBBLE_SIZE / 2;
	    var y = (row * (BUBBLE_SIZE * 0.85));
	    return [x,y];
		}

		this.findNeighbors = function(gridPos) {
			var col = gridPos.i;
			var row = gridPos.j;
			var neighbors = [];
			// odd row
			if (this.inOddRow(row)) {
				if (row > 0 && this._grid[col][row-1].type != NO_BUBBLE)
					neighbors.push(this._grid[col][row-1]);
				if (row > 0 && (col < (GRID_COLUMNS - 1)) && this._grid[col+1][row-1].type != NO_BUBBLE)
					neighbors.push(this._grid[col+1][row-1]);
				if (col > 0 && this._grid[col-1][row].type != NO_BUBBLE)
					neighbors.push(this._grid[col-1][row]);
				if ((col < (GRID_COLUMNS - 1)) && this._grid[col+1][row].type != NO_BUBBLE)
					neighbors.push(this._grid[col+1][row]);
				if ((row < (this._grid.length - 1)) && this._grid[col][row+1].type != NO_BUBBLE)
					neighbors.push(this._grid[col][row+1]);
				if ((col < (GRID_COLUMNS - 1)) && (row < (this._grid.length - 1)) && this._grid[col+1][row+1].type != NO_BUBBLE)
					neighbors.push(this._grid[col+1][row+1]);
			}
			// even row
			else {
				if (col > 0 && row > 0 && this._grid[col-1][row-1].type != NO_BUBBLE)
					neighbors.push(this._grid[col-1][row-1]);
				if (row > 0 && this._grid[col][row-1].type != NO_BUBBLE)
					neighbors.push(this._grid[col][row-1]);
				if (col > 0 && this._grid[col-1][row].type != NO_BUBBLE)
					neighbors.push(this._grid[col-1][row]);
				if ((col < (GRID_COLUMNS - 1)) && this._grid[col+1][row].type != NO_BUBBLE)
					neighbors.push(this._grid[col+1][row]);
				if (col > 0 && (row < (this._grid.length - 1)) && this._grid[col-1][row+1].type != NO_BUBBLE)
					neighbors.push(this._grid[col-1][row+1]);
				if ((row < (this._grid.length - 1)) && this._grid[col][row+1].type != NO_BUBBLE)
					neighbors.push(this._grid[col][row+1]);
			}
			if (DEBUG) {
				console.log("returning neighbors:");
				for (var i=0; i<neighbors.length; i++)
					console.log(neighbors[i].i + ", " + neighbors[i].j + " --- " + neighbors[i].type);
			}
			return neighbors;
		};

		this.findOpenNeighbors = function(gridPositions) {
			var openNeighbors = [];
			for (var i=0; i<gridPositions.length; i++) {
				if (gridPositions[i].type == BLANK_BUBBLE)
					openNeighbors.push(gridPositions[i]);
			}
			if (DEBUG) {
				console.log("found open neighbors:");
				for (var i=0; i<openNeighbors.length; i++)
					console.log(openNeighbors[i].i + ", " + openNeighbors[i].j + " --- " + openNeighbors[i].type);
			}
			return openNeighbors;
		};

		this.findNearestOpenNeighbor = function(gridPos) {
			var openNeighbors = this.findOpenNeighbors(this.findNeighbors(gridPos));
			if (openNeighbors.length > 0) {
				if (DEBUG)
					console.log("found nearest open neighbor at " + openNeighbors[0].i + ", " + openNeighbors[0].j + " --- " + openNeighbors[0].type);
				return openNeighbors[0];
			}
			return gridPos;
		};

		this.findCluster = function(gridPos, matchType, reset, skipRemoved) {
			if (reset) {
		    // reset the processed flags
		    this.resetChecked();
			}

	    // Initialize the toprocess array with the specified tile
	    var toProcess = [gridPos];
	    gridPos.checked = true;
	    var foundCluster = [];

	    while (toProcess.length > 0) {
        // Pop the last element from the array
        var currentGridPos = toProcess.pop();

        // Skip processed and empty tiles
        if (currentGridPos.type == -1 || currentGridPos.type == -2) {
            continue;
        }

				if (skipRemoved && currentGridPos.removed)
					continue;

        // Check if current tile has the right type, if matchtype is true
        if (!matchType || currentGridPos.type == gridPos.type) {
          // Add current tile to the cluster
          foundCluster.push(currentGridPos);

          // Get the neighbors of the current tile
          var neighbors = this.findNeighbors(currentGridPos);

          // Check the type of each neighbor
          for (var i=0; i<neighbors.length; i++) {
            if (!neighbors[i].checked) {
                // Add the neighbor to the toprocess array
                toProcess.push(neighbors[i]);
                neighbors[i].checked = true;
            }
          }
        }
	    }

    	// Return the found cluster
    	return foundCluster;
		};

		this.resetChecked = function() {
			for (var i=0; i<this._grid.length; i++) {
				for (var j=0; j<this._grid[i].length; j++) {
					this._grid[i][j].checked = false;
				}
			}
		};

		this.findFloatingClusters = function() {
    	this.resetChecked();

    	var foundclusters = [];

	    // check all tiles
	    for (var i=0; i<this._grid.length; i++) {
        for (var j=0; j<this._grid[0].length; j++) {
          var gridPos = this._grid[i][j];
          if (!gridPos.checked) {
            // Find all attached tiles
            var foundcluster = this.findCluster(gridPos, false, false, true);

            // There must be a tile in the cluster
            if (foundcluster.length <= 0) {
              continue;
            }

            // Check if the cluster is floating
            var floating = true;
            for (var k=0; k<foundcluster.length; k++) {
              if (foundcluster[k].style.y == 0) {
                // Tile is attached to the roof
                floating = false;
                break;
              }
            }

            if (floating) {
                // Found a floating cluster
                foundclusters.push(foundcluster);
            }
          }
        }
	    }

		  return foundclusters;
		};

		this.snapShotToGrid = function() {
			var gridColRow = this.getGridPosition(this._shot._shotImg.style.x + (BUBBLE_SIZE / 2), this._shot._shotImg.style.y + (BUBBLE_SIZE / 2));
			if (gridColRow.col < 0)
      	gridColRow.col  = 0;
      if (gridColRow.col >= GRID_COLUMNS)
      	gridColRow.col = GRID_COLUMNS - 1;
			if (gridColRow.row < 0)
				gridColRow.row = 0;
      if (gridColRow.row >= this._grid[0].length)
      	gridColRow.row = this._grid[0].length - 1;

			var foundPos = false;
			this._newGridPos = this._grid[gridColRow.col][gridColRow.row];
			if (this._newGridPos.type != BLANK_BUBBLE)
				this._newGridPos = this.findNearestOpenNeighbor(this._newGridPos);
			if (this._newGridPos != null) {
				if (DEBUG)
					console.log("shot hit at " + this._newGridPos.i + ", " + this._newGridPos.j);
				// this._newGridPos = this._grid[gridColRow.col][gridColRow.row];
				this._newGridPos.setType(this._shot.type);
				this.addBubble(this._newGridPos);
				gameState = 2;
			}
			else {
				if (DEBUG)
					console.log("did not find a place for shot to hit");
				gameState = 0;
			}
			this._shot.removeFromSuperview();
			this._shot = null;
		};

		this.shiftGrid = function() {
			for (var i=0; i<this._grid.length; i++) {
				for (var j=0; j<this._grid[i].length; j++) {
					this._grid[i][j].shiftDown();
				}
			}

			var newRow = new Array();
			var fullRow = false;
			if (this._grid[GRID_COLUMNS - 1][0].type == NO_BUBBLE)
				fullRow = true;
			for (var i=0; i<GRID_COLUMNS; i++) {
				var gridPos = new GridPos();
				var type = getRandomInt(0, 3);
				if (!fullRow && (i == GRID_COLUMNS - 1))
					type = NO_BUBBLE;
				gridPos.setTypeAndPosition(i, 0, type, !fullRow);
				newRow.push(gridPos);
				this.addBubble(gridPos);
				// this.addBubble(i, 0, gridPos.style.x, gridPos.style.y, gridPos.type);
			}

			var shiftedGrid = new Array();
			for (var i=0; i<this._grid.length; i++) {
				var shiftedCol = [];
				shiftedCol.push(newRow[i]);
				for (var j=0; j<this._grid[i].length; j++) {
					this._grid[i][j].j += 1;
					shiftedCol.push(this._grid[i][j]);
				}
				shiftedGrid.push(shiftedCol);
			}
			this._grid = shiftedGrid;

			// console.log(this.findNeighbors(0, 0));
		};

		this.checkForBubblesInLastRow = function() {
			for (var i=0; i<GRID_COLUMNS - 1; i++) {
				if (this._grid[i][GRID_ROWS - 1].type >= 0)
					return true;
			}
			return false;
		};

		this.displayGridDebug = function() {
			for (var j=0; j<this._grid[0].length; j++) {
				var rowStr = "";
				for (var i=0; i<this._grid.length; i++) {
					if (i > 0)
						rowStr += ",";
					rowStr += this._grid[i][j].type;
				}
				console.log(rowStr);
			}
		};
	};
});

function startGameFlow() {
	game_on = true;

	GC.app.engine.on('Tick', bind(this, function() {
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

					// check for overlaps
					for (var i=0; i<this._grid.length; i++) {
						for (var j=0; j<this._grid[i].length; j++) {
							var gridPos = this._grid[i][j];
							if (gridPos.type == BLANK_BUBBLE || gridPos.type == NO_BUBBLE)
								continue;

							if (circleIntersection(gridPos.style.x + BUBBLE_SIZE / 2, gridPos.style.y + BUBBLE_SIZE / 2, BUBBLE_SIZE / 2,
																		 this._shot._shotImg.style.x + BUBBLE_SIZE / 2, this._shot._shotImg.style.y + BUBBLE_SIZE / 2, BUBBLE_SIZE / 2)) {
								this.snapShotToGrid();
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
				var cluster = this.findCluster(this._newGridPos, true, true, false);
				if (cluster.length >= MIN_CLUSTER_SIZE) {
					if (DEBUG)
						console.log("found cluster:");
					for (var i=0; i<cluster.length; i++) {
						if (DEBUG)
							console.log(cluster[i].i + ", " + cluster[i].j + " --- " + cluster[i].type);
						cluster[i].type = -1;
						cluster[i].bubble.removeFromSuperview();
						cluster[i].bubble = null;
					}
					gameState = 3;
				}
				else {
					gameState = 4;
				}
				break;
			case 3:
				// check for floating bubbles
				var clusters = this.findFloatingClusters();
				if (clusters.length > 0) {
					console.log("found " + clusters.length + " cluster(s)");
				}
				gameState++;
				break;
			case 4:
				// check if a new row is to be added to the grid
				if (shotCount % 5 == 0) {
					this.shiftGrid();
					if (this.checkForBubblesInLastRow()) {
						gameState = 5;
						endGameFlow();
					}
				}
				if (DEBUG)
					this.displayGridDebug();
				gameState = 0;
				break;
		}
	}));
}

function update_countdown() {
	countdown_secs -= 1;
	this._countdown.setText(":" + (("00" + countdown_secs).slice(-2)));
}

/* Check for high-score and play the ending animation.
 * Add a click-handler to the screen to return to the title
 * screen so we may play again.
 */
function endGameFlow() {
	var isHighScore = (score > high_score),
			end_msg = get_end_message(score, isHighScore);

	// this._countdown.setText(''); //clear countdown text
	//resize scoreboard text to fit everything
	this._scoreBoard.updateOpts({
		text: '',
		x: 10,
		fontSize: 17,
		verticalAlign: 'top',
		textAlign: 'left',
		wrap: true
	});

	//check for high-score and do appropriate animation
	if (isHighScore) {
		high_score = score;
		/*
		this._molehills.forEach(function (molehill) {
			molehill.endAnimation();
		});
		*/
	} else {
		/*
		var i = (this._molehills.length-1) / 2 | 0; //just center mole
		this._molehills[i].endAnimation(true);
		*/
	}

	this._scoreBoard.setText(end_msg);

	//slight delay before allowing a tap reset
	setTimeout(emitEndEvent.bind(this), 2000);
}

/* Tell the main app to switch back to the title screen.
 */
function emitEndEvent() {
	this.once("InputSelect", function () {
		this.emit("gamescreen:end");
		reset_game.call(this);
	});
}

/* Reset game counters and assets.
 */
function reset_game () {
	score = 0;
	countdown_secs = game_length / 1000;
	this._scoreBoard.setText('');
	/*
	this._molehills.forEach(function (molehill) {
		molehill.resetMole();
	});
	*/
	this._scoreBoard.updateOpts({
		x: 0,
		fontSize: 38,
		verticalAlign: 'middle',
		textAlign: 'center',
		multiline: false
	});
	this._countdown.updateOpts({
		visible: false,
		color: '#fff'
	});
}

/*
 * Strings
 */

function get_end_message (score, isHighScore) {
	var moles = (score === 1) ? text.MOLE : text.MOLES,
			end_msg = text.END_MSG_START + ' ' + score + ' ' + moles + '.\n';

	if (isHighScore) {
		end_msg += text.HIGH_SCORE + '\n';
	} else {
		//random taunt
		var i = (Math.random() * text.taunts.length) | 0;
		end_msg += text.taunts[i] + '\n';
	}
	return (end_msg += text.END_MSG_END);
}

var localized_strings = {
	en: {
		READY: "Ready ...",
		SET: "Set ...",
		GO: "Whack that Mole!",
		MOLE: "mole",
		MOLES: "moles",
		END_MSG_START: "You whacked",
		END_MSG_END: "Tap to play again",
		HIGH_SCORE: "That's a new high score!"
	}
};

localized_strings['en'].taunts = [
	"Welcome to Loserville, population: you.", //max length
	"You're an embarrassment!",
	"You'll never catch me!",
	"Your days are numbered, human.",
	"Don't quit your day job.",
	"Just press the screen, it's not hard.",
	"You might be the worst I've seen.",
	"You're just wasting my time.",
	"Don't hate the playa, hate the game.",
	"Make like a tree, and get out of here!"
];

//object of strings used in game
var text = localized_strings[lang.toLowerCase()];

// utilities
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function rect(x, y, w, h) {
	return { x: x, y: y, w: w, h: h};
}

function circleIntersection(x1, y1, r1, x2, y2, r2) {
    var dx = x1 - x2;
    var dy = y1 - y2;
    var len = Math.sqrt(dx * dx + dy * dy);

    if (len < r1 + r2)
        return true;
    return false;
}
