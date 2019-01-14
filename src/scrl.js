/*

	scrl.js (scen.js ext)

*/

// =============================================================================
// -----------------------------------------------------------------------------
// # Notes
// -----------------------------------------------------------------------------
// =============================================================================

/**

	& SCROLL TYPES

		1. Button   : n tiles  -- tile based, delayed scroll
		2. Keyboard : 1 tile   -- tile based, instant scroll
		3. Mouse    : movement -- pixel based, instant scroll + delayed scroll (snap)
		4. Script   : variable -- pixel based, delayed scroll

		A. scrollOf : +x, +y   -- défiler de/par ; 'combien'
		B. scrollTo : @x, @y   -- défiler à/vers ; 'où'

*/

// =============================================================================
// -----------------------------------------------------------------------------
// # Scroll
// -----------------------------------------------------------------------------
// =============================================================================

function canScrollVertically(x) { // x = pixel
	let c1 = scen.screen.x - x >= scen.area.min_x;
	let c2 = scen.screen.x + scen.screen.width - x <= scen.area.max_x;
	return c1 && c2;
}

function canScrollHorizontally(y) { // y = pixel
	let c1 = scen.screen.y - y >= scen.area.min_y;
	let c2 = scen.screen.y + scen.screen.height - y <= scen.area.max_y;
	return c1 && c2;
}

function updateScroll(x, y) { // x, y = pixel
	if (!canScrollVertically(x)) x = 0;
	if (!canScrollHorizontally(y)) y = 0;
	if (x != 0 || y != 0) {
		scen.context.translate(x, y);
		scen.screen.x -= x;
		scen.screen.y -= y;
		for (let k in ents.Text) {
			if (ents.Text[k].fixed) {
				ents.Text[k].x -= x;
				ents.Text[k].y -= y;
			}
		}
	}
}

// -----------------------------------------------------------------------------
// * Scroll Of
// -----------------------------------------------------------------------------

/**

	& SCROLL DELAY

	* Fixed Speed (Method 1)
	scroll at fixed speed (e.g. 10px per frame)
	in that case, speed is the number of pixel translated per frame
	in short : speed = distance

	* Variable Speed (Method 2)
	scroll at variable speed toward distance (e.g. 1px per frame for 10px distance and 100px per frame for 1000px distance)
	in that case, speed is a factor of the translation duration
	in short : speed = time
	speed = 1   >>  10 * 15 ms  ==  150 ms
	speed = 2   >>   9 * 15 ms  ==  135 ms
	speed = 3   >>   8 * 15 ms  ==  120 ms
	speed = 4   >>   7 * 15 ms  ==  105 ms
	speed = 5   >>   6 * 15 ms  ==  90 ms
	speed = 6   >>   5 * 15 ms  ==  75 ms
	speed = 7   >>   4 * 15 ms  ==  60 ms
	speed = 8   >>   3 * 15 ms  ==  45 ms
	speed = 9   >>   2 * 15 ms  ==  30 ms
	speed = 10  >>   1 * 15 ms  ==  15 ms

*/

function scrollOfPixel(x, y, speed, f) { // x, y = pixel, speed = 0-10, f = callback function

	if (typeof(f) !== "function") f = function() {};

	speed = speed !== undefined ? Math.clamp(0, speed, 10) : conf.scen.scrl.move_speed;

	if (speed == 0) {
		updateScroll(x, y);
		f();
		return;
	}

	var sign_x = x < 0 ? -1 : 1;
	var sign_y = y < 0 ? -1 : 1;
	var delta_x = 0;
	var delta_y = 0;
	var count_x = Math.abs(x);
	var count_y = Math.abs(y);

	// * Fixed Speed (Method 1)
	// delta_x = speed;
	// delta_y = speed;

	// * Variable Speed (Method 2)
	if (x != 0) delta_x = Math.max(1, Math.floor(Math.abs(x) / (11 - speed)));
	if (y != 0) delta_y = Math.max(1, Math.floor(Math.abs(y) / (11 - speed)));

	if (scen.scrl.delayed.active) {
		scen.scrl.delayed.swift_x = 0;
		scen.scrl.delayed.swift_y = 0;
	}

	scen.scrl.delayed.active = true;

	// * Prevent save
	main.save.prevented = true; // TEMP

	setFrameInterval("scrl", 0, function() { // every frame

		if (count_x == 0 && count_y == 0) {
			clearFrameInterval("scrl");
			scen.scrl.delayed.active = false;
			if (scen.scrl.snap) {
				scen.scrl.snap = false;
				snapToBoard(scen.scrl.delayed.swift_x, scen.scrl.delayed.swift_y);
			} else {
				// * Allow save
				if (!game.chained) main.save.prevented = false; // TEMP
				f();
			}
			scen.scrl.delayed.swift_x = 0;
			scen.scrl.delayed.swift_y = 0;
		}

		if (count_x == 0) delta_x = 0;
		if (count_y == 0) delta_y = 0;

		updateScroll(sign_x * delta_x, sign_y * delta_y);

		scen.scrl.delayed.swift_x += sign_x * delta_x;
		scen.scrl.delayed.swift_y += sign_y * delta_y;

		count_x -= delta_x;
		count_y -= delta_y;

		if (count_x < delta_x) { delta_x = count_x; }
		if (count_y < delta_y) { delta_y = count_y; }

	});

}

function scrollOfPixelInstant(x, y, f) { // x, y = pixel, f = callback function
	if (typeof(f) !== "function") f = function() {};
	updateScroll(x, y);
	f();
}

// -----------------------------------------------------------------------------
// * Scroll To
// -----------------------------------------------------------------------------

function scrollToPixel(x, y, speed, center, tile, f) { // x, y = pixel, speed = 0-10, center = boolean, tile = center on tile (boolean), f = callback function
	if (tile === undefined) tile = true;
	let dist_x = scen.screen.x - x;
	let dist_y = scen.screen.y - y;
	if (center) {
		let center_x = Math.floor(scen.screen.width / 2); // center horizontally on screen
		let center_y = Math.floor(scen.screen.height / 2); // center vertically on screen
		let adjust_x = tile ? center_x % conf.tile.size : 0; // center horizontally on tile
		let adjust_y = tile ? center_y % conf.tile.size : 0; // center vertically on tile
		if (tile && adjust_x == 0) adjust_x += conf.tile.size; // lefter tile
		if (tile && adjust_y == 0) adjust_y += conf.tile.size; // upper tile
		dist_x += center_x - adjust_x;
		dist_y += center_y - adjust_y;
		if (scen.screen.x - dist_x < scen.area.min_x) dist_x = scen.screen.x - scen.area.min_x; // -x
		else if (scen.screen.x + scen.screen.width - dist_x > scen.area.max_x) dist_x = scen.screen.x + scen.screen.width - scen.area.max_x; // +x
		if (scen.screen.y - dist_y < scen.area.min_y) dist_y = scen.screen.y - scen.area.min_y; // -y
		else if (scen.screen.y + scen.screen.height - dist_y > scen.area.max_y) dist_y = scen.screen.y + scen.screen.height - scen.area.max_y; // +y
	}
	if (speed == 0) scrollOfPixelInstant(dist_x, dist_y, f);
	else scrollOfPixel(dist_x, dist_y, speed, f);
}

function scrollToPixelInstant(x, y, center, tile, f) { // x, y = pixel, center = boolean, tile = center on tile (boolean), f = callback function
	scrollToPixel(x, y, 0, center, tile, f);
}

// -----------------------------------------------------------------------------
// * Center To
// -----------------------------------------------------------------------------

function centerToPixel(x, y, speed, snap, tile, f) { // x, y = pixel, speed = 0-10, snap = boolean, tile = center on tile (boolean), f = callback function
	if (snap === undefined) snap = false;
	if (snap && (speed > 0 || speed === undefined)) scen.scrl.snap = true;
	scrollToPixel(x, y, speed, true, tile, f);
	if (snap && speed == 0) snapToBoardInstant();
}

function centerToPixelInstant(x, y, snap, tile, f) { // x, y = pixel, snap = boolean, tile = center on tile (boolean), f = callback function
	centerToPixel(x, y, 0, snap, tile, f);
}

// -----------------------------------------------------------------------------
// * Snap To
// -----------------------------------------------------------------------------

function snapToBoard(swift_x, swift_y, speed, f) { // swift_x = pixel, swift_y = pixel, speed = 0-10, f = callback function
	speed = speed != undefined ? speed : conf.scen.scrl.snap_speed;
	let x = scen.screen.x % conf.tile.size;
	let y = scen.screen.y % conf.tile.size;
	if (x != 0 || y != 0) {
		if (swift_x > 0) x = px(1) + x; // to left (negative)
		else if (swift_x < 0) x -= px(1); // to right (positive)
		if (swift_y > 0) y = px(1) + y; // to up (negative)
		else if (swift_y < 0)y -= px(1); // to down (positive)
		if (swift_x != 0 && Math.abs(x) > conf.tile.size) x += x > 0 ? px(-1) : px(1); // revert
		if (swift_y != 0 && Math.abs(y) > conf.tile.size) y += y > 0 ? px(-1) : px(1); // revert
		if (swift_x == 0 && x > halfti()) x -= px(1); // half-tile adjust
		if (swift_y == 0 && y > halfti()) y -= px(1); // half-tile adjust
		scrollOfPixel(x, y, speed, f);
	}
}

function snapToBoardInstant(f) { // f = callback function
	snapToBoard(0, 0, 0, f);
}

// -----------------------------------------------------------------------------
// * Shake Screen
// -----------------------------------------------------------------------------

function shakeScreen(n, p) { // n = number of shakes (integer), p = shake power (float)
	if (scen.timer.hasOwnProperty("shake")) return; // already shaking
	if (n == undefined) n = conf.scen.scrl.shake_times;
	if (p == undefined) p = conf.scen.scrl.shake_power;
	var i = 1;
	n *= 2;
	setFrameInterval("shake", conf.scen.scrl.shake_delay, function() {
		if (i == n) clearFrameInterval("shake");
		s = px(p);
		s *= i % 2 == 0 ? 1 : -1; // sign
		s *= i <= n / 2 ? i : n - i + 1; // mult
		scrollOfPixel(s, 0, conf.scen.scrl.shake_speed);
		i++;
	});
}

// -----------------------------------------------------------------------------
// * Scroll By Mouse
// -----------------------------------------------------------------------------

function startScrollByMouse() {
	if (!scen.scrl.mouse.active && !isScrollLocked()) {
		clearFrameInterval("scrl");
		scen.scrl.mouse.active = true;
		ents.Rect.hilite.hidden = true;
		updateCursorState("grabbing");
	}
}

function stopScrollByMouse() {
	if (scen.scrl.mouse.active) {
		scen.scrl.mouse.active = false;
		snapToBoard(scen.scrl.mouse.swift_x, scen.scrl.mouse.swift_y);
		scen.scrl.mouse.swift_x = 0;
		scen.scrl.mouse.swift_y = 0;
		resetCursor();
	}
}

// -----------------------------------------------------------------------------
// * Scroll By Input
// -----------------------------------------------------------------------------

function bindScrollButton(horz, vert) { // horz, vert = signed integer
	if (!isScrollLocked()) {
		let x, y, v = conf.scen.scrl.input_power;
		if (isPressed(16)) v += conf.scen.scrl.shift_power;
		x = px(v) * horz;
		y = px(v) * vert;
		scrollOfPixelInstant(x, y);
	}
}

////////////////////////////////////////////////////////////////////////////////
// @ Events
////////////////////////////////////////////////////////////////////////////////

// -----------------------------------------------------------------------------
// * Scroll By Mouse
// -----------------------------------------------------------------------------

document.addEventListener("mousemove", function(e) {
	if ((scen.scrl.mouse.forced || scen.scrl.mouse.active) && !isScrollLocked()) {
		let swift_x = -e.movementX;
		let swift_y = -e.movementY;
		let accel, cfg = conf.scen.scrl.mouse_accel;
		if (scen.scrl.mouse.accel == 0) scen.scrl.mouse.accel = cfg.min;
		accel = scen.scrl.mouse.accel;
		scrollOfPixelInstant(accel * swift_x, accel * swift_y);
		scen.scrl.mouse.swift_x += swift_x;
		scen.scrl.mouse.swift_y += swift_y;
		if (accel <= cfg.max
		 && (Math.abs(swift_x) > cfg.pix
			|| Math.abs(swift_y) > cfg.pix)) {
				accel = Math.max(Math.abs(swift_x), Math.abs(swift_y)) / cfg.div;
				if (accel > cfg.max) accel = cfg.max;
				else if (accel < cfg.min) accel = cfg.min;
				scen.scrl.mouse.accel = accel;
		}
		clearFrameTimeout("mouse_accel");
		setFrameTimeout("mouse_accel", cfg.num, function() {
			scen.scrl.mouse.accel = 0;
		});
	}
});

// -----------------------------------------------------------------------------
// * Scroll By Mouse Forced
// -----------------------------------------------------------------------------

function startScrolByMouseForced() {
	startScrollByMouse();
	scen.scrl.mouse.forced = true;
	document.getElementById("mouse_scroll").classList.add("active");
}

function stopScrollByMouseForced() {
	stopScrollByMouse();
	scen.scrl.mouse.forced = false;
	scen.mouse.down = false; // TEMP
	document.getElementById("mouse_scroll").classList.remove("active");
}

document.addEventListener("pointerlockchange", function() {
	if (scen.scrl.mouse.forced) stopScrollByMouseForced();
	else startScrolByMouseForced();
});

document.getElementById("mouse_scroll").addEventListener("click", function() {
	if (scen.scrl.mouse.forced) document.exitPointerLock();
	else scen.canvas.requestPointerLock();
});

document.addEventListener("mouseup", function() {
	document.exitPointerLock();
});

// -----------------------------------------------------------------------------
// * Scroll By Input
// -----------------------------------------------------------------------------

document.querySelector("#scroll_up").addEventListener("click", function() {bindScrollButton(0, 1)});
document.querySelector("#scroll_lt").addEventListener("click", function() {bindScrollButton(1, 0)});
document.querySelector("#scroll_rt").addEventListener("click", function() {bindScrollButton(-1, 0)});
document.querySelector("#scroll_dn").addEventListener("click", function() {bindScrollButton(0, -1)});

