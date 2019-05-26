/*

	tool.js

*/

// =============================================================================
// -----------------------------------------------------------------------------
// # Module
// -----------------------------------------------------------------------------
// =============================================================================

var tool = {

	//////////////////////////////////////////////////////////////////////////////
	// @ Accessors
	//////////////////////////////////////////////////////////////////////////////

	"button" : {
		"range" : ["move_cc", "detect_sight", "detect_sense", "detect_los"],
		"luck" : ["limbo_luck", "limbo_jinx"]
	},

	"gimme" : {
		"move" : 20,
		"attack" : 20,
		"scan" : 10
	},

	"limbo" : {
		"haste" : 20,
		"life" : 666
	},
	
	"volume_label_delay" : 750,

	//////////////////////////////////////////////////////////////////////////////
	// @ Mutators
	//////////////////////////////////////////////////////////////////////////////

	"active" : false,

	"los" : false,

	"toggle" : {
		"limbo_luck" : false,
		"limbo_jinx" : false,
		"mute_audio" : false
	},

	"volume_sound" : {"timer" : null, "down" : false},
	"volume_music" : {"timer" : null, "down" : false},

};

// =============================================================================
// -----------------------------------------------------------------------------
// # Functions
// -----------------------------------------------------------------------------
// =============================================================================

////////////////////////////////////////////////////////////////////////////////
// @ Actor
////////////////////////////////////////////////////////////////////////////////

function moveOf(x, y) { // x, y = tile
	if (!main.pause && !game.actor.moving) {
		deactivateToolButtons(tool.button.range, this);
		game.actor.moveOf(x, y);
	}
}

////////////////////////////////////////////////////////////////////////////////
// @ Buttons
////////////////////////////////////////////////////////////////////////////////

function hasAttribute(i, s, v) { // i = HTML element id, s = attribute name, v = attribute value (optional) ; returns boolean
	let q = document.getElementById(i), r = false;
	if (q.hasAttribute(s) && (v == null || q.getAttribute(s) == v)) r = true;
	return r;
}

function toggleAttribute(i, s, v) { // i = HTML element id, s = attribute name, v = attribute value ; returns boolean
	let q = document.getElementById(i), r = false;
	if (hasAttribute(i, s, v)) {
		q.removeAttribute(s);
		tool.toggle[i] = false;
	} else {
		q.setAttribute(s, v);
		tool.toggle[i] = true;
		r = true;
	} return r;
}

function isToolButtonActivated(o) { // o = DOM object ; returns boolean
	return toggleAttribute(o.id, "data-state", "activated");
}

function deactivateToolButtons(l, o) { // l = HTML elements id list, o = DOM object
	// * Unset tool line of sight
	tool.los = false;
	let q;
	// * Deactivate tool buttons
	l.forEach(function(e) {
		q = document.getElementById(e);
		if (q != o) q.removeAttribute("data-state");
	});
	let k = main.ctrl.action;
	// * Cancel previous action
	if (game.actor != null && k != null && k != s) cancelAction(game.actor, k);
	// * Deactivate action buttons
	deactivateActionButtons();
}

function disableToolButton(o, t) { // o = DOM object, t = no transition flag
	o.style.transition = t ? "none" : "";
	o.setAttribute("disabled", "disabled");
}

function enableToolButton(o, t) { // o = DOM object
	o.style.transition = t ? "none" : "";
	o.removeAttribute("disabled");
}

function switchToolButtons(b, t) { // b = enable flag, t = no transition flag
	let q = document.getElementById("tool");
	let o = q.querySelector("#scroll_cc");
	// * Set tool active
	tool.active = b ? true : false;
	// * Switch buttons
	b ? enableToolButton(o, t) : disableToolButton(o, t);
	q.querySelectorAll("#tool_move button").forEach(function(o) {
		b ? enableToolButton(o, t) : disableToolButton(o, t);
	});
	q.querySelectorAll("#tool_detect button").forEach(function(o) {
		b ? enableToolButton(o, t) : disableToolButton(o, t);
	});
	q.querySelectorAll("#tool_limbo button").forEach(function(o) {
		if (o.id != "limbo_luck" && o.id != "limbo_jinx")
			b ? enableToolButton(o, t) : disableToolButton(o, t);
	});
}

function disableToolButtons(t) {switchToolButtons(false, t)} // t = no transition flag
function enableToolButtons(t) {switchToolButtons(true, t)} // t = no transition flag

// =============================================================================
// -----------------------------------------------------------------------------
// # Events
// -----------------------------------------------------------------------------
// =============================================================================

////////////////////////////////////////////////////////////////////////////////
// @ Scroll By Input
////////////////////////////////////////////////////////////////////////////////

document.getElementById("scroll_nn").addEventListener("click", function() {bindScrollButton(0, 1)});
document.getElementById("scroll_ww").addEventListener("click", function() {bindScrollButton(1, 0)});
document.getElementById("scroll_ee").addEventListener("click", function() {bindScrollButton(-1, 0)});
document.getElementById("scroll_ss").addEventListener("click", function() {bindScrollButton(0, -1)});
document.getElementById("scroll_nw").addEventListener("click", function() {bindScrollButton(1, 1)});
document.getElementById("scroll_ne").addEventListener("click", function() {bindScrollButton(-1, 1)});
document.getElementById("scroll_sw").addEventListener("click", function() {bindScrollButton(1, -1)});
document.getElementById("scroll_se").addEventListener("click", function() {bindScrollButton(-1, -1)});
document.getElementById("scroll_cc").addEventListener("click", function() {
	if (!isScrollLocked()) centerToPixel(game.actor.x, game.actor.y);
});

////////////////////////////////////////////////////////////////////////////////
// @ Move
////////////////////////////////////////////////////////////////////////////////

document.getElementById("move_nn").addEventListener("click", function() {moveOf(0, -1)});
document.getElementById("move_ww").addEventListener("click", function() {moveOf(-1, 0)});
document.getElementById("move_ee").addEventListener("click", function() {moveOf(1, 0)});
document.getElementById("move_ss").addEventListener("click", function() {moveOf(0, 1)});
document.getElementById("move_nw").addEventListener("click", function() {moveOf(-1, -1)});
document.getElementById("move_ne").addEventListener("click", function() {moveOf(1, -1)});
document.getElementById("move_sw").addEventListener("click", function() {moveOf(-1, 1)});
document.getElementById("move_se").addEventListener("click", function() {moveOf(1, 1)});
document.getElementById("move_cc").addEventListener("click", function() {
	deactivateToolButtons(tool.button.range, this);
	if (isToolButtonActivated(this)) game.actor.drawMoveRange();
	else game.actor.clearMoveRange();
});

////////////////////////////////////////////////////////////////////////////////
// @ Zoom
////////////////////////////////////////////////////////////////////////////////

document.getElementById("zoom_out").addEventListener("click", function() {if (main.ready) zoomOut()});
document.getElementById("zoom_in").addEventListener("click", function() {if (main.ready) zoomIn()});
document.getElementById("zoom_reset").addEventListener("click", function() {if (main.ready) resetScale()});

////////////////////////////////////////////////////////////////////////////////
// @ Audio
////////////////////////////////////////////////////////////////////////////////

document.getElementById("mute_audio").addEventListener("click", function() {
	toggleAttribute("mute_audio", "data-state", "activated");
	toggleAudioMute();
});

document.getElementById("volume_sound").addEventListener("change", function() {
});

document.getElementById("volume_music").addEventListener("change", function() {
});

document.getElementById("play_music").addEventListener("click", function() {
	if (main.pause) return; // TEMP
	let o = document.getElementById("music");
	if (main.audio.music.play) { // is playing
		stopMusic();
		this.innerHTML = "Play";
	} else { // not playing
		playMusic();
		this.innerHTML = "Stop";
	}
});

////////////////////////////////////////////////////////////////////////////////
// @ Detect
////////////////////////////////////////////////////////////////////////////////

document.getElementById("detect_sight").addEventListener("click", function() {
	deactivateToolButtons(tool.button.range, this);
	if (isToolButtonActivated(this)) game.actor.drawSightRange();
	else game.actor.clearSightRange();
});

document.getElementById("detect_sense").addEventListener("click", function() {
	deactivateToolButtons(tool.button.range, this);
	if (isToolButtonActivated(this)) game.actor.drawSenseRange();
	else game.actor.clearSenseRange();
});

document.getElementById("detect_los").addEventListener("click", function() {
	deactivateToolButtons(tool.button.range, this);
	if (isToolButtonActivated(this)) tool.los = true;
	else tool.los = false;
});

////////////////////////////////////////////////////////////////////////////////
// @ Gimme!
////////////////////////////////////////////////////////////////////////////////

document.getElementById("gimme_move").addEventListener("click", function() {
	game.actor.action.move += tool.gimme.move;
	game.actor.clearRange();
	checkActionButtons(game.actor);
	if (main.ctrl.action != null) forceClick("action_" + main.ctrl.action);
	console.log("[" + game.actor.id + "] can move " + tool.gimme.move + " more times"); // DEBUG
});

document.getElementById("gimme_attack").addEventListener("click", function() {
	game.actor.action.attack_range += tool.gimme.attack;
	game.actor.action.attack_melee += tool.gimme.attack;
	game.actor.clearRange();
	checkActionButtons(game.actor);
	if (main.ctrl.action != null) forceClick("action_" + main.ctrl.action);
	console.log("[" + game.actor.id + "] can attack " + tool.gimme.attack + " more times"); // DEBUG
});

document.getElementById("gimme_scan").addEventListener("click", function() {
	game.team[game.player[0]].action.scan += tool.gimme.scan;
	game.actor.clearRange();
	checkActionButtons(game.actor);
	if (main.ctrl.action != null) forceClick("action_" + main.ctrl.action);
	console.log(game.player[0] + " team can scan " + tool.gimme.scan + " more times"); // DEBUG
});

////////////////////////////////////////////////////////////////////////////////
// @ Limbo's Touch
////////////////////////////////////////////////////////////////////////////////

document.getElementById("limbo_luck").addEventListener("click", function() {
	if (isToolButtonActivated(this)) {
		if (hasAttribute("limbo_jinx", "data-state")) toggleAttribute("limbo_jinx", "data-state", "activated");
		conf.game.die.light = [2,2,2,2,2,2];
		conf.game.die.heavy = [3,3,3,3,3,3];
		console.info("%cLimbo's Luck activated : THE SLAYER WALKS THE EARTH!", conf.console["debug"]); // DEBUG
	} else {
		conf.game.die.light = [0,0,0,0,1,2];
		conf.game.die.heavy = [0,0,0,1,2,3];
		console.info("%cLimbo's Luck deactivated", conf.console["debug"]); // DEBUG
	}
});

document.getElementById("limbo_jinx").addEventListener("click", function() {
	if (isToolButtonActivated(this)) {
		if (hasAttribute("limbo_luck", "data-state")) toggleAttribute("limbo_luck", "data-state", "activated");
		conf.game.die.light = [0,0,0,0,0,0];
		conf.game.die.heavy = [0,0,0,0,0,0];
		console.info("%cLimbo's Jinx activated : THE EYE OF CTHULHU IS UPON YOU!", conf.console["debug"]); // DEBUG
	} else {
		conf.game.die.light = [0,0,0,0,1,2];
		conf.game.die.heavy = [0,0,0,1,2,3];
		console.info("%cLimbo's Jinx deactivated", conf.console["debug"]); // DEBUG
	}
});

document.getElementById("limbo_haste").addEventListener("click", function() {
	game.actor.movement = tool.limbo.haste;
	console.log("[" + game.actor.id + "] can now move at speed of " + tool.limbo.haste); // DEBUG
});

document.getElementById("limbo_life").addEventListener("click", function() {
	game.actor.life = tool.limbo.life;
	updateStatus(game.actor);
	console.log("[" + game.actor.id + "] has now " + tool.limbo.life + " life points"); // DEBUG
});

////////////////////////////////////////////////////////////////////////////////
// @ Storage
////////////////////////////////////////////////////////////////////////////////

document.getElementById("browse_storage").addEventListener("change", importStorage);
document.getElementById("export_storage").addEventListener("click", exportStorage);
document.getElementById("import_storage").addEventListener("click", loadStorageFile);
document.getElementById("clear_storage").addEventListener("click", clearStorage);

////////////////////////////////////////////////////////////////////////////////
// @ Panel
////////////////////////////////////////////////////////////////////////////////

document.getElementById("tool_menu").addEventListener("click", function() {
	let q = document.getElementById("tool");
	if (q.classList.contains("open")) { // close
		q.classList.remove("open");
	} else { // open
		q.querySelector("#tool_content").style.display = "";
		q.classList.add("open");
		if (!main.screen.enlarged && main.screen.docked) dockMain(true);
	}
});

document.getElementById("tool").addEventListener("transitionend", function(e) {
	if (e.target == this) { // prevent this event from being triggered by child elements
		let q = this.querySelector("#tool_content");
		if (!this.classList.contains("open")) { // on close
			if (!main.screen.enlarged && main.screen.docked) dockMain(true);
			q.style.display = "none";
		}
	}
});
