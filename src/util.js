/*

	util.js

*/

// =============================================================================
// -----------------------------------------------------------------------------
// # Math (Prototype extensions)
// -----------------------------------------------------------------------------
// =============================================================================

/**

	Reduces a fraction by finding the Greatest Common Divisor and dividing by it.
	https://stackoverflow.com/questions/4652468/is-there-a-javascript-function-that-reduces-a-fraction

*/

Math.reduce = function(numerator, denominator) { // numerator = number, denominator = number ; returns integer
	var gcd = function gcd(a, b){
		return b ? gcd(b, a % b) : a;
	};
	gcd = gcd(numerator, denominator);
	return [numerator / gcd, denominator / gcd];
};

/**

	Returns an integer increased to a minimum or decreased to a maximum.

*/

Math.clamp = function(min, val, max) { // min = number, val = number, max = number ; returns number
	if (val > max) return max;
	else if (val < min) return min;
	else return val;
};

// =============================================================================
// -----------------------------------------------------------------------------
// # Objects (Built-in object functions)
// -----------------------------------------------------------------------------
// =============================================================================

/**

	Checks if a nested set of objects matches a specific property hierarchy.

*/

function hasProperty(o, s) { // o = JavaScript object, s = property hierarchy (string) ; returns boolean
	let i, l = s.split("."), r = false;
	if (o !== undefined) {
		for (i = 0; i < l.length; i++) {
			if (o.hasOwnProperty(l[i])) {
				r = true;
				o = o[l[i]];
			} else {
				r = false;
				break;
			}
		}
	}
	return r;
}

// =============================================================================
// -----------------------------------------------------------------------------
// # Arrays (Built-in object functions)
// -----------------------------------------------------------------------------
// =============================================================================

/**

	Returns an array filled with an array randomized values.

*/

function shuffle(a) { // a = array ; returns array
	let k, i, m, r = [];
	m = a.length;
	for (i = 0; i < m; i++) {
		k = Math.floor(Math.random() * a.length);
		r.push(a[k]);
		a.splice(k, 1);
	} return r;
}

// =============================================================================
// -----------------------------------------------------------------------------
// # Arrays (Built-in object methods providers)
// -----------------------------------------------------------------------------
// =============================================================================

/**

	Array.reduce() provider for the sum of an array values.

*/

function sum(len, val) { // l = array length, v = current value
	return len + val;
}

/**

	Array.sort() providers where a = value at index and b = value at index + 1.

*/

function asc(a, b) {return a - b} // ascending (lowest to highest)
function desc(a, b) {return b - a} // descending (highest to lowest)
function arr_asc(a, b) {return a[0] - b[0]} // array ascending (first value lowest to first value highest)
function arr_desc(a, b) {return b[0] - a[0]} // array descending (first value highest to first value lowest)

// =============================================================================
// -----------------------------------------------------------------------------
// # Strings (Built-in object functions)
// -----------------------------------------------------------------------------
// =============================================================================

/**

	Converts an integer to a string leaded by padding zero(s).

*/

function leadZero(num, max) { // num = integer, max = maximum ; returns string
	if (!Number.isInteger(max)) max = Math.pow(10, conf.util.lead_zero);
	max = max.toString();
	num = num.toString();
	while (max.length > num.length) num = "0" + num;
	return num;
}

/**

	Replaces some '%n' tokens in a given string by some replacement string values.

*/

function fstr(s, r) { // s = string, r = replacement (str or arr) ; returns string
	let i;
	if (typeof(r) == "string") r = [r];
	for (i = 0; i < r.length; i++) s = s.replace(new RegExp("%" + (i + 1), "g"), r[i]);
	return s;
}

/**

	Returns the ordinal string of a numeric day

*/

function getNumberOrdinalSuffix(n) { // n = number ; returns string
	let r = "th";
	let s = n.toString().split(".")[0];
	n = parseFloat(s);
	s = s.substr(-1, 1);
	if (n < 11 || n > 13) {
		if (s == "1") r = "st";
		else if (s == "2") r = "nd";
		else if (s == "3") r = "rd";
	} return r;
}

// =============================================================================
// -----------------------------------------------------------------------------
// # Fullscreen API (Cross-browser short-hands)
// -----------------------------------------------------------------------------
// =============================================================================

/**

	Turns on browser fullscreen.
	https://www.w3schools.com/jsref/met_element_requestfullscreen.asp

*/

function requestFullscreen(o) { // o = DOM object
	if (o.requestFullscreen) {
		o.requestFullscreen();
	} else if (o.mozRequestFullScreen) { // Firefox
		o.mozRequestFullScreen();
	} else if (o.webkitRequestFullscreen) { // Chrome, Safari and Opera
		o.webkitRequestFullscreen();
	} else if (o.msRequestFullscreen) { // Internet Explorer and Edge
		o.msRequestFullscreen();
	}
}

/**

	Turns off browser fullscreen.
	https://www.w3schools.com/jsref/met_element_exitfullscreen.asp

*/

function exitFullscreen(o) { // o = DOM object
	if (document.exitFullscreen) {
		document.exitFullscreen();
	} else if (document.mozCancelFullScreen) { // Firefox
		document.mozCancelFullScreen();
	} else if (document.webkitExitFullscreen) { // Chrome, Safari and Opera
		document.webkitExitFullscreen();
	} else if (document.msExitFullscreen) { // Internet Explorer and Edge
		document.msExitFullscreen();
	}
}

// =============================================================================
// -----------------------------------------------------------------------------
// # Web Storage API (Convenience short-hands)
// -----------------------------------------------------------------------------
// =============================================================================

/**

	Retrieves a web storage item.

*/

function getLocalStorageItem(k) { // k = item key ; returns object
	return JSON.parse(localStorage.getItem(k));
}

/**

	Checks if a web storage item key exists.

*/

function hasLocalStorageKey(k) { // k = item key ; returns boolean
	return localStorage.hasOwnProperty(k);
}

/**

	Checks if a web storage item key exists and if its value is defined.

*/

function hasLocalStorageItem(k) { // k = item key ; returns boolean
	if (hasLocalStorageKey(k)) return getLocalStorageItem(k) != null;
	return false;
}

/**

	Registers a web storage item, erasing any already existing value.

*/

function setLocalStorageItem(k, v, b) { // k = item key, v = item value, b = replace flag
	if (b && hasLocalStorageItem(k) && typeof(v) == "object") {
		let r = getLocalStorageItem(k);
		if (typeof(r) == "object") v = Object.assign(r, v);
	} localStorage.setItem(k, JSON.stringify(v));
}

/**

	Registers a web storage item, adding new object values to old one.

*/

function putLocalStorageItem(k, v) { // k = item key, v = item value
	setLocalStorageItem(k, v, true);
}

/**

	Removes a web storage item (i.e. delete item).

*/

function removeLocalStorageItem(k, b) { // k = item key, b = null value flag
	if (b) localStorage.setItem(k, null);
	else localStorage.removeItem(k);
}

/**

	Erases a web storage item (i.e. clear item).

*/

function eraseLocalStorageItem(k) { // k = item key
	removeLocalStorageItem(k, true);
}

// =============================================================================
// -----------------------------------------------------------------------------
// # Units
// -----------------------------------------------------------------------------
// =============================================================================

/**

	Converts a pixel value to a tile value (i.e. Area to Board).

*/

function px(n) { // n = number ; returns integer
	return Math.floor(n * conf.tile.size);
}

/**

	Converts a tile value to a pixel value (i.e. Board to Area).

*/

function ti(n) { // n = number ; returns integer
	return Math.floor(n / conf.tile.size);
}

/**

	Returns half the value of a tile in pixels.

*/

function halfti() {
	return Math.floor(conf.tile.size / 2);
}

// =============================================================================
// -----------------------------------------------------------------------------
// # Screen
// -----------------------------------------------------------------------------
// =============================================================================

/**

	Checks if a rectangle has any portion of it displayed on screen.

*/
/*
function isRectPartOnScreen(x, y, w, h) { // x, y, w, h = pixel ; returns boolean
	let c1 = scen.screen.x < x + w; // axis +x ; rect right side
	let c2 = scen.screen.x + scen.screen.width > x; // axis -x ; rect left side
	let c3 = scen.screen.y < y + h; // axis +y ; rect bottom side
	let c4 = scen.screen.y + scen.screen.height > y; // axis -y ; rect top side
	return c1 && c2 && c3 && c4;
}
*/

/**

	Checks if a rectangle is entirely displayed on screen.

*/

function isRectOnScreen(x, y, w, h, b) { // x, y, w, h = pixel, b = screen outer flag* (false for inner) ; returns boolean
	let n = b ? px(conf.scen.screen.outer) : 0;
	let m = b === false ? px(conf.scen.screen.inner) : 0;
	let c1 = scen.screen.x <= x + n - m; // axis +x ; rect left side
	let c2 = scen.screen.x + scen.screen.width >= x + w - n + m; // axis -x ; rect right side
	let c3 = scen.screen.y <= y + n - m; // axis +y ; rect top side
	let c4 = scen.screen.y + scen.screen.height >= y + h - n + m; // axis -y ; rect bottom side
	return c1 && c2 && c3 && c4;
}

// =============================================================================
// -----------------------------------------------------------------------------
// # Board
// -----------------------------------------------------------------------------
// =============================================================================

/**

	Checks if a tile is between board bounds.

*/

function isTileOnBoard(x, y) { // x, y = tile ; returns boolean
	let c1 = x >= 0;
	let c2 = y >= 0;
	let c3 = x <= conf.board.width - 1;
	let c4 = y <= conf.board.height - 1;
	return c1 && c2 && c3 && c4;
}

// =============================================================================
// -----------------------------------------------------------------------------
// # Grids (i.e. matrix)
// -----------------------------------------------------------------------------
//   Grids are arrays of form a[x][y] = v
// -----------------------------------------------------------------------------
// =============================================================================

/**

	Returns a two dimensions array filled with zero.

*/

function createGrid(w, h) { // w, h = grid dimension (tile) ; returns grid
	let x, y, a = [];
	for (x = 0; x < w; x++) {
		a[x] = [];
		for (y = 0; y < h; y++) {
			a[x][y] = 0;
		}
	}
	return a;
}

/**

	Converts a map grid (octal matrix) into a game grid (array matrix).

	map grid and game grid have different formats:
	> map grid uses integer values, game grid uses array values
	> map grid docks are positive, game grid docks are negative

*/

function createGameGrid(a, w, h) { // a = map grid, w, h = game grid dimension (tile) ; returns grid
	let x, y, v, r = createGrid(w, h);
	for (x = 0; x < a.length; x++) {
		for (y = 0; y < a[x].length; y++) {
			v = a[x][y];
			if (v >= 5 && v <= 8) v *= -1; // dock or spawn
			r[x][y] = [v, null];
		}
	}
	return r;
}

/**

	Converts a game grid (array matrix) into a path grid (bit matrix).

	game grid and A* grid of Brian Grinstead's have different formats:
	> game grid uses -8 to 0 as walkable value, A* grid uses 1
	> game grid uses 1 to 8 as unwalkable values, A* grid uses 0

*/

function createPathGrid(a, b, l, e, q, f, t) { // a = game grid, b = exclude hidden flag, l = pass through type list, e = exclude type list, q = quad grid flag, f = force closed door hovering, t = A* grid format ; returns grid array

	// console.time("createPathGrid"); // DEBUG

	let x, y, r = [];

	// 1. Define cell values
	let empty = t ? 1 : 0; // 0 for game grid, 1 for A* grid
	let filled = t ? 0 : 1; // 1 for game grid, 0 for A* grid

	// 2. Force closed door hovering
	if (f) {
		if (!Array.isArray(l)) l = [3];
		else if (!l.includes(3)) l.push(3);
	}

	// 3. Create flat array
	for (x = 0; x < a.length; x++) {
		r[x] = [];
		for (y = 0; y < a[x].length; y++) {
			r[x][y] = isCellEmpty(a[x][y], b, l, e) ? empty : filled;
		}
	}

	// 4. Quadruple filled cells to the toppest-leftest tile
	if (q) {
		for (x = 1; x < r.length; x++) {
			for (y = 1; y < r[x].length; y++) {
				if (r[x][y] == filled) {
					r[x-1][y] = filled; // left
					r[x][y-1] = filled; // top
					r[x-1][y-1] = filled; // top-left
				}
			}
		}
	}

	// let debug = createPointListFromGrid(r, conf.board.width, conf.board.height); // DEBUG
	// ents.Rect.range.draw(debug, "debug", true); // DEBUG
	// console.timeEnd("createPathGrid"); // DEBUG

	return r;
}

/**

	Converts a game grid into a point list excluding empty cells.

*/

function createPointListFromGrid(a, w, h) { // a = game grid, w, h = grid dimension (tile) ; returns point list
	let x, y, v, b = [];
	for (x = 0; x < w; x++) {
		for (y = 0; y < h; y++) {
			v = a[x][y];
			if (v[0] > 0) { // is not empty (either flat or pawn)
				b.push([x, y, v[0], v[1]]); // append type as well as id
			}
		}
	}
	return b;
}

/**

	Checks if a grid cell is empty.

*/

function isCellEmpty(c, b, l, e, f, s) { // c = game grid cell, b = exclude hidden flag, l = pass through type list, e = exclude type list, f = exclude door rail, s = self id (exclude clause) ; returns boolean
	let r = true;
	if (s !== undefined && c[1] == s) r = true; // self
	else if (f && (c[0] == -1 || c[0] == 3)) r = false; // door rail
	else if (Array.isArray(l) && l.includes(c[0])) r = true; // pass through
	else if (Array.isArray(e) && e.includes(c[0])) r = false; // exclude
	else if (b) {
		if (c[0] <= 0) r = true;
		else if (c[0] == 4 || c[0] == 8) r = pawn[c[1]].hidden; // item or alien
		else r = false;
	} else r = c[0] <= 0;
	return r;
}

/**

	Checks if all grid cells covered by a plinth are empty.

*/

function isPlinthEmpty(a, x, y, w, h, b, l, e, d, s) { // a = game grid, x, y = tile, w, h = plinth size, b = exclude hidden flag, l = pass through type list, e = exclude type list, d = exclude door rail, s = self id (exclude clause) ; returns boolean
	let c, i, j, r = true;
	for (i = 0; i < w; i++) {
		for (j = 0; j < h; j++) {
			if (isTileOnBoard(x + i, y + j)) { // only if on board
				c = game.grid[x + i][y + j];
				if (!isCellEmpty(c, b, l, e, d, s)) r = false;
			}
		}
	}
	return r;
}

/**

	Returns a point list of empty adjacent cells around some origin coordinates.
	Resulting array sorted by distance tension if a distant point [x,y] is defined.
	Resulting array matches a given plinth size.

*/

function getEmptyTileAround(a, x, y, w, h, d, l, e, f, s, p, b) { // a = game grid, x, y = origin (tile), w, h = plinth size, d = diagonal flag, l = pass through type list, e = exclude type list, p = distant point ([x,y]), f = exclude door rail, s = self id (exclude clause), b = check flag ; returns point list or boolean
	// console.time("getEmptyTileAround"); // DEBUG
	let i, j, r = b ? false : [];
	let min_x = x - w; // plinth space
	let min_y = y - h; // plinth space
	let max_x = x + 1; // always +1
	let max_y = y + 1; // always +1
	for (i = min_x; i <= max_x; i++) {
		for (j = min_y; j <= max_y; j++) {
			if (i == min_x || i == max_x || j == min_y || j == max_y) { // at bounds
				if (d || !(
				 (i == min_x && j == min_y) ||
				 (i == max_x && j == max_y) ||
				 (i == max_x && j == min_y) ||
				 (i == min_x && j == max_y))) { // diagonal or lineal
					if (isPlinthEmpty(a, i, j, w, h, false, l, e, f, s)) { // hidden included
						 if (b) {
							r = true;
							break;
						 } else {
							r.push([i, j]);
						}
					}
				}
			}
		}
	}
	if (!b && Array.isArray(p)) r = sortByDist(r, p); // tensed distance
	// console.timeEnd("getEmptyTileAround"); // DEBUG
	// ents.Rect.range.draw(r, "debug", true); // DEBUG
	return r;
}

/**

	Returns true if any adjacent cell is empty around some origin coordinates.
	Result matches a given plinth size.

*/

function hasEmptyTileAround(a, x, y, w, h, d, l, e, f, s) { // a = game grid, x, y = tile, w, h = plinth size, d = diagonal flag, l = pass through type list, e = exclude type list, f = exclude door rail, s = self id (exclude clause) ; returns boolean
	return getEmptyTileAround(a, x, y, w, h, d, l, e, f, s, null, true);
}

/**

	Checks if any adjacent cell matches a given value in a grid.

*/

function hasAdjacentCellOfValue(a, x, y, v, d, p) { // a = game grid, x, y = origin (tile), v = value (int or arr), d = diagonal flag, p = return first matching cell flag ; returns boolean, array or integer
	let r = false, i, j, k, n;
	outer:
	for (i = x - 1; i <= x + 1; i++) {
		for (j = y - 1; j <= y + 1; j++) {
			if (!(i == x && j == y)) { // not origin
				if (d || (i == x || j == y)) { // diagonal or lineal
					k = a[i][j][0];
					if (Number.isInteger(v)) v = [v];
					for (n in v) {
						if (k == v[n]) {
							r = true;
							if (p) return a[i][j];
							break outer;
						}
					}
				}
			}
		}
	}
	return r;
}

// =============================================================================
// -----------------------------------------------------------------------------
// # Point Lists (i.e. serie)
// -----------------------------------------------------------------------------
//   Point Lists are arrays of form a[n] = [x, y, v]
// -----------------------------------------------------------------------------
// =============================================================================

/**

	Sort a point list by distance tension.

*/

function sortByDist(a, p, b) { // a = point list, p = origin (point), b = sort descending flag
	let l = [], k, d, v;
	for (k in a) {
		d = getDist(p[0], p[1], a[k][0], a[k][1], null); // tensed distance
		v = [d, a[k][0], a[k][1]];
		if (a[k][2] !== undefined) v.push(a[k][2]);
		l.push(v);
	}
	b ? l.sort(arr_desc) : l.sort(arr_asc); // sort array
	l.forEach(function(ele, idx, arr) {ele.shift()}); // reduce array
	return l;
}

/**

	Checks if any point value within a point list matches a given value.
	Returns point index on success, -1 otherwise.

*/

function hasValue(a, v, p) { // a = point list, v = value, p = return point index flag ; returns boolean or integer
	let i;
	for (i = 0; i < a.length; i++) {
		if (a[i][2] == v) {
			return p ? i : true;
		}
	}
	return p ? -1 : false;
}

/**

	Checks if a point (x,y) exists in a point list.
	Returns point index on success, -1 otherwise.

*/

function hasPoint(a, x, y, p) { // a = point list, x, y = tile, p = return point index flag ; returns boolean or integer
	let i;
	for (i = 0; i < a.length; i++) {
		if (a[i][0] == x && a[i][1] == y) {
			return p ? i : true;
		}
	}
	return p ? -1 : false;
}

/**

	Checks if a point (x,y) which has a given value exists in a point list.

*/

function hasPointOfValue(a, x, y, v) { // a = point list, x, y = tile, v = value ; returns boolean
	let i;
	for (i = 0; i < a.length; i++) {
		if (a[i][0] == x && a[i][1] == y && a[i][2] == v) {
			return true;
		}
	}
	return false;
}

/**

	Checks if a point (x,y) which value is greater than zero exists in a point list.

*/

function hasPointPositive(a, x, y) { // a = point list, x, y = tile ; returns boolean
	let i;
	for (i = 0; i < a.length; i++) {
		if (a[i][0] == x && a[i][1] == y && a[i][2] > 0) {
			return true;
		}
	}
	return false;
}

/**

	Returns the lowest value of an adjacent point in a point list.

	Possible values:
	> null  = unknown
	>  NaN  = out of range
	>   -n  = passtrough
	>    0  = blocked
	>   +n  = walkable

*/

function getLowestAdjacentPoint(a, x, y) { // a = point list, x, y = tile ; returns integer or null
	let r = null;
	a.forEach(function(v) {
		if (!(v[0] == x && v[1] == y)) {
			if ((v[0] >= x - 1 && v[0] <= x + 1)
			 && (v[1] >= y - 1 && v[1] <= y + 1)) {
				if (v[2] != 0 && v[2] != null && !Number.isNaN(v[2])) {
					if (r == null || (r != null && Math.abs(v[2]) < r)) {
						r = v[2]; // lowest except zero, null or NaN (1 to n and -1 to n)
					}
				}
			}
		}
	});
	return r;
}

/**

	Checks if any adjacent point flag matches a value in a point list.

	Point Form : [x, y, f] => [x-pos, y-pos, flag]

	# Walkable Tileset:
		0 = unwalkable
		1 = walkable
		2 = unreachable
		3 = should be reachable
		4 = unknow

*/

/*
function hasAdjacent(a, x, y, v, k) { // a = point list, x, y = origin (tile), v = value, k = range ; returns boolean
	let r = false, i, j, k = k || 1;
	for (i = 0; i < a.length; i++) {
		for (j = 1; j <= k; j++) {
			if (!(a[i][0] == x && a[i][1] == y)) { // not origin
				if ((a[i][0] == x - j || a[i][0] == x || a[i][0] == x + j)
				 && (a[i][1] == y - j || a[i][1] == y || a[i][1] == y + j)) { // in range of j
					if (a[i][2] == v) { // match value
						r = true;
						break;
					}
				}
			}
		}
	}
	return r;
}
*/

/**

	Returns an array of a point adjacent points in a point list.

	For point(3,3) and array [0,1][1,1][2,3][3,2][3,3][2,6]

	Checks [2,2][3,2][4,2][2,3][4,3][2,4][3,4][4,4]

	Returns [2,3][3,2] (but not [3,3])

*/

/*
function getAdjacentTiles(a, x, y) { // a = point list, x, y = tile ; returns array or null
	let r = [];
	a.forEach(function(v) {
		if (!(v[0] == x && v[1] == y)) {
			if ((v[0] == x - 1 || v[0] == x || v[0] == x + 1)
			 && (v[1] == y - 1 || v[1] == y || v[1] == y + 1)) {
					r.push(v);
			}
		}
	});
	if (r.length == 0) r = null;
	return r;
}
*/

/*
function countAdjacents(a, x, y) { // a = point list, x, y = tile ; returns integer
	let r = 0;
	a.forEach(function(v) {
		if (!(v[0] == x && v[1] == y)) {
			if ((v[0] == x - 1 || v[0] == x || v[0] == x + 1)
			 && (v[1] == y - 1 || v[1] == y || v[1] == y + 1)) {
				r++;
			}
		}
	});
	return r;
}

function hasAdjacentPositive(a, x, y) { // a = point list, x, y = tile ; returns integer
	let r = 0;
	a.forEach(function(v) {
		if (!(v[0] == x && v[1] == y)) {
			if ((v[0] == x - 1 || v[0] == x || v[0] == x + 1)
			 && (v[1] == y - 1 || v[1] == y || v[1] == y + 1)) {
				if (v[2] == null || v[2] < 0) { // either 0 or -1
					r++;
				}
			}
		}
	});
	if (r < countAdjacents(a, x, y)) return true;
	return false;
}
*/

// =============================================================================
// -----------------------------------------------------------------------------
// # Position
// -----------------------------------------------------------------------------
// =============================================================================

/**

	Checks if a tile is adjacent to another tile.

*/

function isAdjacent(x1, y1, x2, y2, d) { // x1, y1 = origin (tile), x2, y2 = destination (tile), d = diagonal flag ; returns boolean
	let i, j;
	for (i = x1 - 1; i <= x1 + 1; i++) {
		for (j = y1 - 1; j <= y1 + 1; j++) {
			if (i == x2 && j == y2) { // destination
				if (d || (x1 == x2 || y1 == y2)) { // diagonal
					return true;
				}
			}
		}
	}
	return false;
}

// =============================================================================
// -----------------------------------------------------------------------------
// # Visibility
// -----------------------------------------------------------------------------
// =============================================================================

/**

	Returns the radian angle corresponding at some distant coordinates.

*/

function getRadFromCoord(x1, y1, x2, y2) { // x1, y1 = origin (tile), x2, y2 = destination (tile) ; returns angle in radian
	return Math.atan2(y2 - y1, x2 - x1);
}

/**

	Checks if a radian angle is strictly equivalent to a cardinal direction.

*/

function isCardAngle(ang) { // ang = angle (radian) ; returns boolean
	return ang % (1/4 * Math.PI) == 0;
}

/**

	Checks if a straight line can be drawn between two tiles centers.

*/

function hasLos(x1, y1, x2, y2, pts, card, draw) { // x1, y1 = origin (tile), x2, y2 = destination (tile), pts = excluded points, card = cardinal angle flag, draw = draw line flag ; returns boolean

	let lim = conf.Char.sight; // scan length in tiles
	let div = conf.tile.size; // tile size divider
	let ang = getRadFromCoord(x1, y1, x2, y2); // base angle in radian
	let adj = halfti(); // tile center adjustment
	let cos = Math.cos(ang); // ray x angle
	let sin = Math.sin(ang); // ray y angle
	let b = true;
	let n, m, x, y;

	let dest_x, dest_y; // DEBUG
	let orig_x, orig_y; // DEBUG
	let last_x, last_y;
	let diag_x, diag_y;
	let sign_x = x2 - x1 > 0 ? -1 : 1;
	let sign_y = y2 - y1 > 0 ? -1 : 1;

	if (!pts) pts = [];

	if (card && !isCardAngle(ang)) return false;

	if (conf.debug.time.los) console.time("hasLos"); // DEBUG

	outer:
	for (n = 0; n <= lim; n++) { // tile

		inner:
		for (m = 0; m < div; m++) { // pixel

			// * Set line end position
			dest_x = px(x1) + adj + ((px(n) + m) * cos); // DEBUG
			dest_y = px(y1) + adj + ((px(n) + m) * sin); // DEBUG

			// * Set line start position
			if (n == 0 && m == 0) {
				orig_x = dest_x; // DEBUG
				orig_y = dest_y; // DEBUG
			}

			x = ti(dest_x);
			y = ti(dest_y);

			if (x != last_x || y != last_y) { // new tile in line

				diag_x = x + sign_x;
				diag_y = y + sign_y;
				last_x = x;
				last_y = y;

				if (!isTileOnBoard(x, y)) break outer; // out of board
				if (x == x1 && y == y1) continue inner; // origin
				if (hasPoint(pts, x, y)) continue inner; // excluded point

				// * Two unreachable blocked tiles diagonally adjacents breaks line of sight
				if (n > 0 && isTileOnBoard(diag_x, y) && isTileOnBoard(x, diag_y)
				 && !isCellEmpty(game.grid[diag_x][y]) && !isCellEmpty(game.grid[x][diag_y])) {
					b = false;
					break outer;
				}

				// * Destination tile
				if (x == x2 && y == y2) {
					dest_x += (halfti() * cos); // center line mark on tile
					dest_y += (halfti() * sin); // center line mark on tile
					break outer;
				}

				if (!isCellEmpty(game.grid[x][y], true)) { // blocked tile
					b = false;
					break outer;
				}

			}
		}
	}

	if (conf.debug.time.los) console.timeEnd("hasLos"); // DEBUG

	// * Draw line
	if (draw) ents.Line.sight.draw(orig_x, orig_y, dest_x, dest_y, null, {"mark" : {"color" : (b ? "lime" : "darkorange")}, "line" : {"color" : (b ? "limegreen" : "orangered")}}); // DEBUG

	// * Get result
	return b;
}

// =============================================================================
// -----------------------------------------------------------------------------
// # Distances
// -----------------------------------------------------------------------------
// =============================================================================

/**

	Returns the number of tiles separating a position from another.

*/

/*
function getDist(orig, dist, straight) { // orig = point {x,y}, dist = point {x,y}, straight = lineal flag ; returns integer
	let ax = orig.x, ay = orig.y;
	let bx = dist.x, by = dist.y;
	let dx, dy, line, diag;
	dx = bx > ax ? bx - ax : ax - bx;
	dy = by > ay ? by - ay : ay - by;
	line = dx + dy; // lineal move (4-dir)
	diag = line - (Math.min(dx, dy)); // diagonal move (8-dir)
	return straight ? line : diag
}
*/

/**

	Returns the number of tiles separating some coordinates from some other coordinates.

*/

function getDist(x1, y1, x2, y2, straight) { // x1, y1 = origin, x2, y2 = destination, straight = lineal only flag (null for tensed) ; returns integer
	let dx, dy, line, diag;
	dx = x2 > x1 ? x2 - x1 : x1 - x2;
	dy = y2 > y1 ? y2 - y1 : y1 - y2;
	line = dx + dy; // lineal move (4-dir)
	diag = line - (Math.min(dx, dy)); // diagonal move (8-dir)
	return straight === null ? line + diag : (straight ? line : diag);
}

// =============================================================================
// -----------------------------------------------------------------------------
// # Directions
// -----------------------------------------------------------------------------
// =============================================================================

/**

	Returns the cardinal direction corresponding at a distance coordinates.

*/

function getDirFromDist(x, y) { // x, y = distance (tile) ; returns cardinal direction
	if (y < 0 && x < 0) return y < 2 * x ? "nn" : x < 2 * y ? "ww" : "nw";
	else if (y < 0 && x > 0) return -y > 2 * x ? "nn" : x > 2 * -y ? "ee" : "ne";
	else if (y > 0 && x < 0) return y > 2 * -x ? "ss" : -x > 2 * y ? "ww" : "sw";
	else if (y > 0 && x > 0) return y > 2 * x ? "ss" : x > 2 * y ? "ee" : "se";
	else if (y < 0) return"nn";
	else if (x < 0) return"ww";
	else if (x > 0) return"ee";
	else if (y > 0) return"ss";
}

/**

	Returns the cardinal direction corresponding at some coordinates to some other coordinates.

*/

function getDir(x1, y1, x2, y2) { // x1, y1 = origin (tile), x2, y2 = destination (tile) ; returns cardinal direction
	return getDirFromDist(x2 - x1, y2 - y1);
}

/**

	Returns the cardinal coordinates corresponding at a cardinal direction.

*/

function getCoordFromDir(dir) { // dir = cardinal direction ; returns point object {x,y}
	switch(dir) {
		case "nw": return {"x" : -1, "y" : -1}; // 1
		case "ne": return {"x" : +1, "y" : -1}; // 3
		case "sw": return {"x" : -1, "y" : +1}; // 5
		case "se": return {"x" : +1, "y" : +1}; // 7
		case "nn": return {"x" : +0, "y" : -1}; // 2
		case "ww": return {"x" : -1, "y" : -0}; // 4
		case "ee": return {"x" : +1, "y" : +0}; // 6
		case "ss": return {"x" : -0, "y" : +1}; // 8
	}
}

/**

	Returns the opposite of a cardinal direction.

*/

function reverseDir(dir) { // dir = cardinal direction ; returns cardinal direction
	switch(dir) {
		case "nw": return "se";
		case "ne": return "sw";
		case "sw": return "ne";
		case "se": return "nw";
		case "nn": return "ss";
		case "ww": return "ee";
		case "ee": return "ww";
		case "ss": return "nn";
	}
}

/**

	Checks if a cardinal direction is strictly a diagonal direction.

*/

function isDiag(dir) { // dir = cardinal direction ; returns cardinal direction
	switch(dir) {
		case "ne":
		case "nw":
		case "se":
		case "sw": return true;
		default  : return false;
	}
}

/**

	Converts a cardinal direction to a degree integer.

*/

function cardToDeg(dir) { // dir = cardinal direction ; returns degree
	switch (dir) {
		case "nn" : return 90;
		case "ne" : return 45;
		case "ee" : return 0;
		case "se" : return 315;
		case "ss" : return 270;
		case "sw" : return 225;
		case "ww" : return 180;
		case "nw" : return 135;
	}
}

/**

	Converts a cardinal direction to a radian floating point.

*/

function cardToRad(dir) { // dir = cardinal direction ; returns radian
	switch (dir) {
		case "nn" : return 2/4 * Math.PI;
		case "ne" : return 1/4 * Math.PI;
		case "ee" : return 8/4 * Math.PI;
		case "se" : return 7/4 * Math.PI;
		case "ss" : return 6/4 * Math.PI;
		case "sw" : return 5/4 * Math.PI;
		case "ww" : return 4/4 * Math.PI;
		case "nw" : return 3/4 * Math.PI;
	}
}

/**

	Converts a cardinal direction to a brad integer.

*/

function cardToBrad(dir) { // dir = cardinal direction ; returns brad
	switch (dir) {
		case "nn" : return 192;
		case "ne" : return 224;
		case "ee" : return 0;
		case "se" : return 32;
		case "ss" : return 64;
		case "sw" : return 96;
		case "ww" : return 128;
		case "nw" : return 160;
	}
}

/**

	Converts a cardinal direction to an octogonal integer.

*/

function cardToOcto(dir) { // dir = cardinal direction ; returns octo
	switch (dir) {
		case "nn" : return 6;
		case "ne" : return 7;
		case "ee" : return 0;
		case "se" : return 1;
		case "ss" : return 2;
		case "sw" : return 3;
		case "ww" : return 4;
		case "nw" : return 5;
	}
}

/**

	Converts an octogonal direction to a clockwise direction.

	Clockwise Direction (from 1 to 8 clockwise)
	Octogonal Direction (from 1 to 4 lineal and 5 to 8 diagonal)

*/

/*
function octogonalToClockwise(n) { // n = integer
	switch (n) {
		case 1 : return 7;
		case 2 : return 8;
		case 3 : return 1;
		case 4 : return 6;
		case 5 : return 5;
		case 6 : return 2;
		case 7 : return 3;
		case 8 : return 4;
	}
}
*/

/**

	Converts a clockwise direction to an octogonal direction.

*/

/*
function clockwiseToOctogonal(n) { // n = integer
	switch (n) {
		case 1 : return 3;
		case 2 : return 6;
		case 3 : return 7;
		case 4 : return 8;
		case 5 : return 5;
		case 6 : return 4;
		case 7 : return 1;
		case 8 : return 2;
	}
}
*/

/**

	Converts a clockwise direction array to an octogonal direction array.

*/

/*
function clockwiseToOctogonalArray(a) { // a = array
	let i = 0, b = [];
	while (i < a.length) {
		b.push(clockwiseToOctogonal(a[i]));
		i++;
	}
	return b;
}
*/

/**

	Returns an array of 8 clockwise directions sorted by proximity.

*/

/*
function getClockwiseDirectionArray(n) { // n = integer
	let min = 1, max = 8;
	let min_b = false, max_b = false
	let a = [], i = 1;
	while (i <= 4) {
		if (n - i > 0) {
			a.push(n - i);
		} else {
			a.push(max);
			max_b = true;
		}
		if (i <= 3) {
			if (n + i <= 8) {
				a.push(n + i);
			} else {
				a.push(min);
				min_b = true;
			}
		}
		if (max_b) max--;
		if (min_b) min++;
		i++;
	}
	a.splice(0,0,n);
	return a
}
*/

/**

	Converts axis coordinate to octogonal direction.

*/

/*
function AxisToDir(x, y) { // x= int, y = int
	if (x == 0 && y < 0) return 2; // Up
	else if (x < 0 && y == 0) return 4; // Left
	else if (x > 0 && y == 0) return 6; // Right
	else if (x == 0 && y > 0) return 8; // Down
	else if (x < 0 && y < 0) return 1; // Up-Left
	else if (x > 0 && y < 0) return 3; // Up-Right
	else if (x < 0 && y > 0) return 5; // Down-Left
	else if (x > 0 && y > 0) return 7; // Down-Right
	else return 0; // None
}
*/

/**

	Converts octogonal direction to axis coordinate.

*/

/*
function DirToAxis(n) { // n = octogonal direction
	if (n == 2) return [0, -1]; // Up
	else if (n == 4) return [-1, 0]; // Left
	else if (n == 6) return [1, 0]; // Right
	else if (n == 8) return [0, 1]; // Down
	else if (n == 1) return [-1, -1]; // Up-Left
	else if (n == 3) return [1, -1]; // Up-Right
	else if (n == 5) return [-1, 1]; // Down-Left
	else if (n == 7) return [1, 1]; // Down-Right
	else return [0,0]; // None
}
*/
