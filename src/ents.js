/*

	ents.js

*/

// =============================================================================
// -----------------------------------------------------------------------------
// # Notes
// -----------------------------------------------------------------------------
// =============================================================================

/**

	& TERMS

	# Terminology
		Name   : generic term (should not be used specifically)
		String : generic term (should not be used specifically)
		Key    : entity script string (referenced either by itself or by an integer)
		Word   : entity localized name (referenced by key)

	& SPACES

	# Field           Pixels          Tiles
		Area            1920x1920       60x60
		Board           1280x1280       40x40
		Screen          480x480         15x15

	# Board vs. Grid
		Board is a Space ; a dimensional representation of a visual area (i.e. image) ; it is filled with tiles
		Grid is a Matrix ; an algorithmic representation of a board content (i.e. array) ; it is filled with cells

	& GRIDS DISAMBIGUATION

	# Grid        Matrix      Possible values
		path        bit         0 ; 1
		map         octal       0 ; 1 ; 2 ; 3 ; 4 ; 5 ; 6 ; 7
		game        array       [int, str or nil] => [type, id] (e.g. [5, "red01"] i.e. type = 'red' and id = 'red01')

	& ENTITIES (1)

	# Entity          Order*  Motion**        Source          Nature***       OnGrid?         UseId?          Example
		Text            1       Static          Vector          Mark            *               *               FPS
		Line            2       Dynamic         Vector          Mark            *               *               Vector
		Reti(-cle)      3       Dynamic         Vector          Mark            *               *               Focus
		Anim(-ation)    4       Dynamic         Bitmap          Mark            *               *               Explosion
		Proj(-ectile)   5       Mobile          Vector          Mark            *               *               *
		Char(-acter)    6       Mobile          Bitmap          Pawn            true            true            Marine, Gremkin
		Furn(-iture)    6       Static          Bitmap          Pawn            true            true            Door, Boulder
		Rect(-angle)    7       Dynamic         Vector          Mark            *               *               Hilite, Range
		Back(-ground)   8       Static          Bitmap          Mark            *               *               Background

		*   Depth (reverse of the order in which the entities are drawn on the canvas)
		**  Static = never move, Mobile = move by itself, Dynamic = move on condition (e.g. follow another entity)
		*** Mark = lifeless, never saved, regenerated with new properties ; Pawn = lifespan, saved at last heartbeat, regenerated with previous properties

	# Identifiers
		Marine => Type Key + Index* (e.g. red third member => 'red03')
		Other  => Subt Key + Index* (e.g. fifth alien => 'gremkin05' ; second item => 'boulder02')
		* Indexes have at least one leading zero (from 01 to 05 for marine and from 01 to 99 for aliens and items)

	& TILES CHECKING ROUTINES

	# Pathfinding             div     seg     ang     los     Alias
		findPath()              *       *       *       *       *

	# Square Scan             div     seg     ang     los     Alias
		getMoveRange()          *       *       *       0       drawMoveRange()

	# Radial Scan             div     seg     ang     los     Alias
		detect()                0       1       1       1       updateSight(), updateSense(), getSightRange(), getSenseRange(), drawSightRange(), drawSenseRange(), hasSightGreaterThan()
		getShootRange()         0       1       1       1       drawShootRange()
		startScan()             0       0       0       0       *
		hasLos()                1       0       1       *       *

	& ENTITIES VISIBILITY

	# Terms
		Visible   : viewable (not hidden and not invisible) and identifiable (not unseen)
		Invisible : not viewable (hidden or invisible) or undidentifiable (unseen)

	# Properties
		Pawn.hidden (prop)
		Pawn.unseen (prop)
		Char.condition.invisible (subprop)

	# Methods                 Effect
		hide()                  set Pawn.hidden
		conceal()               set Pawn.unseen
		unhide()                unset Pawn.hidden
		reveal()                unset Pawn.hidden and Pawn.unseen
	* setInvisible()          set Char.condition.invisible

	# Functions               Result
		isVisible()             returns TRUE if NOT hidden, NOT unseen and NOT condition.invisible

*/

// =============================================================================
// -----------------------------------------------------------------------------
// # Globals
// -----------------------------------------------------------------------------
// =============================================================================

/**

	& ENTITIES (2)

	Texts, Reticles, Animations, Projectiles, Rectangles, Lines and Backgrounds
		are Marks
		are saved in the global 'ents' variable followed by the entity capitalized class key
		have different depth of drawing
	Characters and Furnitures
		are Pawns
		are saved in the global 'pawn' variable
		have same depth of drawing
		have subclasses (Door, Item, Marine, Alien)

*/

var ents = {
	"Text" : {},
	"Reti" : {},
	"Anim" : {},
	"Proj" : {},
	"Rect" : {},
	"Line" : {},
	"Back" : {}
};

var pawn = {};

// =============================================================================
// -----------------------------------------------------------------------------
// # Functions
// -----------------------------------------------------------------------------
// =============================================================================

////////////////////////////////////////////////////////////////////////////////
// @ Types
////////////////////////////////////////////////////////////////////////////////

function getTypeKey(v) { // v = entity or numeric type ; returns string
	if (typeof(v) === "object") v = v.type;
	switch (v) {
		case -8 : return "spawn";
		case -7 : return "dock";
		case -6 : return "dock";
		case -5 : return "dock";
		case -1 : return "door";
		case  0 : return "floor";
		case  1 : return "void";
		case  2 : return "wall";
		case  3 : return "door";
		case  4 : return "item";
		case  5 : return "red";
		case  6 : return "gold";
		case  7 : return "blue";
		case  8 : return "alien";
		default : return null;
	}
}

function getTypeWord(v) { // v = entity or numeric type ; returns string
	if (typeof(v) === "object") v = v.type;
	return lang[getTypeKey(v)];
}

function isSpawn(n) { // n = numeric type ; returns boolean
	return n == -8;
}

function isDock(n) { // n = numeric type ; returns boolean
	return n == -7 || n == -6 || n == -5;
}

function isFloor(n) { // n = numeric type ; returns boolean
	return n == 0;
}

function isVoid(n) { // n = numeric type ; returns boolean
	return n == 1;
}

function isWall(n) { // n = numeric type ; returns boolean
	return n == 2;
}

function isDoor(v, c) { // v = entity or numeric type, c = closed door only flag ; returns boolean
	if (typeof(v) === "object") v = v.type;
	return c ? v == 3 : v == 3 || v == -1;
}

function isItem(v) { // v = entity or numeric type ; returns boolean
	if (typeof(v) === "object") v = v.type;
	return v == 4;
}

function isRed(v) { // v = entity or numeric type ; returns boolean
	if (typeof(v) === "object") v = v.type;
	return v == 5;
}

function isGold(v) { // v = entity or numeric type ; returns boolean
	if (typeof(v) === "object") v = v.type;
	return v == 6;
}

function isBlue(v) { // v = entity or numeric type ; returns boolean
	if (typeof(v) === "object") v = v.type;
	return v == 7;
}

function isAlien(v) { // v = entity or numeric type ; returns boolean
	if (typeof(v) === "object") v = v.type;
	return v == 8;
}

function isMarine(v) { // v = entity or numeric type ; returns boolean
	return isRed(v) || isGold(v) || isBlue(v);
}

function isFlat(n) { // n = numeric type ; returns boolean
	return isDock(n) || isFloor(n) || isVoid(n) || isWall(n);
}

function isFurn(v, c) { // v = entity or numeric type, c = closed door only flag ; returns boolean
	return isItem(v) || isDoor(v, c);
}

function isChar(v) { // v = entity or numeric type ; returns boolean
	return isMarine(v) || isAlien(v);
}

function isPawn(v, c) { // v = entity or numeric type, c = closed door only flag ; returns boolean
	return isFurn(v) || isChar(v);
}

function getTypeKeyFromId(v) { // v = entity or identifier string ; returns string
	if (typeof(v) === "object") v = v.id;
	return v.substr(0, v.length - 2);
}

function getIndexFromId(v) { // v = entity or identifier string ; returns string
	if (typeof(v) === "object") v = v.id;
	return parseInt(v.slice(-2));
}

function getDockTypeList() { // returns array of numeric types
	return [-7, -6, -5];
}

function getDoorTypeList() { // returns array of numeric types
	return [-1, 3];
}

function getItemTypeList() { // returns array of numeric types
	return [4];
}

function getMarineTypeList() { // returns array of numeric types
	return [5, 6, 7];
}

function getAlienTypeList() { // returns array of numeric types
	return [8];
}

function getFriendTypeList(v) { // v = entity or numeric type ; returns array of numeric types
	let a = [];
	if (isAlien(v)) a = getAlienTypeList();
	else if (isMarine(v)) a = getMarineTypeList();
	return a;
}

function getHostileTypeList(v) { // v = entity or numeric type ; returns array of numeric types
	let a = [];
	if (isMarine(v)) a = getAlienTypeList();
	else if (isAlien(v)) a = getMarineTypeList();
	return a;
}

function getAttackableTypeList(v, b) { // v = entity or numeric type, b = friendly fire flag ; returns array of numeric types
	let a = getHostileTypeList(v);
	if (b) {
		if (isMarine(v)) a = a.concat(getMarineTypeList());
		else if (isAlien(v)) a = a.concat(getAlienTypeList());
	}
	return a.concat(getItemTypeList());
}

function getPassThroughTypeList(v, e) { // v = entity or numeric type, e = exclude doors flag ; returns array of numeric types
	let a = [];
	if (!e) a = a.concat(getDoorTypeList());
	if (isMarine(v)) a = a.concat(getMarineTypeList());
	if (isAlien(v)) a = a.concat(getAlienTypeList());
	return a;
}

function getExcludeTypeList(v) { // v = entity or numeric type ; returns array of numeric types
	let a = [];
	if (isAlien(v)) a = a.concat(getDockTypeList());
	return a;
}

////////////////////////////////////////////////////////////////////////////////
// @ Subtypes
////////////////////////////////////////////////////////////////////////////////

function isGreen(o) { // o = entity
	return o.subt == "gremkin" || o.subt == "scrof";
}

function isLimbo(o) { // o = entity
	return o.subt == "limbo_lw" || o.subt == "limbo_hw" || o.subt == "limbo_cc";
}

function isRobot(o) { // o = entity
	return o.subt == "cyborg" || o.subt == "juggernaut";
}

function isXeno(o) { // o = entity
	return o.subt == "fleshripper";
}

////////////////////////////////////////////////////////////////////////////////
// @ Colors
////////////////////////////////////////////////////////////////////////////////

function setColorScheme(o) { // o = entity
	if (isRed(o)) { // red
		o.color.major = "red"; // armor
		o.color.minor = "gold"; // strap
	} else if (isGold(o)) { // gold
		o.color.major = "gold"; // armor
		o.color.minor = "blue"; // strap
	} else if (isBlue(o)) { // blue
		o.color.major = "blue"; // armor
		o.color.minor = "red"; // strap
	} else if (isGreen(o)) { // green
		let a = ["red", "gold", "brown"];
		let b = ["iron", "teal", "purple"];
		o.color.major = "green"; // skin
		o.color.minor = a[Math.floor(Math.random() * a.length)]; // cloth
		o.color.third = b[Math.floor(Math.random() * b.length)]; // strap
	} else if (isLimbo(o)) { // limbo
		o.color.major = "hooker"; // armor
	} else if (isRobot(o)) { // robot
		if (o.subt == "juggernaut") {
			o.color.major = "iron"; // armor
			o.color.minor = "red"; // weapon
			o.color.third = "brown"; // strap
		} else o.color.major = "steel"; // armor
	} else if (isXeno(o)) { // xeno
		o.color.major = "teal"; // skin
	}
}

function recolorSprite(o, ctx, x, y, w, h, brit) { // o = entity, ctx = canvas context, x, y = position on canvas (pixel), w, h = dimension on canvas (pixel), brit = brightness (float)
	let mj = o.color.major != null, mn = o.color.minor != null, th = o.color.third != null;
	if (mj || mn || th) { // has color scheme
		let imgData = ctx.getImageData(x, y, w, h);
		let pal = conf.color.palette;
		let sch = conf.color.scheme;
		let col = o.color;
		let mj_dk, mj_md, mj_lt, mn_dk, mn_md, mn_lt, th_dk, th_md, th_lt;
		if (mj) mj_dk = pal[sch[col.major][0]], mj_md = pal[sch[col.major][1]], mj_lt = pal[sch[col.major][2]];
		if (mn) mn_dk = pal[sch[col.minor][0]], mn_md = pal[sch[col.minor][1]], mn_lt = pal[sch[col.minor][2]];
		if (th) th_dk = pal[sch[col.third][0]], th_md = pal[sch[col.third][1]], th_lt = pal[sch[col.third][2]];
		let i, r, g, b, f;
		for (i = 0; i < imgData.data.length; i += 4) {
			f = false;
			// * Get pixel data
			r = imgData.data[i+0];
			g = imgData.data[i+1];
			b = imgData.data[i+2];
			// a = 255;
			// * Set major color scheme
			if (mj) {
				if (r == pal[32][0] && g == pal[32][1] && b == pal[32][2]) {r = mj_dk[0]; g = mj_dk[1]; b = mj_dk[2]; f = true;} // major dark
				else if (r == pal[33][0] && g == pal[33][1] && b == pal[33][2]) {r = mj_md[0]; g = mj_md[1]; b = mj_md[2]; f = true;} // major medium
				else if (r == pal[34][0] && g == pal[34][1] && b == pal[34][2]) {r = mj_lt[0]; g = mj_lt[1]; b = mj_lt[2]; f = true;} // major light
			}
			// * Set minor color scheme
			if (!f && mn) {
				if (r == pal[35][0] && g == pal[35][1] && b == pal[35][2]) {r = mn_dk[0]; g = mn_dk[1]; b = mn_dk[2]; f = true;} // minor dark
				else if (r == pal[36][0] && g == pal[36][1] && b == pal[36][2]) {r = mn_md[0]; g = mn_md[1]; b = mn_md[2]; f = true;} // minor medium
				else if (r == pal[37][0] && g == pal[37][1] && b == pal[37][2]) {r = mn_lt[0]; g = mn_lt[1]; b = mn_lt[2]; f = true;} // minor light
			}
			// * Set third color scheme
			if (!f && th) {
				if (r == pal[38][0] && g == pal[38][1] && b == pal[38][2]) {r = th_dk[0]; g = th_dk[1]; b = th_dk[2];} // third dark
				else if (r == pal[39][0] && g == pal[39][1] && b == pal[39][2]) {r = th_md[0]; g = th_md[1]; b = th_md[2];} // third medium
				else if (r == pal[40][0] && g == pal[40][1] && b == pal[40][2]) {r = th_lt[0]; g = th_lt[1]; b = th_lt[2];} // third light
			}
			// * Set transparency
			if (r == pal[2][0] && g == pal[2][1] && b == pal[2][2]) {r = 0; g = 0; b = 0; imgData.data[i+3] = 0;}
			// * Set shadow
			if (r == pal[3][0] && g == pal[3][1] && b == pal[3][2]) {r = 0; g = 0; b = 0; imgData.data[i+3] = 128;}
			// * Set brightness
			if (brit != null) {
				r = Math.round(r * brit);
				g = Math.round(g * brit);
				b = Math.round(b * brit);
			}
			// * Set pixel data
			imgData.data[i+0] = r > 255 ? 255 : r;
			imgData.data[i+1] = g > 255 ? 255 : g;
			imgData.data[i+2] = b > 255 ? 255 : b;
		}
		// * Output image data on buffer
		ctx.putImageData(imgData, x, y);
	}
}

////////////////////////////////////////////////////////////////////////////////
// @ Focus
////////////////////////////////////////////////////////////////////////////////

function hasFocus(o) { // o = entity
	return ents.Reti.focus.x == o.getX() && ents.Reti.focus.y == o.getY();
}

function setFocus(o, b) { // o = entity, b = corner flag
	let x, y, w, h, c;
	if (b) {
		x = o.getX();
		y = o.getY();
		c = o.corner[0]; // corner index
	} else {
		x = o.x;
		y = o.y;
		w = o.width;
		h = o.height;
	}
	ents.Reti.focus.show(x, y, w, h, c);
	term.updateMiniMap();
}

function unsetFocus(b) { // b = update minimap
	ents.Reti.focus.hide();
	if (b) term.updateMiniMap();
}

////////////////////////////////////////////////////////////////////////////////
// @ Screen
////////////////////////////////////////////////////////////////////////////////

function isOnScreen(o, b) { // o = entity, b = screen outer flag* (false for inner) ; returns boolean
	return isRectOnScreen(o.x, o.y, o.width, o.height, b);
}

////////////////////////////////////////////////////////////////////////////////
// @ Scroll
////////////////////////////////////////////////////////////////////////////////

function updateScrollAtBound(o, b, x, y) { // o = entity, b = half-tile adjustment flag, dir_x, dir_y = moving entity direction (signed integer)
	let margin = px(conf.scen.scrl.auto_scroll.margin) + (b ? halfti() : 0);
	let c1 = x > 0 ? false : o.x - margin < scen.screen.x;
	let c2 = x < 0 ? false : o.x + margin > scen.screen.x + scen.screen.width;
	let c3 = y > 0 ? false : o.y - margin < scen.screen.y;
	let c4 = y < 0 ? false : o.y + margin > scen.screen.y + scen.screen.width;
	if (c1 || c2 || c3 || c4) {
		x = y = 0;
		if (c1) x = o.x - scen.screen.x - margin; // at left
		else if (c2) x = o.x - Math.floor(scen.screen.x + scen.screen.width) + margin; // at right
		if (c3) y = o.y - scen.screen.y - margin; // at top
		else if (c4) y = o.y - Math.floor(scen.screen.y + scen.screen.height) + margin; // at bottom
		updateScroll(-x, -y);
	}
}

function updateScrollCenter(o) { // o = entity
	if (!scen.scrl.delayed.active) centerToPixelInstant(o.x, o.y);
}

////////////////////////////////////////////////////////////////////////////////
// @ Position
////////////////////////////////////////////////////////////////////////////////

function getDoorAround(o, c, b) { // o = entity, c = closed door only flag, b = check flag ; returns boolean or entity identifier
	let i, j, k, a = game.grid;
	let x = ti(o.x);
	let y = ti(o.y);
	for (i = x - 1; i <= x + 1; i++) {
		for (j = y - 1; j <= y + 1; j++) {
			if (!(i == x && j == y)) { // not origin
				k = a[i][j];
				if (isDoor(k[0], c)) { // found a door in grid
					return b ? true : k[1];
				} else if (!c && (isMarine(k[0]) || isAlien(k[0]))) { // search in character properties
					if (isDoor(pawn[k[1]].last_tile[2][0])) { // TEMP -- do not work for four-tiles pawns
						return b ? true : pawn[k[1]].last_tile[2][1];
					}
				}
			}
		}
	}
	return false;
}

function isDoorAround(o, c) { // o = entity, c = closed door only flag ; returns boolean
	return getDoorAround(o, c, true);
}

function isAdjacentEnt(o, u, d) { // o = origin entity, u = destination entity, d = diagonal flag ; returns boolean
	if (hasFourTiles(o)) { // TEMP
		let i, j, a = [];
		for (j = 0; j < o.plinth.height; j++) {
			for (i = 0; i < o.plinth.width; i++) {
				a.push([ti(o.x) + i, ti(o.y) + j]);
			}
		}
		a = sortByDist(a, [ti(u.x), ti(u.y)]);
		let k, v = false;
		for (k in a) {
			if (isAdjacent(a[k][0], a[k][1], ti(u.x), ti(u.y), d)) {
				o.setCorner(a[k][0], a[k][1]);
				v = true;
				break;
			}
		}
		return v;
	} else {
		return isAdjacent(ti(o.x), ti(o.y), ti(u.x), ti(u.y), d);
	}
}

////////////////////////////////////////////////////////////////////////////////
// @ Visibility
////////////////////////////////////////////////////////////////////////////////

function hasLosEnt(o, u, pts, card) { // o = origin entity, u = destination entity, pts = excluded points, card = cardinal line flag ; returns boolean
	let draw = conf.debug.draw.los; // DEBUG
	if (hasFourTiles(o)) { // TEMP
		let i, j, a = [];
		for (j = 0; j < o.plinth.height; j++) {
			for (i = 0; i < o.plinth.width; i++) {
				a.push([ti(o.x) + i, ti(o.y) + j]);
			}
		}
		a = sortByDist(a, [ti(u.x), ti(u.y)]);
		let k, v = false;
		for (k in a) {
			if (hasLos(a[k][0], a[k][1], ti(u.x), ti(u.y), pts, card, draw)) {
				o.setCorner(a[k][0], a[k][1]);
				v = true;
				break;
			}
		}
		return v;
	} else {
		return hasLos(ti(o.x), ti(o.y), ti(u.x), ti(u.y), pts, card, draw);
	}
}

function hasLofEnt(o, u, pts) { // o = origin entity, u = destination entity, pts = excluded points ; returns boolean
	return hasLosEnt(o, u, pts, hasBeamWeapon(o));
}

function isHoveringEnt(o, n) { // o = entity, n = corner index ; returns boolean
	let i, c, v = false;
	for (i = 0; i < (hasFourTiles(o) ? 4 : 1); i++) { // TEMP
		if (n !== undefined && n != i) continue;
		c = hasFourTiles(o) ? o.last_tile[i][2] : o.last_tile[2];
		if (c[0] > 0) {
			v = true;
			break;
		}
	}
	return v;
}

////////////////////////////////////////////////////////////////////////////////
// @ Distances
////////////////////////////////////////////////////////////////////////////////

function getDistEnt(o, u, b) { // o = origin entity, u = destination entity, b = straight flag ; returns numeric
	return getDist(o.getTiX(), o.getTiY(), u.getTiX(), u.getTiY(), b);
}

////////////////////////////////////////////////////////////////////////////////
// @ Directions
////////////////////////////////////////////////////////////////////////////////

function getDirEnt(o, u) { // o = origin entity, u = destination entity ; returns cardinal direction
	return getDir(o.getTiX(), o.getTiY(), u.getTiX(), u.getTiY());
}

////////////////////////////////////////////////////////////////////////////////
// @ Placement
////////////////////////////////////////////////////////////////////////////////

function isAtDockingClaws(o) { // o = entity ; returns boolean
	return isMarine(o) && hasPoint(maps[game.map].spawn[getTypeKey(o.type)].pts, ti(o.x), ti(o.y));
}

function hasFourTiles(v) { // v = entity or subtype ; returns boolean
	if (typeof(v) === "object") v = v.subt;
	return v == "juggernaut";
}

function canStopOnDoorRail(v) { // v = entity or subtype ; returns boolean
	if (typeof(v) === "object") v = v.subt;
	return v != "juggernaut";
}

function getPlinth(v) { // v = entity or subtype ; returns plinth object
	if (typeof(v) === "object") v = v.subt;
	let n = hasFourTiles(v) ? 2 : 1;
	return {"width" : n, "height" : n};
}

////////////////////////////////////////////////////////////////////////////////
// @ Properties
////////////////////////////////////////////////////////////////////////////////

function hasAction(o, s) { // o = entity, s = action key (leave empty for any) ; returns boolean
	let c1 = o.action.attack_range > 0;
	let c2 = o.action.attack_melee > 0;
	if ((s === undefined || s == "move") && o.action.move > 0) return true;
	if ((s === undefined || s == "attack") && (c1 || c2)) return true;
	else if (s == "attack_range" && c1) return true;
	else if (s == "attack_melee" && c2) return true;
	return false;
}

function isAlive(o) { // o = entity ; returns boolean
	return o.life > 0;
}

function isDead(o) { // o = entity ; returns boolean
	return o.life <= 0;
}

function isAwol(o) { // o = entity ; returns boolean
	return game.team[getTypeKey(o)].members[o.id].state == "awol";
}

function hasQuit(o) { // o = entity ; returns boolean
	return game.team[getTypeKey(o)].members[o.id].state == "quit";
}

function isGone(o) { // o = entity ; returns boolean
	return isDead(o) || (isMarine(o) && hasQuit(o));
}

function isVisible(o) { // o = entity ; returns boolean
	return !(o.hidden || o.unseen || o.condition.invisible);
}

function isGrenater(o) { // o = entity ; returns boolean
	return o.subt == "gremkin" && o.weapon == "grenade";
}

function isMechatek(o) { // o = entity ; returns boolean
	return o.subt == "scrof" && o.weapon == "plasma_cannon";
}

////////////////////////////////////////////////////////////////////////////////
// @ Weapons
////////////////////////////////////////////////////////////////////////////////

function setWeaponModifiers(o) { // o = entity
	let e = game.team[getTypeKey(o)].equipment;
	o.movement = hasHeavyWeapon(o) && !e.suspensors ? 4 : 6;
	if (o.subt == "commander") { // commander modifiers
		if (e.dual_weapon && o.weapon == "heavy_bloter") o.weapon = "heavy_bloter_plasma";
		if (e.bionic_arm || e.bionic_hand) o.attack.reroll_melee = true;
		if (e.bionic_eye || e.bionic_hand) o.attack.reroll_range = true;
	} else if (o.subt == "trooper") { // trooper modifiers
		if (e.assault_blades && o.weapon == "bloter") o.weapon = "bloter_blade";
		if (e.blot_pistol && (o.weapon == "bloter" || o.weapon == "bloter_blade")) o.weapon += "_pistol";
		if (e.targeter_1 == getBaseWeapon(o.weapon) || e.targeter_2 == getBaseWeapon(o.weapon)) o.attack.reroll_range = true;
	}
}

function setWeaponAttack(o) { // o = entity
	o.attack = {}; // reset attack
	if (isMarine(o)) setWeaponModifiers(o); // marine only
	let n = o.subt == "gremkin" ? 1 : 2;
	switch (o.weapon) {
		case "unarmed"             : o.attack.melee = [[n, false]]; o.attack.range = null; break;
		case "claw"                : o.attack.melee = [[n, true]]; o.attack.range = null; break;
		case "glove_sword"         : o.attack.melee = [[n, true],[n, false]]; o.attack.range = null; break;
		case "pistol_axe"          : o.attack.melee = [[n, true]]; o.attack.range = [[2, false]]; break;
		case "pistol_knife"        :
		case "gremkin_rifle"       :
		case "bloter"              : o.attack.melee = [[n, false]]; o.attack.range = [[2, false]]; break;
		case "bloter_pistol"       : o.attack.melee = [[n+1, false]]; o.attack.range = [[2, false]]; break;
		case "bloter_blade"        : o.attack.melee = [[n, false]]; o.attack.range = [[2, false]]; o.attack.assault_blade = true; break;
		case "bloter_blade_pistol" : o.attack.melee = [[n+1, false]]; o.attack.range = [[2, false]]; o.attack.assault_blade = true; break;
		case "cyborg_rifle"        : o.attack.melee = [[n, true]]; o.attack.range = [[3, false]]; break;
		case "heavy_bloter"        :
		case "heavy_bloter_plasma" :
		case "plasma_cannon"       :
		case "machine_gun"         :
		case "rocket_launcher"     :
		case "grenade"             : o.attack.melee = [[n, false]]; o.attack.range = [[2, true]]; break;
		case "dual_heavy_smg"      : o.attack.melee = [[2, true], [2, false]]; o.attack.range = [[4, true], [2, false]]; break;
	}
}

function getBaseWeapon(v) { // v = entity or weapon key ; returns string
	if (typeof(v) === "object") v = v.weapon;
	switch (v) {
		case "gremkin_rifle"       :
		case "cyborg_rifle"        :
		case "bloter_pistol"       :
		case "bloter_blade"        :
		case "bloter_blade_pistol" : return "bloter";
		case "heavy_bloter_plasma" : return "heavy_bloter";
		default                    : return v;
	}
}

function hasHeavyWeapon(o) { // o = entity ; returns boolean
	switch (o.weapon) {
		case "machine_gun"         :
		case "rocket_launcher"     :
		case "plasma_cannon"       :
		case "heavy_bloter"        :
		case "heavy_bloter_plasma" : return true;
		default                    : return false;
	}
}

function hasMeleeWeapon(o) { // o = entity ; returns boolean
	return o.weapon == "unarmed" || o.weapon == "claw" || o.weapon == "glove_sword";
}

function hasBlastWeapon(o) { // o = entity ; returns boolean
	return o.weapon == "rocket_launcher" || o.weapon == "grenade" || o.conduct == "bomber";
}

function hasBeamWeapon(o) { // o = entity ; returns boolean
	return o.weapon == "plasma_cannon";
}

function hasChainWeapon(o) { // o = entity ; returns boolean
	return o.weapon == "machine_gun";
}

function hasAttack(l) { // l = attack list, t = attack type ; returns boolean
	if (l != null && l.length > 0) {
		let r = l.length, i;
		for (i in l) if (l[i][0] <= 0) r--;
		return r > 0;
	} return false;
}

////////////////////////////////////////////////////////////////////////////////
// @ Attributes
////////////////////////////////////////////////////////////////////////////////

function setDoorAttributes(o) { // o = entity
	o.armor = 20;
	let opposite = hasAdjacentCellOfValue(game.grid, ti(o.x), ti(o.y), 3, false, true);
	if (opposite) {
		o.opposite = opposite[1];
		o.hidden = false; // doors always visible (unless closed with type -1)
	}
}

function setItemAttributes(o) { // o = entity
	// EMPTY
}

function setMarineAttributes(o) { // o = entity
	let e = game.team[getTypeKey(o)].equipment;
	// 1. Set life
	o.life = o.subt == "commander" ? 6 : 1;
	// 2. Set armor
	o.armor = o.subt == "commander" && e.force_field ? 3 : 2;
	// 3. Set weapon attack(s)
	setWeaponAttack(o);
}

function setAlienAttributes(o) { // o = entity
	// 1. Set attributes
	switch (o.subt) {
		case "gremkin"     : o.movement = 8; o.life = 1; o.armor = 0; o.conduct = "sniper"; o.weapon = "gremkin_rifle"; break;
		case "scrof"       : o.movement = 6; o.life = 1; o.armor = 1; o.conduct = "rusher"; o.weapon = "pistol_knife"; break;
		case "limbo_lw"    : o.movement = 6; o.life = 1; o.armor = 2; o.conduct = "walker"; o.weapon = "bloter"; break;
		case "limbo_hw"    : o.movement = 4; o.life = 1; o.armor = 2; o.conduct = "sniper"; o.weapon = "rocket_launcher"; break;
		case "limbo_cc"    : o.movement = 6; o.life = 3; o.armor = 2; o.conduct = "gunner"; o.weapon = "heavy_bloter"; break;
		case "fleshripper" : o.movement = 8; o.life = 1; o.armor = 3; o.conduct = "rusher"; o.weapon = "claw"; break;
		case "cyborg"      : o.movement = 4; o.life = 1; o.armor = 2; o.conduct = "walker"; o.weapon = "cyborg_rifle"; break;
		case "juggernaut"  : o.movement = 4; o.life = 3; o.armor = 4; o.conduct = "gunner"; o.weapon = "dual_heavy_smg"; break;
	}
	// 2. Set weapon attack(s)
	setWeaponAttack(o);
}

////////////////////////////////////////////////////////////////////////////////
// @ Animations
////////////////////////////////////////////////////////////////////////////////

function getBuffetKey(v) { // v = anim index or anim key ; returns anim key
	if (typeof(v) == "number") {
		switch(v) {
			case 0 : v = "blast"; break;
			default: null;
		}
	} return v;
}

function getBuffetIndex(v) { // v = anim index or anim key
	let n;
	if (typeof(v) == "string") {
		switch(v) {
			case "blast" : n = 0; break;
			default      : n = -1;
		}
	} else n = v;
	return n;
}

function playBuffet(x, y, v) { // x, y = pixel, v = anim index or anim key
	playSound(getBuffetKey(v)); // NEW
	ents.Anim.buffet.start(x, y, getBuffetIndex(v), true);
}

function getEffectKey(v) { // v = anim index or anim key ; returns anim key
	if (typeof(v) == "number") {
		switch(v) {
			case 0 : v = "explode"    ; break;
			case 1 : v = "hit"        ; break;
			case 2 : v = "wound"      ; break;
			case 3 : v = "wound_green"; break;
			case 4 : v = "wound_xeno" ; break;
			case 5 : v = "wound_robot"; break;
			case 6 : v = "reveal"     ; break;
			default: null;
		}
	} return v;
}

function getEffectIndex(v) { // v = anim index or anim key
	let n;
	if (typeof(v) == "string") {
		switch(v) {
			case "explode"     : n = 0; break;
			case "hit"         : n = 1; break;
			case "wound"       : n = 2; break;
			case "wound_green" : n = 3; break;
			case "wound_xeno"  : n = 4; break;
			case "wound_robot" : n = 5; break;
			case "reveal"      : n = 6; break;
			default            : n = -1;
		}
	} else n = v;
	return n;
}

function playEffect(x, y, v) { // x, y = pixel, v = anim index or anim key
	let i, e, k;
	for (i = 0; i < conf.Anim.effect_num; i++) {
		k = leadZero(i + 1);
		e = ents.Anim["effect" + k];
		if (!e.playing) {
			playSound(getEffectKey(v)); // NEW
			e.start(x, y, getEffectIndex(v), true);
			break;
		}
	}
}

function getMuzzleIndex(v) { // v = anim index or anim key
	let n;
	if (typeof(v) == "string") {
		switch(v) {
			case "bullet_line" : n = 0; break;
			case "bullet_diag" : n = 1; break;
			case "rocket_line" : n = 2; break;
			case "rocket_diag" : n = 3; break;
			case "plasma_line" : n = 4; break;
			case "plasma_diag" : n = 5; break;
			default            : n = -1;
		}
	} else n = v;
	return n;
}

function playMuzzle(x, y, v, g) { // x, y = pixel, v = anim index or anim  key, g = angle (radian)
	ents.Anim.muzzle.start(x, y, getMuzzleIndex(v), false, g);
}

function getMeleeAnimation(o) { // o = entity ; returns character animation track identifier
	return hasMeleeWeapon(o) && Math.round(Math.random()) == 0 ? "melee_alt" : "melee";
}

////////////////////////////////////////////////////////////////////////////////
// @ Commands -- DEBUG
////////////////////////////////////////////////////////////////////////////////

function count(t, s) { // t = type (numeric), s = subtype
	let l = pawn, k, j = 0;
	for (k in l) {
		if (isGone(l[k])
		 || (t != null && l[k].type != t)
		 || (s != null && l[k].subt != s)
		) continue;
		else {
			j++;
		}
	} return j;
}

function slaughter(t, s, i) { // t = type (numeric), s = subtype, i = id (exclude clause)
	let l = pawn, k;
	for (k in l) {
		if (isGone(l[k])
		 || (t != null && l[k].type != t)
		 || (s != null && l[k].subt != s)
		 || (i != null && l[k].id == i)
		) continue;
		else {
			l[k].explode();
		}
	}
}

function hide() {
	let l = pawn, k;
	for (k in l) if (!isGone(l[k]) && (isAlien(l[k]) || isItem(l[k]))) l[k].hidden = true;
	term.updateMiniMap();
}

function unhide() {
	let l = pawn, k;
	for (k in l) if (!isGone(l[k]) && (isAlien(l[k]) || isItem(l[k])) && l[k].hidden) l[k].unhide();
	term.updateMiniMap();
}

function conceal() {
	let l = pawn, k;
	for (k in l) if (!isGone(l[k]) && (isAlien(l[k]) || isItem(l[k]))) l[k].conceal();
	term.updateMiniMap();
}

function reveal() {
	let l = pawn, k;
	for (k in l) if (!isGone(l[k]) && (isAlien(l[k]) || isItem(l[k])) && (l[k].hidden || l[k].unseen)) l[k].reveal();
	term.updateMiniMap();
}

// =============================================================================
// -----------------------------------------------------------------------------
// # Entities
// -----------------------------------------------------------------------------
// =============================================================================

/**

	& CLASSES HIERARCHY

	# Class                   Properties                      Properties              Properties              Methods
	# -                       Global                          Local                   Game                    -
		Ents                    id, x, y,                       hidden, spawned         *                       *
		> Text                  fixed, style                    *                       *                       *
		> Reti                  width, height                   *                       *                       *
		> Anim                  width, height, source           *                       *                       *
		> Proj                  slug                            *                       *                       *
		> Rect                  width, height, pattern, color   *                       *                       *
		> Back                  *                               *                       *                       *
		> Pawn                  width, height, type, subt       img, inited             life, armor             leave(), die(), explode(), hit()
			+ Furn                *                               *                       *                       *
				| Door              *                               dir                     *                       *
				| Item              *                               unseen                  *                       *
			+ Char                *                               dir                     *                       *
				| Marine            *                               *                       *                       *
				| Alien             *                               unseen                  *                       *

*/

class Ents {

	//////////////////////////////////////////////////////////////////////////////
	// @ Constructor
	//////////////////////////////////////////////////////////////////////////////

	constructor(id, x, y) {

		// * Global
		this.id = id;
		this.x = x;
		this.y = y;

		// * Local
		this.hidden = true;
		this.spawned = false;

	}

	//////////////////////////////////////////////////////////////////////////////
	// @ Get X
	//////////////////////////////////////////////////////////////////////////////

	getX(b) { // b = tile flag
		return b ? ti(this.x) : this.x;
	}

	//////////////////////////////////////////////////////////////////////////////
	// @ Get Y
	//////////////////////////////////////////////////////////////////////////////

	getY(b) { // b = tile flag
		return b ? ti(this.y) : this.y;
	}

	//////////////////////////////////////////////////////////////////////////////
	// @ Get Tile X
	//////////////////////////////////////////////////////////////////////////////

	getTiX() {
		return this.getX(true);
	}

	//////////////////////////////////////////////////////////////////////////////
	// @ Get Tile Y
	//////////////////////////////////////////////////////////////////////////////

	getTiY() {
		return this.getY(true);
	}

	//////////////////////////////////////////////////////////////////////////////
	// @ Spawn
	//////////////////////////////////////////////////////////////////////////////

	spawn() {
		// * Set spawned
		this.spawned = true;
	}

	//////////////////////////////////////////////////////////////////////////////
	// @ Spawn
	//////////////////////////////////////////////////////////////////////////////

	update() {

		// -------------------------------------------------------------------------
		// * Spawn
		// -------------------------------------------------------------------------

		if (!this.spawned) this.spawn();

	}

}

// =============================================================================
// -----------------------------------------------------------------------------
// # Texts
// -----------------------------------------------------------------------------
// =============================================================================

class Text extends Ents {

	//////////////////////////////////////////////////////////////////////////////
	// @ Constructor
	//////////////////////////////////////////////////////////////////////////////

	constructor(id, x, y, fixed, style) {

		// * Global
		super(id, x, y);

		// * Local
		this.fixed = fixed || false;
		this.style = {
			"size" : typeof(style) !== "undefined" && style.hasOwnProperty("size") ? style.size : conf.Text.size,
			"font" : typeof(style) !== "undefined" && style.hasOwnProperty("font") ? style.font : conf.Text.font,
			"color" : typeof(style) !== "undefined" && style.hasOwnProperty("color") ? style.color : conf.Text.color,
			"align" : typeof(style) !== "undefined" && style.hasOwnProperty("align") ? style.align : conf.Text.align
		};

		// * Variables
		this.str = "";
		this.delay = -1;

	}

	//////////////////////////////////////////////////////////////////////////////
	// @ Update
	//////////////////////////////////////////////////////////////////////////////

	update() {

		super.update();

		// -------------------------------------------------------------------------
		// * Delay
		// -------------------------------------------------------------------------

		if (!this.hidden && this.delay > 0) this.delay--;
		else if (this.delay == 0) this.hidden = true;

		// -------------------------------------------------------------------------
		// * Draw
		// -------------------------------------------------------------------------

		if (!this.hidden) {
			let ctx = scen.context;
			ctx.font = (this.style.size * scen.screen.scale) + "px " + this.style.font;
			ctx.textAlign = this.style.align;
			ctx.fillStyle = this.style.color;
			ctx.fillText(this.str, this.x, this.y);
		}

	}

}

// =============================================================================
// -----------------------------------------------------------------------------
// # Lines
// -----------------------------------------------------------------------------
// =============================================================================

class Line extends Ents {

	//////////////////////////////////////////////////////////////////////////////
	// @ Constructor
	//////////////////////////////////////////////////////////////////////////////

	constructor(id, x, y, style) {

		// * Global
		super(id, x, y);

		// * Local
		this.list = []; // drawn tiles array -- square, line, mosaic and ripple patterns
		this.orig = {"x" : 0, "y" : 0};
		this.dest = {"x" : 0, "y" : 0};
		this.initial = {
			"style" : {
				"mark" : {
					"length" : hasProperty(style, "mark.length") ? style.mark.length : conf.Line.mark.length,
					"width" : hasProperty(style, "mark.width") ? style.mark.width : conf.Line.mark.width,
					"color" : hasProperty(style, "mark.color") ? style.mark.color : conf.Line.mark.color
				},
				"line" : {
					"width" : hasProperty(style, "line.width") ? style.line.width : conf.Line.line.width,
					"color" : hasProperty(style, "line.color") ? style.line.color : conf.Line.line.color
				}
			}
		};
		this.style = {
			"mark" : {
				"length" : this.initial.style.mark.length,
				"width" : this.initial.style.mark.width,
				"color" : this.initial.style.mark.color
			},
			"line" : {
				"width" : this.initial.style.line.width,
				"color" : this.initial.style.line.color
			}
		};

	}

	//////////////////////////////////////////////////////////////////////////////
	// @ Draw
	//////////////////////////////////////////////////////////////////////////////

	draw(x1, y1, x2, y2, l, s) { // x1, y1 = origin (pixel), x2, y2 = destination (pixel), l = path array, s = style (object)
		Object.assign(this.style.mark, this.initial.style.mark); // reassign initial mark style
		Object.assign(this.style.line, this.initial.style.line); // reassign initial line style
		if (s !== undefined) {
			if (s.hasOwnProperty("mark")) Object.assign(this.style.mark, s.mark); // reassign mark style if existing
			if (s.hasOwnProperty("line")) Object.assign(this.style.line, s.line); // reassign line style if existing
		}
		if (Array.isArray(l)) { // path lines
			let n = halfti()
			this.list = l.slice();
			this.orig.x = x1 + n;
			this.orig.y = y1 + n;
			this.dest.x = px(l[l.length - 1].x) + n;
			this.dest.y = px(l[l.length - 1].y) + n;
		} else { // straight line
			this.list = [];
			this.orig.x = x1;
			this.orig.y = y1;
			this.dest.x = x2;
			this.dest.y = y2;
		}
		this.hidden = false;
	}

	//////////////////////////////////////////////////////////////////////////////
	// @ Clear
	//////////////////////////////////////////////////////////////////////////////

	clear() {
		this.hidden = true;
	}

	//////////////////////////////////////////////////////////////////////////////
	// @ Spawn
	//////////////////////////////////////////////////////////////////////////////

	spawn() {
		super.spawn();
	}

	//////////////////////////////////////////////////////////////////////////////
	// @ Update
	//////////////////////////////////////////////////////////////////////////////

	update() {

		super.update();

		// -------------------------------------------------------------------------
		// * Draw
		// -------------------------------------------------------------------------

		if (!this.hidden) {

			// * Get context
			let ctx = scen.context;

			// * Set variables
			let m_l = this.style.mark.length; // mark length
			let m_w = this.style.mark.width; // mark width
			let m_c = this.style.mark.color; // mark color
			let l_w = this.style.line.width; // line width
			let l_c = this.style.line.color; // line color

			// * Draw line(s)
			if (this.list.length > 0) { // path lines
				let i, l = this.list, n = halfti();
				for (i = -1; i < l.length - 1; i++) {
					ctx.beginPath();
					ctx.lineWidth = l_w;
					ctx.strokeStyle = l_c;
					if (i == -1) ctx.moveTo(this.orig.x, this.orig.y);
					else ctx.moveTo(px(l[i].x) + n, px(l[i].y) + n);
					ctx.lineTo(px(l[i+1].x) + n, px(l[i+1].y) + n);
					ctx.stroke();
				}
			} else { // straight line
				ctx.beginPath();
				ctx.lineWidth = l_w;
				ctx.strokeStyle = l_c;
				ctx.moveTo(this.orig.x, this.orig.y);
				ctx.lineTo(this.dest.x, this.dest.y);
				ctx.stroke();
			}

			// * Draw origin mark
			ctx.fillStyle = m_c;
			ctx.fillRect(this.orig.x - m_l, this.orig.y - m_l, m_l * 2, m_l * 2);

			// * Draw destination mark
			ctx.beginPath();
			ctx.lineWidth = m_w;
			ctx.strokeStyle = m_c;
			ctx.moveTo(this.dest.x - m_l, this.dest.y - m_l);
			ctx.lineTo(this.dest.x + m_l, this.dest.y + m_l);
			ctx.moveTo(this.dest.x + m_l, this.dest.y - m_l);
			ctx.lineTo(this.dest.x - m_l, this.dest.y + m_l);
			ctx.stroke();

		}

	}

}

// =============================================================================
// -----------------------------------------------------------------------------
// # Reticles
// -----------------------------------------------------------------------------
// =============================================================================

class Reti extends Ents {

	//////////////////////////////////////////////////////////////////////////////
	// @ Constructor
	//////////////////////////////////////////////////////////////////////////////

	constructor(id, x, y, width, height) {

		// * Global
		super(id, x, y);
		this.width = width;
		this.height = height;
		this.corner = null;
		this.initial = {"width" : width, "height" : height};

		// * Local

		// * Variables
		this.count = 1;
		this.count_forward = true;
	}

	//////////////////////////////////////////////////////////////////////////////
	// @ Show
	//////////////////////////////////////////////////////////////////////////////

	show(x, y, w, h, c) { // x, y, w, h = pixel, c = corner index
		if (w === undefined) w = this.initial.width;
		if (h === undefined) h = this.initial.height;
		if (c === undefined) c = -1;
		this.x = x;
		this.y = y;
		this.width = w;
		this.height = h;
		this.corner = c;
		this.hidden = false;
	}

	//////////////////////////////////////////////////////////////////////////////
	// @ Hide
	//////////////////////////////////////////////////////////////////////////////

	hide() {
		this.hidden = true;
	}

	//////////////////////////////////////////////////////////////////////////////
	// @ Update
	//////////////////////////////////////////////////////////////////////////////

	update() {

		super.update();

		// -------------------------------------------------------------------------
		// * Draw
		// -------------------------------------------------------------------------

		if (!this.hidden) {

			let ctx = scen.context;

			this.count_forward ? this.count++ : this.count--;
			if (this.count_forward && this.count == 64) this.count_forward = false;
			if (!this.count_forward && this.count == 1) this.count_forward = true;

			let b = 2; // lineWidth
			let x = this.x + b / 2;
			let y = this.y + b / 2;
			let w = this.width - b;
			let h = this.height - b;
			let c = 3 - this.corner;
			// let c = this.corner;
			let i;

			// * Borders
			for (i = 1; i <= 4; i++) {
				if (i == 3) continue;
				ctx.beginPath();
				// * Top-Left
				if (c != 0) {
					ctx.moveTo(x, y + (h/(i+2)));
					ctx.lineTo(x, y);
					ctx.lineTo(x + (w/(i+2)), y);
				}
				// * Top-Right
				if (c != 1) {
					ctx.moveTo(x + w, y + (h/(i+2)));
					ctx.lineTo(x + w, y);
					ctx.lineTo(x + w - (w/(i+2)), y);
				}
				// * Bottom-Left
				if (c != 2) {
					ctx.moveTo(x + (w/(i+2)), y + h);
					ctx.lineTo(x, y + h);
					ctx.lineTo(x, y + h - (h/(i+2)));
				}
				// * Bottom-Right
				if (c != 3) {
					ctx.moveTo(x + w - (w/(i+2)), y + h);
					ctx.lineTo(x + w, y + h);
					ctx.lineTo(x + w, y + h - (w/(i+2)));
				}
				ctx.lineCap = "square";
				ctx.lineWidth = b;
				ctx.strokeStyle = "rgba(255," + (160 + i * 16) + ",0," + (0.25 * i)  + ")";
				ctx.stroke();
			}

			// * Bloat Effect
			// x -= Math.sqrt(this.count);
			// y -= Math.sqrt(this.count);
			// w += Math.sqrt(this.count) * 2;
			// h += Math.sqrt(this.count) * 2;

			// * Spike Effect
			b = Math.sqrt(this.count) / 2;

			// * Diagonals
			ctx.beginPath();
			// * Top-Left
			if (c != 0) {
				ctx.moveTo(x + b/2, y + b/2);
				ctx.lineTo(x + b/2 + w/8, y + b/2 + h/8);
			}
			// * Top-Right
			if (c != 1) {
				ctx.moveTo(x - b/2 + w, y + b/2);
				ctx.lineTo(x - b/2 + w - w/8, y + b/2 + h/8);
			}
			// * Bottom-Left
			if (c != 2) {
				ctx.moveTo(x + b/2, y - b/2 + h);
				ctx.lineTo(x + b/2 + w/8, y - b/2 + h - h/8);
			}
			// * Bottom-Right
			if (c != 3) {
				ctx.moveTo(x - b/2 + w, y - b/2 + h);
				ctx.lineTo(x - b/2 + w - w/8, y - b/2 + h - h/8);
			}
			// * Draw
			ctx.lineCap = "square";
			ctx.lineWidth = b / 2;
			ctx.strokeStyle = "rgba(255," + (160 + 64) + ",0," + 1.0 + ")";
			ctx.stroke();

		}

	}

}

// =============================================================================
// -----------------------------------------------------------------------------
// # Animations
// -----------------------------------------------------------------------------
// =============================================================================

class Anim extends Ents {

	//////////////////////////////////////////////////////////////////////////////
	// @ Constructor
	//////////////////////////////////////////////////////////////////////////////

	constructor(id, x, y, width, height, source) {

		// * Global
		super(id, x, y);
		this.width = width;
		this.height = height;
		this.source = source;

		// * Local
		this.img = null;
		this.src_x = 0;
		this.src_y = 0;
		this.angle = null;
		this.length = null; // number of frames in animation
		this.speed = conf.Anim.speed; // each frame is drawn 'speed' times
		this.playing = false;

		// * Variables
		this.count = 0;

	}

	//////////////////////////////////////////////////////////////////////////////
	// @ Start
	//////////////////////////////////////////////////////////////////////////////

	start(x, y, n, b, g) { // x, y = pixel, n = anim index, b = center flag, g = angle (radian)
		if (x != null) {
			this.x = x;
			if (b) this.x += Math.floor((conf.tile.size - this.width) / 2) - (conf.Anim.tile_border ? 2 : 0); // center horizontally
		}
		if (y != null) {
			this.y = y;
			if (b) this.y += Math.floor((conf.tile.size - this.height) / 2) - (conf.Anim.tile_border ? 2 : 0); // center vertically
		}
		this.src_y = (n != null ? n : 0) * this.height;
		this.src_x = 0;
		this.angle = g !== undefined ? g : null;
		this.count = 0;
		this.playing = true;
		this.hidden = false;
	}

	//////////////////////////////////////////////////////////////////////////////
	// @ Stop
	//////////////////////////////////////////////////////////////////////////////

	stop() {
		this.src_x = 0;
		this.count = 0;
		this.playing = false;
		this.hidden = true;
	}

	//////////////////////////////////////////////////////////////////////////////
	// @ Spawn
	//////////////////////////////////////////////////////////////////////////////

	spawn() {
		// * Set image
		this.img = spr.anim[this.source].img;
		// * Calc animation length
		this.length = Math.floor(this.img.width / this.width);
		super.spawn();
	}

	//////////////////////////////////////////////////////////////////////////////
	// @ Update
	//////////////////////////////////////////////////////////////////////////////

	update() {

		super.update();

		// -------------------------------------------------------------------------
		// * Draw
		// -------------------------------------------------------------------------

		if (this.playing) {

			if (!this.hidden && isOnScreen(this, true)) { // not hidden and on outer screen

				// * Set sprite variables
				let x = 0;
				let y = 0;
				let w = this.width;
				let h = this.height;

				// * Get scene context
				let ctx = scen.context;

				// * Get buffer 1 canvas
				let bf1 = scen.buffer1;

				// * Get buffer 1 context
				let bx1 = scen.buffer1_context;

				// * Reset buffer 1 size
				bf1.width = w;
				bf1.height = h;

				// * Rotate sprite on buffer 1
				if (this.angle != null) {
					bx1.translate(w/2, h/2);
					bx1.rotate(this.angle);
					bx1.drawImage(this.img, this.src_x, this.src_y, w, h, w/-2, h/-2, w, h);
				} else {
					bx1.drawImage(this.img, this.src_x, this.src_y, w, h, x, y, w, h);
				}

				// * Draw buffer 1 on scene
				ctx.drawImage(bf1, x, y, w, h, this.x, this.y, w, h);

			}

			// * Check counter
			if (this.count % (this.speed) == 0) this.src_x += this.width; // switch to next frame
			if (this.count == this.speed * this.length) this.stop(); // exit
			this.count++;

		}

	}

}

// =============================================================================
// -----------------------------------------------------------------------------
// # Projectiles
// -----------------------------------------------------------------------------
// =============================================================================

class Proj extends Ents {

	//////////////////////////////////////////////////////////////////////////////
	// @ Constructor
	//////////////////////////////////////////////////////////////////////////////

	constructor(id, x, y, slug) {

		// * Global
		super(id, x, y);
		this.slug = slug;

		// * Local
		this.firing = false; // NEW
		this.quenching = 0;
		this.speed = 0;
		this.add = {"x" : 0, "y" : 0}; // pixel
		this.orig = {"x" : 0, "y" : 0}; // pixel
		this.dest = {"x" : 0, "y" : 0}; // pixel
		this.dist = {"x" : 0, "y" : 0}; // pixel
		this.sign = {"x" : 0, "y" : 0}; // signed integer
		this.bump = {"x" : false, "y" : false, "hit" : false};

		this.tile = {"x" : null, "y" : null}; // NEW

		// * Variable
		this.counter = 0;

	}

	//////////////////////////////////////////////////////////////////////////////
	// @ Fire
	//////////////////////////////////////////////////////////////////////////////

	fire(x1, y1, x2, y2, slug) { // x1, y1 = origin (pixel), x2, y2 = destination (pixel), slug = bullet, rocket or plasma

		// * Reset counter
		this.counter = 1;

		// * Reset flags
		this.bump.x = false;
		this.bump.y = false;
		this.bump.hit = false;

		// * Set slug
		if (slug !== undefined) this.slug = slug;

		// * Set speed
		this.speed = conf.Proj[this.slug].speed;

		// * Set quenching
		this.quenching = Math.round(conf.Proj[this.slug].quenching / conf.scen.frame_rate);

		// * Get adjustment
		let adjust = halfti();

		// * Set origin
		this.orig.x = x1; // center horizontally
		this.orig.y = y1; // center vertically

		// * Set destination
		this.dest.x = x2 + adjust; // center horizontally
		this.dest.y = y2 + adjust; // center vertically

		// * Set distances
		this.dist.x = this.dest.x - this.orig.x;
		this.dist.y = this.dest.y - this.orig.y;

		// * Set signs
		this.sign.x = this.dist.x > 0 ? 1 : -1;
		this.sign.y = this.dist.y > 0 ? 1 : -1;

		// * Adjust speed
		if (this.slug == "bullet") {
			let distance = Math.max(1, ti(getDist(this.orig.x, this.orig.y, this.dest.x, this.dest.y)));
			this.speed = Math.min(distance * conf.Proj.bullet.velocity, this.speed);
		}

		// * Adjust destination
		if (this.slug == "plasma") {
			this.dest.x += this.dist.x != 0 ? adjust * this.sign.x : 0;
			this.dest.y += this.dist.y != 0 ? adjust * this.sign.y : 0;
		}

		// * Set increments
		if (Math.abs(this.dist.x) > Math.abs(this.dist.y)) {
			this.add.x = this.speed * this.sign.x;
			this.add.y = this.dist.y == 0 ? 0 : (this.dist.y / this.dist.x) * this.speed * this.sign.x; // float value
		} else if (Math.abs(this.dist.y) > Math.abs(this.dist.x)) {
			this.add.x = this.dist.x == 0 ? 0 : (this.dist.x / this.dist.y) * this.speed * this.sign.y; // float value
			this.add.y = this.speed * this.sign.y;
		} else {
			this.add.x = this.speed * this.sign.x;
			this.add.y = this.speed * this.sign.y;
		}

		// * Set position
		this.x = this.orig.x;
		this.y = this.orig.y;

		// this.tile.x = ti(this.orig.x); // NEW
		// this.tile.y = ti(this.orig.y); // NEW

		// * Show graphics
		this.hidden = false;

	// * Lock scroll during auto-scroll
		if (conf.scen.scrl.auto_scroll.proj != null) lockScroll();

		this.firing = true; // NEW

	}

	//////////////////////////////////////////////////////////////////////////////
	// @ Quench
	//////////////////////////////////////////////////////////////////////////////

	quench() {

		this.tile.x = null; // NEW
		this.tile.y = null; // NEW
		this.hidden = true;
		this.firing = false; // NEW

		// console.log("projectile finish quenching"); // DEBUG

	}

	//////////////////////////////////////////////////////////////////////////////
	// @ Hit
	//////////////////////////////////////////////////////////////////////////////

	hit() {

		performDamage(); // continue attack

		// * Snap to board after auto-scroll
		if (conf.scen.scrl.auto_scroll.proj == "bound") snapToBoard(-this.sign.x, -this.sign.y); // auto-scroll end

		// * Unlock scroll after auto-scroll
		if (conf.scen.scrl.auto_scroll.proj != null) unlockScroll();

		// console.log("projectile hit"); // DEBUG

	}

	//////////////////////////////////////////////////////////////////////////////
	// @ Update
	//////////////////////////////////////////////////////////////////////////////

	update() {

		super.update();

		// -------------------------------------------------------------------------
		// * Draw
		// -------------------------------------------------------------------------

		if (this.firing) {

			// * Get context
			let ctx = scen.context;

			// * Update horizontal position
			if (!this.bump.x) {
				if (Math.abs(this.dest.x - this.x) < Math.max(conf.Proj.thres, Math.abs(this.add.x))) {
					this.x = this.dest.x; // horizontal destination reached
					this.bump.x = true;
				} else {
					this.x += this.add.x;
				}
			}

			// * Update vertical position
			if (!this.bump.y) {
				if (Math.abs(this.dest.y - this.y) < Math.max(conf.Proj.thres, Math.abs(this.add.y))) {
					this.y = this.dest.y; // vertical destination reached
					this.bump.y = true;
				} else {
					this.y += this.add.y;
				}
			}

			// * Check tile position
			if (ti(this.x) != this.tile.x || ti(this.y) != this.tile.y) { // new tile
				this.tile.x = ti(this.x);
				this.tile.y = ti(this.y);
				if (!this.bump.hit  && this.slug == "plasma") { // plasma damages targets on touch
					let p = hasPoint(game.target, this.tile.x, this.tile.y, true);
					if (p >= 0) {
						let o = game.actor;
						let u = pawn[game.target[p][2]];
						let l = term.roll.attack;
						inflictLethalDamage(o, u, l);
					}
				}
			}

			if (!this.hidden) { // only if not hidden (update even if not on screen)

				// * Update scroll during auto-scroll
				if (!this.bump.hit && conf.scen.scrl.auto_scroll.proj != null) {
					if (conf.scen.scrl.auto_scroll.proj == "center") updateScrollCenter(this);
					else if (conf.scen.scrl.auto_scroll.proj == "bound") updateScrollAtBound(this, true, this.sign.x, this.sign.y);
				}

				// -----------------------------------------------------------------------
				// * Bullet
				// -----------------------------------------------------------------------

				if (this.slug == "bullet") {
					for (let i = 1; i <= conf.Proj.bullet.number; i++) {
						if (!this.bump.hit && i > this.counter / (conf.Proj.bullet.number / this.speed)) break; // firing
						else if (i * (this.quenching / conf.Proj.bullet.number) > this.counter) break; // quenching
						ctx.beginPath();
						ctx.moveTo(this.x, this.y);
						ctx.lineTo(this.x - (this.add.x * i * conf.Proj.bullet.length), this.y - (this.add.y * i * conf.Proj.bullet.length));
						ctx.lineWidth = conf.Proj.bullet.width;
						ctx.lineCap = "round"
						ctx.strokeStyle = "rgba(255,255,255," + (1 / i) + ")";
						ctx.stroke();
					}
				}

				// -----------------------------------------------------------------------
				// * Rocket
				// -----------------------------------------------------------------------

				else if (this.slug == "rocket") {

					let grd, i;
					let blue = 240;
					let alpha = 0.25;
					let factor_x = 0;
					let factor_y = 0;
					let factor_z = 0;
					let size = conf.Proj.rocket.width;
					let dist_x = Math.round(this.dest.x > this.x ? this.dest.x - this.x : this.x - this.dest.x);
					let dist_y = Math.round(this.dest.y > this.y ? this.dest.y - this.y : this.y - this.dest.y);

					if (dist_x > 0) factor_x = Math.abs(dist_x / this.dist.x).toFixed(2); // 1.0 to 0.0
					if (dist_y > 0) factor_y = Math.abs(dist_y / this.dist.y).toFixed(2); // 1.0 to 0.0

					factor_z = Math.max(factor_x, factor_y); // 1.0 to 0.0

					if (dist_x > Math.abs(this.dist.x / 2)
					 || dist_y > Math.abs(this.dist.y / 2)) factor_z = Math.abs(1.0 - factor_z); // 1.0 to 0.5

					size = Math.round(size * conf.Proj.rocket.mult * factor_z);

					// * Head
					if (!this.bump.hit) {
						grd = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, size * 2);
						grd.addColorStop(0, "rgba(255,255,255,1)");
						grd.addColorStop(0.25, "rgba(255,224,64,.875)");
						grd.addColorStop(0.5, "rgba(240,32,0,.75)");
						grd.addColorStop(1, "transparent");
						ctx.beginPath();
						ctx.arc(this.x, this.y, size * 2, 0, 2 * Math.PI);
						ctx.fillStyle = grd;
						ctx.fill();
					}

					// * Tail
					let num = this.bump.hit ? 1 : conf.Proj.rocket.number;
					for (i = 1; i <= num; i++) {
						ctx.beginPath();
						if (!this.bump.hit) { // firing
							blue = Math.min(240, 48 + (32 * i));
							ctx.moveTo(this.x, this.y);
							ctx.lineTo(
								this.orig.x + (this.add.x * this.counter * factor_z * i) / conf.Proj.rocket.number,
								this.orig.y + (this.add.y * this.counter * factor_z * i) / conf.Proj.rocket.number
							);
							ctx.lineWidth = size / i;
						} else { // quenching
							alpha = (0.5 / this.quenching) * this.counter;
							ctx.moveTo(this.orig.x, this.orig.y);
							ctx.lineTo(this.x, this.y);
							ctx.lineWidth = (conf.Proj.rocket.width / this.quenching) * this.counter;
						}
						ctx.lineCap = "round";
						ctx.strokeStyle = "rgba(255,240," + blue + "," + alpha + ")";
						ctx.stroke();
					}

				}

				// -----------------------------------------------------------------------
				// * Plasma
				// -----------------------------------------------------------------------

				else if (this.slug == "plasma") {
					let i, r, g, b, a;
					ctx.beginPath();
					for (let i = 1; i <= conf.Proj.plasma.number; i++) {
						if (!this.bump.hit)
							ctx.moveTo(this.orig.x, this.orig.y);
						else
							ctx.moveTo(
								this.orig.x + ((this.quenching - this.counter) * this.dist.x / this.quenching),
								this.orig.y + ((this.quenching - this.counter) * this.dist.y / this.quenching)
							);
						ctx.lineTo(this.x, this.y );
						ctx.lineWidth = conf.Proj.plasma.width * (conf.Proj.plasma.number - i + 1);
						ctx.lineCap = "round"
						r = (conf.Proj.plasma.rgba[0] + (255 - conf.Proj.plasma.rgba[0]) / conf.Proj.plasma.number * i)
						g = (conf.Proj.plasma.rgba[1] + (255 - conf.Proj.plasma.rgba[1]) / conf.Proj.plasma.number * i)
						b = (conf.Proj.plasma.rgba[2] + (255 - conf.Proj.plasma.rgba[2]) / conf.Proj.plasma.number * i)
						a = (conf.Proj.plasma.rgba[3] + conf.Proj.plasma.rgba[3] / conf.Proj.plasma.number * i)
						ctx.strokeStyle = "rgba(" + r + "," + g + "," + b + "," + a + ")";
						ctx.stroke();
					}
				}

				// -----------------------------------------------------------------------

			}

			// * Quenched
			if (this.bump.hit && this.counter == 0) this.quench();

			// * Fired
			else if (this.bump.x && this.bump.y) {

				if (!this.bump.hit) { // hit

					this.hit();
					this.bump.hit = true;
					this.counter = this.quenching; // fixed value

				} else { // quenching
					this.counter--;
				}

			} else { // firing
				this.counter++;
			}

		}

	}

}

// =============================================================================
// -----------------------------------------------------------------------------
// # Rectangles
// -----------------------------------------------------------------------------
// =============================================================================

/**

	& RECTANGLES PATTERNS

	> "slab" for generic 'block' pattern (i.e. point)
	> "square" for specific 'blast' pattern (embed non singleton code)
	> "line" for specific 'beam' pattern (embed non singleton code)
	> "mosaic" for generic 'puzzle' pattern (i.e. list)
	> "ripple" for specific 'scan' pattern (embed non singleton code)

*/

class Rect extends Ents {

	//////////////////////////////////////////////////////////////////////////////
	// @ Constructor
	//////////////////////////////////////////////////////////////////////////////

	constructor(id, x, y, width, height, pattern, color) {

		// * Global
		super(id, x, y);
		this.width = width;
		this.height = height;

		// * Local
		this.pattern = pattern; // shape -- slab, square, line, mosaic or ripple
		this.fill = color; // color -- slab, square, line and mosaic patterns
		this.list = []; // drawn tiles array -- square, line, mosaic and ripple patterns
		this.heap = []; // limit tiles array -- square and line patterns
		this.radius = 0; // wave length -- ripple pattern

		// * Variables
		this.count_backward = false;
		this.count = 1;

	}

	//////////////////////////////////////////////////////////////////////////////
	// @ Set Slab
	//////////////////////////////////////////////////////////////////////////////

	setSlab(h) { // h = heap
		this.clear();
		this.pattern = "slab";
		this.hidden = false;
	}

	//////////////////////////////////////////////////////////////////////////////
	// @ Reset Square
	//////////////////////////////////////////////////////////////////////////////

	resetSquare(p) { // p = selected point override
		let i, j, c;
		let f = Array.isArray(p);
		let x = f ? p[0] : ti(this.x);
		let y = f ? p[1] : ti(this.y);
		this.list = [];
		if (hasPoint(this.heap, x, y)) { // list over heap
			for (i = -1; i <= 1; i++) {
				for (j = -1; j <= 1; j++) {
					c = game.grid[x + i][y + j];
					if (isVoid(c[0]) || isWall(c[0])) continue; // void or wall (closed door included ; assumed undestructible but targettable)
					if (i == 0 && j == 0) this.list.unshift([x + i, y + j, true]); // first value
					else this.list.push([x + i, y + j, false]);
				}
			}
		} else { // list out of heap
			this.list.push([ti(this.x), ti(this.y), null]);
		}
	}

	//////////////////////////////////////////////////////////////////////////////
	// @ Set Square
	//////////////////////////////////////////////////////////////////////////////

	setSquare(h, p) { // h = heap, p = selected point override
		this.clear();
		this.pattern = "square";
		this.heap = h;
		this.resetSquare(p);
		this.hidden = false;
	}

	//////////////////////////////////////////////////////////////////////////////
	// @ Reset Line
	//////////////////////////////////////////////////////////////////////////////

	resetLine(p) { // p = selected point override
		let dir, n, q;
		let f = Array.isArray(p);
		let x = f ? p[0] : ti(this.x);
		let y = f ? p[1] : ti(this.y);
		this.list = [];
		q = hasPoint(this.heap, x, y, true);
		if (q >= 0) { // point over heap
			// * Get selected line
			dir = this.heap[q][2];
			// * Get tile in line
			for (n in this.heap) {
				if (this.heap[n][2] == dir) this.list.push(this.heap[n]);
			}
		} else { // point out of heap
			this.list.push([ti(this.x), ti(this.y), null]);
		}
	}

	//////////////////////////////////////////////////////////////////////////////
	// @ Set Line
	//////////////////////////////////////////////////////////////////////////////

	setLine(h, p) { // h = heap, p = selected point override
		this.clear();
		this.pattern = "line";
		this.heap = h;
		this.resetLine(p);
		this.hidden = false;
	}

	//////////////////////////////////////////////////////////////////////////////
	// @ Draw
	//////////////////////////////////////////////////////////////////////////////

	draw(l, s, b) { // l = point list, s = color string, b = update minimap flag
		// * Set properties
		if (l !== undefined) this.list = l;
		if (s !== undefined) this.fill = conf.color.board[s];
		// * Show
		this.hidden = false;
		// * Update minimap
		if (b) term.updateMiniMap(l, s !== undefined ? conf.color.mini[s] : null);
	}

	//////////////////////////////////////////////////////////////////////////////
	// @ Clear
	//////////////////////////////////////////////////////////////////////////////

	clear() {
		// * Reset counters
		this.count_backward = false;
		this.count = 1;
		// * Clear arrays
		this.list = [];
		this.heap = [];
		// * Hide
		this.hidden = true;
		// * Reset minimap
		term.updateMiniMap();
	}

	//////////////////////////////////////////////////////////////////////////////
	// @ Update
	//////////////////////////////////////////////////////////////////////////////

	update() {

		super.update();

		// -------------------------------------------------------------------------
		// * Draw
		// -------------------------------------------------------------------------

		if (!this.hidden) {

			let ctx = scen.context;
			let x, y, w, h;
			let border = conf.Rect.tile_border ? 2 : 0; // tile border

			// ***********************************************************************
			// * Slab
			// ***********************************************************************

			if (this.pattern == "slab") {

				let b = 0; // line width

				// * Pulse Effect
				// this.count_backward ? this.count-- : this.count++;
				// if (!this.count_backward && this.count == 128) this.count_backward = true;
				// if (this.count_backward && this.count == 1) this.count_backward = false;
				// * Border
				// x = this.x + b / 2;
				// y = this.y + b / 2;
				// w = this.width - b;
				// h = this.height - b;
				// * No Border
				x = this.x + b;
				y = this.y + b;
				w = this.width - b * 2;
				h = this.height - b * 2;

				// * Pulse effect
				// ctx.fillStyle = "rgba(255,240,96," + (0.5 + (this.count / 512)) + ")"; // 0.5 to 0.75
				// * Border
				// ctx.beginPath();
				// ctx.lineWidth = b;
				// ctx.strokeStyle = "rgba(255,255,255,.875)";
				// ctx.rect(x, y, w, h);
				// ctx.stroke();
				// * No border
				ctx.fillStyle = this.fill;
				ctx.fillRect(x, y, w - border, h - border);

			// ***********************************************************************
			// * Square
			// ***********************************************************************

			} else if (this.pattern == "square") {
				let n, a = this.list;
				for (n in a) {
					ctx.fillStyle = conf.color.board[a[n][2] == null ? conf.Rect.hilite_blank ? "hilite_blank" : "transparent" : a[n][2] ? "square_center" : "square_edge"];
					ctx.fillRect(px(a[n][0]), px(a[n][1]), this.width - border, this.height - border);
				}

			// ***********************************************************************
			// * Line
			// ***********************************************************************

			} else if (this.pattern == "line") {
				let n, a = this.list;
				for (n in a) {
					ctx.fillStyle = conf.color.board[a[n][2] == null ? conf.Rect.hilite_blank ? "hilite_blank" : "transparent" : "line"];
					ctx.fillRect(px(a[n][0]), px(a[n][1]), this.width - border, this.height - border);
				}

			// ***********************************************************************
			// * Mosaic (draw move range, draw target range)
			// ***********************************************************************

			} else if (this.pattern == "mosaic") {
				let a, i;
				a = this.list;
				ctx.fillStyle = this.fill;
				for (i = 0; i < a.length; i++) {
					if (Number.isNaN(a[i][2]) || a[i][2] <= 0) continue;
					x = px(a[i][0]);
					y = px(a[i][1]);
					w = h = px(1);
					if (isRectOnScreen(x, y, w, h, true)) ctx.fillRect(x, y, w - border, h - border);
				}

			// ***********************************************************************
			// * Ripple (draw scan range)
			// ***********************************************************************

			} else if (this.pattern == "ripple") {

				let rate = conf.Rect.ripple_speed;
				let k, n, a, l, c;

				a = this.list;
				l = [];

				for (k = 0; k < a.length; k++) {

					if (!this.count_backward && k >= this.count / rate) break;
					else if (this.count_backward && this.radius - k >= this.count / rate) continue;

					if (k % 2 == 0) ctx.fillStyle = conf.color.board.scan_even;
					else ctx.fillStyle = conf.color.board.scan_odd;

					for (n in a[k]) {

						// * Feed minimap update list (obstruct all tiles)
						l.push([a[k][n][0], a[k][n][1]]);

						// * Get grid cell
						c = game.grid[a[k][n][0]][a[k][n][1]];

						// * Check invisible entities
						if (!a[k][n][2]) { // not has been run
							if ((isItem(c[0]) || isAlien(c[0])) && pawn[c[1]].hidden) pawn[c[1]].unhide(); // NEW
							a[k][n][2] = true; // set run flag
						}

						// * Draw tile on floor (including docks and spawns) and under any bleep
						if (c[0] <= 0 || ((isItem(c[0]) || isAlien(c[0])) && pawn[c[1]].unseen))
							ctx.fillRect(px(a[k][n][0]), px(a[k][n][1]), px(1) - border, px(1) - border);

					}

				}

				// * Check counter
				if (!this.count_backward && this.count == this.radius * rate) this.count_backward = true;
				if (this.count_backward && this.count == 1) { // end
					if (this.pattern == "ripple") stopScan(); // NEW VERY TEMP
					else this.clear(); // reset
				} else {
					term.updateMiniMap(l, conf.color.mini.scan);
				}

				// * Update counter
				this.count_backward ? this.count-- : this.count++;

			}

		}

	}

}

// =============================================================================
// -----------------------------------------------------------------------------
// # Backgrounds
// -----------------------------------------------------------------------------
// =============================================================================

class Back extends Ents {

	//////////////////////////////////////////////////////////////////////////////
	// @ Constructor
	//////////////////////////////////////////////////////////////////////////////

	constructor(id, x, y) {

		// * Global
		super(id, x, y);

		// * Local
		this.img = null;

	}

	//////////////////////////////////////////////////////////////////////////////
	// @ Spawn
	//////////////////////////////////////////////////////////////////////////////

	spawn() {
		// * Set image
		this.img = spr.back.board.img;
		super.spawn();
	}

	//////////////////////////////////////////////////////////////////////////////
	// @ Update
	//////////////////////////////////////////////////////////////////////////////

	update() {

		super.update();

		// -------------------------------------------------------------------------
		// * Draw
		// -------------------------------------------------------------------------

		// * Get context
		let ctx = scen.context;

		// * Draw bitmap
		ctx.drawImage(this.img, this.x, this.y);

	}

}

// =============================================================================
// -----------------------------------------------------------------------------
// # Pawns
// -----------------------------------------------------------------------------
// =============================================================================

class Pawn extends Ents {

	//////////////////////////////////////////////////////////////////////////////
	// @ Constructor
	//////////////////////////////////////////////////////////////////////////////

	constructor(id, x, y, type, subt) {

		// * Global
		super(id, x, y);
		this.width = 0;
		this.height = 0;
		this.type = type;
		this.subt = subt;

		// * Local
		this.img = null;
		this.inited = false;
		this.unseen = true;

		// * Game
		this.life = 1;
		this.armor = 0;

		// * Plinth
		this.plinth = null; // {"width" : tile, "height" : tile}
		this.corner = null; // [0 [x,y]] => [index [tile,tile]]

		// * Position
		this.last_tile = [ti(this.x), ti(this.y), [0, null]]; // hovered cell

		// * Graphics
		this.color = {"major" : null, "minor" : null, "third" : null}; // bitmap color scheme

		// * Audio
		this.audio = null; // NEW : audio player id

	}

	//////////////////////////////////////////////////////////////////////////////
	// @ Get X
	//////////////////////////////////////////////////////////////////////////////

	getX(b) { // b = tile flag
		let x = hasFourTiles(this) && this.corner != null ? px(this.corner[1][0]) : this.x;
		return b ? ti(x) : x;
	}

	//////////////////////////////////////////////////////////////////////////////
	// @ Get Y
	//////////////////////////////////////////////////////////////////////////////

	getY(b) { // b = tile flag
		let y = hasFourTiles(this) && this.corner != null ? px(this.corner[1][1]) : this.y;
		return b ? ti(y) : y;
	}

	//////////////////////////////////////////////////////////////////////////////
	// @ Reset Position
	//////////////////////////////////////////////////////////////////////////////

	resetPosition() {
		game.grid[this.last_tile[0]][this.last_tile[1]] = this.last_tile[2]; // recall last tile
	}

	//////////////////////////////////////////////////////////////////////////////
	// @ Set Position
	//////////////////////////////////////////////////////////////////////////////

	setPosition() {
		this.last_tile = [ti(this.x), ti(this.y), game.grid[ti(this.x)][ti(this.y)]]; // register last tile (which is current tile actually)
		game.grid[ti(this.x)][ti(this.y)] = [this.type, this.id]; // update grid
	}

	//////////////////////////////////////////////////////////////////////////////
	// @ Update Position
	//////////////////////////////////////////////////////////////////////////////

	updatePosition() {
		this.resetPosition();
		this.setPosition();
	}

	//////////////////////////////////////////////////////////////////////////////
	// @ Teleport
	//////////////////////////////////////////////////////////////////////////////

	teleport(x, y, b, t) { // x, y = tile, b = blind flag (no reveal, no center), t = transfer flag (no reset position)
		let f;
		if (isCellEmpty(game.grid[x][y])) { // floor or opened door only
			if (hasFocus(this)) f = true;
			if (isTileOnBoard(this.x, this.y)) this.resetPosition(); // recall last tile
			this.x = px(x);
			this.y = px(y);
			if (isTileOnBoard(x, y)) { // on board only
				t ? this.setPosition() : this.updatePosition(); // update grid
				if (this instanceof Marine) this.updateSight();
			}
			if (!b) {
				if (f) setFocus(this);
				if (!isOnScreen(this)) centerToPixel(this.x, this.y);
				if (this.hidden || this.unseen) this.reveal(true); // also update minimap
			}
		} else {
			console.log("[" + this.id + "] cannot be teleported to occupied tile (" + x + "," + y + ")");
		}
	}

	//////////////////////////////////////////////////////////////////////////////
	// @ Reset Corner
	//////////////////////////////////////////////////////////////////////////////

	resetCorner() {
		if (hasFourTiles(this)) {
			this.corner = [0, [ti(this.x), ti(this.y)]];
		}
	}

	//////////////////////////////////////////////////////////////////////////////
	// @ Set Corner
	//////////////////////////////////////////////////////////////////////////////

	setCorner(x, y, c) { // x, y = tile, c = corner index
		if (hasFourTiles(this)) {
			let f = false;
			let base_x = ti(this.x);
			let base_y = ti(this.y);
			if (Number.isInteger(x) && Number.isInteger(y)) {
				if (x - base_x == 0) c = y - base_y == 0 ? 0 : y - base_y == 1 ? 2 : -1; // 0 or 2
				else if (x - base_x == 1) c = y - base_y == 0 ? 1 : y - base_y == 1 ? 3 : -1; // 1 or 3
				if (c >= 0) this.corner = [c, [x, y]];
				else f = true;
			} else if (c >= 0 && c < 4) {
				switch(c) {
					case 0 : x = 0; y = 0; break;
					case 1 : x = 1; y = 0; break;
					case 2 : x = 0; y = 1; break;
					case 3 : x = 1; y = 1; break;
				}
				this.corner = [c, [base_x + x, base_y + y]];
			} else f = true;
			if (f) {
				this.resetCorner();
				console.log("[" + this.id + "] cannot find corner (" + x + "," + y + ") ; corner reset to base"); // DEBUG
			}
		}
	}

	//////////////////////////////////////////////////////////////////////////////
	// @ Hide
	//////////////////////////////////////////////////////////////////////////////

	hide(b) { // b = update minimap flag
		// * Hide
		this.hidden = true;
		// * Update minimap
		if (b) term.updateMiniMap();
		console.log("[" + this.id + "] hidden"); // DEBUG
	}

	//////////////////////////////////////////////////////////////////////////////
	// @ Unhide
	//////////////////////////////////////////////////////////////////////////////

	unhide(b) { // b = update minimap flag
		// * Unhide
		this.hidden = false;
		// * Play sound effect
		playSound("unhide"); // NEW
		// * Update minimap
		if (b) term.updateMiniMap();
		console.log("[" + this.id + "] spotted"); // DEBUG
	}

	//////////////////////////////////////////////////////////////////////////////
	// @ Conceal
	//////////////////////////////////////////////////////////////////////////////

	conceal(b) { // b = update minimap flag
		// * Conceal
		this.unseen = true;
		// * Update minimap
		if (b) term.updateMiniMap();
		console.log("[" + this.id + "] concealed"); // DEBUG
	}

	//////////////////////////////////////////////////////////////////////////////
	// @ Reveal
	//////////////////////////////////////////////////////////////////////////////

	reveal(b, s) { // b = update minimap flag, s = entity id
		// * Reveal
		this.unseen = false;
		this.hidden = false;
		// * Update minimap
		if (b) term.updateMiniMap();
		// * Play animation effect
		// playEffect(this.x, this.y, "reveal"); // DEPRECATED
		console.log("[" + this.id + "] revealed" + (s !== undefined ? " by [" + s + "]" : "")); // DEBUG
	}

	//////////////////////////////////////////////////////////////////////////////
	// @ Leave (area)
	//////////////////////////////////////////////////////////////////////////////

	leave() {
		// * Unset focus
		if (hasFocus(this)) unsetFocus();
		// * Hide sprite
		this.hidden = true;
		// * Put out of area
		this.x = scen.area.out_x;
		this.y = scen.area.out_y;
		// * Restore grid cell
		this.resetPosition();
		// * Update minimap
		term.updateMiniMap();
	}

	//////////////////////////////////////////////////////////////////////////////
	// @ Die
	//////////////////////////////////////////////////////////////////////////////

	die() {
		// * Set life to zero
		this.life = 0;
		// * Leave area
		this.leave();
	}

	//////////////////////////////////////////////////////////////////////////////
	// @ Explode
	//////////////////////////////////////////////////////////////////////////////

	explode() {
		let x = this.x;
		let y = this.y;
		if (hasFourTiles(this)) {
			x += halfti();
			y += halfti();
		}
		playEffect(x, y, "explode");
		this.die();
	}

	//////////////////////////////////////////////////////////////////////////////
	// @ Hit
	//////////////////////////////////////////////////////////////////////////////

	hit(b) { // b = wound flag
		let s = "hit";
		if (b) {
			s = "wound";
			if (isGreen(this)) s += "_green";
			else if (isXeno(this)) s += "_xeno";
			else if (isRobot(this)) s += "_robot";
		}
		playEffect(this.getX(), this.getY(), s);
	}

	//////////////////////////////////////////////////////////////////////////////
	// @ Play Sound
	//////////////////////////////////////////////////////////////////////////////

	playSound(k, b) { // k = sound key, b = loop flag
		this.audio = playSound(k, b); // NEW
	}

	//////////////////////////////////////////////////////////////////////////////
	// @ Stop Sound
	//////////////////////////////////////////////////////////////////////////////

	stopSound() {
		stopSound(this.audio);
		this.audio = null; // NEW
	}

	//////////////////////////////////////////////////////////////////////////////
	// @ Initialize
	//////////////////////////////////////////////////////////////////////////////

	init() {
		// * Set plinth
		this.plinth = getPlinth(this.subt); // TEMP
		this.setPosition();
		this.inited = true;
	}

}
