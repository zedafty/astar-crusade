/*

	keys.js (main.js ext)

*/

// =============================================================================
// -----------------------------------------------------------------------------
// # Keys
// -----------------------------------------------------------------------------
// =============================================================================

////////////////////////////////////////////////////////////////////////////////
// @ Functions
////////////////////////////////////////////////////////////////////////////////

function forceClick(s) { // s = HTML element id
	document.getElementById(s).click() ;
	document.getElementById(s).focus();
}

function isPressed(n, t) { // n = key code, t = pressed time
	let c1 = main.key.map.hasOwnProperty(n) && main.key.map[n] > 0;
	let c2 = t !== undefined ? main.key.map[n] == t : true;
	return c1 && c2;
}

function isTriggered(n) { // n = key code ; returns boolean
	if (main.key.curr == n && main.key.last != n) {
		main.key.last = n;
		main.key.twice = n;
		clearInterval(main.key.interval);
		main.key.interval = setInterval(function() {
			main.key.twice = null;
		}, conf.input.double_trigger_delay);
		return true;
	} return false;
}

function isDoubleTriggered(n) { // n = key code ; returns boolean
	if (main.key.curr == n && main.key.twice == n) {
		main.key.last = n;
		main.key.twice = null;
		clearInterval(main.key.interval);
		return true;
	} return false;
}

////////////////////////////////////////////////////////////////////////////////
// @ Events
////////////////////////////////////////////////////////////////////////////////

document.addEventListener("keyup", function(e) {

	let k = e.which;
	main.key.curr = null; // reset current key
	delete main.key.map[k]; // unregister current key in map
	if (main.key.last != null) main.key.last = null; // reset last key

});

document.addEventListener("keydown", function(e) {

	let k = e.which;
	// console.log(k); // DEBUG

	// * Keymap
	main.key.curr = k; // set current key
	if (!main.key.map.hasOwnProperty(k)) main.key.map[k] = 1; // register current key in map
	else main.key.map[k] += 1; // increment current key in map

	// * Help
	if (isTriggered(112) && !mdal.active) { // F1 -- TEMP
		e.preventDefault();
		openModal();
	} else if (mdal.active) {
		closeModal();
	}

	// * Tool
	if (isTriggered(113)) { // F2 -- TEMP
		forceClick("tool_menu");
	}

	// ---------------------------------------------------------------------------
	// * Prompt (shown)
	// ---------------------------------------------------------------------------

	if (!main.shown) return; // WARNING

	// * Fullscreen
	if (isTriggered(70)) forceClick("screen_enlarge"); // Key F

	// ---------------------------------------------------------------------------
	// * Prompt (ready)
	// ---------------------------------------------------------------------------

	if (!main.ready) return; // WARNING

	// * Quicksave
	if (isTriggered(119)) { // F8
		if (!main.save.pending) saveGame("quicksave");
	}

	// * Quickload
	else if (isTriggered(120)) { // F9
		loadGame("quicksave");
	}

	// * Clear Quicksave
	else if (isTriggered(121)) { // F10 -- TEMP
		e.preventDefault() // WARNING
		clearGame("quicksave");
	}

	// * Pause
	if (isTriggered(19) || isTriggered(80)) { // Key Pause or Key P
		main.pause ? stopPause() : startPause();
	}

	// ---------------------------------------------------------------------------
	// * Prompt (pause)
	// ---------------------------------------------------------------------------

	if (main.pause) return; // WARNING

	// * Center on focus
	if (isTriggered(67) && !isScrollLocked() && game.actor != null) { // Key C
		centerToPixel(game.actor.x, game.actor.y);
	}

	// * Scroll by mouse
	if (isTriggered(83)) { // Key S
		if (scen.scrl.mouse.forced) document.exitPointerLock();
		else forceClick("mouse_scroll");
	}

	// * Scroll by keyboard
	if ((k == 16 || (k >= 37 && k <= 40)) && !isScrollLocked()) {
		e.preventDefault(); // WARNING
		let x, y, v = conf.scen.scrl.key_power;
		if (isPressed(16)) v += conf.scen.scrl.shift_power; // Key Left Shift or Right Shift
		if (isPressed(37)) x = v; // Key Left
		if (isPressed(38)) y = v; // Key Up
		if (isPressed(39)) x = -v; // Key Right
		if (isPressed(40)) y = -v; // Key Down
		scrollOfPixelInstant(px(x), px(y));
	}

	// * Zoom
	if (k == 106 || k == 107 || k == 109) {
		if (!e.ctrlKey) { // TEMP
			e.preventDefault(); // WARNING
			if (isTriggered(106)) resetScale(); // Key Star (numpad)
			else if (k == 107) zoomIn(); // Key Plus (numpad)
			else if (k == 109) zoomOut(); // Key Minus (numpad)
		}
	}

	// * Fire
	if (isTriggered(13) || isTriggered(32)) { // Key Enter or Key Space
		fire(); // TEMP
	}

	// * Cancel
	if (isTriggered(27) || isTriggered(8)) { // Key Escape or Key Backspace
		cancel(); // TEMP
	}

	// * Select
	if (k >= 49 && k <= 53) {
		e.preventDefault() // WARNING
		if (isDoubleTriggered(49)) bindSelectButton(document.getElementById("member_1"), true); // Double Key 1
		else if (isDoubleTriggered(50)) bindSelectButton(document.getElementById("member_2"), true); // Double Key 2
		else if (isDoubleTriggered(51)) bindSelectButton(document.getElementById("member_3"), true); // Double Key 3
		else if (isDoubleTriggered(52)) bindSelectButton(document.getElementById("member_4"), true); // Double Key 4
		else if (isDoubleTriggered(53)) bindSelectButton(document.getElementById("member_5"), true); // Double Key 5
		else if (isTriggered(49)) forceClick("member_1"); // Key 1
		else if (isTriggered(50)) forceClick("member_2");// Key 2
		else if (isTriggered(51)) forceClick("member_3");// Key 3
		else if (isTriggered(52)) forceClick("member_4");// Key 4
		else if (isTriggered(53)) forceClick("member_5");// Key 5
	}

	// * Actions
	if (isTriggered(77)) forceClick("action_move"); // Key M
	else if (isTriggered(82)) forceClick("action_attack_range");// Key R
	else if (isTriggered(65)) forceClick("action_attack_melee");// Key A
	else if (isTriggered(79)) forceClick("action_give_order");// Key O
	else if (isTriggered(69)) forceClick("action_use_equipment");// Key E
	else if (isTriggered(68)) forceClick("action_switch_door");// Key D
	else if (isTriggered(75)) forceClick("action_scan");// Key K
	else if (isTriggered(35)) {
		e.preventDefault() // WARNING
		forceClick("action_end_turn");// Key End
	}

});

////////////////////////////////////////////////////////////////////////////////
// @ Events
////////////////////////////////////////////////////////////////////////////////

document.addEventListener("blur", function() {
	main.key.map = {}; // WARNING : hard reset
});

