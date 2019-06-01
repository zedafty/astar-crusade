/*

	main.js

*/

// =============================================================================
// -----------------------------------------------------------------------------
// # Module
// -----------------------------------------------------------------------------
// =============================================================================

var main = {

	//////////////////////////////////////////////////////////////////////////////
	// @ Shown
	//////////////////////////////////////////////////////////////////////////////

	"shown" : false,

	//////////////////////////////////////////////////////////////////////////////
	// @ Ready
	//////////////////////////////////////////////////////////////////////////////

	"ready" : false,

	//////////////////////////////////////////////////////////////////////////////
	// @ Load
	//////////////////////////////////////////////////////////////////////////////

	"load" : {
		"count" : 0,
		"index" : 0,
		"spin" : {
			"show" : null,
			"hide" : null
		},
		"main" : {
			"show" : null,
			"hide" : null
		}
	},

	//////////////////////////////////////////////////////////////////////////////
	// @ Window
	//////////////////////////////////////////////////////////////////////////////

	"window" : {
		"timeout" : 0
	},

	//////////////////////////////////////////////////////////////////////////////
	// @ Screen
	//////////////////////////////////////////////////////////////////////////////

	"screen" : {
		"docked" : true,
		"enlarged" : false,
		"scale" : 1,
		"x" : 0,
		"y" : 0
	},

	//////////////////////////////////////////////////////////////////////////////
	// @ Mouse
	//////////////////////////////////////////////////////////////////////////////

	"mouse" : {
		"x" : 0,
		"y" : 0,
		"hover" : false,
		"down" : false
	},

	//////////////////////////////////////////////////////////////////////////////
	// @ Cursor
	//////////////////////////////////////////////////////////////////////////////

	"cursor" : {
		"state" : null // current cursor state
	},

	//////////////////////////////////////////////////////////////////////////////
	// @ Keymap
	//////////////////////////////////////////////////////////////////////////////

	"keymap" : null, // refreshed when modal is closed

	//////////////////////////////////////////////////////////////////////////////
	// @ Keys
	//////////////////////////////////////////////////////////////////////////////

	"key" : { // key vars
		"map" : {},
		"curr" : null,
		"last" : null,
		"twice" : null,
		"interval" : 0
	},

	//////////////////////////////////////////////////////////////////////////////
	// @ Controls
	//////////////////////////////////////////////////////////////////////////////

	"ctrl" : {
		"action" : null
	},

	//////////////////////////////////////////////////////////////////////////////
	// @ Audio
	//////////////////////////////////////////////////////////////////////////////

	"audio" : {
		"mute" : false,
		"sound" : {
			"enabled" : true, // user setting
			"volume" : 1.0 // user setting
		},
		"music" : {
			"enabled" : true, // user setting
			"volume" : 1.0, // user setting
			"playtime" : 0, // active player
			"active" : null, // "music_1" or "music_1"
			"resource" : [null, null], // current file
			"timer" : [null, null], // fade timeout
			"count" : [-1, -1] // fade counter
		}
	},

	//////////////////////////////////////////////////////////////////////////////
	// @ Pause
	//////////////////////////////////////////////////////////////////////////////

	"pause" : false,

	//////////////////////////////////////////////////////////////////////////////
	// @ Save
	//////////////////////////////////////////////////////////////////////////////

	"save" : {
		"forbidden" : false,
		"prevented" : false,
		"pending" : false,
		"savekey" : null
	},

	//////////////////////////////////////////////////////////////////////////////
	// @ Storage
	//////////////////////////////////////////////////////////////////////////////

	"storage" : {
		"timer" : null
	}

};

// =============================================================================
// -----------------------------------------------------------------------------
// # Load
// -----------------------------------------------------------------------------
// =============================================================================

/**

	& LOAD RESOURCES

	Load ALL images before starting game (no matter if they are to be used or not)
	Prepare spritesets for convenience and to reduce the number of contingent HTTP Requests
	Display a progress bar using the 'onload' image event
	At entity spawn, set entity image as a reference of corresponding already loaded image

	This allows several things to be done:
	1) load images before starting the game
	2) display a precise progress bar of loaded images
	3) change all sprites sharing the same bitmap resource at once

	Images resources can be of two kinds:
	1) User Interface
	2) Sprites

	Logically, User Interface images should rely only on standard HTTP Request methods (should it be HTML images or CSS backgrounds)
	which means they are displayed when they are ready to be output (supposingly at window.load for every visible elements)
	On the other hand, Sprites should be pre-cached because those images are generated within the canvas
	and a loading latency result immediately in a game experience decrease
	Issue is for CSS background images of invisible elements
	If only sprites are pre-cached, those images will be requested when the element holding them is turned to visible
	This can produce a slight 'blank' (especially true for 'cursor' images which can't be defined in spritesets)
	An elegant solution could be to simply display an outside 'main' progress bar on page load,
	then charge all images (User Interface + Sprites) and when ready start main process
	In that configuration, 'main' container should start hidden

*/

////////////////////////////////////////////////////////////////////////////////
// @ Display
////////////////////////////////////////////////////////////////////////////////

function setTitle() {
	let q = document.getElementById("title");
	q.querySelector("#stage").innerHTML = prog.stage;
	q.querySelector("#version").innerHTML = prog.version;
}

function showSpinner() {
	let q = document.getElementById("spin");
	q.style.display = "";
	clearTimeout(main.load.spin.hide);
	main.load.spin.show = setTimeout(function() {
		q.style.opacity = "";
	}, 125);
}

function hideSpinner(f) { // f = callback function
	if (f === undefined) f = function() {};
	let q = document.getElementById("spin");
	q.style.opacity = "0";
	clearTimeout(main.load.spin.show);
	main.load.spin.hide = setTimeout(function() {
		q.style.display = "none";
		f();
	}, 125);
}

function showMain(t) { // t = timeout (ms)
	let q = document.getElementById("main");
	q.style.display = "";
	clearTimeout(main.load.main.hide);
	main.load.main.show = setTimeout(function() {
		q.style.opacity = "";
	}, t !== undefined ? t : 250);
}

function hideMain(t) { // t = timeout (ms)
	let q = document.getElementById("main");
	q.style.opacity = "0";
	clearTimeout(main.load.main.show);
	main.load.main.hide = setTimeout(function() {
		q.style.display = "none";
	}, t !== undefined ? t : 250);
}

////////////////////////////////////////////////////////////////////////////////
// @ Routine
////////////////////////////////////////////////////////////////////////////////

function loadResources(s, p, f) { // s = resource stack, p = progress key (spin or load), f = callback function

	if (f === undefined) f = function() {};

	// * Reset load variables
	main.load.count = 0;
	main.load.index = 0;

	// * Prepare progress
	var o, q;
	if (p == "spin") {
		o = document.getElementById("spin");
	} else if (p == "load") {
		o = document.getElementById("load");
		q = o.querySelector(".progress div");
		o.querySelector("p").innerHTML = lang["loading"];
		o.style.display = "";
	}

	// * Set loading variables
	var l = s,  a = [];
	let k, u;

	// * Count number of resources
	for (k in l) {
		for (u in l[k]) {
			a.push([k, u]);
			main.load.count++;
		}
	}

	console.info("%cloading " + main.load.count + " "+ (p == "spin" ? "user interface" : "sprites") + " resources", conf.console["debug"]); // DEBUG

	// * Set function
	function loadImage(key, sub) {
		// console.log("loading " + key + " " + sub + "..."); // DEBUG
		l[key][sub].img = new Image();
		l[key][sub].img.src = l[key][sub].src;
		l[key][sub].img.onload = function() {
			main.load.index++;
			if (p == "spin") {
				let v = Math.round(main.load.index / main.load.count * 400);
				let d = Math.round(1 / main.load.count * 400);
				let r = conf.main.load.spin.rgb[0];
				let g = conf.main.load.spin.rgb[1];
				let b = conf.main.load.spin.rgb[2];
				let c = (r + (255 - r) / 400 * v) + "," + (g + (255 - g) / 400 * v) + "," + (b + (255 - b) / 400 * v);
				if (v <= 100) {
					if (v + d >= 100) v = 100;
					q = o.querySelector("span:nth-of-type(1)");
					q.style.width = v + "%";
				} else if (v > 100 && v <= 200) {
					if (v + d >= 200) v = 200;
					q = o.querySelector("span:nth-of-type(2)");
					q.style.height = (v - 100) + "%";
				} else if (v > 200 && v <= 300) {
					if (v + d >= 300) v = 300;
					q = o.querySelector("span:nth-of-type(3)");
					q.style.width = (v - 200) + "%";
				} else {
					if (v + d >= 400) v = 400;
					q = o.querySelector("span:nth-of-type(4)");
					q.style.height = (v - 300) + "%";
				}
				o.querySelectorAll("span").forEach(function(e) {
					e.style.backgroundColor = "rgb(" + c + ")";
				});
			} else if (p == "load") {
				q.style.width = Math.round(main.load.index / main.load.count * 100) + "%";
			}

			// console.log("image " + main.load.index + " of " + main.load.count + " loaded -- " + (Math.round(main.load.index / main.load.count * 400))); // DEBUG

			if (main.load.index == main.load.count) {
				if (p == "load") o.style.display = "none";
				f();
			}
		}
	}

	// * Load images
	var i = 0; // TEST
	var j = 0;
	while (i < main.load.count) {
		// -------------------------------------------------------------------------
		// TEST : load resources
		// -------------------------------------------------------------------------
		setTimeout(function() {
			loadImage(a[j][0], a[j][1]);
			j++;
		}, (p == "spin" ? conf.main.load.spin_latency * i : conf.main.load.load_latency * i));
		// -------------------------------------------------------------------------
		// STABLE : load resources
		// -------------------------------------------------------------------------
		// loadImage(a[i][0], a[i][1]);
		// -------------------------------------------------------------------------
		i++;
	}

}

////////////////////////////////////////////////////////////////////////////////
// @ Event
////////////////////////////////////////////////////////////////////////////////

window.addEventListener("load", function() {

	disableToolButtons(true); // TEMP
	disableActionButtons(); // TEMP
	initializeStorage(); // VERY TEMP
	initializeAudio(); // TEMP
	bindTipsEvents(); // TEMP

	// game.map = "_01"; // TEMP (original map)
	game.map = "m01"; // TEMP (resized map)

	spr.back.board.src = maps[game.map].board;

	dockMain(true); // TEMP

	hideMain(0);
	showSpinner();

	loadResources(ui, "spin", function() {

		hideSpinner(function() {
			showMain(0);
			resetCursor();
			main.shown = true;
		});

		loadResources(spr, "load", function() {
			startScene();
			showStatus();
			setTitle();
			main.ready = true;
			if (main.audio.music.enabled) playMusic(); // TEMP
		});

	});

});

// =============================================================================
// -----------------------------------------------------------------------------
// # Screen
// -----------------------------------------------------------------------------
// =============================================================================

////////////////////////////////////////////////////////////////////////////////
// @ Drag
////////////////////////////////////////////////////////////////////////////////

document.getElementById("main").addEventListener("mousedown", function(e) {
	if (!main.screen.enlarged && e.button == 0 && e.target == this) { // left mouse button
		let q = document.getElementById("main");
		q.style.transition = "none";
		main.mouse.x = e.clientX - q.offsetLeft;
		main.mouse.y = e.clientY - q.offsetTop;
		main.mouse.down = true;
	}
});

document.addEventListener("mouseup", function() {
	if (main.mouse.down) {
		let q = document.getElementById("main");
		q.style.transition = "";
		main.mouse.down = false;
		if (!main.screen.enlarged) resetCursor();
	}
});

document.addEventListener("mousemove", function(e) {
	if (!main.screen.enlarged && main.mouse.down) {
		if (main.screen.docked) {
			main.screen.docked = false; // set main screen undocked
			showHint(lang.undocked); // advertise user
		}
		let q = document.getElementById("main");
		q.style.left = Math.round(e.clientX - main.mouse.x) + "px";
		q.style.top = Math.round(e.clientY - main.mouse.y) + "px";
		updateCursorState("grabbing");
	}
});

////////////////////////////////////////////////////////////////////////////////
// @ Move
////////////////////////////////////////////////////////////////////////////////

function moveMain(b, f, g) { // b = center flag, f = force flag, g = ground flag (ignore toolbar)

	let q = document.getElementById("main");
	let s = document.getElementById("spin");
	let t = document.getElementById("tool"); // DEBUG
	let u = document.getElementById("tool_menu"); // DEBUG

	let w = window.innerWidth;
	let h = window.innerHeight;

	let min_x, min_y;
	let adj_x, adj_y;
	let x, y;

	let pad = conf.main.load.spin.padding; // spinner padding

	let rim_t = conf.main.screen.margin.top;
	let rim_l = conf.main.screen.margin.left;
	let rim_r = conf.main.screen.margin.right;
	let rim_b = conf.main.screen.margin.bottom;

	min_x = min_y = adj_x = adj_y = x = y = 0;

	if (!g) {
		if (t.classList.contains("open")) { // DEBUG
			min_x = t.clientWidth;
			adj_x = min_x;
			x = min_x;
		} else {
			rim_l += u.clientWidth;
		}
	}

	let c1 = q.offsetLeft < min_x + rim_l; // out of left or covered by tool
	let c2 = q.offsetLeft + q.offsetWidth > w - rim_l - rim_r; // out of right
	let c3 = q.offsetTop < min_y + rim_t; // out of top
	let c4 = q.offsetTop + q.offsetHeight > h - rim_t - rim_b; // out of bottom

	if (b) { // center
		x = Math.max(min_x, x + Math.round((w - q.clientWidth - adj_x) / 2));
		y = Math.max(min_y, y + Math.round((h - q.clientHeight - adj_y) / 2));
	} else { // dock
		x = rim_l + adj_x;
		y = rim_t + adj_y;
	}

	if (f || c1 || c2) { // move horizontally
		if (!main.shown) s.style.left = (x + pad) + "px";
		q.style.left = x + "px";
	}
	if (f || c3 || c4) { // move vertically
		if (!main.shown) s.style.top = (y + pad) + "px";
		q.style.top = y + "px";
	}

}

function dockMain(f, g) { // f = force flag, g = ground flag
	moveMain(false, f, g);
}

function centerMain(f, g) { // f = force flag, g = ground flag
	moveMain(true, f, g);
}

document.getElementById("main").addEventListener("dblclick", function(e) {
	if (!main.screen.enlarged && !main.screen.docked && e.target == this) {
		main.screen.docked = true; // set main screen docked
		showHint(lang.docked); // advertise user
		dockMain(true);
	}
});

////////////////////////////////////////////////////////////////////////////////
// @ Resize
////////////////////////////////////////////////////////////////////////////////

function resizeMain(b, s) { // b = enlarge flag, s = silent flag
	let p = document.getElementById("page");
	let q = document.getElementById("main");
	if (b) { // enlarge
		// 1. Hide background color
		p.style.backgroundColor = "transparent";
		// 2. Set main screen enlarged
		main.screen.enlarged = true;
		// 3. Register current position
		main.screen.x = q.offsetLeft;
		main.screen.y = q.offsetTop;
		// 4. Maximize main size
		let m = conf.main.screen.enlarged.margin;
		let w = (window.innerWidth - m.left - m.right) / q.offsetWidth;
		let h = (window.innerHeight - m.top - m.bottom) / q.offsetHeight;
		let n = Math.max(Math.min(w, h), 1); // minimum scale set to 1 (i.e. no size reduction) -- TEMP
		q.style.transform = "scale(" + n + "," + n + ")";
		// 5. Set main screen scale
		main.screen.scale = 1 / n;
		// 6. Center main
		centerMain(true, true);
	} else { // reduce
		// 1. Show background color
		p.style.backgroundColor = "";
		// 2. Reset main size
		q.style.transform = "";
		// 3. Restore position
		if (main.screen.docked) dockMain(true);
		else {
			q.style.left = main.screen.x + "px";
			q.style.top = main.screen.y + "px";
		}
		// 4. Reset main screen scale
		main.screen.scale = 1;
		// 5. Unset main screen enlarged
		main.screen.enlarged = false;
	}
	if (!s) showHint(b ? lang.enlarged : lang.reduced); // advertise user
}

document.getElementById("screen_enlarge").addEventListener("click", function() {
	// if (main.pause) return;
	let p = document.getElementById("page");
	if (!this.classList.contains("active")) {
		// * Active enlarge button
		this.classList.add("active");
		// * Request browser fullscreen
		if (conf.main.screen.enlarged.fullscreen) requestFullscreen(p);
		// * Enlarge main screen
		resizeMain(true);
	} else {
		// * Unactive enlarge button
		this.classList.remove("active");
		// * Exit browser fullscreen
		if (conf.main.screen.enlarged.fullscreen) exitFullscreen(p);
		// * Reduce main screen
		resizeMain();
	}
});

window.addEventListener("resize", function(e) {
	if (mdal.active) centerModal();
	if (main.screen.enlarged) {
		if (conf.main.window.resize_delay > 0) {
			clearTimeout(main.window.timeout);
			main.window.timeout = setTimeout(function() {
				resizeMain(true, true);
			}, conf.main.window.resize_delay);
		} else {
			resizeMain(true, true);
		}
	}
});

// =============================================================================
// -----------------------------------------------------------------------------
// # Cursor
// -----------------------------------------------------------------------------
// =============================================================================

function getCursorSize() {
	let w = h = 24; // WARNING : complete assumption of 24x24 ; see [https://stackoverflow.com/questions/1889487/get-size-of-mouse-cursor-in-javascript]
	if (main.mouse.hover) {
		w = conf.main.cursor.width;
		h = conf.main.cursor.height;
	} return {"width" : w, "height" : h};
}

function updateCursor(b) { // b = change state flag (remove cursor if not true)
	let q = document.getElementById("main");
	q.classList.remove(
		"pointer",
		"click",
		"grab",
		"grabbing"
	);
	if (b) q.classList.add(main.cursor.state);
}

function updateCursorState(state) { // state = string (pointer, click, grab or grabbing)
	if (!main.pause) {
		main.cursor.state = state;
		updateCursor(true);
	}
}

function resetCursor() {
	if (!isScrollLocked && term.mouse.hover) updateCursorState("grab"); // TEMP
	else updateCursorState("pointer");
}

function removeCursor() {
	updateCursor();
}

// =============================================================================
// -----------------------------------------------------------------------------
// # Mouse
// -----------------------------------------------------------------------------
// =============================================================================

document.getElementById("main").addEventListener("contextmenu", function(e) {
	e.preventDefault(); // WARNING : browser feature override
});

document.getElementById("main").addEventListener("mouseenter", function() {
	main.mouse.hover = true;
});

document.getElementById("main").addEventListener("mouseleave", function() {
	main.mouse.hover = false;
});

document.addEventListener("mouseup", function(e) {
	if (main.ready && !mdal.active && !main.pause) {
		if (e.button == 0) { // left mouse button
			if (!scen.scrl.mouse.active && main.cursor.state != "pointer") updateCursorState("pointer");
			fire();
		} else if (e.button == 1) { // middle mouse button
			resetScale();
		} else if (e.button == 2) { // right mouse button
			cancel();
		}
	}
});

document.getElementById("main").addEventListener("mousedown", function(e) {
	if (e.button == 0) { // left mouse button
		if (!scen.scrl.mouse.active && main.cursor.state != "click") updateCursorState("click");
	}
});

document.addEventListener("wheel", function(e) {
	if (main.ready && !mdal.active && !e.ctrlKey) { // TEMP
		// console.log("wheel: deltaX " + e.deltaX + " -- deltaY " + e.deltaY + " -- deltaZ " + e.deltaZ + " -- deltaMode " + e.deltaMode); // DEBUG
		if (e.deltaY > 0) zoomOut(); // wheel down
		else zoomIn(); // wheel up
	}
});

// =============================================================================
// -----------------------------------------------------------------------------
// # Audio
// -----------------------------------------------------------------------------
// =============================================================================

/**

	& AUDIO

	# Disambiguation
		playSound() => Sound <!> Pawn.playSound
		playMusic() => Music

	# Notions
		sound key              <=> e.g. "step_even"
		<sound|music> resource <=> e.g. "futb" or "test"
		<sound|music> location <=> e.g. "res/aud/snd/futb.mp3" or "res/aud/mus/test.ogg"

*/

////////////////////////////////////////////////////////////////////////////////
// @ Sounds
////////////////////////////////////////////////////////////////////////////////

function getMeleeSoundKey(v, s) { // v = entity or weapon key, s = anim key ; returns sound key
	if (typeof(v) === "object") v = v.weapon;
	let k;
	switch (v) {
		case "claw"            :
		case "pistol_axe"      : k = "slash"; break;
		case "pistol_knife"    : k = "stab"; break;
		case "unarmed"         :
		case "glove_sword"     : if (s == "melee") { k = "slash"; break; }
		case "bloter"          :
		case "heavy_bloter"    :
		case "plasma_cannon"   :
		case "machine_gun"     :
		case "rocket_launcher" :
		case "grenade"         :
		case "dual_heavy_smg"  :
		default                : k = "crush";
	} return k;
}

function getRangeSoundKey(v) { // v = entity or weapon key ; returns sound key
	let k;
	switch (getBaseWeapon(v)) {
		case "plasma_cannon"   : k = "laser"; break;
		case "rocket_launcher" : k = "rocket"; break;
		case "grenade"         : k = "throw"; break;
		case "pistol_axe"      :
		case "pistol_knife"    :
		case "bloter"          :
		case "heavy_bloter"    :
		case "machine_gun"     :
		case "dual_heavy_smg"  :
		default                : k = "fire";
	} return k;
}

function getSoundResource(k) { // k = sound key ; returns sound resource (null if none)
	switch(k) {
		// * Doors
		case "open_door"      :
		case "close_door"     : k = "bbbr"; break;
		// * Movement
		case "stumble"        : k = "poch"; break;
		case "step_odd"       : k = "fut" + (conf.audio.sound.step_alt ? "a" : "b"); break;
		case "step_even"      : k = "futb"; break;
		case "step_bleep"     : k = "futx"; break;
		// * Weapons
		case "draw"           : k = "pwii"; break;
		case "crush"          : k = "pock"; break;
		case "slash"          : k = "sshh"; break;
		case "stab"           : k = "sswe"; break;
		case "fire"           : k = "pang"; break;
		case "laser"          : k = "zbrr"; break;
		case "rocket"         : k = "psho"; break;
		case "throw"          : k = "wezz"; break;
		// * Impacts
		case "blast"          : k = "kbom"; break;
		case "explode"        : k = "boom"; break;
		case "hit"            : k = "bump"; break;
		case "wound"          :
		case "wound_green"    :
		case "wound_xeno"     :
		case "wound_robot"    : k = "hoop"; break;
		// * Death Screams
		case "die"            : k = "argh"; break;
		case "die_green"      : k = "argg"; break;
		case "die_limbo"      : k = "argl"; break;
		case "die_robot"      : k = "argr"; break;
		case "die_xeno"       : k = "argx"; break;
		// * Visbility
		case "hide"           : k = null; break;
		case "unhide"         : k = "blip"; break;
		case "conceal"        : k = null; break;
		case "reveal"         : k = null; break;
		// * Actions
		case "scan_commander" : k = "wsh1"; break;
		case "scan_trooper"   : k = "wsh2"; break;
		// * User Commands
		case "pause_in"       : k = "pipa"; break;
		case "pause_out"      : k = "pipb"; break;
		// * User Interface
		case "roll"           : k = "di" + leadZero(Math.floor(Math.random() * 20 + 1)); break;
		case "noise_in"       : k = "noia"; break;
		case "noise_out"      : k = "noib"; break;
		case "choice"         : k = "uie1"; break;
		case "identify"       : k = "uie2"; break;
		case "update_choice"  : k = "uie3"; break;
		case "member_select"  : k = "msel"; break;
		case "member_action"  : k = "mact"; break;
		case "action_cancel"  : k = "mcan"; break;
		// * Storage
		case "import_storage" : k = "hddl"; break;
		case "export_storage" : k = "hdds"; break;
		case "load_game"      : k = "flop"; break;
		case "save_game"      : k = null; break;
		default               : k = null;
	} return k;
}

function getSoundLocation(s) { // s = sound resource ; returns sound location
	return s = conf.audio.sound.dir + s + "." + conf.audio.sound.ext;
}

function playSound(k, b, c) { // k = sound key, b = loop flag, c = pause sound flag ; returns audio player id

	if (!main.audio.sound.enabled) return;

	let s = getSoundResource(k), o, i, r, p;
	if (s != null) {
		for (i = 0; i < conf.audio.sound.players + 1; i++) {
			p = "sound_" + i;
			o = document.getElementById(p);
			if (o.src == "" || o.ended || o.paused) { // source empty, playback ended or audiostream paused
				// console.log("%cplay audio " + k + " on audio player " + p, conf.console["test"]); // DEBUG
				c ? o.dataset.pauseSound = true : o.removeAttribute("data-pause-sound");
				o.removeAttribute("data-stop");
				o.loop = b ? true : false;
				o.src = getSoundLocation(s);
				o.load();
				o.play();
				r = true;
				break;
			}
		}
		if (!r) {
			p = null;
			console.error("failed to play audio " + k + " ; no audio player available"); // DEBUG
		} return p;
	} console.error("failed to play audio " + k + " ; no sound resource found"); // DEBUG
}

function stopSound(p) { // p = audio player id
	let o = document.getElementById(p);
	if (p != null) {
		o.pause();
		if (o.loop) { // throw AbortError exception otherwise
			o.loop = false;
			o.currentTime = 0;
		}
		o.dataset.stop = true;
		// console.log("%cstop audio on audio player " + p, conf.console["test"]); // DEBUG
	} else {
		console.error("failed to stop audio ; can't retrieve audio player " + p); // DEBUG
	}
}

////////////////////////////////////////////////////////////////////////////////
// @ Musics
////////////////////////////////////////////////////////////////////////////////

function getMusicPlayers() { // returns HTML collection
	return document.querySelectorAll("audio[id^='music']");
}

function getActiveMusicPlayer() { // returns HTML element
	return document.querySelector("audio[id^='music'][data-active]");
}

function getUnactiveMusicPlayer() { // returns HTML element
	return document.querySelector("audio[id^='music']:not([data-active])");
}

function getMusicPlayer(u) {// u = unactive player flag ; returns HTML element
	return u ? getUnactiveMusicPlayer() : getActiveMusicPlayer();
}

function setActiveMusicPlayer(s) { // s = HTML element id
	main.audio.music.active = s;
	getMusicPlayers().forEach(function(o) {
		if (o.id == s) o.dataset.active = "true";
		else o.removeAttribute("data-active");
	});
}

function swapActiveMusicPlayer() {
	let o = getUnactiveMusicPlayer();
	setActiveMusicPlayer(o.id);
}

function getMusicLocation(s) { // s = music resource ; returns music location
	return s = conf.audio.music.dir + s + "." + conf.audio.music.ext;
}

function loadMusic(s, u) { // s = music resource, u = unactive player flag
	let o = getMusicPlayer(u);
	let i = parseInt(o.id.slice(-1));
	main.audio.music.resource[i] = s;
	o.src = getMusicLocation(s);
	o.loop = true;
	o.load();
}

function reloadMusicResources() {
	let l = getMusicPlayers(), i, o;
	for (i = 0; i < l.length; i++) {
		o = l[i];
		o.src = getMusicLocation(main.audio.music.resource[i]);
		o.loop = true;
		o.load();
	}
}

function playMusic(u, b) { // u = unactive player flag, b = force fade flag
	let o = getMusicPlayer(u);
	o.play();
	if (b) { // force fading music to play
		let l = main.audio.music.count, i;
		for (i in l) if (l[i] >= 0) document.getElementById("music_" + i).play();
	}
}

function pauseMusic(u, b) { // u = unactive player flag, b = force fade flag
	let o = getMusicPlayer(u);
	o.pause();
	if (b) { // force fading music to pause
		let l = main.audio.music.count, i;
		for (i in l) if (l[i] >= 0) document.getElementById("music_" + i).pause();
	}
}

function stopMusicPlayer(u, b) { // u = unactive player flag, b = keep playtime flag
	let o = getMusicPlayer(u);
	let i = parseInt(o.id.slice(-1));
	// * Clear music fade interval
	clearInterval(main.audio.music.timer[i]);
	// * Reset counter
	main.audio.music.count[i] = -1;
	// * Reset music volume to default
	o.volume = main.audio.music.volume;
	// * Pause music player
	o.pause();
	// * Reset playtime
	if (!b && o.currentTime > 0) o.currentTime = 0; // throw AbortError exception otherwise
}

function stopMusic(u, b) { // u = unactive player flag*, b = keep playtime flag
	if (u == null) {
		stopMusicPlayer(true, b);
		stopMusicPlayer(false, b);
	} else {
		stopMusicPlayer(u, b);
	}
}

function fadeMusic(m, u, b, f) { // m = fade duration (ms), u = unactive player flag, b = fade-in flag, f = callback function
	if (typeof(m) != "number") m = conf.audio.music.fade_duration;
	if (typeof(m) != "function") f = function() {};
	let o = getMusicPlayer(u);
	let n = conf.audio.music.fade_delay;
	let d = Math.floor(m / n);
	let v = main.audio.music.volume / d * (b ? 1 : -1);
	let i = parseInt(o.id.slice(-1));
	// * Clear music fade interval
	clearInterval(main.audio.music.timer[i]);
	// * Reset counter
	main.audio.music.count[i] = 0;
	// * Set music element volume
	o.volume = b ? 0 : main.audio.music.volume;
	// * Start player
	o.play();
	// * Set music fade interval
	main.audio.music.timer[i] = setInterval(function() {
		if (main.pause) return; // hang interval until pause end
		if (main.audio.music.count[i] == d) {
			o.volume = b ? main.audio.music.volume : 0;
			main.audio.music.count[i] = -1;
			f();
			clearInterval(main.audio.music.timer[i]);
		} else {
			o.volume = Math.min(Math.clamp(0.0, o.volume + v, 1.0), main.audio.music.volume);
			main.audio.music.count[i]++;
		}
	}, n);
}

function fadeMusicIn(m, u, f) { // m = fade duration (ms), u = unactive player flag, f = callback function
	fadeMusic(m, u, true, f);
}

function fadeMusicOut(m, u, f) { // m = fade duration (ms), u = unactive player flag, f = callback function
	fadeMusic(m, u, false, f);
}

function crossfadeMusics(m) { // m = fade duration (ms)
	// * Fade active music player out
	fadeMusicOut(m, false, function() { stopMusic(false) });
	// * Fade unactive music player in
	fadeMusicIn(m, true);
	// * Swap active music player
	swapActiveMusicPlayer();
}

function getMusicTime(u) { // u = unactive player flag ; returns float
	let o = getMusicPlayer(u);
	return o.currentTime;
}

function setMusicTime(n, u) { // n = float, u = unactive player flag
	let o = getMusicPlayer(u);
	o.currentTime = n;
}

////////////////////////////////////////////////////////////////////////////////
// @ Audio Controls
////////////////////////////////////////////////////////////////////////////////

function getSoundPlayers() { // returns HTML collection
	return document.querySelectorAll("audio[id^='sound']");
}

function pauseSoundPlayers() {
	getSoundPlayers().forEach(function(o) {
		if (!o.ended && o.currentTime > 0 && !o.hasAttribute("data-pause-sound")) {
			o.pause();
		}
	});
}

function resumeSoundPlayers() {
	getSoundPlayers().forEach(function(o) {
		if (!o.ended && o.currentTime > 0 && !o.hasAttribute("data-stop")) {
			o.play();
		}
	});
}

function resetSoundPlayers() {
	getSoundPlayers().forEach(function(o) {
		o.removeAttribute("src");
		o.loop = false;
		o.load();
	});
}

function setSoundVolume(n) { // n = float (0.0 to 1.0)
	n = Math.clamp(0.0, n, 1.0);
	main.audio.sound.volume = n;
	getSoundPlayers().forEach(function(o) {
		o.volume = n;
	});
}

function setMusicVolume(n) { // n = float (0.0 to 1.0)
	n = Math.clamp(0.0, n, 1.0);
	main.audio.music.volume = n;
	getMusicPlayers().forEach(function(o) {
		o.volume = n;
	});
}

function setAudioMute(b) { // b = mute flag
	main.audio.mute = b;
	document.querySelectorAll("audio").forEach(function(o) {
		o.muted = b;
	});
}

function toggleAudioMute() {
	let b = main.audio.mute;
	setAudioMute(b ? false : true);
	showHint(lang["mute_" + (b ? "off" : "on")]);
}

////////////////////////////////////////////////////////////////////////////////
// @ Content Modifications
////////////////////////////////////////////////////////////////////////////////

function createAudioPlayers() {
	let o = document.getElementById("pool"), u, i;
	let m = conf.audio.sound.players;
	for (i = 0; i < m + 2; i++) {
		u = document.createElement("audio");
		u.id = i < m ? u.id = "sound_" + i : "music_" + (i - m);
		o.appendChild(u);
	}
}

////////////////////////////////////////////////////////////////////////////////
// @ Storage Interaction
////////////////////////////////////////////////////////////////////////////////

function storeAudioSettings() {
	// * Define audio settings
	let audio = { // TEMP
		"sound" : {
			"enabled" : main.audio.sound.enabled,
			"volume" : main.audio.sound.volume
		},
		"music" : {
			"enabled" : main.audio.music.enabled,
			"volume" : main.audio.music.volume
		}
	};
	// * Put audio settings in storage
	putLocalStorageItem("settings", {"audio" : audio});
}

function retrieveAudioSettings(b) { // b = play music flag
	// * Get audio settings from storage
	let l = getLocalStorageItem("settings").audio; // TEMP
	// * Set audio enabled
	main.audio.sound.enabled = l.sound.enabled;
	main.audio.music.enabled = l.music.enabled;
	// * Set audio volume
	setSoundVolume(l.sound.volume);
	setMusicVolume(l.music.volume);
	// * Toggle music
	if (b) main.audio.music.enabled ? playMusic() : stopMusic();
}

////////////////////////////////////////////////////////////////////////////////
// @ Initialization
////////////////////////////////////////////////////////////////////////////////

function initializeAudio() {
	// * Create audio players
	createAudioPlayers();
	// * Set music player active
	setActiveMusicPlayer("music_0");
	// * Load musics
	loadMusic("marine_theme", false);
	loadMusic("alien_theme", true);
	retrieveAudioSettings();
}

// =============================================================================
// -----------------------------------------------------------------------------
// # Pause
// -----------------------------------------------------------------------------
// =============================================================================

function startPause() {
	main.pause = true;
	lockScroll();
	lockZoom();
	lockButtons();
	if (conf.audio.sound.pause_sound) playSound("pause_in", null, true);
	pauseSoundPlayers();
	if (main.audio.music.enabled) pauseMusic(null, true);
	document.getElementById("main").classList.add("pause");
	document.getElementById("roll").querySelectorAll(".die").forEach(function(e) {
		if (e.style.animationPlayState == "running") e.style.animationPlayState = "paused";
	});
	showIcon("pause");
	removeCursor();
	scen.stop();
}

function stopPause(b) { // b = restart scene flag
	main.pause = false;
	unlockScroll();
	unlockZoom();
	unlockButtons();
	resumeSoundPlayers();
	if (!b && conf.audio.sound.pause_sound) playSound("pause_out");
	if (!b && main.audio.music.enabled) playMusic(null, true);
	document.getElementById("main").classList.remove("pause");
	document.getElementById("roll").querySelectorAll(".die").forEach(function(e) {
		if (e.style.animationPlayState == "paused") e.style.animationPlayState = "running";
	});
	hideIcon("pause");
	if (term.mouse.down) updateCursor("grabbing");
	else if (term.mouse.hover) updateCursor("grab");
	else resetCursor();
	scen.continue();
}

// =============================================================================
// -----------------------------------------------------------------------------
// # Save
// -----------------------------------------------------------------------------
// =============================================================================

////////////////////////////////////////////////////////////////////////////////
// @ Save Game
////////////////////////////////////////////////////////////////////////////////

function getSaveGameThumbnail(k) { // k = savegame key
	try {
		scen.canvas.toBlob(function(blob) {
			let reader = new FileReader();
			reader.readAsBinaryString(blob);
			reader.addEventListener("loadend", function() {
				saveData(k, "data:image/png;base64," + btoa(this.result));
			});
		});
	} catch(e) {
		let s = ui.base.save_slot_no_pic.src;
		saveData(k, s);
	}
}

function saveData(k, s) { // k = savegame key, s = base64 encoded thumbnail
	// * Set music time
	main.audio.music.playtime = getMusicTime();
	// * Set vars
		console.log(s); // DEBUG
	let save = {
		
		
		"img" : s,
		"time" : Date.now(),
		"setup" : setup,
		"game" : game,
		"main" : {
			"ctrl" : main.ctrl,
			"audio" : main.audio,
			"pause" : main.pause
		},
		"scen" : {
			"frame_count" : scen.frame_count,
			"screen" : scen.screen,
			"zoom" : scen.zoom
		},
		"term" : {
			"choice" : term.choice
		},
		"tool" : {
			"toggle" : tool.toggle
		},
		"pawn" : pawn
	};
	// * Save vars
	setLocalStorageItem(k, save);
	// * Show caption
	showCaption(lang["game_saved"]);
	console.info("%c" + k + " saved (data registered in web storage)", conf.console["debug"]); // DEBUG
}

function saveGame(k) { // k = savegame key
	if (main.save.forbidden) {
		showCaption(lang["game_save_forbidden"]);
	} else if (!main.save.prevented) {
		if (main.save.pending) {
			hideWait();
			main.save.pending = false;
			main.save.savekey = null;
		} getSaveGameThumbnail(k);
	} else {
		hideCaption();
		showWait();
		main.save.pending = true;
		main.save.savekey = k;
		console.info("%c" + k + " pending (data will be registered in web storage later)", conf.console["debug"]); // DEBUG
	}
}

////////////////////////////////////////////////////////////////////////////////
// @ Load Game
////////////////////////////////////////////////////////////////////////////////

function loadGame(k) { // k = savegame key
	if (!hasLocalStorageItem(k)) {
		console.warn(k + " loading failed (no such data registered in web storage)"); // DEBUG
	} else {
		// * Load vars
		let save = getLocalStorageItem(k);
		let date = new Date (save.time);
		// * Stop scene
		scen.stop();
		// * Restart scene
		restartScene(save.game, save.main, save.scen, save.term, save.tool, save.pawn);
		// * Play Sound
		playSound("load_game");
		// * Show caption
		showCaption(lang["game_loaded"]);
		console.info("%c" + k + " loaded (data retrieved from web storage) [" + date.toLocaleDateString() + " " + date.toLocaleTimeString() + "]", conf.console["debug"]); // DEBUG
	}
}

// =============================================================================
// -----------------------------------------------------------------------------
// # Storage
// -----------------------------------------------------------------------------
// =============================================================================

function showStorageReport(s, c) { // s = string, c = css class
	let o = document.getElementById("report_storage"); // TEMP : toolbar element for now
	let u = o.querySelector("span");
	c == null ? o.removeAttribute("class") : o.setAttribute("class", c);
	u.innerHTML = s;
	u.style.opacity = "";
	u.style.transition = "opacity " + conf.storage.report.duration.show + "ms";
	clearTimeout(main.storage.timer);
	main.storage.timer = setTimeout(hideStorageReport, conf.storage.report.delay);
}

function hideStorageReport() {
	let o = document.getElementById("report_storage"); // TEMP : toolbar element for now
	let u = o.querySelector("span");
	u.style.opacity = "0";
	u.style.transition = "opacity " + conf.storage.report.duration.hide + "ms";
	clearTimeout(main.storage.timer);
}

function loadStorageFile() {
	document.getElementById("browse_storage").click(); // WARNING : placed in a dummy container displayed off-page
}

function getStorageTable() { // returns array
	return conf.storage.roaming.concat(conf.storage.save_slots);
}

function isValidStorageTable() { // returns boolean
	let l = getStorageTable();
	for (k in l) if (!hasLocalStorageKey(l[k])) return false; // missing key
	return true;
}

function isValidStorageFormat(v) { // v = storage data ; returns boolean
	if (v == null || typeof(v) != "object" || Array.isArray(v)) return false; // not javascript object
	let l = getStorageTable();
	for (k in v) if (l.includes(k)) return false; // missing key
	return true;
}

function exportStorage() {
	hideStorageReport(); // TEMP
	if (!isValidStorageTable()) {
		showStorageReport(lang.storage.wrong_data_table, "error");
		console.error("Storage export failed: invalid storage table"); // DEBUG
	} else {
		let o = document.getElementsByTagName("body")[0];
		let a = document.createElement("a");
		let r = {};
		let l = getStorageTable();
		for (k in l) r[l[k]] = getLocalStorageItem(l[k]);
		let blob = new Blob([JSON.stringify(r)], {type : "application/json"});
		let url = window.URL.createObjectURL(blob);
		o.appendChild(a);
		a.setAttribute("href", url);
		a.setAttribute("download", conf.storage.filename + ".json");
		a.click();
		o.removeChild(a);
		// -------------------------------------------------------------------
		// * Export Storage Callback
		// -------------------------------------------------------------------
		playSound("export_storage");
		// -------------------------------------------------------------------
		showStorageReport(lang.storage.export_success);
		console.info("%cStorage export succeed", conf.console["debug"]); // DEBUG
	}
}

function importStorage() {
	hideStorageReport(); // TEMP
	if (this.files.length == 0) {
		showStorageReport(lang.storage.no_file, "error");
		console.error("Storage import failed: file input empty"); // DEBUG
	} else {
		// * File API
		let file = this.files[0]; // only first in list ; no multiple selection allowed
		if (file.type != "application/json") {
			showStorageReport(lang.storage.wrong_file_type, "error");
			console.error("Storage import failed: file type is not JSON"); // DEBUG
			return;
		}
		if (Number.isInteger(conf.storage.filesize_max) && file.size > conf.storage.filesize_max) {
			showStorageReport(lang.storage.wrong_file_size, "error");
			console.error("Storage import failed: file size greater than "+ (conf.storage.filesize_max / 1000000).toPrecision(4) + " MB");  // DEBUG
			return;
		}
		// * FileReader API
		let reader = new FileReader();
		reader.readAsText(file);
		reader.addEventListener("loadend", function() {
			let v = this.result;
			try {
				v = JSON.parse(v);
				if (!isValidStorageFormat(v)) {
					hideStorageReport();
					for (k in v) setLocalStorageItem(k, v[k]);
					// -------------------------------------------------------------------
					// * Import Storage Callback
					// -------------------------------------------------------------------
					retrieveAudioSettings(true); // VERY TEMP
					playSound("import_storage");
					// -------------------------------------------------------------------
					showStorageReport(lang.storage.import_success);
					console.info("%cStorage import succeed", conf.console["debug"]); // DEBUG
				} else {
					showStorageReport(lang.storage.wrong_data_format, "error");
					console.error("Storage import failed: invalid storage format"); // DEBUG
				}
			} catch (e) {
				showStorageReport(lang.storage.wrong_data_type, "error");
				console.error("Storage import failed: file parsing exception"); // DEBUG
			}
		});
	}
}

function clearStorage() {
	localStorage.clear();
	showStorageReport(lang.storage.data_cleared, "warning");
	console.warn("Storage cleared! All game data erased ; please reload the document or import a previously exported storage before continue playing"); // DEBUG
}
