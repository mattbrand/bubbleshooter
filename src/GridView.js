import ui.View;
import ui.ImageView;
import ui.TextView;
import src.GridPos as GridPos;
import src.Bubble as Bubble;

var BLANK_BUBBLE = -1;
var NO_BUBBLE = -2;
var GRID_ROWS = 13;
var GRID_COLUMNS = 8;
var START_ROWS = 12;
var BUBBLE_SIZE = 40;
var DEBUG = false;

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

	// grid building functions
	this.addBubble = function(gridPos) {
		var bubble = new Bubble();
		bubble.createBubbleImage(gridPos);
		gridPos.setBubble(bubble);
		this.addSubview(bubble);
		this._bubbles.push(bubble);
	};

	this.buildGrid = function() {
		for (var i=0; i<GRID_COLUMNS; i++) {
			var arrayRow = [];
			for (var j=0; j<GRID_ROWS; j++) {
				var gridPos = new GridPos();
				var type = getRandomInt(0, 4);
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
				if (this._grid[i][j]._type >= 0) {
					this.addBubble(this._grid[i][j]);
				}
			}
		}
	};

	// main view building function
	this.build = function() {

		this.style.width = 320;
		this.style.height = 570;
		this._grid = new Array();

		// build the grid
		this.buildGrid();

		// grid calculation functions
		this.hasNeighbors = function(i, j) {
			var openNeighbors = this.findOpenNeighbors(i, j);
			// console.log(openNeighbors.length);
			if (openNeighbors.length > 0) {
				for (var i=0; i<openNeighbors.length; i++) {
					if (this._grid[openNeighbors[i][0]][openNeighbors[i][1]]._type >= 0)
						return true;
				}
			}
			return false;
		};

		this.inOddRow = function(row) {
			if (row < GRID_ROWS) {
				if (this._grid[GRID_COLUMNS - 1][row]._type == NO_BUBBLE)
					return true;
			}
			return false;
		};

		this.getGridPosition = function(x, y) {
	    var j = Math.floor((y + (BUBBLE_SIZE / GRID_COLUMNS)) / (BUBBLE_SIZE * 0.85));

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

		this.findNeighbors = function(gridPos) {
			var col = gridPos._i;
			var row = gridPos._j;
			var neighbors = [];
			// odd row
			if (this.inOddRow(row)) {
				if (row > 0 && this._grid[col][row-1]._type != NO_BUBBLE)
					neighbors.push(this._grid[col][row-1]);
				if (row > 0 && (col < (GRID_COLUMNS - 1)) && this._grid[col+1][row-1]._type != NO_BUBBLE)
					neighbors.push(this._grid[col+1][row-1]);
				if (col > 0 && this._grid[col-1][row]._type != NO_BUBBLE)
					neighbors.push(this._grid[col-1][row]);
				if ((col < (GRID_COLUMNS - 1)) && this._grid[col+1][row]._type != NO_BUBBLE)
					neighbors.push(this._grid[col+1][row]);
				if ((row < (this._grid.length - 1)) && this._grid[col][row+1]._type != NO_BUBBLE)
					neighbors.push(this._grid[col][row+1]);
				if ((col < (GRID_COLUMNS - 1)) && (row < (this._grid.length - 1)) && this._grid[col+1][row+1]._type != NO_BUBBLE)
					neighbors.push(this._grid[col+1][row+1]);
			}
			// even row
			else {
				if (col > 0 && row > 0 && this._grid[col-1][row-1]._type != NO_BUBBLE)
					neighbors.push(this._grid[col-1][row-1]);
				if (row > 0 && this._grid[col][row-1]._type != NO_BUBBLE)
					neighbors.push(this._grid[col][row-1]);
				if (col > 0 && this._grid[col-1][row]._type != NO_BUBBLE)
					neighbors.push(this._grid[col-1][row]);
				if ((col < (GRID_COLUMNS - 1)) && this._grid[col+1][row]._type != NO_BUBBLE)
					neighbors.push(this._grid[col+1][row]);
				if (col > 0 && (row < (this._grid.length - 1)) && this._grid[col-1][row+1]._type != NO_BUBBLE)
					neighbors.push(this._grid[col-1][row+1]);
				if ((row < (this._grid.length - 1)) && this._grid[col][row+1]._type != NO_BUBBLE)
					neighbors.push(this._grid[col][row+1]);
			}
			if (DEBUG) {
				console.log("returning neighbors:");
				for (var i=0; i<neighbors.length; i++)
					console.log(neighbors[i]._i + ", " + neighbors[i]._j + " --- " + neighbors[i]._type);
			}
			return neighbors;
		};

		this.findOpenNeighbors = function(gridPositions) {
			var openNeighbors = [];
			for (var i=0; i<gridPositions.length; i++) {
				if (gridPositions[i]._type == BLANK_BUBBLE)
					openNeighbors.push(gridPositions[i]);
			}
			if (DEBUG) {
				console.log("found open neighbors:");
				for (var i=0; i<openNeighbors.length; i++)
					console.log(openNeighbors[i]._i + ", " + openNeighbors[i]._j + " --- " + openNeighbors[i]._type);
			}
			return openNeighbors;
		};

		this.findNearestOpenNeighbor = function(gridPos) {
			var openNeighbors = this.findOpenNeighbors(this.findNeighbors(gridPos));
			if (openNeighbors.length > 0) {
				if (DEBUG)
					console.log("found nearest open neighbor at " + openNeighbors[0]._i + ", " + openNeighbors[0]._j + " --- " + openNeighbors[0]._type);
				return openNeighbors[0];
			}
			return gridPos;
		};

		this.findCluster = function(gridPos, matchType, reset) {
			if (reset)
		    this.resetChecked();

	    // initialize the toprocess array with the specified tile
	    var toProcess = [gridPos];
	    gridPos._checked = true;
	    var foundCluster = [];

	    while (toProcess.length > 0) {
        // pop the last element from the array
        var currentGridPos = toProcess.pop();

        // skip processed and empty tiles
        if (currentGridPos._type == -1 || currentGridPos._type == -2)
          continue;

        // check if current tile has the right type, if matchtype is true
        if (!matchType || currentGridPos._type == gridPos._type) {
          // add current tile to the cluster
          foundCluster.push(currentGridPos);

					if (DEBUG)
						console.log("added " + currentGridPos._i + ", " + currentGridPos._j + " --- " + currentGridPos._type + " to cluster");

          // get the neighbors of the current tile
          var neighbors = this.findNeighbors(currentGridPos);

          // check the type of each neighbor
          for (var i=0; i<neighbors.length; i++) {
            if (!neighbors[i]._checked) {
              // add the neighbor to the toprocess array
              toProcess.push(neighbors[i]);
              neighbors[i]._checked = true;
            }
          }
        }
	    }

    	// return the found cluster
    	return foundCluster;
		};

		this.resetChecked = function() {
			for (var i=0; i<this._grid.length; i++) {
				for (var j=0; j<this._grid[i].length; j++) {
					this._grid[i][j]._checked = false;
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
          if (!gridPos._checked) {
            // find all attached tiles
            var foundcluster = this.findCluster(gridPos, false, false);

            // if nothing in cluster, skip
            if (foundcluster.length <= 0) {
              continue;
            }

            // check if the cluster is floating
            var floating = true;
            for (var k=0; k<foundcluster.length; k++) {
              if (foundcluster[k].style.y == 0) {
                // tile is attached to the roof
                floating = false;
                break;
              }
            }

            if (floating) {
                // found a floating cluster
                foundclusters.push(foundcluster);
            }
          }
        }
	    }

		  return foundclusters;
		};

		this.snapShotToGrid = function(shot) {
			var gridColRow = this.getGridPosition(shot._shotImg.style.x, shot._shotImg.style.y);
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

			if (DEBUG)
				console.log("shot hit at " + this._newGridPos._i + ", " + this._newGridPos._j);

			if (this._newGridPos._type != BLANK_BUBBLE) {
				if (DEBUG)
					console.log("not a blank bubble, finding nearest open neighbor");
				this._newGridPos = this.findNearestOpenNeighbor(this._newGridPos);
			}
			if (this._newGridPos != null) {
				if (DEBUG)
					console.log("starting shot calculation at " + this._newGridPos._i + ", " + this._newGridPos._j);
				// this._newGridPos = this._grid[gridColRow.col][gridColRow.row];
				this._newGridPos.setType(shot._type);
				this.addBubble(this._newGridPos);
				return 2;
			}
			else {
				if (DEBUG)
					console.log("did not find a place for shot to hit");
			}
      return 0;
		};

		this.shiftGrid = function() {
			for (var i=0; i<this._grid.length; i++) {
				for (var j=0; j<this._grid[i].length; j++) {
					this._grid[i][j].shiftDown();
				}
			}

			var newRow = new Array();
			var fullRow = false;
			if (this._grid[GRID_COLUMNS - 1][0]._type == NO_BUBBLE)
				fullRow = true;
			for (var i=0; i<GRID_COLUMNS; i++) {
				var gridPos = new GridPos();
				var type = getRandomInt(0, 3);
				if (!fullRow && (i == GRID_COLUMNS - 1))
					type = NO_BUBBLE;
				gridPos.setTypeAndPosition(i, 0, type, !fullRow);
				newRow.push(gridPos);
				this.addBubble(gridPos);
			}

			var shiftedGrid = new Array();
			for (var i=0; i<this._grid.length; i++) {
				var shiftedCol = [];
				shiftedCol.push(newRow[i]);
				for (var j=0; j<this._grid[i].length; j++) {
					this._grid[i][j]._j += 1;
					shiftedCol.push(this._grid[i][j]);
				}
				shiftedGrid.push(shiftedCol);
			}
			this._grid = shiftedGrid;

			if (DEBUG)
				console.log("shifted grid");
		};

		this.checkForBubblesInLastRow = function() {
			for (var i=0; i<GRID_COLUMNS - 1; i++) {
				if (this._grid[i][GRID_ROWS - 1]._type >= 0)
					return true;
			}
			return false;
		};

		this.addToScore = function(points) {
			score += points;
			this._scoreBoard.setText("SCORE: " + score);
		};

		this.displayGridDebug = function() {
			for (var j=0; j<this._grid[0].length; j++) {
				var rowStr = "";
				for (var i=0; i<this._grid.length; i++) {
					if (i > 0)
						rowStr += ",";
					rowStr += this._grid[i][j]._type;
				}
				console.log(rowStr);
			}
		};
	};
});

/* reset

for (var i=0; i<GRID_COLUMNS; i++) {
  for (var j=0; j<GRID_ROWS; j++) {
    this._grid[i][j].removeFromSuperview();
  }
}

for (var i=0; i<this._bubbles.length; i++)
  this._bubbles[i].removeFromSuperview();
*/

// utilities
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
