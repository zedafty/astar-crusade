/*

	moni.js

*/

// =============================================================================
// -----------------------------------------------------------------------------
// # Module
// -----------------------------------------------------------------------------
// =============================================================================

var moni = {

	"status" : {
		"active" : false
	},

	"identify" : {
		"active" : false
	},

	"turn" : {
		"active" : false,
		"prompt" : false
	},

	"alien" : {
		"active" : false
	}

};

// =============================================================================
// -----------------------------------------------------------------------------
// # Report
// -----------------------------------------------------------------------------
// =============================================================================

function showReport(s, c, b) { // s = string to report, c = container class, b = close itself flag
	let q = document.getElementById("report");
	q.style.display = "";
	q.innerHTML = s;
	if (typeof(c) === "string") q.setAttribute("class", c);
	else q.removeAttribute("class");
	if (scen.timer.hasOwnProperty("report")) clearFrameTimeout("report");
	if (b) {
		setFrameTimeout("report", conf.moni.report.delay, function() {
			hideReport()
		});
	}
}

function hideReport() {
	let q = document.getElementById("report");
	q.style.display = "none";
	q.innerHTML = "";
}

// =============================================================================
// -----------------------------------------------------------------------------
// # Status
// -----------------------------------------------------------------------------
// =============================================================================

function updateStatus(o) { // o = entity (null for reset)
	let q = document.getElementById("status");
	if (o != null) s = q.setAttribute("class", getTypeKey(o.type));
	else q.removeAttribute("class");
	q.querySelector("#status_rank").innerHTML = o != null ? lang[o.subt] : "";
	q.querySelector("#status_name").innerHTML = o != null ? o.name : "";
	q.querySelector("#status_life").style.height = o != null ? (16 * Math.min(Math.max(o.life, 0), 10)) + "px" : "0";
	if (o != null) q.querySelector("#status_weapon").setAttribute("class", o.weapon);
	else q.querySelector("#status_weapon").removeAttribute("class");
	if (o != null && (o.attack.reroll_melee || o.attack.reroll_range))
		q.querySelector("#status_targeter").style.display = "";
	else q.querySelector("#status_targeter").style.display = "none";
}

function resetStatus() {
	updateStatus(null);
}

function showStatus(o) { // o = entity
	let q = document.getElementById("status");
	updateStatus(o);
	moni.status.active = true;
	q.style.display = "";
}

function hideStatus() {
	let q = document.getElementById("status");
	moni.status.active = false;
	q.style.display = "none";
}

// =============================================================================
// -----------------------------------------------------------------------------
// # Identify
// -----------------------------------------------------------------------------
// =============================================================================

////////////////////////////////////////////////////////////////////////////////
// @ Functions
////////////////////////////////////////////////////////////////////////////////

function getIdentifyBodyRect(s) { // s = entity subtype ; returns rect {x,y,w,h}
	let x, y, w, h, a_x = 0, a_y = 0, n = 32 * 2;
	switch(s) {
		// * Bleep
		case "bleep"       : x = 0;   y = 0;   w = h = 1.5; break;
		// * Characters
		case "commander"   : x = 1.5; y = 0;   w = h = 1.5; break;
		case "trooper"     : x = 3;   y = 0;   w = h = 1.5; break;
		case "gremkin"     : x = 4.5; y = 0;   w = h = 1.5; a_x = -2; a_y = 4; break;
		case "scrof"       : x = 6;   y = 0;   w = h = 1.5; a_y = 6; break;
		case "limbo_lw"    :
		case "limbo_hw"    : x = 1.5; y = 1.5; w = h = 1.5; break;
		case "limbo_cc"    : x = 3;   y = 1.5; w = h = 1.5; break;
		case "fleshripper" : x = 4.5; y = 1.5; w = h = 1.5; break;
		case "cyborg"      : x = 6;   y = 1.5; w = h = 1.5; a_x = 3; break;
		case "juggernaut"  : x = 0;   y = 3;   w = h = 2; break;
		// * Doors
		case "airlock"     : x = 2;   y = 3;   w = h = 2; break;
		// * Items
		case "boulder"     : x = 4;   y = 3;   w = h = 1; break;
		case "c_panel_1"   : x = 5;   y = 3;   w = h = 1; break;
		case "c_panel_2"   : x = 6;   y = 3;   w = h = 1; break;
		case "weapon"      : x = 7;   y = 3;   w = h = 1; break;
		case "brain"       : x = 4;   y = 4;   w = h = 1; break;
		case "nuke"        : x = 5;   y = 4;   w = h = 1; break;
		case "egg"         : x = 6;   y = 4;   w = h = 1; break;
		case "cube"        : x = 7;   y = 4;   w = h = 1; break;
		case "breach"      : x = 8;   y = 3;   w = 1; h = 2; break;
	} return {"x" : x * n, "y": y * n, "w" : w * n, "h" : h * n, "a_x" : a_x * 2, "a_y" : a_y * 2};
}

function getIdentifyWeapRect(s) { // s = weapon key ; returns rect {x,y,w,h}
	let x, y, w = 1.5, h = 1.5, n = 32 * 2;
	switch(s) {
		case "unarmed"             : x = 0; y = 0; break;
		case "claw"                : x = 1.5; y = 0; break;
		case "glove_sword"         : x = 3; y = 0; break;
		case "pistol_axe"          : x = 4.5; y = 0; break;
		case "pistol_knife"        : x = 6; y = 0; break;
		case "gremkin_rifle"       : x = 7.5; y = 0; break;
		case "cyborg_rifle"        : x = 0; y = 1.5; break;
		case "bloter"              :
		case "bloter_pistol"       :
		case "bloter_blade"        :
		case "bloter_blade_pistol" : x = 1.5; y = 1.5; break;
		case "heavy_bloter"        :
		case "heavy_bloter_plasma" : x = 3; y = 1.5; break;
		case "plasma_cannon"       : x = 4.5; y = 1.5; break;
		case "machine_gun"         : x = 6; y = 1.5; break;
		case "rocket_launcher"     : x = 7.5; y = 1.5; break;
		case "grenade"             : x = 0; y = 3; break;
		case "dual_heavy_smg"      : x = 2; y = 3; w = h = 2; break;
		case "rocket_mg"           : x = 4; y = 3; w = h = 2; break;
	} return {"x" : x * n, "y": y * n, "w" : w * n, "h" : h * n};
}

function drawIdentify(o) { //o = entity
	let q = document.getElementById("identify");
	let ele = q.querySelector("canvas");
	let ctx = ele.getContext("2d");
	let x, y, w, h;
	x = 0;
	y = 0;
	w = ele.width;
	h = ele.height;
	// * Clear canvas
	ctx.clearRect(x, y, w, h);
	// * Draw body bitmap
	let img = ui.moni.identify_body.img;
	let src = getIdentifyBodyRect(o.unseen ? "bleep" : o.subt);
	ctx.drawImage(img, src.x, src.y, src.w, src.h, (w - src.w) / 2, (h - src.h), src.w, src.h);
	// * Draw weapon bitmap
	if (!o.unseen && o.weapon != null) {
		let wmg = ui.moni.identify_weap.img;
		let wrc = getIdentifyWeapRect(o.weapon);
		ctx.drawImage(wmg, wrc.x, wrc.y, wrc.w, wrc.h, (w - wrc.w) / 2 + src.a_x, (h - wrc.h) + src.a_y, wrc.w, wrc.h);
	}
	// * Recolor sprite
	recolorSprite(o, ctx, x, y, w, h, conf.moni.identify.brightness);
}

function identify(o) { // o = entity
	let q = document.getElementById("identify");
	let p = q.querySelectorAll("p");
	let t = getTypeKey(o);
	// * Set container class
	q.setAttribute("class", o.unseen ? "bleep" : t);
	// * Set container texts
	if (isMarine(o)) { // marine
		p[0].innerHTML = lang[t];
		p[1].innerHTML = o.subt;
	} else if (o.unseen) { // bleep
		p[0].innerHTML = lang["unidentified"];
		p[1].innerHTML = "";
	} else { // item or alien
		p[0].innerHTML = lang[o.subt];
		p[1].innerHTML = "";
	}
	// * Draw entity bitmap
	drawIdentify(o);
}

function showIdentify(o) { // o = entity
	let q = document.getElementById("identify");
	moni.identify.active = true;
	if (o != null) identify(o);
	q.style.display = "";
}

function hideIdentify() {
	let q = document.getElementById("identify");
	moni.identify.active = false;
	q.style.display = "none";
}

////////////////////////////////////////////////////////////////////////////////
// @ Events
////////////////////////////////////////////////////////////////////////////////

document.getElementById("identify").addEventListener("click", function() {hideIdentify()});

// =============================================================================
// -----------------------------------------------------------------------------
// # Turn
// -----------------------------------------------------------------------------
// =============================================================================

function showTurn(b) { // b = prompt flag
	let q = document.getElementById("turn");
	moni.turn.active = true;
	q.querySelector("p").innerHTML = lang["remaining_turn"] + getTurnRemaining();
	q.style.display = "";
	if (b) {
		moni.turn.prompt = true;
		showReport(lang["click_on_fire"], "mult teal");
	}
}

function hideTurn(b) { // b = prompt flag
	let q = document.getElementById("turn");
	moni.turn.active = false;
	q.style.display = "none";
	if (b) {
		moni.turn.prompt = false;
		hideReport();
	}
}

function validTurn() {
	hideTurn(true);
	setFrameTimeout("turn", conf.moni.turn.delay, function() {
		startAlienEvent(); // TEMP
	});
}

// =============================================================================
// -----------------------------------------------------------------------------
// # Alien
// -----------------------------------------------------------------------------
// =============================================================================

function setAlienText(s) { // s = string
	s = s || "";
	let q = document.getElementById("alien");
	let p = q.querySelector("p");
	p.innerHTML = s;
}

function showAlien(s) { // s = string (optional)
	let q = document.getElementById("alien");
	moni.alien.active = true;
	q.style.display = "";
	setAlienText(s);
}

function hideAlien() {
	let q = document.getElementById("alien");
	moni.alien.active = false;
	q.style.display = "none";
}

