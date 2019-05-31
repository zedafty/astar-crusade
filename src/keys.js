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

	// ---------------------------------------------------------------------------
	// * Prompt (keymap edit)
	// ---------------------------------------------------------------------------

	if (mdal.keymap.edit) return; // TEMP

	if (main.keymap == null) main.keymap = getLocalStorageItem("settings").keymap; // WARNING : keymap registration

	let l = main.keymap;

	if (k == 27) { // Escape (27) -- WARNING : hard key code
		if (mdal.active) closeModal();
		else toggleModal("menu");
	}

	// * Keymap
	if (isTriggered(l.keymap)) { // F1 (112) -- TEMP
		e.preventDefault(); // WARNING : browser feature override
		toggleModal("keymap");
	}

	// * Settings
	if (isTriggered(l.settings)) { // F2 (113) -- TEMP
		toggleModal("settings");
	}

	// * Toolbar
	if (isTriggered(l.toolbar)) { // Key T (84) -- DEBUG
		forceClick("tool_menu");
	}

	// * Save Game
	else if (isTriggered(l.save_game)) { // F8 (119)
		toggleModal("save_game");
	}

	// * Load Game
	else if (isTriggered(l.load_game)) { // F9 (120)
		toggleModal("load_game");
	}

	// * Mute Audio
	else if (isTriggered(l.mute_audio)) { // F10 (121)
		e.preventDefault(); // WARNING : browser feature override
		// TEST
		forceClick("mute_audio");
		// STABLE
		// toggleAudioMute();
	}

	// ---------------------------------------------------------------------------
	// * Prompt (main shown)
	// ---------------------------------------------------------------------------

	if (!main.shown) return; // WARNING : key prompt

	// * Fullscreen
	if (isTriggered(l.fullscreen)) forceClick("screen_enlarge"); // Key F (70)

	// ---------------------------------------------------------------------------
	// * Prompt (main ready)
	// ---------------------------------------------------------------------------

	if (!main.ready) return; // WARNING : key prompt

	// * Quicksave
	if (isTriggered(l.quicksave)) { // F8 (119)
		if (!main.save.pending) saveGame("quicksave");
	}

	// * Quickload
	else if (isTriggered(l.quickload)) { // F9 (120)
		loadGame("quicksave");
	}

	// * Pause
	if (isTriggered(l.pause)) { // Key Pause (19)
		main.pause ? stopPause() : startPause();
	}

	// ---------------------------------------------------------------------------
	// * Prompt (main pause)
	// ---------------------------------------------------------------------------

	if (main.pause) return; // WARNING : key prompt

	// ---------------------------------------------------------------------------
	// * Prompt (modal active)
	// ---------------------------------------------------------------------------

	if (mdal.active) return; // WARNING : key prompt

	// * Fire
	if (isTriggered(13) || isTriggered(32)) { // Key Enter or Key Space -- WARNING : hard key code
		fire(); // TEMP
	}

	// * Cancel
	if (isTriggered(27) || isTriggered(8)) { // Key Escape or Key Backspace -- WARNING : hard key code
		cancel(); // TEMP
	}

	// * Center on focus
	if (isTriggered(l.center_to_focus) && !isScrollLocked() && game.actor != null) { // Key C (67)
		centerToPixel(game.actor.x, game.actor.y);
	}

	// * Scroll by mouse
	if (isTriggered(l.scroll_by_mouse)) { // Key S (83)
		if (scen.scrl.mouse.forced) document.exitPointerLock();
		else forceClick("mouse_scroll");
	}

	// * Scroll by keyboard
	if ((k == 16 || (k == l.scroll_left || k == l.scoll_up || k == l.scroll_right || k == l.scroll_down)) && !isScrollLocked()) {
		e.preventDefault(); // WARNING : browser feature override
		let x, y, v = conf.scen.scrl.key_power;
		if (isPressed(16)) v += conf.scen.scrl.shift_power; // Shift (16) -- WARNING : hard key code
		if (isPressed(l.scroll_left)) x = v; // Key Left (37)
		if (isPressed(l.scoll_up)) y = v; // Key Up (38)
		if (isPressed(l.scroll_right)) x = -v; // Key Right (39)
		if (isPressed(l.scroll_down)) y = -v; // Key Down (40)
		scrollOfPixelInstant(px(x), px(y));
	}

	// * Zoom
	if (k == l.zoom_reset || k == l.zoom_in || k == l.zoom_out) {
		if (!e.ctrlKey) { // TEMP
			e.preventDefault(); // WARNING : browser feature override
			if (isTriggered(l.zoom_reset)) resetScale(); // Keypad Star (106)
			else if (k == l.zoom_in) zoomIn(); // Keypad Plus (107)
			else if (k == l.zoom_out) zoomOut(); // Keypad Minus (109)
		}
	}

	// * Select
	if (k == l.select_commander || k == l.select_trooper_1 || k == l.select_trooper_2 || k == l.select_trooper_3 || k == l.select_trooper_4) {
		e.preventDefault() // WARNING : browser feature override
		if (isDoubleTriggered(l.select_commander)) bindSelectButton(document.getElementById("member_1"), true); // Double Key 1 (49)
		else if (isDoubleTriggered(l.select_trooper_1)) bindSelectButton(document.getElementById("member_2"), true); // Double Key 2 (50)
		else if (isDoubleTriggered(l.select_trooper_2)) bindSelectButton(document.getElementById("member_3"), true); // Double Key 3 (51)
		else if (isDoubleTriggered(l.select_trooper_3)) bindSelectButton(document.getElementById("member_4"), true); // Double Key 4 (52)
		else if (isDoubleTriggered(53)) bindSelectButton(document.getElementById("member_5"), true); // Double Key 5 (53)
		else if (isTriggered(l.select_commander)) forceClick("member_1"); // Key 1 (49)
		else if (isTriggered(l.select_trooper_1)) forceClick("member_2");// Key 2 (50)
		else if (isTriggered(l.select_trooper_2)) forceClick("member_3");// Key 3 (51)
		else if (isTriggered(l.select_trooper_3)) forceClick("member_4");// Key 4 (52)
		else if (isTriggered(l.select_trooper_4)) forceClick("member_5");// Key 5 (53)
	}

	// * Actions
	if (isTriggered(l.move)) forceClick("action_move"); // Key M (77)
	else if (isTriggered(l.attack_range)) forceClick("action_attack_range");// Key R (82)
	else if (isTriggered(l.attack_melee)) forceClick("action_attack_melee");// Key A (65)
	else if (isTriggered(l.give_order)) forceClick("action_give_order");// Key O (79)
	else if (isTriggered(l.use_equipment)) forceClick("action_use_equipment");// Key E (69)
	else if (isTriggered(l.switch_door)) forceClick("action_switch_door");// Key D (68)
	else if (isTriggered(l.scan)) forceClick("action_scan");// Key K (75)
	else if (isTriggered(l.end_turn)) {
		e.preventDefault() // WARNING : browser feature override
		forceClick("action_end_turn");// Key End (35)
	}

});

////////////////////////////////////////////////////////////////////////////////
// @ Events
////////////////////////////////////////////////////////////////////////////////

document.addEventListener("blur", function() {
	main.key.map = {}; // WARNING : hard reset
});
