/*

	mdal.js

*/

// =============================================================================
// -----------------------------------------------------------------------------
// # Notes
// -----------------------------------------------------------------------------
// =============================================================================

/**

	& MODAL

	# Topic           320x400     800x600
		Menu            [x]          *
		Keymap           *          [x]
		Settings        [x]          *
		Save Game        *          [x]
		Load Game        *          [x]

*/

// =============================================================================
// -----------------------------------------------------------------------------
// # Module
// -----------------------------------------------------------------------------
// =============================================================================

var mdal = {

	//////////////////////////////////////////////////////////////////////////////
	// @ Accessors
	//////////////////////////////////////////////////////////////////////////////

	"transition" : {
		"duration" : 250, // time in milliseconds of the modal transition effect -- Default : 250
		"delay" : 10 // time in milliseconds before the modal transition effect is cleared -- Default : 10
	},

	"vu_label_delay" : 750, // time in milliseconds before numerical volume indication disappears -- Default : 750
	"vu_children" : 4, // number of steps in VU meters (i.e. number of displayed blocks) -- Default : 4
	"vu_zero_val" : false, // allow VU meters zero value (i.e. allow gauge to be empty) -- Default : false

	"kbd_nav_selector" : "button", // keyboard navigation pattern for affected HTML elements (CSS selector) -- Default : "button"

	//////////////////////////////////////////////////////////////////////////////
	// @ Mutators
	//////////////////////////////////////////////////////////////////////////////

	"active" : false,

	"topic" : null, // menu, keymap, settings, save_game, load_game

	"pause" : false,

	"timeout" : null,

	"keymap" : {
		"edit" : false,
		"error" : false
	},

	"vu_meter" : {
		"down" : true,
		"target" : null,
		"last_val" : null,
		"timer" : {
			"sound" : null,
			"music" : null
		}
	}

};

// =============================================================================
// -----------------------------------------------------------------------------
// # Modal
// -----------------------------------------------------------------------------
// =============================================================================

////////////////////////////////////////////////////////////////////////////////
// @ Elements
////////////////////////////////////////////////////////////////////////////////

function focusModalClose() {
	document.getElementById("close").focus();
}

////////////////////////////////////////////////////////////////////////////////
// @ Position
////////////////////////////////////////////////////////////////////////////////

function centerModal() {
	let o = document.getElementById("modal");
	let p = window.getComputedStyle(o);
	let x = Math.max(Math.floor((window.innerWidth - parseFloat(p.width)) / 2), 0);
	let y = Math.max(Math.floor((window.innerHeight - parseFloat(p.height )) / 2), 0);
	o.style.left = x + "px";
	o.style.top = y + "px";
}

////////////////////////////////////////////////////////////////////////////////
// @ Visibility
////////////////////////////////////////////////////////////////////////////////

function setModalTransitionProperties(o) { // o = HTML element
	o.style.transform = "scale(0,0)";
	o.style.opacity = "0";
}

function resetModalTransitionProperties(o) { // o = HTML element
	o.style.transform = "";
	o.style.opacity = "";
}

function openModal(s) { // s = modal topic
	let q = document.getElementById("modal_wrap");
	let o = document.getElementById("modal");
	let d = mdal.transition.duration;
	if (!main.pause) {
		mdal.pause = true;
		startPause();
	}
	mdal.active = true;
	mdal.topic = s;
	q.style.display = "";
	q.style.backgroundColor = "transparent";
	q.classList.add("open");
	q.style.transitionDuration = d + "ms";
	setModalTransitionProperties(o);
	mdal.timeout = setTimeout(function() {
		q.style.backgroundColor = "";
		o.style.transition = "transform " + d + "ms, opacity " + d + "ms"; // TEMP
		resetModalTransitionProperties(o);
		focusModalClose();
	}, mdal.transition.delay); // TEMP
}

function closeModal() {
	let q = document.getElementById("modal_wrap");
	let o = document.getElementById("modal");
	q.classList.remove("open");
	q.style.backgroundColor = "transparent";
	setModalTransitionProperties(o);
	mdal.topic = null;
	mdal.active = false;
	if (mdal.pause) {
		stopPause();
		mdal.pause = false;
	} main.keymap = getLocalStorageItem("settings").keymap; // WARNING : keymap registration
}

function createModalContent(s) { // s = modal topic
	let o = document.getElementById("modal");
	o.removeAttribute("class");
	switch(s) {
		case "menu"      : createModalMenu(); o.setAttribute("class", "tiny"); break;
		case "keymap"    : createModalKeymap(); break;
		case "settings"  : createModalSettings(); o.setAttribute("class", "tiny"); break;
		case "save_game" : createModalSaveGame(); break;
		case "load_game" : createModalLoadGame(); break;
	}
}

function toggleModal(s) { // s = modal topic
	if (mdal.active && mdal.topic == s) closeModal();
	else {
		if (mdal.topic != s) createModalContent(s);
		!mdal.active ? openModal(s) : mdal.topic = s;
		focusModalClose();
		centerModal();
	}
}

////////////////////////////////////////////////////////////////////////////////
// @ Content Modifications
////////////////////////////////////////////////////////////////////////////////

function eraseModalContent() {
	document.getElementById("modal_content").innerHTML = "";
}

function createModalHeader(s) { // s = header text
	let o = document.getElementById("modal_content");
	let h = document.createElement("h4");
	h.innerHTML = s;
	o.appendChild(h);
}

function createModalSubHeader(s) { // s = header text ; returns HTML element
	let h = document.createElement("h4");
	h.innerHTML = s;
	h.classList.add("subheader");
	return h;
}

////////////////////////////////////////////////////////////////////////////////
// @ Keyboard Navigation
////////////////////////////////////////////////////////////////////////////////

/**

	& KEYBOARD NAVIGATION

	# Definition
		TAB NAVIGATION is the standard keyboard navigation feature,
		which relies on Tab (forward) and Shift+Tab (backward) keys.
		ARROW NAVIGATION is the the game oriented navigation feature,
		which relies on 'arrow' keys as below:
		> Down    next row or item (same as Tab)
		> Up      prev row or item (same as Shift+Tab)
		> Right   next col or item
		> Left    prev col or item
		* PgDn    last col in row (unimplemented ; alias of End)
		* PgUp    first col in row (unimplemented ; alias of Home)
		> Home    first item in first row
		> End     last item in last row

	# Notions
	> Word            Selector                        Description
		Item            [data-nav]                      An HTML Element
		Row             [data-nav-row]                  An horizontal line of items
		Column          *                               A vertical line of items
		Pattern         button, .slot, [data-cmd]       Any HTML element matched by the pattern is an item

	# Functions
	> Function                                        Description
		setKeyboardNavigation()                         Defines the items
		getKeyboardNavigationArray()                    Returns the items matrix AND the current active item position (as shown below)
		getKeyboardNavigationObject()                   Returns the current active item directions (as shown below)

	# Matrix (example)
		[1],
		[2, 3, 4],
		[5, 6],
		[7, 8],
		[9, null, 10],
		[11, 12, 14],
		[15]

	# Item Position (example)
		[2,1] => 3rd row 2nd col (e.g. 6 in matrix above)

	# Object (example)
		top    : first item in first row     (e.g. '1' in matrix above for item position [2,1])
		bottom : last item in last row       (e.g. '15' in matrix above for item position [2,1])
		up     : item at col in previous row (e.g. '3' in matrix above for item position [2,1])
		down   : item at col in next row     (e.g. '8' in matrix above for item position [2,1])
		left   : item at row in previous col (e.g. '5' in matrix above for item position [2,1])
		right  : item at row in next col     (e.g. '5' in matrix above for item position [2,1])

*/

function setKeyboardNavigation(l) { // l = css selector
	let o = document.getElementById("modal");
	let s = mdal.kbd_nav_selector;
	let i;
	if (Array.isArray(l) && l.length > 0) for (i = 0; i < l.length; i++) s += ", " + l[i];
	else if (typeof(l) == "string") s += ", " + l;
	i = 0;
	o.querySelectorAll(s).forEach(function(q) {
		i++;
		q.dataset.nav = i;
	});
}

function getKeyboardNavigationArray(o, u) { // o = HTML element, u = current active HTML element ; returns array
	let l = o.querySelectorAll("[data-nav-row], [data-nav]");
	let h = i = j = 0;
	let a = [], r, p, v;
	for (h; h < l.length; h++) {
		b = [];
		r = l[h];
		if (r.getAttribute("data-nav-row")) { // found a row
			r.querySelectorAll("[data-nav]").forEach(function(q) {
				if (!(q.hasAttribute("disabled") || q.classList.contains("disabled"))) {
					v = parseInt(q.getAttribute("data-nav"));
					if (q == u) p = [i, j];
					b.push(v);
				} else {
					b.push(null);
				} j++;
			});
			j = 0;
		} else { // found an item
			if (!(r.hasAttribute("disabled") || r.classList.contains("disabled"))) {
				v = parseInt(r.getAttribute("data-nav"));
				if (i > 0 && a[i - 1].includes(v)) {
					continue; // prevent duplication
				} else {
					if (r == u) p = [i, 0];
					b.push(v);
				}
			}
		}
		if (b.length > 0) {
			a.push(b);
			i++;
		}
	} return [a, p];
}

function getKeyboardNavigationObject(o, u) { // o = HTML element, u = current active HTML element ; returns object

	let r = getKeyboardNavigationArray(o, u);
	let a = r[0]; // 2-dimensional array
	let p = r[1]; // current position

	let min, max, prev_v, next_v, prev_h, next_h;
	let row, col, i, j;

	// * First not null item
	outer:
	for (i = 0; i < a.length; i++) {
		for (j = 0; j < a[i].length; j++) {
			if (a[i][j] != null) {
				min = a[i][j];
				break outer;
			}
		}
	}

	// * Last not null item
	outer:
	for (i = a.length - 1; i >= 0; i--) {
		for (j = a[i].length - 1; j >= 0; j--) {
			if (a[i][j] != null) {
				max = a[i][j];
				break outer;
			}
		}
	}

	if (p != null) { // has current position

		// -----------------------------------------------------------------------
		// 1. Verticality
		// -----------------------------------------------------------------------

		// * Previous row
		i = 1; outer:
		while (p[0] - i >= 0) { // prev row (going bottom to top)
			row = a[p[0] - i];
			if (row[p[1]] != null) { // prev pos in row not null
				prev_v = row[p[1]];
				break;
			} else { // prev pos in row is null
				for (j = 0; j < row.length; j++) {
					if (row[j] != null) { // not null in prev row found
						prev_v = row[j];
						break outer;
					}
				}
			} i++;
		} if (prev_v == null) prev_v = max; // no prev row found ; last col in last row

		// * Next row
		i = 1; outer:
		while (p[0] + i < a.length) { // next row (going top to bottom)
			row = a[p[0] + i];
			if (row[p[1]] != null) { // next pos in row not null
				next_v = row[p[1]];
				break;
			} else { // next pos in row is null
				for (j = 0; j < row.length; j++) {
					if (row[j] != null) { // not null in next row found
						next_v = row[j];
						break outer;
					}
				}
			} i++;
		} if (next_v == null) next_v = min; // no next row found ; first col in first row

		// -----------------------------------------------------------------------
		// 2. Horizontality
		// -----------------------------------------------------------------------

		if (a[p[0]].length == 1) { // only one item in current row (i.e. no 'data-nav-row')

			prev_h = prev_v;
			next_h = next_v;

		} else { // more than one item in current row

			// * Previous column
			i = 1;
			while (p[1] - i >= 0) { // prev col (going right to left)
				col = a[p[0]][p[1] - i];
				if (col != null) { // prev col not null
					prev_h = col;
					break;
				} i++;
			} if (prev_h == null) prev_h = a[p[0]][a[p[0]].length -1]; // last col in current row ; no prev col found

			// * Next column
			i = 1;
			while (p[1] + i < a[p[0]].length) { // next col (going left to right)
				col = a[p[0]][p[1] + i];
				if (col != null) { // next col not null
					next_h = col;
					break;
				} i++;
			} if (next_h == null) next_h = a[p[0]][0]; // no next col found ; first col in current row

		}

	} else { // no current position

		prev_v = prev_h = min;
		next_v = next_h = max;

		if (!u.hasAttribute("data-nav")) { // out of navigation array ; always first col in first row
			next_v = prev_v;
			next_h = prev_h;
		}

	}

	return {
		"top" : min,
		"bottom" : max,
		"up" : prev_v,
		"down" : next_v,
		"left" : prev_h,
		"right" : next_h
	}

}

// =============================================================================
// -----------------------------------------------------------------------------
// # Menu
// -----------------------------------------------------------------------------
// =============================================================================

////////////////////////////////////////////////////////////////////////////////
// @ Events Bindings
////////////////////////////////////////////////////////////////////////////////

function bindMenuButtonsEvents() {
	document.querySelectorAll("[data-topic]").forEach(function(o) {
		o.addEventListener("click", function() {
			let s = this.getAttribute("data-topic");
			if (s != null) toggleModal(s);
		});
	});
}

////////////////////////////////////////////////////////////////////////////////
// @ Content Modifications
////////////////////////////////////////////////////////////////////////////////

function createModalMenuKeyString(c) { // c = command key
	let k = getKeymapKeyCodeFromCommand(c);
	return k != null ? "<kbd>" + getKeyString(k) + "</kbd>" : "";
}

function createModalMenuButtons() {
	let o = document.getElementById("modal_content");
	let d1 = document.createElement("div");
	let b1 = document.createElement("button");
	let b2 = document.createElement("button");
	let b3 = document.createElement("button");
	let b4 = document.createElement("button");
	let b5 = document.createElement("button");
	d1.id = "menu";
	b1.innerHTML = lang["load_game"] + createModalMenuKeyString("load_game");
	b2.innerHTML = lang["save_game"] + createModalMenuKeyString("save_game");
	b3.innerHTML = lang["restart"];
	b4.innerHTML = lang["settings"];
	b5.innerHTML = lang["keymap"] + createModalMenuKeyString("keymap");
	b1.dataset.topic = "load_game";
	b2.dataset.topic = "save_game";
	b4.dataset.topic = "settings";
	b5.dataset.topic = "keymap";
	b3.setAttribute("disabled", "disabled");
	b1.classList.add("block", "revert");
	b2.classList.add("block", "revert");
	b3.classList.add("block", "revert");
	b4.classList.add("block", "revert");
	b5.classList.add("block", "revert");
	d1.appendChild(b1);
	d1.appendChild(b2);
	d1.appendChild(b3);
	d1.appendChild(b4);
	d1.appendChild(b5);
	o.appendChild(d1);
	bindMenuButtonsEvents();
}

function createModalMenu() {
	if (conf.debug.time.modal_topic) console.time("createModalMenu"); // DEBUG
	eraseModalContent();
	createModalHeader(lang["menu"]);
	createModalMenuButtons();
	setKeyboardNavigation();
	if (conf.debug.time.modal_topic) console.timeEnd("createModalMenu"); // DEBUG
}

// =============================================================================
// -----------------------------------------------------------------------------
// # Keymap
// -----------------------------------------------------------------------------
// =============================================================================

/**

	& KEYCODES

	# Interaction     Key             User Agent
		8               Backspace       Go back
		9               Tab             Focus
		13              Enter           Click
		27              Escape          Cancel
		32              Space           Click
	# Navigation      ^               ^
		33              Page Up         Scroll One Page Up
		34              Page Down       Scroll One Page Down
		35              End             Scroll To Bottom
		36              Home            Scroll To Top
		37              Left            Scroll One Row Left
		38              Up              Scroll One Line Up
		39              Right           Scroll One Row Right
		40              Down            Scroll One Line Down
	# Modifier        ^               ^
		16              Shift           *
		17              Ctrl            *
		18              Alt             *
		20              CapsLock        *
	# System          ^               ^
		91              OS              *
		93              ContextMenu     *
		44              PrintScreen     *
		145             ScrollLock      *
	# Browser         ^               ^
		112             F1              Help
		114             F3              Search
		116             F5              Refresh
		122             F11             Fullscreen
		123             F12             Dev Tools

	& KEYMAP

	# Disallow
		Backspace, Tab, Enter, Escape, Space
		Shift, Ctrl, Alt, CapsLock
		OS, ContextMenu, PrintScreen, ScrollLock
		Greater/Lower (no QWERTY key)
		NumLock

	# Allow
		F1 to F12
		Alphanumerical
		Diacritical
		Pause
		Insert, Home, Delete, End, PageUp, PageDown
		Arrows
		Key Pad

	# Control Keys
		Enter           Edit entry
		Escape          Reset entry
		Backspace       Clear entry

	# Storing
		Retrieving an item from a local storage is a rather time consuming process.
		Benchmark over 50 occurences shown average results as below:
		> From local storage : 0,13721679688ms
		> From variable      : 0,03205078125ms
		So, during game (i.e. when modal is closed),
		the keymap is registered in a temporay object held by 'main' variable.
		This variable is refreshed every time the modal is closed.

*/

////////////////////////////////////////////////////////////////////////////////
// @ Keys Functions
////////////////////////////////////////////////////////////////////////////////

function getKeyString(k) { // k = key code
	if (k == null) return "null";
	let i;
	switch(getLocalStorageItem("settings").keyboard_layout) {
		case "azerty" : i = 1; break;
		case "qwerty" :
		default       : i = 0;
	} return conf.keys[k][i];
}

function getInteractionKeys(b) { // b = backspace flag ; returns array
	let a = [
		9,  // Tab
		13, // Enter
		27, // Escape
		32  // Space
	];
	if (b) a.unshift(8);
	return a;
}

function getNavigationKeys() { // returns array
	return [
		33, // Page Up
		34, // Page Down
		35, // End
		36, // Home
		37, // Left
		38, // Up
		39, // Right
		40  // Down
	];
}

function getModifierKeys() { // returns array
	return [
		16, // Shift
		17, // Ctrl
		18, // Alt
		20  // CapsLock
	];
}

function isInteractionKey(k, b) { // k = key code, b = backspace flag ; returns boolean
	return getInteractionKeys().includes(k);
}

function isNavigationKey(k) { // k = key code ; returns boolean
	return getNavigationKeys().includes(k);
}

function isModifierKey(k) { // k = key code ; returns boolean
	return getModifierKeys().includes(k);
}

function preventDefaultKeys(e) { // e = event
	let a = getInteractionKeys().concat(getModifierKeys());
	let k = e.which;
	if (!a.includes(k)) e.preventDefault(); // TEMP
}

////////////////////////////////////////////////////////////////////////////////
// @ Keymap Functions
////////////////////////////////////////////////////////////////////////////////

function getKeymapKeyCodeFromCommand(c) { // c = command key ; returns key code
	let k = getLocalStorageItem("settings").keymap[c];
	if (Number.isInteger(k)) return k;
}

function getKeymapCommandFromKeyCode(k) { // k = key code ; returns command key
	let l = getLocalStorageItem("settings").keymap, n;
	for (n in l) if (l[n] == k) return n;
}

function startKeymapKeyEdit(o) { // o = HTML element
	mdal.keymap.edit =  true;
	o.classList.add("edit");
}

function endKeymapKeyEdit(o) { // o = HTML element
	mdal.keymap.edit =  false;
	o.classList.remove("edit");
}

function toggleKeymapKeyEdit(o) { // o = HTML element
	mdal.keymap.edit ? endKeymapKeyEdit(o) : startKeymapKeyEdit(o);
}

function setKeymapKeyError(c, s, b) { // c = command key, s = CSS class, b = animation flag
	let o = document.querySelector("#keys [data-cmd='" + c + "'");
	if (o != undefined) {
		mdal.keymap.error = true;
		o.classList.add("error");
		o.classList.add(s);
	}
}

function unsetKeymapKeyError() {
	mdal.keymap.error = false;
	document.querySelectorAll("#keys .error").forEach(function(o) {
		o.classList.remove("error");
		o.classList.remove("wrong");
		o.classList.remove("warning");
		o.classList.remove("forbidden");
	});
}

////////////////////////////////////////////////////////////////////////////////
// @ Buttons Actions
////////////////////////////////////////////////////////////////////////////////

function resetKeymap() {
	putLocalStorageItem("settings", {"keymap" : conf.keymap});
	removeKeymapKeys();
	createModalKeymapKeys();
	setKeyboardNavigation("[data-cmd]"); // TEMP
	console.info("%cKeymap reset to defaults", conf.console["debug"]); // DEBUG
}

function changeKeyboardLayout() {
	let a = conf.keyboard_layouts;
	let i = a.indexOf(getLocalStorageItem("settings").keyboard_layout);
	i < a.length - 1 ? r = a[i + 1] : r = a[0];
	putLocalStorageItem("settings", {"keyboard_layout" : r});
	this.innerHTML = lang[r];
	removeKeymapKeys();
	createModalKeymapKeys();
	setKeyboardNavigation("[data-cmd]"); // TEMP
	console.info("%cKeyboard layout changed to " + r, conf.console["debug"]); // DEBUG
}

////////////////////////////////////////////////////////////////////////////////
// @ Events Bindings
////////////////////////////////////////////////////////////////////////////////

function bindKeymapButtonsEvents() {
	let b1 = document.getElementById("reset_keymap");
	let b2 = document.getElementById("change_keyboard_layout");
	b1.addEventListener("click", resetKeymap);
	b2.addEventListener("click", changeKeyboardLayout);
};

function bindKeymapKeyEvents(o) { // o = HTML element

	o.addEventListener("click", function() {
		toggleKeymapKeyEdit(o);
	}); // TEMP

	o.addEventListener("keypress", function(e) {
		if (mdal.keymap.edit) preventDefaultKeys(e);
	}); // TEMP

	o.addEventListener("keydown", function(e) {
		if (mdal.keymap.edit) preventDefaultKeys(e); // TEMP
		if (mdal.keymap.error) unsetKeymapKeyError(); // TEMP
	});

	o.addEventListener("keyup", function(e) {

		let k = e.which; // TEMP

		if (k == 13 || k == 32) toggleKeymapKeyEdit(o); // Enter or Space

		if (!mdal.keymap.edit) return;

		if (mdal.keymap.error) unsetKeymapKeyError();

		preventDefaultKeys(e); // TEMP

		let c = o.getAttribute("data-cmd");
		let b = false; // edit flag
		let r = false; // reset flag
		let l;

		if (k == 27) { // Escape
			b = true;
			r = true;
			k = conf.keymap[c];
		}

		if (k == 8 || k == null) { // Backspace or reset to null

			b = true;
			o.innerHTML = "&nbsp;";
			let l = getLocalStorageItem("settings");
			l.keymap[c] = null;
			putLocalStorageItem("settings", {"keymap" : l.keymap});
			console.info("%cCommand '" + c + "' erased", conf.console["debug"]); // DEBUG

		} else if (Object.keys(conf.keys).includes(k.toString())) { // is valid key

			let n = getKeymapCommandFromKeyCode(k);

			if (n === undefined) {
				b = true;
				o.innerHTML = getKeyString(k);
				let l = getLocalStorageItem("settings");
				l.keymap[c] = k;
				putLocalStorageItem("settings", {"keymap" : l.keymap});
				console.info("%cCommand '" + c + "' " + (r ? "reset" : "binded") + " to key " + k + " (" + getKeyString(k) + ")", conf.console["debug"]); // DEBUG
			} else if (!r) {
				setKeymapKeyError(n, "wrong");
				setKeymapKeyError(c, "forbidden");
				console.info("%cOups... key " + k + " (" + getKeyString(k) + ") already set", conf.console["debug"]); // DEBUG
			}

		} else if (!isInteractionKey(k) && !isModifierKey(k)) { // not navigation or modifier key
			setKeymapKeyError(c, "warning");
			console.info("%cNope! key " + k + " (" + e.key + ") unbindable", conf.console["debug"]); // DEBUG
		}

		if (b) endKeymapKeyEdit(this);

		e.stopPropagation(); // TEMP

	});

	o.addEventListener("blur", function(e) {
		if (mdal.keymap.edit) endKeymapKeyEdit(this);
		if (mdal.keymap.error) unsetKeymapKeyError();
	});

}

////////////////////////////////////////////////////////////////////////////////
// @ Content Modifications
////////////////////////////////////////////////////////////////////////////////

function escapeRegExpOperators(s) { // s = string ; returns string
	return s
		.replace("^", "\\^")
		.replace("&", "\\&")
		.replace("(", "\\(")
		.replace(")", "\\)")
		.replace("[", "\\[")
		.replace("]", "\\]")
		.replace("*", "\\*")
		.replace(".", "\\.")
		.replace("+", "\\+")
		.replace("-", "\\-");
}

function removeKeymapKeys() {
	document.getElementById("keys").remove();
}

function createModalKeymapKey(k, c) { // k = key code, c = command key ; returns HTML element
	let d1 = document.createElement("div");
	let d2 = document.createElement("div");
	let d3 = document.createElement("div");
	let kb = document.createElement("kbd");
	d1.classList.add("key");

	let n = k == null ? "&nbsp;" : getKeyString(k); // key name
	let s = lang.commands[c]; // command string

	kb.dataset.cmd = c;
	kb.innerHTML = n;
	kb.setAttribute("tabindex", "0"); // TODO : except if can't be modified (e.g. Escape)
	bindKeymapKeyEvents(kb);
	d2.appendChild(kb);

	if (n != "\\") { // skip backslash
		let r = new RegExp("(" + escapeRegExpOperators(n) + ")");
		if (r.test(s)) s = s.replace(r, "<em>$1</em>");
	}

	d3.innerHTML = s;
	d1.appendChild(d2);
	d1.appendChild(d3);
	return d1;
}

function createModalKeymapKeys() {
	let o = document.querySelector("#modal_content h4");
	let d1 = document.createElement("div");
	let d2 = document.createElement("div");
	let l = getLocalStorageItem("settings").keymap, k;
	let i = j = 0;
	let m = Object.keys(l).length;
	for (k in l) {
		d2.appendChild(createModalKeymapKey(l[k], k));
		i++;
		j++;
		if (i == 3 || j == m) {
			d1.appendChild(d2);
			d2.dataset.navRow = i;
			d2 = document.createElement("div");
			i = 0;
		}
	}
	d1.id = "keys";
	o.insertAdjacentElement("afterend", d1);
}

function createModalKeymapButtons() {
	let o = document.getElementById("modal_content");
	let d2 = document.createElement("div");
	let b1 = document.createElement("button");
	let b2 = document.createElement("button");
	d2.id = "buttons";
	b1.id = "reset_keymap";
	b2.id = "change_keyboard_layout";
	b1.classList.add("small");
	b2.classList.add("round", "revert");
	b1.innerHTML = lang["reset"];
	b2.innerHTML = lang[getLocalStorageItem("settings").keyboard_layout]; // TEMP
	d2.appendChild(b1);
	d2.appendChild(b2);
	o.appendChild(d2);
	bindKeymapButtonsEvents()
}

function createModalKeymap() {
	if (conf.debug.time.modal_topic) console.time("createModalKeymap"); // DEBUG
	eraseModalContent();
	createModalHeader(lang["keymap"]);
	createModalKeymapKeys();
	createModalKeymapButtons();
	setKeyboardNavigation("[data-cmd]");
	if (conf.debug.time.modal_topic) console.timeEnd("createModalKeymap"); // DEBUG
}

// =============================================================================
// -----------------------------------------------------------------------------
// # Settings
// -----------------------------------------------------------------------------
// =============================================================================

/**

	& VU METERS

	# Disambiguation
		Index => Integer (0 to n ; counter)
		Value => Float   (0.0 to 1.0 ; ratio)

*/

////////////////////////////////////////////////////////////////////////////////
// @ Audio Functions
////////////////////////////////////////////////////////////////////////////////

function getAudioItemKeyFromId(o) { // o = HTML element ; returns audio item key
	return o.id.slice(-5);
}

////////////////////////////////////////////////////////////////////////////////
// @ VU Meters Functions
////////////////////////////////////////////////////////////////////////////////

function setVuMeterIndex(o, n) { // o = HTML element, index (integer)
	let l = o.children, i;
	for (i = 0; i < l.length; i++) {
		if (i <= n) l[i].classList.add("active")
		else l[i].classList.remove("active")
	}
}

function getVuMeterIndex(o) { // o = HTML element ; returns index (integer)
	return o.querySelectorAll(".active").length;
}

function getVuMeterIndexFromValue(o, v) { // o = HTML element, v = value (float) ; returns index (integer)
	return Math.floor(v * o.children.length) - 1;
}

function getVuMeterValueFromIndex(o, n) { // o = HTML element, n = index (integer) ; returns value (float)
	return Math.clamp(0, (n + 1) * (100 / o.children.length), 100) / 100;
}

function setVuMeterLabel(s, v) { // s = audio item key, v = value (float)
	clearTimeout(mdal.vu_meter.timer[s]);
	let u = document.querySelector("[for='volume_" + s + "']");
	u.innerHTML = (v * 100).toFixed() + "%";
	u.style.color = "yellow";
	mdal.vu_meter.timer[s] = setTimeout(function() {
		u.innerHTML = u.getAttribute("data-text");
		u.style.color = "";
	}, mdal.vu_label_delay); // TEMP
}

function changeVolume(s, v) { // s = audio item key, v = value (float)
	// * Set volume
	if (s == "sound") setSoundVolume(v);
	else if (s == "music") setMusicVolume(v);
	// * Set volume label
	setVuMeterLabel(s, v);
	// * Register audio settings
	storeAudioSettings();
}

function getVuMeterValueFromMouse(o, e) { // o = HTML element, e = mouse event ; returns value (float) or undefined
	let r = o.getBoundingClientRect();
	let x = e.clientX - r.left;
	let l = o.children, i;
	let d = r.width / l.length;
	let n = Math.clamp(mdal.vu_zero_val ? -1 : 0, Math.floor(x / d), l.length - 1);
	let v = getVuMeterValueFromIndex(o, n);
	if (mdal.vu_meter.last_val == n) return; // no change
	mdal.vu_meter.last_val = n;
	setVuMeterIndex(o, n);
	return v;
}

function changeVolumeFromMouse(o, e) { // o = HTML element, e = mouse event
	let v = getVuMeterValueFromMouse(o, e);
	if (v != null) {
		let s = getAudioItemKeyFromId(o);
		changeVolume(s, v);
	}
}

function changeVolumeFromKey(o, i) { // o = HTML element, i = signed integer
	if (!Number.isInteger(i)) i = 1;
	let s = getAudioItemKeyFromId(o);
	let n = getVuMeterIndexFromValue(o, main.audio[s].volume);
	let max = o.children.length;
	let min = mdal.vu_zero_val ? -1 : 0;
	n = n + i >= max ? min : n + i < min ? max - 1 : n + i;
	let v = getVuMeterValueFromIndex(o, n);
	setVuMeterIndex(o, n);
	changeVolume(s, v);
}

////////////////////////////////////////////////////////////////////////////////
// @ Checkboxes Functions
////////////////////////////////////////////////////////////////////////////////

function checkVuMeterEnabling(s, b) { // s = audio item key, b = checked flag
	let o = document.getElementById("volume_" + s);
	if (b) {
		o.classList.remove("disabled");
		o.setAttribute("tabindex", "0");
	} else {
		o.classList.add("disabled");
		o.setAttribute("tabindex", "-1");
	}
}

////////////////////////////////////////////////////////////////////////////////
// @ Events Bindings
////////////////////////////////////////////////////////////////////////////////

function bindSettingsAudioEvents() {
	// * Get audio settings from storage
	let l = getLocalStorageItem("settings").audio;
	// * Get container
	let p = document.getElementById("setting_audio");
	// * Initialize VU meters
	p.querySelectorAll(".vu-meter").forEach(function(o) {
		let s = getAudioItemKeyFromId(o);
		setVuMeterIndex(o, getVuMeterIndexFromValue(o, l[s].volume));
		// * Bind events
		o.addEventListener("mousedown", function(e) {
			if (!o.classList.contains("disabled")) {
				mdal.vu_meter.down = true;
				mdal.vu_meter.target = o;
				changeVolumeFromMouse(o, e);
			}
		});
		document.addEventListener("mouseup", function() {
			mdal.vu_meter.down = false;
			mdal.vu_meter.target = null;
			mdal.vu_meter.last_val = null;
		});
		document.addEventListener("mousemove", function(e) {
			if (!o.classList.contains("disabled")) {
				if (mdal.vu_meter.down && mdal.vu_meter.target != null) {
					changeVolumeFromMouse(mdal.vu_meter.target, e);
				}
			}
		});
		o.addEventListener("keydown", function(e) {
			if (!o.classList.contains("disabled")) {
				let k = e.which;
				if (k == 8 || k == 13 || k == 32) { // Backspace, Enter or Space
					changeVolumeFromKey(o, k == 8 || e.shiftKey ? -1 : 1);
				}
			}
		});
	});
	// * Initialize checkboxes
	p.querySelectorAll("[type='checkbox']").forEach(function(o) {
		let s = getAudioItemKeyFromId(o);
		// * Reset checkboxes
		o.checked = l[s].enabled;
		// * Check VU meters enabling
		checkVuMeterEnabling(s, o.checked);
		// * Add additional keyboard control
		o.addEventListener("keydown", function(e) {
			if (e.which == 13) this.click(); // Enter
		});
		// * Bind Events
		o.addEventListener("change", function() {
			if (s == "sound") {
				if (!this.checked) resetSoundPlayers();
			} else if (s == "music") {
				if (!this.checked) stopMusic();
				else if (!main.pause) playMusic();
			}
			checkVuMeterEnabling(s, this.checked);
			main.audio[s].enabled = this.checked;
			storeAudioSettings();
		});
	});
}

////////////////////////////////////////////////////////////////////////////////
// @ Content Modifications
////////////////////////////////////////////////////////////////////////////////

function createModalSettingsAudioItem(s) { // s = audio item key, returns HTML element
	let d1 = document.createElement("div");
	let e1 = document.createElement("label");
	let e2 = document.createElement("em");
	let e3 = document.createElement("input");
	let e4 = document.createElement("span");
	let e5 = document.createElement("div");
	e1.classList.add("checkbox", "toggle");
	e2.setAttribute("for", "volume_" + s);
	e2.dataset.text = lang[s];
	e2.innerHTML = lang[s];
	e3.id = "enable_" + s;
	e3.type = "checkbox";
	e5.id = "volume_" + s;
	e5.classList.add("vu-meter");
	e5.setAttribute("tabindex", "0");
	for (i = 0; i < mdal.vu_children; i++) {
		e5.appendChild(e4);
		e4 = document.createElement("span");
	}
	e1.appendChild(e2);
	e1.appendChild(e3);
	e1.appendChild(e4);
	d1.appendChild(e1);
	d1.appendChild(e5);
	d1.dataset.navRow = d1.children.length;
	return d1;
}

function createModalSettingsAudio() {
	let o = document.getElementById("modal_content");
	let h = createModalSubHeader(lang["audio"]);
	let d = document.createElement("div");
	d.id = "setting_audio"; // TEMP
	d.appendChild(h);
	d.appendChild(createModalSettingsAudioItem("sound"));
	d.appendChild(createModalSettingsAudioItem("music"));
	o.appendChild(d);
}

function createModalSettingsLanguage() {
	let o = document.getElementById("modal_content");
	let h = createModalSubHeader(lang["language"]);
	let d = document.createElement("div");
	let p = document.createElement("p");
	d.id = "setting_language"; // TEMP
	p.innerHTML = lang["lang"]["en"];
	d.appendChild(h);
	d.appendChild(p);
	o.appendChild(d);
}

function createModalSettings() {
	if (conf.debug.time.modal_topic) console.time("createModalSettings"); // DEBUG
	eraseModalContent();
	createModalHeader(lang["settings"]);
	createModalSettingsAudio();
	createModalSettingsLanguage();
	bindSettingsAudioEvents();
	setKeyboardNavigation(["[type='checkbox']", ".vu-meter"]);
	if (conf.debug.time.modal_topic) console.timeEnd("createModalSettings"); // DEBUG
}

// =============================================================================
// -----------------------------------------------------------------------------
// # Save/Load
// -----------------------------------------------------------------------------
// =============================================================================

////////////////////////////////////////////////////////////////////////////////
// @ Slots Selection
////////////////////////////////////////////////////////////////////////////////

function enableSlotButtons(b) { // b = empty flag
	document.querySelectorAll("[data-slot-button='true']").forEach(function(o) {
		if (!(b && o.id == "delete_slot")) o.removeAttribute("disabled");
	});
}

function disableSlotButtons() {
	document.querySelectorAll("[data-slot-button='true']").forEach(function(o) {
		o.setAttribute("disabled", "disabled");
	});
}

function clearSlotSelection() {
	disableSlotButtons();
	document.querySelectorAll(".slot").forEach(function(o) {
		o.classList.remove("active");
	});
}

function toggleSlotSelection(o) { // o = HTML element
	if (!o.classList.contains("disabled")) {
		let b = o.classList.contains("active");
		if (!b) {
			clearSlotSelection();
			o.classList.add("active");
			enableSlotButtons(o.classList.contains("empty"));
		} else {
			saveLoadSlot(o);
		}
	}
}

////////////////////////////////////////////////////////////////////////////////
// @ Buttons Actions
////////////////////////////////////////////////////////////////////////////////

function deleteSlot(o) { // o = HTML element
	let q = document.getElementById("slots");
	let s = q.getAttribute("data-save-load");
	let k = o.getAttribute("data-slot");
	let u = createModalSaveLoadSlot(k, s, true);
	o.insertAdjacentElement("beforebegin", u);
	o.remove();
	disableSlotButtons();
	setKeyboardNavigation(".slot"); // TEMP
	!u.classList.contains("disabled") ? u.focus() : focusModalClose(); // TEMP
	eraseLocalStorageItem(k);
	console.info("%cSlot " + k + " deleted", conf.console["debug"]); // DEBUG
}

function saveLoadSlot(o) { // o = HTML element
	let q = document.getElementById("slots");
	let s = q.getAttribute("data-save-load");
	let k = o.getAttribute("data-slot");
	s == "save" ? saveGame(k) : loadGame(k);
	closeModal();
}

////////////////////////////////////////////////////////////////////////////////
// @ Events Bindings
////////////////////////////////////////////////////////////////////////////////

function getActiveSlot() { // returns HTML element
	return document.querySelector(".slot.active");
}

function bindSaveLoadButtonsEvents() {
	let q = document.getElementById("slots");
	let s = q.getAttribute("data-save-load");
	let b1 = document.getElementById("delete_slot");
	let b2 = document.getElementById(s  +"_slot");
	b1.addEventListener("click", function() {
		deleteSlot(getActiveSlot());
	});
	b2.addEventListener("click", function() {
		saveLoadSlot(getActiveSlot());
	});
}

function bindSaveLoadSlotEvents(o) { // o = HTML element
	o.addEventListener("click", function() {
		toggleSlotSelection(this);
	});
	o.addEventListener("keydown", function(e) {
		let k = e.which;
		if (k == 13 || k == 32) { // Enter OR Space
			toggleSlotSelection(this);
		} else if (k == 46) { // Delete
			if (!this.classList.contains("empty")) deleteSlot(this);
		}
	});
}

////////////////////////////////////////////////////////////////////////////////
// @ Content Modifications
////////////////////////////////////////////////////////////////////////////////

function createModalSaveLoadSlotTime(t) { // t = Unix timestamp ; returns HTML element
	function f(i) { return leadZero(i, 10); }
	let d = new Date();
	d.setTime(t);
	let month = d.getMonth();
	let year  = d.getFullYear();
	let day   = d.getDate();
	let hour  = d.getHours();
	let min   = d.getMinutes();
	let sec   = d.getSeconds();
	let date  = year + "-" + f(month + 1) + "-" + f(day) + " " + f(hour) + ":" + f(min) + ":" + f(sec);
	let o = document.createElement("time");
	o.setAttribute("datetime", date);
	o.innerHTML = lang.month[month] + " " + year + ", " + day + "<sup>" + getNumberOrdinalSuffix(day) +"</sup> &sdot; " + f(hour) + ":" + f(min);
	return o;
}

function createModalSaveLoadSlot(k, s, b) { // k = save slot key, s = save/load key, b = empty flag ; returns HTML element
	let o = document.createElement("div");
	let d1 = document.createElement("div");
	let d2 = document.createElement("div");
	let p1 = document.createElement("p");
	let p2 = document.createElement("p");
	let p3 = document.createElement("p");
	p1.innerHTML = "<strong>" + lang[k] + "</strong>"
	d2.appendChild(p1);
	o.dataset.slot = k;
	o.classList.add("slot");
	if ((s == "save" && (k == "autosave" || k == "quicksave"))
	 || (s == "load" && b)) o.classList.add("disabled");
	else o.setAttribute("tabindex", "0");
	if (b) {
		o.classList.add("empty"); // TEMP
		d1.innerHTML = lang.empty;
	} else {
		let l = getLocalStorageItem(k);
		let img_data  = l.img;
		let timestamp = l.time;
		let map_id    = l.setup.map;
		let game_mode = l.setup.mode;
		let map_index = getCampaignMapIndex(map_id);
		let map_total = getCampaignMapTotal();
		let nb_player = l.setup.nb_player;
		let game_info = game_mode == "campaign" ? map_index + "/" + map_total : nb_player + " player" + (nb_player > 1 ? "s" : "");
		let game_map  = lang[map_id].name;
		let game_turn = l.game.turn;
		p2.classList.add(game_mode);
		p2.innerHTML = "<strong>" + lang[game_mode] + "</strong> <small>(" + game_info + ")</small>";
		p3.innerHTML = game_map + " &ndash; Turn " + game_turn;
		d2.appendChild(p2);
		d2.appendChild(p3);
		d2.appendChild(createModalSaveLoadSlotTime(timestamp));
		d1.innerHTML = "<img src='" + img_data + "' alt='" + lang.thumbnail + "'>";
	}
	o.appendChild(d1);
	o.appendChild(d2);
	bindSaveLoadSlotEvents(o);
	return o;
}

function createModalSaveLoadSlots(s) { // s = save/load key
	let o = document.getElementById("slots");
	let d1 = document.createElement("div");
	let a = conf.storage.save_slots;
	let i = j = 0;
	let m = a.length;
	for (j = 0; j < a.length; j++) {
		d1.appendChild(createModalSaveLoadSlot(a[j], s, !hasLocalStorageItem(a[j])));
		i++;
		if (i == 2 || j == m) {
			o.appendChild(d1);
			d1.dataset.navRow = i;
			d1 = document.createElement("div");
			i = 0;
		}
	}
}

function createModalSaveLoad(s) { // s = save/load key
	let o = document.getElementById("modal_content");
	let d1 = document.createElement("div");
	let d2 = document.createElement("div");
	let b1 = document.createElement("button");
	let b2 = document.createElement("button");
	d1.id = "slots";
	d1.dataset.saveLoad = s;
	d2.id = "buttons";
	b1.id = "delete_slot";
	b2.id = s +"_slot";
	b1.innerHTML = lang["delete"];
	b2.innerHTML = lang[s];
	b1.dataset.slotButton = "true";
	b2.dataset.slotButton = "true";
	b1.classList.add("small");
	b2.classList.add("large");
	d2.appendChild(b1);
	d2.appendChild(b2);
	o.appendChild(d1);
	o.appendChild(d2);
	bindSaveLoadButtonsEvents();
	disableSlotButtons();
	createModalSaveLoadSlots(s);
	setKeyboardNavigation(".slot");
}

function createModalSaveGame() {
	if (conf.debug.time.modal_topic) console.time("createModalSaveGame"); // DEBUG
	eraseModalContent();
	createModalHeader(lang["save_game"]);
	createModalSaveLoad("save");
	if (conf.debug.time.modal_topic) console.timeEnd("createModalSaveGame"); // DEBUG
}

function createModalLoadGame() {
	if (conf.debug.time.modal_topic) console.time("createModalLoadGame"); // DEBUG
	eraseModalContent();
	createModalHeader(lang["load_game"]);
	createModalSaveLoad("load");
	if (conf.debug.time.modal_topic) console.timeEnd("createModalLoadGame"); // DEBUG
}

// =============================================================================
// -----------------------------------------------------------------------------
// # Events
// -----------------------------------------------------------------------------
// =============================================================================

////////////////////////////////////////////////////////////////////////////////
// @ Modal
////////////////////////////////////////////////////////////////////////////////

document.getElementById("modal_wrap").addEventListener("transitionend", function(e) {
	if (e.target == this && !mdal.active) {
		this.style.display = "none";
		this.querySelector("#modal").style.transition = "";
	}
});

document.getElementById("modal_wrap").addEventListener("click", function(e) {
	if (e.target == this) {
		closeModal();
	}
});

document.getElementById("close").addEventListener("click", function() {
	closeModal();
});

////////////////////////////////////////////////////////////////////////////////
// @ Document
////////////////////////////////////////////////////////////////////////////////

document.addEventListener("keydown", function(e) {
	let k = e.which;
	if (!mdal.active || mdal.keymap.edit) return;
	if (k >= 33 && k <= 40) { // any arrow key
		let o = document.getElementById("modal");
		let u = e.target;
		let r = getKeyboardNavigationObject(o, u);
		let index = null;
		switch(k) {
			case 33 : // PageUp
			case 36 : index = r.top; break; // Home
			case 34 : // PageDown
			case 35 : index = r.bottom; break; // End
			case 37 : index = r.left; break; // Left
			case 38 : index = r.up; break; // Up
			case 39 : index = r.right; break; // Right
			case 40 : index = r.down; break; // Down
		}
		let q = document.querySelector("[data-nav='" + index + "']");
		if (q != null) q.focus();
	}
});
