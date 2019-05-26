/*

temp.js

*/

// =============================================================================
// -----------------------------------------------------------------------------
// # Variables
// -----------------------------------------------------------------------------
// =============================================================================

var setup = { // TEMP

	//////////////////////////////////////////////////////////////////////////////
	// @ Language
	//////////////////////////////////////////////////////////////////////////////

	"lang" : "en",

	//////////////////////////////////////////////////////////////////////////////
	// @ Game
	//////////////////////////////////////////////////////////////////////////////

	"mode" : "skirmish",
	"map" : "m01",
	"nb_player" : 1

};

var tempstorage = { // TEMP
	"settings" : {
		"keyboard_layout" : null,
		"keymap" : {}
	},
	// ---------------------------------------------------------------------------
	"setup" : {},
	// ---------------------------------------------------------------------------
	"autosave" : null,
	// ---------------------------------------------------------------------------
	"quicksave" : null,
	// ---------------------------------------------------------------------------
	"save_1" : null,
	// ---------------------------------------------------------------------------
	"save_2" : null,
	// ---------------------------------------------------------------------------
	"save_3" : null,
	// ---------------------------------------------------------------------------
	"save_4" : null,
	// ---------------------------------------------------------------------------
	"save_5" : null,
	// ---------------------------------------------------------------------------
	"save_6" : null,
	// ---------------------------------------------------------------------------
	"save_7" : null,
	// ---------------------------------------------------------------------------
	"save_8" : null
}

////////////////////////////////////////////////////////////////////////////////
// @ Window
////////////////////////////////////////////////////////////////////////////////

window.addEventListener("load", function() {
	// ---------------------------------------------------------------------------
	// * TEST : feed local storage with defaults values
	// ---------------------------------------------------------------------------
	let l = tempstorage, k;
	for (k in l) {
		if (!hasLocalStorageKey(k)) {
			setLocalStorageItem(k, l[k]);
			if (k == "settings") {
				setLocalStorageItem("settings", {"keyboard_layout" : conf.keyboard_layouts[0], "keymap" : conf.keymap});
			}
		}
	}
	// ---------------------------------------------------------------------------
});

////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////

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
// @ TEST
////////////////////////////////////////////////////////////////////////////////

function playSoundResource(s) { // s = sound resource
	o = document.getElementById("audio");
	o.src = getSoundLocation(s);
	o.load();
	o.play();
}

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
		default               : k = null;
	} return k;
}

function getSoundLocation(s) { // s = sound resource ; returns sound location
	return s = conf.audio.sound.dir + s + "." + conf.audio.sound.ext;
}

function playSound(k, b, c) { // k = sound key, b = loop flag, c = pause sound flag ; returns audio player id
	let s = getSoundResource(k), o, i, r, p;
	if (s != null) {
		for (i = 0; i < conf.audio.sound.players + 1; i++) { // VERY TEMP
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
		if (o.loop) {
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

function getMusicLocation(s) { // s = music resource ; returns music location
	return s = conf.audio.music.dir + s + "." + conf.audio.music.ext;
}

function loadMusic(s) { // s = music resource
	let o = document.getElementById("music");
	o.src = getMusicLocation(s);
	o.loop = true;
	o.load();
}

function playMusic() {
	let o = document.getElementById("music");
	o.play();
	main.audio.music.play = true;
}

function pauseMusic() {
	let o = document.getElementById("music");
	o.pause();
}

function stopMusic() {
	let o = document.getElementById("music");
	o.pause();
	o.currentTime = 0;
	main.audio.music.play = false;
}

function getMusicTime() { // returns float
	let o = document.getElementById("music");
	return o.currentTime;
}

function setMusicTime(n) { // n = float
	let o = document.getElementById("music");
	o.currentTime = n;
}

////////////////////////////////////////////////////////////////////////////////
// @ Audio Controls
////////////////////////////////////////////////////////////////////////////////

function pauseSoundPlayers() {
	document.querySelectorAll("audio").forEach(function(o) {
		if (o.id != "music" && !o.ended && o.currentTime > 0 && !o.hasAttribute("data-pause-sound")) {
			o.pause();
		}
	});
}

function continueSoundPlayers() {
	document.querySelectorAll("audio").forEach(function(o) {
		if (o.id != "music" && !o.ended && o.currentTime > 0 && !o.hasAttribute("data-stop")) {
			o.play();
		}
	});
}

function resetSoundPlayers() {
	document.querySelectorAll("audio").forEach(function(o) {
		if (o.id != "music") {
			o.removeAttribute("src");
			o.loop = false;
			o.load();
		}
	});
}

function setSoundVolume(n) { // n = float (0.0 to 1.0)
	n = Math.clamp(0.0, n, 1.0);
	main.audio.sound.volume = n;
	document.querySelectorAll("audio").forEach(function(o) {
		if (o.id != "music") o.volume = n;
	});
	// console.log("%csound volume set to " + n, conf.console["test"]); // DEBUG
}

function setMusicVolume(n) { // n = float (0.0 to 1.0)
	n = Math.clamp(0.0, n, 1.0);
	main.audio.music.volume = n;
	document.getElementById("music").volume = n;
	// console.log("%cmusic volume set to " + n, conf.console["test"]); // DEBUG
}

function setAudioMute(b) { // b = muted flag
	main.audio.mute = b;
	document.querySelectorAll("audio").forEach(function(o) {
		o.muted = b;
	});
}

function toggleAudioMute() {
	setAudioMute(main.audio.mute ? false : true);
}

////////////////////////////////////////////////////////////////////////////////
// @ Content Modifications
////////////////////////////////////////////////////////////////////////////////

function createAudioPlayers() {
	let o = document.getElementById("pool"), u, i;
	let m = conf.audio.sound.players;
	for (i = 0; i < m + 1; i++) {
		u = document.createElement("audio");
		u.id = i == m ? "music" : "sound_" + i;
		o.appendChild(u);
	}
}

////////////////////////////////////////////////////////////////////////////////
// @ Window Events
////////////////////////////////////////////////////////////////////////////////

function setVolumeFromInput(o, b) { // o = HTML element, b = no info flag
	let n = o.value / 100, s = o.id.substr(7);
	if (!b) {
		clearTimeout(tool[o.id].timer);
		let u = document.querySelector("[for='" + o.id + "']");
		u.innerHTML = o.value + "%";
		u.style.color = "yellow";
		tool[o.id].timer = setTimeout(function() {
			u.innerHTML = u.getAttribute("data-text");
			u.style.color = "";
		}, tool.volume_label_delay);
	}
	if (s == "sound") setSoundVolume(n);
	else if (s == "music") setMusicVolume(n);
}

window.addEventListener("load", function() {
	// * Create audio players
	createAudioPlayers(); // TEMP
	// * Load music
	loadMusic("test"); // TEMP
	// * Prepare Tool range inputs
	document.querySelectorAll("input[type='range']").forEach(function(o) {
		// * Reset range inputs
		o.value = o.getAttribute("value");
		// * Set initial volumes
		setVolumeFromInput(o, true);
		// * Bind events
		o.addEventListener("mousedown", function() { tool[o.id].down = true; });
		o.addEventListener("mouseup", function() { tool[o.id].down = false; });
		o.addEventListener("mousemove", function() { if (tool[o.id].down) setVolumeFromInput(o); });
		o.addEventListener("change", function() { setVolumeFromInput(o); });
		o.addEventListener("wheel", function(e) { e.preventDefault(); });
	});
	// * Auto-start music
	// document.getElementById("play_music").click(); // TEMP
});
