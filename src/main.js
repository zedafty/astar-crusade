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
		"down" : false
	},

	//////////////////////////////////////////////////////////////////////////////
	// @ Cursor
	//////////////////////////////////////////////////////////////////////////////

	"cursor" : {
		"state" : null // current cursor state
	},

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

};

// =============================================================================
// -----------------------------------------------------------------------------
// # User Interface Resource Stack
// -----------------------------------------------------------------------------
// =============================================================================

var ui = {

	//////////////////////////////////////////////////////////////////////////////
	// @ Base
	//////////////////////////////////////////////////////////////////////////////

	"base" : {
		"main"                     : {"img" : null, "src" : "res/ui/main.png"},
		"scroll"                   : {"img" : null, "src" : "res/ui/scroll.png"},
		"weapons"                  : {"img" : null, "src" : "res/ui/weapons.png"},
		"disabled_gray"            : {"img" : null, "src" : "res/ui/disabled_gray.png"},
		"disabled_black"           : {"img" : null, "src" : "res/ui/disabled_black.png"}
	},

	//////////////////////////////////////////////////////////////////////////////
	// @ Cursors
	//////////////////////////////////////////////////////////////////////////////

	"cursor" : {
		"green_pointer"            : {"img" : null, "src" : "res/ui/cur/green_pointer.png"},
		"green_click"              : {"img" : null, "src" : "res/ui/cur/green_click.png"},
		"green_grab"               : {"img" : null, "src" : "res/ui/cur/green_grab.png"},
		"green_grabbing"           : {"img" : null, "src" : "res/ui/cur/green_grabbing.png"},
		"red_pointer"              : {"img" : null, "src" : "res/ui/cur/red_pointer.png"},
		"red_click"                : {"img" : null, "src" : "res/ui/cur/red_click.png"},
		"red_grab"                 : {"img" : null, "src" : "res/ui/cur/red_grab.png"},
		"red_grabbing"             : {"img" : null, "src" : "res/ui/cur/red_grabbing.png"},
		"gold_pointer"             : {"img" : null, "src" : "res/ui/cur/gold_pointer.png"},
		"gold_click"               : {"img" : null, "src" : "res/ui/cur/gold_click.png"},
		"gold_grab"                : {"img" : null, "src" : "res/ui/cur/gold_grab.png"},
		"gold_grabbing"            : {"img" : null, "src" : "res/ui/cur/gold_grabbing.png"},
		"blue_pointer"             : {"img" : null, "src" : "res/ui/cur/blue_pointer.png"},
		"blue_click"               : {"img" : null, "src" : "res/ui/cur/blue_click.png"},
		"blue_grab"                : {"img" : null, "src" : "res/ui/cur/blue_grab.png"},
		"blue_grabbing"            : {"img" : null, "src" : "res/ui/cur/blue_grabbing.png"}
	},

	//////////////////////////////////////////////////////////////////////////////
	// @ Monitor
	//////////////////////////////////////////////////////////////////////////////

	"moni" : {
		"insignia"                 : {"img" : null, "src" : "res/ui/moni/insignia.png"},
		"life"                     : {"img" : null, "src" : "res/ui/moni/life.png"},
		"targeter"                 : {"img" : null, "src" : "res/ui/moni/targeter.png"},
		"identify_body"            : {"img" : null, "src" : "res/ui/moni/identify_body.png"},
		"identify_weap"            : {"img" : null, "src" : "res/ui/moni/identify_weap.png"},
		"alien"                    : {"img" : null, "src" : "res/ui/moni/alien.png"}
	},

	//////////////////////////////////////////////////////////////////////////////
	// @ Terminal
	//////////////////////////////////////////////////////////////////////////////

	"term" : {
		"noise"                    : {"img" : null, "src" : "res/ui/term/noise.png"},
		"choice"                   : {"img" : null, "src" : "res/ui/term/choice.png"},
		"roll"                     : {"img" : null, "src" : "res/ui/term/roll.png"}
	},

	//////////////////////////////////////////////////////////////////////////////
	// @ Controls
	//////////////////////////////////////////////////////////////////////////////

	"ctrl" : {
		"buttons"                  : {"img" : null, "src" : "res/ui/ctrl/buttons.png"},
		"faces"                    : {"img" : null, "src" : "res/ui/ctrl/faces.png"},
		"light_s"                  : {"img" : null, "src" : "res/ui/ctrl/light_s.png"},
		"light_m"                  : {"img" : null, "src" : "res/ui/ctrl/light_m.png"}
	}

};

// =============================================================================
// -----------------------------------------------------------------------------
// # Sprites Resource Stack
// -----------------------------------------------------------------------------
// =============================================================================

var spr = {

	//////////////////////////////////////////////////////////////////////////////
	// @ Background (always required -- varying)
	//////////////////////////////////////////////////////////////////////////////

	"back" : {
		"board"                         : {"img" : null, "src" : null}
	},

	//////////////////////////////////////////////////////////////////////////////
	// @ Animations (always required)
	//////////////////////////////////////////////////////////////////////////////

	"anim" : {
		"buffet"                        : {"img" : null, "src" : "res/spr/anim/buffet.png"},
		"effect"                        : {"img" : null, "src" : "res/spr/anim/effect.png"},
		"muzzle"                        : {"img" : null, "src" : "res/spr/anim/muzzle.png"}
	},

	//////////////////////////////////////////////////////////////////////////////
	// @ Doors (always required)
	//////////////////////////////////////////////////////////////////////////////
	"door" : {
		"ww"                            : {"img" : null, "src" : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAABVQTFRFZmZmERERu7u7ACIiiIiIRERE////5ji0DQAAAAd0Uk5T////////ABpLA0YAAABPSURBVHja3NMxDgAgCARBxMP/P1k7gyYclLr1FECCDJI8AZSUARKXAi2oDlThygGArEmB2d4KMBcHaww3ZD+qg+tQKRBGQSdx8MVnTQEGAOtGDTl1jSSqAAAAAElFTkSuQmCC"},
		"ee"                            : {"img" : null, "src" : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAABVQTFRFZmZmERERACIiu7u7iIiIRERE////+Bt3agAAAAd0Uk5T////////ABpLA0YAAABQSURBVHja3NNLDgAQDEXR6sf+lyxioiRepSPu+ESUlCqIngACwuAcMwblUAyoS+Qe7GPNA0aAuVT7wSOzGOCl7ZIQ5F8y/5sMwuCLzWoCDAB8fQ0hMlIadgAAAABJRU5ErkJggg=="},
		"nn"                            : {"img" : null, "src" : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAABVQTFRFZmZmERERu7u7ACIiiIiIRERE////5ji0DQAAAAd0Uk5T////////ABpLA0YAAABBSURBVHjaYmADAyYkwAIGzMwQGQaiFTCgAXIUMAIBCwsrK4gmXwGMHlVAmQJIZDMzk6+AhYWJiZV1VMGQVQAQYAB5Rg05d4AOBwAAAABJRU5ErkJggg=="},
		"ss"                            : {"img" : null, "src" : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAABVQTFRFZmZmERERACIiu7u7iIiIRERE////+Bt3agAAAAd0Uk5T////////ABpLA0YAAABISURBVHja7Mo5EoAgEETRXma4/5FVCCiLRDGi5Ccd9EOp2QAZYWdKJCC1BxssCnwW8QVcB9l2FnT4bwBkzoN774GGHoJDgAEAIYwNIYxJQt4AAAAASUVORK5CYII="}
		/*
		"ww"                            : {"img" : null, "src" : "res/spr/door/airlock_ww.png"},
		"ee"                            : {"img" : null, "src" : "res/spr/door/airlock_ee.png"},
		"nn"                            : {"img" : null, "src" : "res/spr/door/airlock_nn.png"},
		"ss"                            : {"img" : null, "src" : "res/spr/door/airlock_ss.png"}
		*/
	},

	//////////////////////////////////////////////////////////////////////////////
	// @ Items (sometimes required)
	//////////////////////////////////////////////////////////////////////////////

	"item" : {
		"bleep"                         : {"img" : null, "src" : "res/spr/item/bleep.png"},
		"boulder"                       : {"img" : null, "src" : "res/spr/item/boulder.png"},
		"brain"                         : {"img" : null, "src" : "res/spr/item/brain.png"},
		"breach"                        : {"img" : null, "src" : "res/spr/item/breach.png"},
		"cube"                          : {"img" : null, "src" : "res/spr/item/cube.png"},
		"c_panel_1"                     : {"img" : null, "src" : "res/spr/item/c_panel_1.png"},
		"c_panel_2"                     : {"img" : null, "src" : "res/spr/item/c_panel_2.png"},
		"egg"                           : {"img" : null, "src" : "res/spr/item/egg.png"},
		"nuke"                          : {"img" : null, "src" : "res/spr/item/nuke.png"},
		"weapon"                        : {"img" : null, "src" : "res/spr/item/weapon.png"}
	},

	//////////////////////////////////////////////////////////////////////////////
	// @ Characters (usually required)
	//////////////////////////////////////////////////////////////////////////////

	"char" : {
		"bleep"                         : {"img" : null, "src" : "res/spr/char/bleep.png"},
		"commander"                     : {"img" : null, "src" : "res/spr/char/commander.png"},
		"trooper"                       : {"img" : null, "src" : "res/spr/char/trooper.png"},
		"gremkin"                       : {"img" : null, "src" : "res/spr/char/gremkin.png"},
		"scrof"                         : {"img" : null, "src" : "res/spr/char/scrof.png"},
		"limbo_tr"                      : {"img" : null, "src" : "res/spr/char/limbo_tr.png"},
		"limbo_cc"                      : {"img" : null, "src" : "res/spr/char/limbo_cc.png"},
		"fleshripper"                   : {"img" : null, "src" : "res/spr/char/fleshripper.png"},
		"cyborg"                        : {"img" : null, "src" : "res/spr/char/cyborg.png"},
		"juggernaut"                    : {"img" : null, "src" : "res/spr/char/juggernaut.png"},
	},

	//////////////////////////////////////////////////////////////////////////////
	// @ Weapons (usually required)
	//////////////////////////////////////////////////////////////////////////////

	"weap" : {
		"unarmed"                       : {"img" : null, "src" : "res/spr/weap/unarmed.png"},
		"claw"                          : {"img" : null, "src" : "res/spr/weap/claw.png"},
		"glove_sword"                   : {"img" : null, "src" : "res/spr/weap/glove_sword.png"},
		"pistol_axe"                    : {"img" : null, "src" : "res/spr/weap/pistol_axe.png"},
		"pistol_knife"                  : {"img" : null, "src" : "res/spr/weap/pistol_knife.png"},
		"bloter"                        : {"img" : null, "src" : "res/spr/weap/bloter.png"},
		"heavy_bloter"                  : {"img" : null, "src" : "res/spr/weap/heavy_bloter.png"},
		"plasma_cannon"                 : {"img" : null, "src" : "res/spr/weap/plasma_cannon.png"},
		"machine_gun"                   : {"img" : null, "src" : "res/spr/weap/machine_gun.png"},
		"rocket_launcher"               : {"img" : null, "src" : "res/spr/weap/rocket_launcher.png"},
		"grenade"                       : {"img" : null, "src" : "res/spr/weap/grenade.png"},
		"dual_heavy_smg"                : {"img" : null, "src" : "res/spr/weap/dual_heavy_smg.png"}
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
		// ****************
		// * TEST
		// ****************
		setTimeout(function() {
			loadImage(a[j][0], a[j][1]);
			j++;
		}, (p == "spin" ? conf.main.load.spin_latency * i : conf.main.load.load_latency * i));
		// ****************
		// * STABLE
		// ****************
		// loadImage(a[i][0], a[i][1]);
		// ****************
		i++;
	}

}

////////////////////////////////////////////////////////////////////////////////
// @ Event
////////////////////////////////////////////////////////////////////////////////

window.addEventListener("load", function() {

	disableToolButtons(true); // TEMP
	disableActionButtons(); // TEMP

	// game.map = "m01"; // TEMP
	game.map = "m01s"; // TEMP

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
	e.preventDefault(); // WARNING
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
		e.preventDefault(); // WARNING
		// console.log("wheel: deltaX " + e.deltaX + " -- deltaY " + e.deltaY + " -- deltaZ " + e.deltaZ + " -- deltaMode " + e.deltaMode); // DEBUG
		if (e.deltaY > 0) zoomOut(); // wheel down
		else zoomIn(); // wheel up
	}
});

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
	document.getElementById("main").classList.add("pause");
	document.getElementById("roll").querySelectorAll(".die").forEach(function(e) {
		if (e.style.animationPlayState == "running") e.style.animationPlayState = "paused";
	});
	showIcon("pause");
	removeCursor()
	scen.stop();
}

function stopPause() {
	main.pause = false;
	unlockScroll();
	unlockZoom();
	unlockButtons();
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

function saveGame(s) { // s = savegame key
	if (main.save.forbidden) {
		showCaption(lang["game_save_forbidden"]);
	} else if (!main.save.prevented) {
		if (main.save.pending) {
			hideWait();
			main.save.pending = false;
			main.save.savekey = null;
		}
		// * Set vars
		let save = {
			"time" : Date.now(),
			"game" : game,
			"main" : {
				"ctrl" : main.ctrl,
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
		localStorage.setItem(s, JSON.stringify(save));
		// * Show caption
		showCaption(lang["game_saved"]);
		console.info("%c" + s + " saved (data stored in local storage)", conf.console["debug"]); // DEBUG
	} else {
		hideCaption();
		showWait();
		main.save.pending = true;
		main.save.savekey = s;
		console.info("%c" + s + " pending (data will be stored in local storage later)", conf.console["debug"]); // DEBUG
	}
}

////////////////////////////////////////////////////////////////////////////////
// @ Load Game
////////////////////////////////////////////////////////////////////////////////

function loadGame(s) { // s = savegame key
	if (localStorage.length == 0) {
		console.warn(s + " loading failed (no data to retrieve from local storage)"); // DEBUG
	} else if (!localStorage.hasOwnProperty(s)) {
		console.warn(s + " loading failed (no such data stored in local storage)"); // DEBUG
	} else {
		// * Load vars
		let save = JSON.parse(localStorage.getItem(s));
		let date = new Date (save.time);
		// * Stop scene
		scen.stop();
		// * Restart scene
		restartScene(save.game, save.main, save.scen, save.term, save.tool, save.pawn);
		// * Show caption
		showCaption(lang["game_loaded"]);
		console.info("%c" + s + " loaded (data retrieved from local storage) [" + date.toLocaleDateString() + " " + date.toLocaleTimeString() + "]", conf.console["debug"]); // DEBUG
	}
}

////////////////////////////////////////////////////////////////////////////////
// @ Clear Game
////////////////////////////////////////////////////////////////////////////////

function clearGame(s) { // s = savegame key
	// * Delete vars
	localStorage.removeItem(s);
	console.info("%c" + s + " cleared (data removed from local storage)", conf.console["debug"]); // DEBUG
}

