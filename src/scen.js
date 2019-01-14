/*

	scen.js

*/

// =============================================================================
// -----------------------------------------------------------------------------
// # Module
// -----------------------------------------------------------------------------
// =============================================================================

var scen = {

	//////////////////////////////////////////////////////////////////////////////
	// @ Canvas
	//////////////////////////////////////////////////////////////////////////////

	"canvas" : null,
	"buffer1" : null,
	"buffer2" : null,
	"context" : null,
	"buffer1_context" : null,
	"buffer2_context" : null,

	//////////////////////////////////////////////////////////////////////////////
	// @ Frame
	//////////////////////////////////////////////////////////////////////////////

	"frame_anim" : null,
	"frame_count" : null,

	//////////////////////////////////////////////////////////////////////////////
	// @ Timer
	//////////////////////////////////////////////////////////////////////////////

	"timer" : {}, // scrl, shake, noise, roll_x, roll, reroll, attack, attack_def, attack_end, marine_quit, turn_prompt, choice, report, alien_event_n, alien_event, alien_reinforcement, mouse_accel

	//////////////////////////////////////////////////////////////////////////////
	// @ FPS
	//////////////////////////////////////////////////////////////////////////////

	"fps" : {
		"delta" : 0,
		"count" : 0,
		"temp" : 0,
		"last" : 0,
		"val" : 0
	},

	//////////////////////////////////////////////////////////////////////////////
	// @ Screen
	//////////////////////////////////////////////////////////////////////////////

	"screen" : { // coord of current screen camera/view (can be negative)
		"x" : 0,
		"y" : 0,
		"width" : 0,
		"height" : 0,
		"scale" : 1.0
	},

	//////////////////////////////////////////////////////////////////////////////
	// @ Area
	//////////////////////////////////////////////////////////////////////////////

	"area" : {
		"min_x" : 0,
		"min_y" : 0,
		"max_x" : 0,
		"max_y" : 0,
		"out_x" : 0,
		"out_y" : 0
	},

	//////////////////////////////////////////////////////////////////////////////
	// @ Widgets
	//////////////////////////////////////////////////////////////////////////////

	"hint" : {
		"timeout" : null
	},

	"icon" : {
		"last" : null
	},

	//////////////////////////////////////////////////////////////////////////////
	// @ Transmission
	//////////////////////////////////////////////////////////////////////////////

	"transmission" : {
		"active" : false
	},

	//////////////////////////////////////////////////////////////////////////////
	// @ Mouse
	//////////////////////////////////////////////////////////////////////////////

	"mouse" : {
		"x" : 0,
		"y" : 0,
		"tile_x" : -1,
		"tile_y" : -1,
		"hover" : false,
		"hold" : false,
		"down" : false,
		"up" : false,
	},

	//////////////////////////////////////////////////////////////////////////////
	// @ Scroll
	//////////////////////////////////////////////////////////////////////////////

	"scrl" : {
		"locked" : 0,
		"snap" : false,
		"delayed" : {
			"active" : false,
			"swift_x" : 0,
			"swift_y" : 0
		},
		"mouse" : {
			"ready" : false,
			"active" : false,
			"forced" : false,
			"swift_x" : 0,
			"swift_y" : 0,
			"accel" : 0, // float
		}
	},

	//////////////////////////////////////////////////////////////////////////////
	// @ Zoom
	//////////////////////////////////////////////////////////////////////////////

	"zoom" : {
		"locked" : 0,
		"time" : 0,
		"last" : {
			"x" : 0,
			"y" : 0,
			"width" : 0,
			"height" : 0
		}
	},

	//////////////////////////////////////////////////////////////////////////////
	// @ Start
	//////////////////////////////////////////////////////////////////////////////

	"start" : function() {

		// * Set canvas
		this.canvas = document.createElement("canvas");
		this.buffer1 = document.createElement("canvas");
		this.buffer2 = document.createElement("canvas");

		// * Set scene id
		this.canvas.id = "view";

		// * Set scene size
		this.canvas.width = conf.scen.canvas.width;
		this.canvas.height = conf.scen.canvas.height;

		// * Define contexts
		this.context = this.canvas.getContext("2d");
		this.buffer1_context = this.buffer1.getContext("2d");
		this.buffer2_context = this.buffer2.getContext("2d");

		// * Set image smoothing (i.e. anti-aliasing)
		this.context.imageSmoothingEnabled = conf.scen.canvas.smooth;
		// this.buffer1_context.imageSmoothingEnabled = conf.scen.canvas.smooth; // USELESS
		// this.buffer2_context.imageSmoothingEnabled = conf.scen.canvas.smooth; // USELESS

		// * Insert scene canvas
		document.getElementById("scene").appendChild(this.canvas);

		// * Define screen
		scen.screen.width = scen.canvas.width;
		scen.screen.height = scen.canvas.height;

		// * Define area
		resizeArea();
		scen.area.out_x = scen.area.max_x * -10;
		scen.area.out_y = scen.area.max_y * -10;

		// * Attach events
		this.canvas.addEventListener("mouseenter", function() {
			scen.mouse.hover = true;
		});
		this.canvas.addEventListener("mouseleave", function() {
			if (!scen.scrl.mouse.active && main.cursor.state == "grab") updateCursorState("pointer");
			scen.mouse.hover = false;
		});
		this.canvas.addEventListener("mousedown", function(e) {
			if (!main.pause && e.button == 0) scen.mouse.down = true; // left mouse button
		});
		document.addEventListener("mouseup", function() { // WARNING : event attached to document and not element
			scen.mouse.up = true;
		});
		this.canvas.addEventListener("mousemove", function(e) {
			scen.mouse.x = e.clientX;
			scen.mouse.y = e.clientY;
		});

		// * Init frame counter
		this.frame_count = 0;

		// * Init frame loop
		this.frame_anim = window.requestAnimationFrame(this.update);

	},

	//////////////////////////////////////////////////////////////////////////////
	// @ Stop
	//////////////////////////////////////////////////////////////////////////////

	"stop" : function() {

		// * Clear frame loop
		window.cancelAnimationFrame(scen.frame_anim)

	},

	//////////////////////////////////////////////////////////////////////////////
	// @ Continue
	//////////////////////////////////////////////////////////////////////////////

	"continue" : function() {

		// * Restart frame loop
		this.frame_anim = window.requestAnimationFrame(this.update);

	},

	//////////////////////////////////////////////////////////////////////////////
	// @ Fade
	//////////////////////////////////////////////////////////////////////////////

	"fade" : function(s) { // s = fade direction (in or out ; null for reset)
		function fade() { scen.canvas.style.opacity = s == "out" ? "0" : "1" }
		this.canvas.style.pointerEvents = s == "out" ? "none" : "";
		this.canvas.style.animationName = s == null ? "" : "fade" + s;
		this.canvas.style.animationDuration = s == null ? "" : conf.scen.fade.duration + "ms";
		this.canvas.style.animationTimingFunction = s == null ? "" : "ease-" + s;
		this.canvas.style.animationPlayState = s == null ? "" : "running";
		if (s != null) this.canvas.addEventListener("animationend", fade);
		else {
			this.canvas.removeEventListener("animationend", fade);
			this.canvas.style.opacity = "";
		}
	},

	//////////////////////////////////////////////////////////////////////////////
	// @ Clear
	//////////////////////////////////////////////////////////////////////////////

	"clear" : function() {

		// * Clear screen
		this.context.clearRect(scen.screen.x, scen.screen.y, scen.screen.width, scen.screen.height);

	},

	//////////////////////////////////////////////////////////////////////////////
	// @ Update
	//////////////////////////////////////////////////////////////////////////////

	"update" : function() {

		let k;

		// * Check save
		if (main.save.pending && !main.save.prevented) saveGame(main.save.savekey);

		// * Update frame counter
		scen.frame_count += 1;

		// * Update timers
		for (k in scen.timer) checkFrameTimeout(k);

		// * Update mouse
		updateMouse();

		// * Update texts
		updateTexts();

		// * Clear screen
		scen.clear();

		// * Redraw entities
		for (k in ents.Back) ents.Back[k].update();
		for (k in ents.Rect) ents.Rect[k].update();
		for (k in pawn) {
			if ((game.actor != null && k == game.actor.id)
			 || (game.cover != null && k == game.cover.id)) continue;
			pawn[k].update();
		}
		if (game.actor != null && game.actor instanceof Char) game.actor.update(); // TEMP
		if (game.cover != null && game.cover instanceof Char) game.cover.update(); // TEMP
		for (k in ents.Proj) ents.Proj[k].update();
		for (k in ents.Anim) ents.Anim[k].update();
		for (k in ents.Reti) ents.Reti[k].update();
		for (k in ents.Line) ents.Line[k].update();
		for (k in ents.Text) ents.Text[k].update();

		// * Update miniscope
		term.updateMiniScope(); // TEMP -- done each frame

		// * Update minimap
		if (scen.frame_count == 1 || term.minimap.update.pending) {
			term.drawMiniMap();
		}

		// * Request animation frame
		scen.frame_anim = window.requestAnimationFrame(scen.update);

	}

};

// =============================================================================
// -----------------------------------------------------------------------------
// # Frames
// -----------------------------------------------------------------------------
// =============================================================================

function getFPS() {
	scen.fps.delta = (Date.now() - scen.fps.last) / 1000; // return number of seconds elapsed since last call
	scen.fps.last = Date.now();
	scen.fps.temp += Math.floor(1 / scen.fps.delta);
	scen.fps.count++;
	if (scen.fps.count == conf.scen.fps.delay) {
		scen.fps.val = Math.floor(scen.fps.temp / conf.scen.fps.delay);
		scen.fps.temp = 0;
		scen.fps.count = 0;
	}
	return scen.fps.val;
}

/*
function isFrameInterval(i) {
	if (scen.frame_count % i == 0) return true;
}
*/

// =============================================================================
// -----------------------------------------------------------------------------
// # Frame Timers
// -----------------------------------------------------------------------------
// =============================================================================

function setFrameTimeout(key, time, func) {
	scen.timer[key] = {"type" : "timeout", "time" : time, "func" : func};
}

function clearFrameTimeout(key) {
	delete scen.timer[key];
}

function setFrameInterval(key, time, func) {
	scen.timer[key] = {"type" : "interval", "time" : time, "func" : func, "init" : time};
}

function clearFrameInterval(key) {
	delete scen.timer[key];
}

function checkFrameTimeout(key) {
	if (scen.timer[key].time == 0) {
		scen.timer[key].func();
		if (scen.timer[key] === undefined) return; // timer cleared during function execution
		else if (scen.timer[key].type == "timeout") clearFrameTimeout(key);
		else if (scen.timer[key].type == "interval") scen.timer[key].time = scen.timer[key].init;
	} else {
		scen.timer[key].time--;
	}
}

// =============================================================================
// -----------------------------------------------------------------------------
// # Area
// -----------------------------------------------------------------------------
// =============================================================================

function resizeArea() {
	let w = Math.ceil(scen.screen.width / 2 / conf.tile.size) * conf.tile.size; // margin ; half-screen width rounded up
	let h = Math.ceil(scen.screen.height / 2 / conf.tile.size) * conf.tile.size; // margin ; half-screen height rounded up
	scen.area.max_x = conf.board.width * conf.tile.size + w;
	scen.area.max_y = conf.board.height * conf.tile.size + h;
	scen.area.min_x = 0 - w;
	scen.area.min_y = 0 - h;
}

// =============================================================================
// -----------------------------------------------------------------------------
// # Widgets
// -----------------------------------------------------------------------------
// =============================================================================

////////////////////////////////////////////////////////////////////////////////
// @ Hint
////////////////////////////////////////////////////////////////////////////////

function showHint(s) { // s = string
	if (main.ready) {
		let o = document.getElementById("hint");
		o.removeEventListener("transitionend", hideHint);
		o.style.opacity = "1";
		o.style.display = "";
		o.innerHTML = s;
		clearTimeout(scen.hint.timeout);
		scen.hint.timeout = setTimeout(function() {
			o.style.opacity = "0";
			o.addEventListener("transitionend", hideHint);
		}, conf.scen.hint.delay);
	}
}

function hideHint() {
	document.getElementById("hint").style.display = "none";
}

////////////////////////////////////////////////////////////////////////////////
// @ Icon
////////////////////////////////////////////////////////////////////////////////

function showIcon(s) { // s = icon id
	scen.icon.last = null;
	let q = document.getElementById("icon");
	q.classList.add("active");
	q.querySelectorAll("g").forEach(function(e) {
		if (e.id == "icon_" + s) {
			e.setAttribute("display", "initial");
		} else {
			if (e.getAttribute("display") == "initial") scen.icon.last = e.id;
			e.setAttribute("display", "none");
		}
	});
}

function hideIcon() {
	let q = document.getElementById("icon");
	q.classList.remove("active");
	q.querySelectorAll("g").forEach(function(e) {
		if (e.id == scen.icon.last) e.setAttribute("display", "initial");
		else e.setAttribute("display", "none");
	});
	scen.icon.last = null;
}

////////////////////////////////////////////////////////////////////////////////
// @ Wait
////////////////////////////////////////////////////////////////////////////////

function showWait() {
	let q = document.getElementById("wait");
	q.style.display = "";
}

function hideWait() {
	let q = document.getElementById("wait");
	q.style.display = "none";
}

// =============================================================================
// -----------------------------------------------------------------------------
// # Transmission
// -----------------------------------------------------------------------------
// =============================================================================

function showTransmission(s) { // s = string
	let q = document.getElementById("transmission");
	q.querySelector("p:nth-child(1)").innerHTML = s;
	q.querySelector("p:nth-child(2)").innerHTML = lang["click_on_fire"];
	q.style.display = "";
	scen.transmission.active = true;
}

function hideTransmission() {
	let q = document.getElementById("transmission");
	q.querySelector("p:nth-child(1)").innerHTML = "";
	q.querySelector("p:nth-child(2)").innerHTML = "";
	q.style.display = "none";
	scen.transmission.active = false;
}

function validTransmission() {
	hideTransmission();
	setFrameTimeout("alien_event", conf.scen.transmission.delay, function() {
		endAlienEvent();
	});
}

// =============================================================================
// -----------------------------------------------------------------------------
// # View
// -----------------------------------------------------------------------------
// =============================================================================

function isScrollLocked() {
	return scen.scrl.locked > 0 || term.mouse.down;
}

function isZoomLocked() {
	return scen.zoom.locked > 0;
}

function lockScroll() {
	scen.scrl.locked++;
}

function lockZoom() {
	scen.zoom.locked++;
}

function unlockScroll(b) { // b = reset flag
	scen.scrl.locked = b ? 0 : Math.max(0, scen.scrl.locked - 1);
}

function unlockZoom(b) { // b = reset flag
	scen.zoom.locked = b ? 0 : Math.max(0, scen.zoom.locked - 1);
}

// =============================================================================
// -----------------------------------------------------------------------------
// # Texts
// -----------------------------------------------------------------------------
// =============================================================================

function spawnTexts() {
	if (conf.scen.frame_count.show) {
		ents.Text.frame_count.hidden = false;
		ents.Text.frame_count.spawned = true;
	}
	if (conf.scen.fps.show) {
		ents.Text.fps.hidden = false;
		ents.Text.fps.spawned = true;
	}
	if (conf.scen.curpos.show) {
		ents.Text.curpos.hidden = false;
		ents.Text.curpos.spawned = true;
	}
}

function updateTexts() {
	if (!ents.Text.frame_count.hidden) ents.Text.frame_count.str = "Frame = " + scen.frame_count;
	if (!ents.Text.fps.hidden) ents.Text.fps.str = getFPS() + " FPS";
	if (!ents.Text.curpos.hidden) {
		if (scen.mouse.tile_x != null && scen.mouse.tile_y != null) {
			ents.Text.curpos.str = "X = " + (scen.mouse.tile_x) + " & Y = " + (scen.mouse.tile_y);
		} else {
			ents.Text.curpos.str = "X = -- & Y = --";
		}
	}
}

function showCaption(s, n) { // s = string, n = number of frames
	ents.Text.caption.str = s;
	ents.Text.caption.delay = n || conf.scen.caption.delay;
	ents.Text.caption.hidden = false;
}

function hideCaption() {
	ents.Text.caption.delay = 0;
	ents.Text.caption.hidden = true;
}

// =============================================================================
// -----------------------------------------------------------------------------
// # Mouse (controller)
// -----------------------------------------------------------------------------
// =============================================================================

function getMousePosition() { // returns position {x,y} in tiles
	let rect = scen.canvas.getBoundingClientRect();
	return {
		"x" : ti((scen.mouse.x - rect.left) * scen.screen.scale * main.screen.scale + scen.screen.x),
		"y" : ti((scen.mouse.y - rect.top) * scen.screen.scale * main.screen.scale + scen.screen.y)
	};
}

function checkMouseTile(p, b, f) { // p = mouse position, b = click flag, f = click out of range flag ; returns boolean
	let r = false;
	let c = game.grid[p.x][p.y];
	if (!(game.actor != null && game.actor.moving)) { // game actor not moving
		if (isPawn(c[0])) { // is Furn or Char
			let o = pawn[c[1]]; // get entity
			if (b) console.log("[" + o.id + "] >> game.grid[" + ti(o.x) + "][" + ti(o.y) + "] << pawn." + o.id); // DEBUG
			if (game.actor != null && game.actor.id == o.id) { // acting entity
				if (f || b) centerToPixel(o.x, o.y);
			} else if (isMarine(o) && game.player[0] == getTypeKey(o)) { // playing marine team member
				if (b) selectMarine(o);
			} else if (!o.hidden) { // visible pawn
				if (b) showIdentify(o);
			} else { // hidden pawn
				r = true;
			}
		} else { // is Flat
			r = true;
		}
	} if (!b) scen.scrl.mouse.ready = r;
}

function checkMouseClick(p, s, o) { // p = mouse position (tile), s = action key, o = entity
	if (s != null) { // has action
		let i = hasPoint(ents.Rect.range.list, p.x, p.y, true);
		if (i >= 0) { // click in range
			if (s != "xeno_sensor") main.ctrl.action = null; // reset action
			switch(s) {
				case "xeno_sensor" :
					let c = game.grid[p.x][p.y];
					let u = pawn[c[1]];
					if (u !== undefined) u.reveal(false, s); // revealed by
					ents.Rect.range.list.splice(i, 1);
					game.xeno_sensor.count++;
					term.updateMiniMap(ents.Rect.range.list, conf.color.mini["range_bleep"]);
					if (game.xeno_sensor.count == 3) stopXenoSensor();
					break;
				case "move" : o.moveTo(Math.abs(p.x), Math.abs(p.y)); break;
				case "attack_range" : startAttack(o, "range", p.x, p.y); break;
				case "attack_melee" : startAttack(o, "melee", p.x, p.y); break;
				case "switch_door" : o.switchDoor(p.x, p.y); break;
			}
		} else { // click out of range
			checkMouseTile(p, false, true); // TEMP
		}
	} else { // no action
		checkMouseTile(p, true);
	}
}

function checkMouseHilite(p) { // p = mouse position (tile)
	ents.Rect.hilite.hidden = true;
	if (isTileOnBoard(p.x, p.y)) { // mouse on board
		let c = game.grid[p.x][p.y];
		if (!(isVoid(c[0]) || isWall(c[0]))) { // tile is neither void or wall
			ents.Rect.hilite.x = p.x * conf.tile.size + ((conf.tile.size - ents.Rect.hilite.width) / 2);
			ents.Rect.hilite.y = p.y * conf.tile.size + ((conf.tile.size - ents.Rect.hilite.height) / 2);
			ents.Rect.hilite.hidden = false;
			if (ents.Rect.hilite.pattern == "slab") {
				let o = pawn[c[1]];
				if (conf.Rect.hilite_point && isPawn(o, true) && !o.hidden) ents.Rect.hilite.fill = conf.color.board.hilite_point; // NEW
				else if (conf.Rect.hilite_blank) ents.Rect.hilite.fill = conf.color.board.hilite_blank; // NEW
				else ents.Rect.hilite.fill = "transparent"; // TEMP -- should be hidden
			}
			else if (ents.Rect.hilite.pattern == "square") ents.Rect.hilite.resetSquare();
			else if (ents.Rect.hilite.pattern == "line") ents.Rect.hilite.resetLine();
			if (game.actor != null && game.actor.moving) { // TEMP -- repetition
				scen.scrl.mouse.ready = false; // ALREADY IS
				ents.Rect.hilite.fill = conf.color.board.hilite_blank; // TEMP
			} else if ((game.actor != null && game.actor.range != null) || game.xeno_sensor.active) {
				if (hasPoint(ents.Rect.range.list, p.x, p.y)) { // tile in range
					scen.scrl.mouse.ready = false;
					updateCursor("pointer");
					ents.Rect.hilite.fill = conf.color.board.hilite_point; // TEMP
				} else { // tile out of range
					if (c[1] != game.actor.id) scen.scrl.mouse.ready = true; // acting entity
					ents.Rect.hilite.fill = conf.color.board.hilite_blank; // TEMP
				}
			}
		}
	}
}

function checkMousePointer(p) {
	checkMouseTile(p);
	checkMouseHilite(p);
}

function updateMouse() {

	//////////////////////////////////////////////////////////////////////////////
	// A. Mouse Up
	//////////////////////////////////////////////////////////////////////////////

	if (scen.mouse.up) {
		scen.mouse.up = false;
		scen.mouse.hold = false;
		if (moni.identify.active) hideIdentify();
		if (scen.scrl.mouse.active) stopScrollByMouse(); // NEW
	}

	if (!mupt.active && scen.mouse.hover) { // alien not playing and mouse on screen

		let p = getMousePosition(), b, c;

		if (scen.mouse.down) {
			scen.mouse.down = false;
			scen.mouse.hold = true;
			b = true;
		}

		if (isTileOnBoard(p.x, p.y)) { // mouse on board

			////////////////////////////////////////////////////////////////////////////
			// B. Mouse Down
			////////////////////////////////////////////////////////////////////////////

			if (b && !scen.scrl.mouse.active) {
				if (moni.turn.prompt) return; // TEMP
				else if (game.xeno_sensor.active) checkMouseClick(p, "xeno_sensor");
				else if (game.actor != null && game.actor.range != null) { // actor action
					let o = game.actor;
					if (o.range == "move") checkMouseClick(p, "move", o);
					else if (o.range == "shoot" && (!term.roll.active || game.chained)) checkMouseClick(p, "attack_range", o);
					else if (o.range == "melee" && !term.roll.active) checkMouseClick(p, "attack_melee", o);
					else if (o.range == "door") checkMouseClick(p, "switch_door", o);
				} else checkMouseClick(p, null);
			}

			// -----------------------------------------------------------------------
			// * Check mouse pointer (run every frame update when mouse is on board)
			if (!scen.scrl.mouse.active) checkMousePointer(p);
			else ents.Rect.hilite.hidden = true;
			// -----------------------------------------------------------------------

			////////////////////////////////////////////////////////////////////////////
			// C. Mouse hover
			////////////////////////////////////////////////////////////////////////////

			if (p.x != scen.mouse.tile_x || p.y != scen.mouse.tile_y) { // new tile
				// * Register mouse tile (x,y)
				scen.mouse.tile_x = p.x;
				scen.mouse.tile_y = p.y;
				// ---------------------------------------------------------------------
				// * Check mouse pointer (run only on tile change)
				// if (!scen.scrl.mouse.active) checkMousePointer(p);
				// else ents.Rect.hilite.hidden = true;
				// ---------------------------------------------------------------------
				// * Show line of sight
				if (tool.los) {
					ents.Line.sight.hidden = false; // DEBUG
					if (game.actor != null) hasLos(game.actor.getTiX(), game.actor.getTiY(), p.x, p.y, null, false, true); // DEBUG
				} else {
					if (!mupt.active) ents.Line.sight.clear(); // DEBUG
				}
			}

		}

		if (scen.scrl.mouse.ready) { // mouse can be scrolled by click
			if (b) startScrollByMouse(); // mouse clicked and mouse scroll not triggered by keyboard
			else if (!term.mouse.down) {
				if (!scen.scrl.mouse.active) updateCursorState("grab"); // NEW
				else updateCursorState("grabbing"); // NEW
			}
		} else { // mouse cannot be scrolled by click
			if (!scen.scrl.mouse.active) {
				updateCursorState(scen.mouse.hold && !c ? "click" : "pointer");
			}
		}

	} else { // alien playing, mouse out of screen or mouse out of board
		// * Reset mouse position
		if (scen.mouse.tile_x != null) scen.mouse.tile_x = null;
		if (scen.mouse.tile_y != null) scen.mouse.tile_y = null;
		// * Hide hilite
		if (!ents.Rect.hilite.hidden) ents.Rect.hilite.hidden = true;
		// * Hide line of sight
		if (tool.los) ents.Line.sight.hidden = true; // DEBUG
	}

}

// =============================================================================
// -----------------------------------------------------------------------------
// # Create Entities
// -----------------------------------------------------------------------------
// =============================================================================

/**

	& ENTITIES SPECIFICATION

	Walls are non-entities stored in grid (using an integer referring to entity type).

	All entities are positioned in pixels (x, y).

	Marks (Texts, Reticles, Animations, Projectiles, Rectangles and Backgrounds) aren't stored in grid.

	Pawns (Characters and Furnitures) are stored in grid (using an array containing entity type and id).
		?> get Char or Furn TYPE from grid : game.grid[ti(x)][ti(y)][0]
		?> get Char or Furn ID   from grid : game.grid[ti(x)][ti(y)][1]

*/

// -----------------------------------------------------------------------------
// * Marks
// -----------------------------------------------------------------------------

function createText(id, x, y, fixed, style) {
	ents.Text[id] = new Text(id, x, y, fixed, style);
}

function createLine(id, x, y, style) {
	ents.Line[id] = new Line(id, x, y, style);
}

function createReti(id, x, y, width, height) {
	ents.Reti[id] = new Reti(id, x, y, width, height);
}

function createAnim(id, x, y, width, height, source) {
	ents.Anim[id] = new Anim(id, x, y, width, height, source);
}

function createProj(id, x, y, slug) {
	ents.Proj[id] = new Proj(id, x, y, slug);
}

function createRect(id, x, y, width, height, pattern, color) {
	ents.Rect[id] = new Rect(id, x, y, width, height, pattern, color);
}

function createBack(id, x, y) {
	ents.Back[id] = new Back(id, x, y);
}

// -----------------------------------------------------------------------------
// * Pawns
// -----------------------------------------------------------------------------

/**

	& PAWNS SPAWNING

	createPawn() => first instantiation (i.e. grid is empty)
	raisePawn()  => later instantiation (i.e. grid is not empty)

*/

function raiseDoor(id, x, y, type, subt) {
	return pawn[id] = new Door(id, x, y, type, subt);
}

function createDoor(id, x, y, subt) { // fixed type (3 = closed door ; -1 = opened door)
	return raiseDoor(id, x, y, 3, subt);
}

function raiseItem(id, x, y, type, subt) {
	return pawn[id] = new Item(id, x, y, type, subt);
}

function createItem(id, x, y, subt) { // fixed type (4 item)
	return raiseItem(id, x, y, 4, subt);
}

function raiseMarine(id, x, y, type, subt, dir, weapon, name) {
	return pawn[id] = new Marine(id, x, y, type, subt, dir, weapon, name);
}

function createMarine(id, x, y, type, subt, dir, weapon, name) { // variable type (5 = red, 6 = gold, 7 = blue)
	return raiseMarine(id, x, y, type, subt, dir, weapon, name);
}

function raiseAlien(id, x, y, type, subt) {
	return pawn[id] = new Alien(id, x, y, type, subt);
}

function createAlien(id, x, y, subt) { // fixed type (8 = alien)
	return raiseAlien(id, x, y, 8, subt);
}

// =============================================================================
// -----------------------------------------------------------------------------
// # Create Marks
// -----------------------------------------------------------------------------
// =============================================================================

function createMarks() {

	// * Create texts
	if (conf.scen.frame_count.show)
		createText("frame_count" , (conf.scen.canvas.width - px(1)), (px(1.5)), true,
		{"color" : "rgb(0,224,0)", "align" : "right"});
	if (conf.scen.fps.show)
		createText("fps" , conf.scen.canvas.width - px(1), conf.scen.canvas.height - px(0.5), true,
		{"color" : "rgb(255,255,255)", "align" : "right"});
	if (conf.scen.curpos.show)
		createText("curpos" , conf.scen.canvas.width - px(1), px(0.75), true,
		{"color" : "rgb(255,255,0)", "align" : "right"});
	if (conf.scen.caption.show)
		createText("caption" , px(0.5), conf.scen.canvas.height - px(0.5), true);

	// * Create lines
	createLine("path", 0, 0, {"mark" : {"color" : "cyan"}, "line" : {"color" : "rgba(255,255,255,.625)"}});
	createLine("sight", 0, 0, {"mark" : {"color" : "yellow"}, "line" : {"color" : "lime"}});

	// * Create reticles
	createReti("focus", 0, 0, px(1), px(1));

	// * Create animations
	createAnim("buffet", 0, 0, px(3), px(3), "buffet");
	for (i = 0; i < conf.Anim.effect_num; i++)
		createAnim("effect" + leadZero(i + 1, conf.Anim.effect_num), 0, 0, px(1.5), px(1.5), "effect");
	createAnim("muzzle", 0, 0, px(0.75), px(0.75), "muzzle");

	// * Create projectile
	createProj("pang", 0, 0, "bullet");

	// * Create rectangles
	createRect("scan", 0, 0, px(1), px(1), "ripple");
	createRect("range", 0, 0, px(1), px(1), "mosaic");
	createRect("hilite", 0, 0, px(1), px(1), "slab", "transparent");

	// * Create backgrounds
	createBack("board", 0, 0);

}

// =============================================================================
// -----------------------------------------------------------------------------
// # Start Scene
// -----------------------------------------------------------------------------
// =============================================================================

function startScene() {

	//////////////////////////////////////////////////////////////////////////////
	// @ Grid
	//////////////////////////////////////////////////////////////////////////////

	// * Create game grid
	game.grid = createGameGrid(maps[game.map].grid, conf.board.width, conf.board.height);

	//////////////////////////////////////////////////////////////////////////////
	// @ Pawns
	//////////////////////////////////////////////////////////////////////////////

	let a, i, n, k, o, p, q, t, u;

	// * Create doors
	a = maps[game.map].pawn.door;
	for (i = 0; i < a.length; i++) {
		o = createDoor("door" + leadZero(i + 1), px(a[i][0]), px(a[i][1]), "airlock");
		o.setPosition(); // position set on creation ; used for locating opposite panel when inited
	}

	// * Create items
	a = maps[game.map].pawn.item;
	n = 1;
	for (k in a) {
		for (i = 0; i < a[k].length; i++) {
			createItem("item" + leadZero(n), px(a[k][i][0]), px(a[k][i][1]), k);
			n++;
		}
	}

	// * Create aliens
	a = maps[game.map].pawn.alien;
	n = 1;
	for (k in a) {
		for (i = 0; i < a[k].length; i++) {
			// createAlien(alien + leadZero(n), px(a[k][i][0]), px(a[k][i][1]), k);
			createAlien(k + leadZero(i + 1), px(a[k][i][0]), px(a[k][i][1]), k); // TEMP DEBUG
			n++;
		}
	}

	// * Create marines
	for (n = 5; n <= 7; n++) {
		t = getTypeKey(n);
		u = maps[game.map].spawn[t].dir;
		i = 0;
		for (k in game.team[t].members) {
			if (game.team[t].members[k].state != null) continue;
			p = maps[game.map].spawn[t].pts[i];
			q = game.team[t].members[k];
			createMarine(k, px(p[0]), px(p[1]), n, q.subt, u, q.weapon, q.name);
			i++;
		}
	}

	//////////////////////////////////////////////////////////////////////////////
	// @ Marks
	//////////////////////////////////////////////////////////////////////////////

	createMarks();

	//////////////////////////////////////////////////////////////////////////////
	// @ Spawn
	//////////////////////////////////////////////////////////////////////////////

	spawnTexts();

	//////////////////////////////////////////////////////////////////////////////
	// @ Start
	//////////////////////////////////////////////////////////////////////////////

	scen.start();
	term.start();

	//////////////////////////////////////////////////////////////////////////////
	// @ Game
	//////////////////////////////////////////////////////////////////////////////

	startGame();

}

// =============================================================================
// -----------------------------------------------------------------------------
// # Restart Scene
// -----------------------------------------------------------------------------
// =============================================================================

function restartScene(_game, _main, _scen, _term, _tool, _pawn) {

	//////////////////////////////////////////////////////////////////////////////
	// @ Muppets
	//////////////////////////////////////////////////////////////////////////////

	// * Prompt alien acting loop
	stopAlienPlay();

	//////////////////////////////////////////////////////////////////////////////
	// @ Pawns
	//////////////////////////////////////////////////////////////////////////////

	// * Erase pawns
	pawn = {};

	// * Raise pawns
	let k, v;
	for (k in _pawn) {
		if (isDoor(_pawn[k])) raiseDoor(_pawn[k].id, _pawn[k].x, _pawn[k].y, _pawn[k].type, _pawn[k].subt);
		else if (isItem(_pawn[k])) raiseItem(_pawn[k].id, _pawn[k].x, _pawn[k].y, _pawn[k].type, _pawn[k].subt);
		else if (isMarine(_pawn[k])) raiseMarine(_pawn[k].id, _pawn[k].x, _pawn[k].y, _pawn[k].type, _pawn[k].subt, _pawn[k].dir, _pawn[k].weapon, _pawn[k].name);
		else if (isAlien(_pawn[k])) raiseAlien(_pawn[k].id, _pawn[k].x, _pawn[k].y, _pawn[k].type, _pawn[k].subt);
		for (v in _pawn[k]) {
			if (v == "img") pawn[k][v] == null; // erase old image
			else if (v == "spawned") pawn[k][v] == false; // force respawn
			else pawn[k][v] = _pawn[k][v]; // copy property
		}
	}

	//////////////////////////////////////////////////////////////////////////////
	// @ Screen (1)
	//////////////////////////////////////////////////////////////////////////////

	// * Reset zoom
	revertScale();

	//////////////////////////////////////////////////////////////////////////////
	// @ Marks
	//////////////////////////////////////////////////////////////////////////////

	// * Erase marks
	ents.Text = {};
	ents.Reti = {};
	ents.Anim = {};
	ents.Proj = {};
	ents.Rect = {};
	ents.Back = {};

	// * Recreate marks
	createMarks();

	//////////////////////////////////////////////////////////////////////////////
	// @ Screen (2)
	//////////////////////////////////////////////////////////////////////////////

	// * Reload zoom level
	scen.zoom.time = _scen.zoom.time;
	scaleScreen(getScaleValue());

	// * Reload scroll position
	scrollToPixelInstant(_scen.screen.x, _scen.screen.y)

	//////////////////////////////////////////////////////////////////////////////
	// @ Texts
	//////////////////////////////////////////////////////////////////////////////

	// * Spawn texts
	spawnTexts();

	//////////////////////////////////////////////////////////////////////////////
	// @ Auxiliary Screens (1)
	//////////////////////////////////////////////////////////////////////////////

	// * Reset monitor
	hideIdentify();
	hideReport();
	hideTurn();
	hideAlien();
	resetStatus();

	// * Reset terminal
	hideRoll();
	hideChoice();
	hideNoise();

	//////////////////////////////////////////////////////////////////////////////
	// @ Game
	//////////////////////////////////////////////////////////////////////////////

	// * Reload game settings
	game = _game;

	// * Reset player theme
	setPlayerTheme(game.player[0]);

	//////////////////////////////////////////////////////////////////////////////
	// @ Widgets
	//////////////////////////////////////////////////////////////////////////////

	// * Hide widgets
	hideHint();
	hideWait();

	//////////////////////////////////////////////////////////////////////////////
	// @ Transmission
	//////////////////////////////////////////////////////////////////////////////

	// * Hide transmission
	hideTransmission();

	//////////////////////////////////////////////////////////////////////////////
	// @ Controls
	//////////////////////////////////////////////////////////////////////////////

	// * Reset controls
	disableSelectLights();
	disableSelectButtons();
	checkSelectControls();
	checkActionButtons();

	//////////////////////////////////////////////////////////////////////////////
	// @ Actor
	//////////////////////////////////////////////////////////////////////////////

	// * Fix actor broken reference
	if (game.actor != null) {

		// * Reset actor reference
		game.actor = pawn[game.actor.id]

		// * Clear actor range
		game.actor.clearRange(); // NEW TEMP

		// * Reselect actor
		if (isMarine(game.actor)) selectMarine(game.actor, true);

		// * Handle actor moving case
		if (game.actor.moving) {
			// * Lock scroll
			lockScroll();
			// * Disable buttons
			if (isMarine(game.actor)) {
				disableSelectButtons(getIndexFromId(game.actor));
				disableActionButtons();
			}
			// * Unset focus
			unsetFocus();
		}
	}

	//////////////////////////////////////////////////////////////////////////////
	// @ Tool
	//////////////////////////////////////////////////////////////////////////////

	deactivateToolButtons(tool.button.range, this); // DEBUG

	//////////////////////////////////////////////////////////////////////////////
	// @ Main (1)
	//////////////////////////////////////////////////////////////////////////////

	// * Reset main save
	main.save.forbidden = false;
	main.save.prevented = false;
	main.save.pending = false;
	main.save.savekey = null;

	//////////////////////////////////////////////////////////////////////////////
	// @ Scene
	//////////////////////////////////////////////////////////////////////////////

	// * Reload frame counter
	scen.frame_count = _scen.frame_count;

	// * Clear timers
	scen.timer = {};

	// * Reset mouse position
	scen.mouse.tile_x = scen.mouse.tile_y = 0;

	//////////////////////////////////////////////////////////////////////////////
	// @ Auxiliary Screens (2)
	//////////////////////////////////////////////////////////////////////////////

	// * Reload terminal settings
	term.choice = _term.choice;

	// * Remember choice settings
	let choice_list = term.choice.list;
	let choice_index = term.choice.index;
	let choice_weapon = term.choice.weapon;

	//////////////////////////////////////////////////////////////////////////////
	// @ Main (2)
	//////////////////////////////////////////////////////////////////////////////

	// * Reload main controls
	main.ctrl = _main.ctrl;

	// * Restart actor action by click
	if (main.ctrl.action != null) forceClick("action_" + main.ctrl.action);

	// * Apply choice settings
	if (term.choice.active) {
		if (term.choice.type == "weapon") {
			confirmChoice(choice_weapon);
		} else { // order or equipment
			term.choice.list = choice_list;
			updateChoice(undefined, choice_index);
		}
	}

	//////////////////////////////////////////////////////////////////////////////
	// @ Tool
	//////////////////////////////////////////////////////////////////////////////

	tool.toggle = _tool.toggle;

	if (tool.toggle.limbo_luck && !hasAttribute("limbo_luck", "data-state")) forceClick("limbo_luck");
	else if (tool.toggle.limbo_jinx && !hasAttribute("limbo_jinx", "data-state")) forceClick("limbo_jinx");

	//////////////////////////////////////////////////////////////////////////////
	// @ Continue
	//////////////////////////////////////////////////////////////////////////////

	// * Cancel scene fade
	scen.fade(null);

	// * Cancel pause
	stopPause();

	// * Reset view locks
	unlockScroll(true);
	unlockZoom(true);

	// * Update minimap
	term.updateMiniMap();

	// * Clear console
	console.clear(); // DEBUG

}

