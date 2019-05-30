/*

	mupt.js (game.js ext)

*/

// =============================================================================
// -----------------------------------------------------------------------------
// # Notes
// -----------------------------------------------------------------------------
// =============================================================================

/**

	& WHY ARE ALIENS SO DUMB?

	1 - Fit best original AI (despite some improvement like sniper conduct).
	2 - Lack of skill in AI programing (pain in the ass big brain task).
	3 - Humans should have a strategic advantage based on intellect
			because aliens in original game are numerous (and should remain as it).
			If the AI is improved, the number of mobs must be reduced accordingly
			in order to keep the game fair and nice (which is precisely the purpose).
			Plus, we assume that the strategic advantage can be improved by humans.
			That is part of the gameplay (i.e. improvement by learning ;
			the more the human plays, the more it is able to improve its skill
			by finding new strategies and ways of playing and winning).
			Last, below a certain limit, the human inner satisfaction is assumed
			to be greater if it slays numerous aliens than if it beats a smart AI.

	& MUPPETS

	# Definition
		A 'muppet' is as a "puppet noted for silliness" [https://en.wiktionary.org/wiki/muppet]

	# Order of play
		game logic      [conduct, movement], distance, <dangerosity>
		code logic      id, subtype, random

	# Alien           Conduct
		gremkin         sniper
		scrof           rusher
		limbo_lw        walker
		limbo_hw        sniper
		limbo_cc        gunner
		fleshripper     rusher
		cyborg          walker
		juggernaut      gunner

	# Conduct         Description
		rusher          engage nearest in melee ; move to nearest then fire nearest if can't engage melee
		walker          fire nearest and move to nearest ; engage melee if hostile near (radius of 4)
		gunner          fire nearest and hold position ; fire nearest if hostile adjacent
		sniper          fire nearest and hold position ; move backward if hostile very near (radius of 2)
	+ bomber          move to nearest then explode himself

	# Conduct         Target
		rusher          nearest hostile in sight or sense
		walker          nearest hostile in sight or sense
		gunner          nearest hostile in sight then nearest hostile in sense
		sniper          nearest hostile in sight then nearest hostile in sense
	+ bomber          nearest hostile in move range

	# Conduct         Melee dist      Shoot dist      Shoot time
		rusher          1+              target afar     after move
		walker          4-              4+              before move
		gunner          *               1+              before move
		sniper          *               1+              before move
	+ bomber          1+              *               *

	# Conduct         Move toward     Move at_sight   Move backward
		rusher          always          *               *
		walker          always          *               *
		gunner          *               out of sight    *
		sniper          *               out of sight    2-
	+ bomber          always          *               *

	# Move            Description
		toward          move to any target adjacent tile
		backward        move at target sight farest accessible tile
		at_sight        move at target sight farest accessible tile if possible ; move to any target adjacent tile otherwise

*/

// =============================================================================
// -----------------------------------------------------------------------------
// # Globals
// -----------------------------------------------------------------------------
// =============================================================================

var mupt = {

	"active" : false,
	"acting" : false,
	"actor" : [],
	"index" : 0,
	"loop" : 0

};

// =============================================================================
// -----------------------------------------------------------------------------
// # Alien Event
// -----------------------------------------------------------------------------
// =============================================================================

////////////////////////////////////////////////////////////////////////////////
// @ Pawns
////////////////////////////////////////////////////////////////////////////////

function getLastIndex(t, s) { // t = type, s = subtype ; returns integer (-1 if unknow)
	let k, o, r = -1, a = [], l = pawn;
	for (k in l) {
		let o = l[k];
		if ((t == null && s == null)
		 || (o.type == t && s == null)
		 || (t == null && o.subt == s)
		 || (o.type == t && o.subt == s)
		) a.push(getIndexFromId(o));
	}
	if (a.length > 0) {
		a.sort(desc); // highest to lowest
		r = Math.max(a[0], a.length);
	} else if (t == null && s != null) r = 0; // none of this subtype in pawn rooster
	return r;
}

////////////////////////////////////////////////////////////////////////////////
// @ Commands
////////////////////////////////////////////////////////////////////////////////

function focusCenter(o, s, c, r, f) { // o = entity, s = report string, c = report class, r = reveal flag, f = callback function
	if (typeof(f) === "function") f();
	if (s !== undefined) showReport(s, c);
	setFocus(o);
	centerToPixel(o.x, o.y);
	if (r) o.reveal(true); // also update minimap
}

function focusCenterReveal(o, s, c, f) { // o = entity, s = report string, c = report class, f = callback function
	focusCenter(o, s, c, true, f);
}

function hangFocusCenter(o, m, s, c, r, f) { // o = entity, m = delay multiplier, s = report string, c = report class, r = reveal flag, f = callback function
	if (m === undefined) m = 1;
	setFrameTimeout("alien_event_" + m, m * conf.moni.alien.event.delay, function() {
		focusCenter(o, s, c, r, f);
	});
}

function hangFocusCenterReveal(o, m, s, c, f) { // o = entity, m = delay multiplier, s = report string, c = report class, f = callback function
	hangFocusCenter(o, m, s, c, true, f);
}

function hangEndAlienEvent(m) { // m = delay multiplier
	if (m === undefined) m = 1;
	setFrameTimeout("alien_event_" + m, m * conf.moni.alien.event.delay, function() {
		endAlienEvent();
	});
}

////////////////////////////////////////////////////////////////////////////////
// @ Dummy
////////////////////////////////////////////////////////////////////////////////

function attackFromDummy(u, s, b) { // u = targetted entity, s = dummy id, b = blast weapon flag
	// * Create dummy entity
	let o = {"id" : s, "attack" : {"range" : [[1, true]]}, "range" : "shoot"}
	if (b) {
		// * Change weapon
		o.weapon = "rocket_launcher"
		// * Change weapon damage
		o.attack.range[0][0] = 2; // 2HD
		// * Set variables
		let x = ti(u.x);
		let y = ti(u.y);
		// * Set hilite
		ents.Rect.hilite.setSquare([[x, y]], [x, y]);
		// * Draw target
		ents.Rect.range.draw(ents.Rect.hilite.list, "range_shoot", true);
	}
	// * Set dummy as game actor
	game.actor = o;
	// * Focus and center on targetted entity
	focusCenter(u);
	// * Force dummy to attack targetted entity
	console.log("[" + o.id + "] attacks [" + u.id + "]"); // DEBUG
	startAttack(o, "range", u.getTiX(), u.getTiY());
}

////////////////////////////////////////////////////////////////////////////////
// @ Marines
////////////////////////////////////////////////////////////////////////////////

function getRandomMarinePlayer() { // returns player
	let k, p, a = [];
	for (k in game.player) { // player ingame
		p = game.player[k];
		if (p != "alien") a.push(p);
	} return a[Math.floor(Math.random() * a.length)];
}

function getRandomMarine(s, v, h, e, p) { // s = subtype (null for any), v = visible only flag, h = heavy weapon flag, e = exclude id array, p = empty plinth around (object) ; returns entity
	let k, n, a = [];
	for (k in pawn) {
		o = pawn[k];
		if (!isMarine(o) || isGone(o)
		 || (s != null && o.subt != s)
		 || (v && !isVisible(o))
		 || (h && !hasHeavyWeapon(o))
		 || (Array.isArray(e) && e.includes(o.id))
		 || (typeof(p) === "object" && !hasEmptyTileAround(game.grid, ti(o.x), ti(o.y), p.width, p.height, true, null, getDockTypeList())) // diagonal, no pass through, exclude docking claws, include door rail, allow on self
		) continue;
		else a.push(o.id);
	}
	if (a.length > 0) {
		n = Math.floor(Math.random() * a.length);
		return pawn[a[n]];
	} return undefined;
}

function getFirstMarine(p) { // p = player (optional) ; returns entity
	if (p === undefined) p = getRandomMarinePlayer();
	let o = getCommander(p);
	if (o === undefined) o = getTrooper(p);
	return o;
}

////////////////////////////////////////////////////////////////////////////////
// @ Aliens
////////////////////////////////////////////////////////////////////////////////

function sortByDangerosity(l, r) { // l = pawn list, r = reverse flag (weakest to strongest) ; returns pawn list
	let o, k, i, a = [];
	for (k in l) {
		o = l[k];
		if (!isAlien(o)) continue;
		switch(o.subt) {
			case "juggernaut"  : i = 1; break;
			case "limbo_cc"    : i = 2; break;
			case "cyborg"      : i = 3; break;
			case "limbo_hw"    : i = 4; break;
			case "fleshripper" : i = 5; break; // melee only
			case "limbo_lw"    : i = 6; break;
			case "scrof"       : i = 7; break;
			case "gremkin"     : i = 8; break;
		} a.push([i, o]); // add value to list
	} r ? a.sort(arr_desc) : a.sort(arr_asc); // sort list
	return a.map(function(e) {return e[1]}); // reduce list to pawn
}

function getRandomAlien(s, v, p) { // s = subtype (null for any, '!' prefix for all but this), v = visible only flag* (false for invisible only), p = empty plinth around (object) ; returns entity
	let k, n, e, a = [], l = pawn;
	if (typeof(s) === "string" && s.substr(0, 1) == "!") {
		s = s.substr(1, s.length);
		e = true;
	}
	for (k in l) {
		o = l[k];
		if (!isAlien(o) || isGone(o)
		 || (s != null && (!e && o.subt != s) || (e && o.subt == s))
		 || (v && !isVisible(o))
		 || (v === false && isVisible(o))
		 || (typeof(p) === "object" && !hasEmptyTileAround(game.grid, ti(o.x), ti(o.y), p.width, p.height, true, null, getDockTypeList())) // diagonal, no pass through, exclude docking claws, include door rail, allow on self
		) continue;
		else a.push(o.id);
	}
	if (a.length > 0) {
		n = Math.floor(Math.random() * a.length);
		return pawn[a[n]];
	} return undefined;
}

function getFirstAlien(s, v, d, g, n) { // s = subtype (null for any, '!' prefix for all but this), v = visible only flag* (false for invisible only), d = sort by dangerosity ascending flag* (false for descending), g = range to hostile ("melee", "move", "sight" or "sense"), n = result as array of 'n' items ; returns entity or entity list
	let o, u, k, b, e, r, i = 0, l = typeof(d) == "boolean" ? sortByDangerosity(pawn, !d) : pawn;
	if (typeof(s) === "string" && s.substr(0, 1) == "!") {
		s = s.substr(1, s.length);
		e = true;
	}
	if (Number.isInteger(n)) r = [];
	for (k in l) {
		o = l[k]; // set alien
		b = false; // reset result
		if (!isAlien(o) || isGone(o)
		 || (s != null && (!e && o.subt != s) || (e && o.subt == s))
		 || (v && !isVisible(o))
		 || (v === false && isVisible(o))) continue;
		else {
			if (typeof(g) !== "string") { // no matter range
				b = true;
			} else if (g == "melee") { // lineally adjacent to hostile
				if (hasAdjacentCellOfValue(game.grid, ti(o.x), ti(o.y), getHostileTypeList(o))) {
					b = true;
				}
			} else { // at distant range of hostile
				if (o.hostile.sight == null) { // update sense and sight ranges if never done (i.e. first turn)
					o.updateSense();
					o.updateSight();
				}
				if (o.hostile.sight.length > 0 || o.hostile.sense.length > 0) { // has hostile in sight or sense
					t = g == "sense" ? o.getTarget() : g == "sight" ? o.getTarget(true) : o.getTarget(false, true);
					u = pawn[t[0]];
					if (typeof(u) === "object") { // target found
						if ((g == "move" && o.findPath(ti(u.x), ti(u.y), true).length <= o.movement)
						 || (g == "sense" && t[1] == "sight")
						 || (g == t[1])) { // in move range, in sight range or in sense range
							b = true;
						}
					}
				}
			}
			if (b) { // result found
				if (Number.isInteger(n)) { // result as array
					if (i < n) { r.push(o); i++; } // feed array
					else break;
				} else { // result as object
					r = o;
					break;
				}
			}
		}
	} return r;
}

////////////////////////////////////////////////////////////////////////////////
// @ Events
////////////////////////////////////////////////////////////////////////////////

function startAlienEvent() {

	if (conf.debug.time.alien_event) console.time("alienEvent"); // DEBUG

	// ---------------------------------------------------------------------------
	// * Play alien music theme
	// ---------------------------------------------------------------------------
	swapActiveMusicPlayer();
	if (main.audio.music.enabled) {
		stopMusic();
		playMusic();
	}
	// ---------------------------------------------------------------------------

	// ---------------------------------------------------------------------------
	// * Skip Alien Event -- DEBUG
	// ---------------------------------------------------------------------------
	if (conf.debug.skip.alien_event) { // DEBUG
		endAlienEvent();
		return;
	}
	// ---------------------------------------------------------------------------

	console.info("%c>---| ALIEN EVENT |---<", conf.console["alien"]); // DEBUG

	mupt.active = true;

	showIcon("alien_event");

	let a = game.team.alien.event.choice;
	let b = game.team.alien.event.random;
	let l = a.length > 0 ? a : b;
	let n, s;

	if (l.length > 0) {
		n = Math.floor(Math.random() * l.length);
		s = l[n];
		l.splice(n, 1);
	}

	// ---------------------------------------------------------------------------
	// * TEST : force event
	// ---------------------------------------------------------------------------
	// s = undefined; // TEMP
	// s = "mothership_trans"; // TEMP
	// s = "mothership_scan"; // TEMP
	// s = "airlock_control"; // TEMP
	// s = "auto_defence"; // TEMP
	// s = "exploding_trap"; // TEMP
	// s = "new_order"; // TEMP
	// s = "battle_plan"; // TEMP
	// s = "intercom_malfunc"; // TEMP
	// s = "equipment_malfunc"; // TEMP
	// s = "report_in"; // TEMP
	// s = "weapons_jammed"; // TEMP
	// s = "out_of_ammo"; // TEMP
	// s = "lure_of_limbo"; // TEMP
	// s = "psychic_attack"; // TEMP
	// s = "robotic_fault"; // TEMP
	// s = "robotic_assault"; // TEMP
	// s = "frenzy"; // TEMP
	// s = "alien_elite"; // TEMP
	// s = "self_destruction"; // TEMP
	// s = "gremkin_grenater"; // TEMP
	// s = "scrof_mechatek"; // TEMP
	// s = "re_deploy"; // TEMP
	// s = "alien_teleporter"; // TEMP
	// s = "alien_task_force"; // TEMP
	// s = "fleshripper"; // TEMP
	// ---------------------------------------------------------------------------

	if (s !== undefined) { // exec alien event
		execAlienEvent(s);
		showAlien(lang[s]);
	} else { // skip without delay
		console.log("[alien_event] no more event"); // DEBUG
		endAlienEvent();
	}

}

function execAlienEvent(s) { // s = alien event string
	let o, u, p, q, l, k, i, j, n, r, a, b, c, f;
	switch(s) {
		// -------------------------------------------------------------------------
		// * Mothership Transmission
		// -------------------------------------------------------------------------
		case "mothership_trans" :
			hideIcon("alien_event");
			showTransmission(lang[game.map].sec_obj); // TEMP
			break;
		// -------------------------------------------------------------------------
		// * Mothership Scan
		// -------------------------------------------------------------------------
		case "mothership_scan" :
			i = 0;
			for (k in pawn) {
				o = pawn[k];
				if (!o.hidden && o.unseen) { // any pawn concealed
					hangFocusCenterReveal(o, i / 2, lang[o.subt], isAlien(o) ? "green" : "teal"); // half-duration
					i++;
				}
			}
			if (i > 0) {
				hangEndAlienEvent(Math.max(1, i / 2)); // half-duration
				term.updateMiniMap();
				console.log("[" + s + "] revealed " + i + " bleeps"); // DEBUG
			} else {
				hangEndAlienEvent();
				showReport(lang["event_failure"], "gray");
				console.log("[" + s + "] failure <= no bleep to reveal"); // DEBUG
			}
			break;
		// -------------------------------------------------------------------------
		// * Airlock Control
		// -------------------------------------------------------------------------
		case "airlock_control" :
			o = getFirstMarine(); // first marine in random marine team
			if (o !== undefined) {
				p = getTypeKey(o);
				game.team[p].active.event.push(s);
				focusCenter(o);
				hangEndAlienEvent();
				showReport(lang["door_master"], "blue");
				console.log("[" + s + "] " + p + " player gains " + s); // DEBUG
			}
			break;
		// -------------------------------------------------------------------------
		// * Auto-Defence
		// * Exploding Trap
		// -------------------------------------------------------------------------
		case "auto_defence" :
		case "exploding_trap" :
			o = getRandomMarine(s == "exploding_trap" ? "trooper" : null, true); // any visible trooper or any visible marine
			if (o !== undefined) attackFromDummy(o, s, s == "exploding_trap");
			else {
				hangEndAlienEvent();
				showReport(lang["event_failure"], "gray");
				console.log("[" + s + "] failure <= no target to attack"); // DEBUG
			}
			break;
		// -------------------------------------------------------------------------
		// * New Order
		// * Battle Plan
		// -------------------------------------------------------------------------
		case "new_order" :
		case "battle_plan" :
			a = [];
			for (k in game.player) { // player ingame
				p = game.player[k];
				if (p != "alien" && hasTrooper(p) && hasCommander(p)) { // marine player that has trooper and commander
					l = getOrderPickable(p);
					if (l.length > 0) { // has order pickable
						a.push([p, l[Math.floor(Math.random() * l.length)]]); // random order not already giveable
					}
				}
			}
			if (a.length > 0) {
				b = s == "new_order";
				n = b ? 0 : a.length - 1;
				for (i = 0; i <= n; i++) {
					r = b ? a[Math.floor(Math.random() * a.length)] : a[i];
					game.team[r[0]].order[r[1]] = true;
					hangFocusCenter(getCommander(r[0]), i, fstr(lang["gain_f"], lang[r[1]]), "blue");
					console.log("[" + s + "] " + r[0] + " player gains " + r[1] + " as extra order"); // DEBUG
					if (i == n) hangEndAlienEvent(i + 1);
				}
			} else {
				hangEndAlienEvent();
				showReport(lang["event_failure"], "gray");
				console.log("[" + s + "] failure <= no commander ingame or no order pickable"); // DEBUG
			}
			break;
		// -------------------------------------------------------------------------
		// * Intercom Malfunction
		// -------------------------------------------------------------------------
		case "intercom_malfunc" :
			a = [];
			for (k in game.player) { // player ingame
				p = game.player[k];
				if (p != "alien" && hasTrooper(p) && hasCommander(p) && hasOrderGiveable(p)) a.push(p);
			}
			if (a.length > 0) { // order available
				p = a[Math.floor(Math.random() * a.length)];
				game.team[p].active.event.push(s);
				focusCenter(getCommander(p), lang["no_order"], "red");
				console.log("[" + s + "] " + p + " player can't give any order his next turn"); // DEBUG
			} else {
				showReport(lang["event_failure"], "gray");
				console.log("[" + s + "] failure <= no commander ingame or no order giveable"); // DEBUG
			}
			hangEndAlienEvent();
			break;
		// -------------------------------------------------------------------------
		// * Equipment Malfunction
		// -------------------------------------------------------------------------
		case "equipment_malfunc" :
			a = [];
			for (k in game.player) { // player ingame
				p = game.player[k];
				if (p != "alien" && hasEquipmentUseable(p)) a.push(p);
			}
			if (a.length > 0) { // equipment available
				p = a[Math.floor(Math.random() * a.length)];
				l = getEquipmentUseable(p);
				r = l[Math.floor(Math.random() * l.length)];
				game.team[p].equipment[r] = false;
				focusCenter(getFirstMarine(p), fstr(lang["lose_f"], lang[r]), "red");
				console.log("[" + s + "] " + p + " player loses " + r + " useable equipment"); // DEBUG
			} else {
				showReport(lang["event_failure"], "gray");
				console.log("[" + s + "] failure <= no equipment useable"); // DEBUG
			}
			hangEndAlienEvent();
			break;
		// -------------------------------------------------------------------------
		// * Report In
		// -------------------------------------------------------------------------
		case "report_in" :
			o = getRandomMarine("commander"); // any commander
			if (o !== undefined) {
				game.team[getTypeKey(o.type)].active.event.push(s);
				focusCenter(o, lang["no_action"], "red");
				console.log("[" + s + "] [" + o.id + "] loses his next actions"); // DEBUG
			} else {
				showReport(lang["event_failure"], "gray");
				console.log("[" + s + "] failure <= no commander ingame"); // DEBUG
			}
			hangEndAlienEvent();
			break;
		// -------------------------------------------------------------------------
		// * Weapons Jammed
		// -------------------------------------------------------------------------
		case "weapons_jammed" :
			o = getRandomMarine(null, false, true); // any marine with heavy weapon
			if (o !== undefined) {
				p = getTypeKey(o.type);
				game.team[p].active.event.push(s);
				focusCenter(getFirstMarine(p), lang["no_heavy_weapon"], "red");
				console.log("[" + s + "] " + p + " player cant't fire any heavy weapon his next turn"); // DEBUG
			} else {
				showReport(lang["event_failure"], "gray");
				console.log("[" + s + "] failure <= no marine with heavy weapon ingame"); // DEBUG
			}
			hangEndAlienEvent();
			break;
		// -------------------------------------------------------------------------
		// * Out of ammo
		// -------------------------------------------------------------------------
		case "out_of_ammo" :
			o = getRandomMarine("trooper", false, true); // any marine with heavy weapon
			if (o !== undefined) {
				i = 0;
				r = o.weapon;
				p = getTypeKey(o.type);
				l = game.team[p].members;
				for (k in l) if (getBaseWeapon(l[k].weapon) == "bloter") i++; // check from settings (i.e. no matter if a bloter is in fact available because another marine died)
				o.changeWeapon(i >= 3 ? "unarmed" : "bloter"); // set unarmed if no bloter available
				focusCenter(o, fstr(lang["lose_f"], lang[r]), "red");
				console.log("[" + s + "] " + p + " player loses [" + o.id + "] heavy weapon"); // DEBUG
			} else {
				showReport(lang["event_failure"], "gray");
				console.log("[" + s + "] failure <= no trooper with heavy weapon ingame"); // DEBUG
			}
			hangEndAlienEvent();
			break;
		// -------------------------------------------------------------------------
		// * Lure of Limbo
		// -------------------------------------------------------------------------
		case "lure_of_limbo" :
			o = getRandomMarine("trooper"); // any trooper
			if (o !== undefined) {
				attackFromDummy(o, s);
			} else {
				hangEndAlienEvent();
				showReport(lang["event_failure"], "gray");
				console.log("[" + s + "] failure <= no trooper ingame"); // DEBUG
			}
			break;
		// -------------------------------------------------------------------------
		// * Psychic Attack
		// * Robotic Fault
		// * Robotic Assault
		// -------------------------------------------------------------------------
		case "psychic_attack" : b = true;
		case "robotic_fault" :
		case "robotic_assault" :
			q = s == "robotic_assault";
			n = q ? 2 : 0;
			i = j = 0;
			for (k in pawn) {
				o = pawn[k];
				c = o.subt == "juggernaut" || o.subt == "cyborg";
				if (b) c = o.subt == "gremkin" || o.subt == "scrof";
				if (!isGone(o) && c) {
					if (isVisible(o)) {
						hangFocusCenter(o, i / 2, lang[q ? "more_alien_action" : "no_alien_action"], q ? "red" : "blue"); // half-duration
						i++;
					}
					resetMemberActions(o, n);
					j++;
				}
			}
			if (i > 0) {
				hangEndAlienEvent(Math.max(1, i / 2)); // half-duration
				console.log("[" + s + "] " + i + " visible alien" + (i > 1 ? "s" : "") + " " + (n == 0 ? "won't act" : "will act twice") + " (" + j + " alien" + (i + j > 1 ? "s" : "") + " really affected)"); // DEBUG
			} else {
				hangEndAlienEvent();
				showReport(lang[j == 0 ? "event_failure" : "event_success"], j == 0 ? "gray" : "green");
				console.log("[" + s + "] possible failure <= no visible alien (" + j + " alien" + (j > 1 ? "s" : "") + " really affected)"); // DEBUG
			}
			break;
		// -------------------------------------------------------------------------
		// * Frenzy
		// -------------------------------------------------------------------------
		case "frenzy" :
			o = getFirstAlien("scrof", null, null, "melee"); // first scrof adjacent to hostile
			if (o === undefined) o = getFirstAlien("scrof", null, null, "move"); // first scrof in move range of hostile
			if (o === undefined) o = getFirstAlien("gremkin", null, null, "melee"); // first gremkin ajacent to hostile
			if (o === undefined) o = getFirstAlien("gremkin", null, null, "move"); // first gremkin in move range of hostile
			if (o !== undefined) {
				console.log("[" + s + "] [" + o.id + "] becomes frenzy"); // DEBUG
				if (isVisible(o)) focusCenter(o, lang["more_alien_attack"], "red"); // even hidden
				else showReport(lang["event_success"], "green");
				o.condition.frenzy = true;
				o.color.major = "grunt";
				o.action.attack_melee = 2;
				if (o.subt == "gremkin") o.conduct = "rusher";
			} else {
				showReport(lang["event_failure"], "gray");
				console.log("[" + s + "] failure <= no hostile in move range of any gremkin or scrof"); // DEBUG
			}
			hangEndAlienEvent();
			break;
		// -------------------------------------------------------------------------
		// * Alien Elite
		// -------------------------------------------------------------------------
		case "alien_elite" :
			o = getFirstAlien(null, null, true, "sight"); // first most dangerous alien in sight range of hostile
			u = getFirstAlien(null, null, true, "move"); // first most dangerous alien in move range of hostile
			if (o !== undefined && u !== undefined) o = sortByDangerosity([o, u])[0]; // first most dangerous alien in either sight range or move range of hostile
			else o = getFirstAlien(null, null, true, "sense"); // first most dangerous alien in sense range of hostile
			if (o !== undefined) {
				console.log("[" + s + "] [" + o.id + "] becomes an elite"); // DEBUG
				if (isVisible(o)) focusCenter(o, lang["more_alien_action"], "red"); // even hidden
				else showReport(lang["event_success"], "green");
				o.condition.elite = true;
				o.color.major = "cadet";
				resetMemberActions(o, 2);
			} else {
				showReport(lang["event_failure"], "gray");
				console.log("[" + s + "] failure <= no hostile in move, sight or sense range of any alien"); // DEBUG
			}
			hangEndAlienEvent();
			break;
		// -------------------------------------------------------------------------
		// * Self-Destruction
		// -------------------------------------------------------------------------
		case "self_destruction" :
			o = getFirstAlien("cyborg", null, null, "move"); // first cyborg in move range of hostile
			if (o !== undefined) {
				u = pawn[o.getTarget(false, true)[0]]; // nearest hostile in sight or sense
				if (u !== undefined) {
					console.log("[" + s + "] [" + o.id + "] is commanded to destruct self"); // DEBUG
					o.conduct = "bomber";
					o.color.major = "shine";
					if (!isVisible(o)) o.reveal(true); // also update minimap
					moveToward(o, u, true); // move to nearest tile in direction of target
				}
			} else {
				hangEndAlienEvent();
				showReport(lang["event_failure"], "gray");
				console.log("[" + s + "] failure <= no hostile in move range of any cyborg"); // DEBUG
			}
			break;
		// -------------------------------------------------------------------------
		// * Gremkin Grenater
		// * Scrof Mechatek
		// -------------------------------------------------------------------------
		case "gremkin_grenater" : b = true;
		case "scrof_mechatek" :
			q = b ? "gremkin" : "scrof";
			o = getFirstAlien(q, null, null, "sight"); // first of subtype in sight range of hostile
			if (o === undefined) o = getFirstAlien(q, null, null, "move"); // first of subtype in move range of hostile
			if (o === undefined) o = getFirstAlien(q, null, null, "sense"); // first of subtype in sense range of hostile
			if (o === undefined) o = getRandomAlien(q, true); // any visible of subtype
			if (o === undefined) o = getRandomAlien(q, null); // any invisible of subtype
			if (o !== undefined) {
				console.log("[" + s + "] [" + o.id + "] pulls out " + (b ? "a frag grenade" : " an experimental weapon")); // DEBUG
				if (isVisible(o)) focusCenter(o, lang["gain_alien_weapon"], "red"); // even hidden
				else showReport(lang["event_success"], "green");
				o.changeWeapon(b ? "grenade" : "plasma_cannon");
				o.conduct = "sniper";
			} else {
				showReport(lang["event_failure"], "gray");
				console.log("[" + s + "] failure <= no " + q + " ingame"); // DEBUG
			}
			hangEndAlienEvent();
			break;
		// -------------------------------------------------------------------------
		// * Re-Deploy
		// -------------------------------------------------------------------------
		// * Get (A, B, C) first three most dangerous invisible aliens except juggernaut
		// * Teleport (A, B, C) near any random marine prior to more <vulnerable> OR [near map objective] OR [near marine spawn] --TODO ?
		case "re_deploy" :
			a = getFirstAlien("!juggernaut", null, true, null, 3); // first three most dangerous invisible aliens except juggernaut
			if (a.length > 0) {
				i = 0;
				l = [];
				for (j = 0; j < a.length; j++) {
					o = a[j];
					// * Target any random marine prior to more <vulnerable>
					u = getRandomMarine("trooper", true, true, l); // any visible trooper with heavy weapon not previously targetted
					if (u === undefined) u = getRandomMarine("trooper", true, false, l); // any visible trooper not previously targetted
					if (u === undefined) u = getRandomMarine("commander", true, false, l); // any visible commander not previously targetted
					if (u === undefined && l.length > 0) u = pawn[l[Math.floor(Math.random() * l.length)]]; // re-target randomly a previously targetted marine
					if (u !== undefined) {
						// * Set destination point
						b = o.conduct == "sniper" || o.conduct == "gunner"; // sniper or gunner => farest tile in sight range of target ; walker or rusher => nearest tile next to target
						p = getDestToTarget(o, u, !(hasMeleeWeapon(o) || o.conduct == "rusher"), b, b, true);
						// * Teleport to destination point
						if (p !== undefined) {
							if (!l.includes(u.id)) l.push(u.id);
							console.log("[" + s + "] [" + o.id + "] re-deployed from (" + ti(o.x) + "," + ti(o.y) + ") near [" + u.id + "] to (" + p[0] + "," + p[1] + ")"); // DEBUG
							o.teleport(p[0], p[1], true); // blind teleport
							hangFocusCenterReveal(o, i / 2, lang[o.subt], "green"); // half-duration
							i++;
						}
					} else {
						console.log("[" + s + "] partial failure <= only " + i + " alien" + (i > 1 ? "s" : "") + " re-deployed"); // DEBUG
						break;
					}
				}
				hangEndAlienEvent(Math.max(1, i / 2)); // half-duration
			} else {
				hangEndAlienEvent();
				showReport(lang["event_failure"], "gray");
				console.log("[" + s + "] failure <= no alien suitable for re-deployment"); // DEBUG
			}
			break;
		// -------------------------------------------------------------------------
		// * Alien Teleporter
		// -------------------------------------------------------------------------
		// * Get (A) less dangerous visible alien next to any marine
		// * Get (B) most dangerous visible alien
		// * Teleport (A) to (B) position
		// * Teleport (B) to (A) position
		case "alien_teleporter" :
			o = getFirstAlien("!juggernaut", true, false, "move"); // first less dangerous visible alien except juggernaut in move range of hostile
			if (o === undefined) o = getFirstAlien("!juggernaut", true, false, "sight"); // first less dangerous visible alien except juggernaut in sight range of hostile
			if (o === undefined) o = getFirstAlien("!juggernaut", true, false, "sense"); // first less dangerous visible alien except juggernaut in sense range of hostile
			u = getFirstAlien("!juggernaut", true, true); // first most dangerous visible alien
			if (o !== undefined && u !== undefined && o != u) {
				focusCenter(u, lang[u.subt], "green");
				hangFocusCenter(u, 1/2, lang["alien_teleported"], "red", false, function() {
					p = [[ti(o.x), ti(o.y)], [ti(u.x), ti(u.y)]];
					o.x = px(-1);
					o.y = px(-1);
					u.x = px(-1);
					u.y = px(-1);
					o.resetPosition();
					u.resetPosition();
					o.teleport(p[1][0], p[1][1], true, true); // blind transfer
					u.teleport(p[0][0], p[0][1], true, true); // blind transfer
				});
				console.log("[" + s + "] [" + u.id + "] swapped with [" + o.id + "]"); // DEBUG
			} else {
				showReport(lang["event_failure"], "gray");
				console.log("[" + s + "] failure <= no alien suitable for swapping"); // DEBUG
			}
			hangEndAlienEvent();
			break;
		// -------------------------------------------------------------------------
		// * Alien Task Force
		// -------------------------------------------------------------------------
		case "alien_task_force" :
			i = recoverAlienReinforcementTokens(2); // add up to 2 reinforcement tokens
			if (i > 0) {
				showReport(lang["event_success"], "green");
				console.log("[" + s + "] alien player gains " + i + " reinforcement token" + (i > 1 ? "s" : "")); // DEBUG
			} else {
				showReport(lang["event_failure"], "gray");
				console.log("[" + s + "] failure <= no unused reinforcement token"); // DEBUG
			}
			hangEndAlienEvent();
			break;
		// -------------------------------------------------------------------------
		// * Fleshripper
		// -------------------------------------------------------------------------
		case "fleshripper" :
			q = "fleshripper";
			p = getPlinth(q);
			o = getRandomMarine(null, true, null, null, p); // any visible marine with empty plinth around
			if (o !== undefined) {
				r = getEmptyTileAround(game.grid, ti(o.x), ti(o.y), p.width, p.height, false, null, getDockTypeList()); // lineal, no pass through, exclude docking claws, include door rail, allow on self
				if (r.length == 0) r = getEmptyTileAround(game.grid, ti(o.x), ti(o.y), p.width, p.height, true, null, getDockTypeList()); // diagonal, no pass through, exclude docking claws, include door rail, allow on self
				if (r.length > 0) {
					k = r.length > 1 ? Math.floor(Math.random() * r.length) : 0; // random empty tile around
					u = createAlien(q + leadZero(getLastIndex(null, q) + 1), px(r[k][0]), px(r[k][1]), q);
					u.turnTo(o);
					focusCenter(o);
					hangFocusCenter(u, 1/2, lang["alien_spawned"], "red", true);
					console.log("[" + s + "] alien [" + u.id + "] placed at (" + r[k][0] + "," + r[k][1] + ") near [" + o.id + "]"); // DEBUG
				} else {
					f = true;
					console.log("[" + s + "] failure <= no place suitable for spawning"); // DEBUG
				}
			} else {
				f = true;
				console.log("[" + s + "] failure <= no valid target"); // DEBUG
			}
			if (f) showReport(lang["event_failure"], "gray");
			hangEndAlienEvent();
			break;

		default : console.error("[" + s + "] failure <= no such event");

	}
}

function endAlienEvent() {
	if (conf.debug.time.alien_event) console.timeEnd("alienEvent"); // DEBUG
	if (!moni.alien.active) showAlien();
	else setAlienText();
	hideIcon("alien_event");
	// term.updateMiniMap(); // TEMP
	startAlienPlay();
}

// =============================================================================
// -----------------------------------------------------------------------------
// # Alien Play
// -----------------------------------------------------------------------------
// =============================================================================

////////////////////////////////////////////////////////////////////////////////
// @ Select
////////////////////////////////////////////////////////////////////////////////

function selectAlien(o) { // o = entity
	if (!o.hidden) {
		// * Center on sprite
		centerToPixel(o.x, o.y);
		// * Set focus
		setFocus(o);
	}
}

////////////////////////////////////////////////////////////////////////////////
// @ Action Buttons
////////////////////////////////////////////////////////////////////////////////

function deactivateAlienActionButton(s) { // s = action key (leave empty for all)
	let a = document.getElementById("action").children, i;
	for (i = 0; i < a.length; i++) {
		if (s === undefined || (s !== undefined && a[i].id == "action_" + s)) {
			a[i].classList.remove("active");
			a[i].classList.add("disabled");
		}
	}
}

function activateAlienActionButton(s) { // s = action key
	let q = document.getElementById("action_" + s);
	q.classList.remove("disabled");
	q.classList.add("active");
}

////////////////////////////////////////////////////////////////////////////////
// @ Actions
////////////////////////////////////////////////////////////////////////////////

// -----------------------------------------------------------------------------
// * Attack
// -----------------------------------------------------------------------------

function checkAlienAttack(o) { // o = entity
	let f = false;
	let u = o.target != null && hasLofEnt(o, pawn[o.target]) ? pawn[o.target] : pawn[o.getTarget(true)[0]]; // nearest hostile in sight
	if (u !== undefined) { // hostile exists
		if (o.conduct == "bomber") {
			explodeSelf(o, u);
			f = true;
		} else if (hasAction(o, "attack_melee") && isAdjacentEnt(o, u) && o.conduct != "sniper" && o.conduct != "gunner") {
			attackTarget(o, u, "melee");
			f = true;
		} else if (hasAction(o, "attack_range") && !hasMeleeWeapon(o) && hasLofEnt(o, u)) {
			attackTarget(o, u, "range");
			f = true;
		} else {
			o.turnTo(u);
		}
	}
	if (!f) checkAlienActor(); // check next alien
}

function attackTarget(o, u, t, b) { // o = attacking entity, u = targetted entity, t = attack type, b = explode self flag

	// * Abort blast attack
	if (!b && (hasBlastWeapon(o) && (isAdjacentEnt(o, u)
	 || hasAdjacentCellOfValue(game.grid, ti(u.x), ti(u.y), getFriendTypeList(o), true)))) { // blaster is adjacent to target or friend around target
		console.log("[" + o.id + "] blast weapon attack aborted (friendly fire)"); // DEBUG
		checkAlienActor();
		return;
	}

	// * Set variables
	let x = ti(b ? o.x : u.x);
	let y = ti(b ? o.y : u.y);
	let l = [[x, y]];

	// * Select character
	selectAlien(o);

	// * Set action range
	o.range = t == "range" ? "shoot" : "melee";

	// * Queue attack
	setFrameTimeout("alien_attack", conf.game.delay.alien_attack, function() {

		if (hasBlastWeapon(o)) {
			// * Set hilite
			ents.Rect.hilite.setSquare(l, [x, y]);
			// * Draw area of effect
			ents.Rect.range.draw(ents.Rect.hilite.list, "range_shoot", true);
		} else if (hasBeamWeapon(o)) {
			// * Turn to target
			o.turnTo(u);
			// * Get shoot range
			l = o.getShootRange(0, 0);
			// * Set hilite
			ents.Rect.hilite.setLine(l, [x, y]);
			// * Draw area of effect
			ents.Rect.range.draw(ents.Rect.hilite.list, "range_shoot", true);
		} else {
			// * Draw area of effect
			ents.Rect.range.draw(l, "range_" + (t == "range" ? "shoot" : "melee"), true);
		}

		// * Activate action button
		if (!b && !o.hidden) activateAlienActionButton("attack_" + t);

		// * Start attack
		console.log("[" + o.id + "] " + (b ? "explodes self next to [" + u.id + "]" : t == "range" ? ("shoots at [" + u.id + "]") : ("engages [" + u.id + "] in melee"))); // DEBUG
		startAttack(o, t, x, y);

		// * Set acting
		if (!b) mupt.acting = true;

	});

}

function explodeSelf(o, u) { // o = exploding entity, u = targetted entity
	// * Set game actor
	game.actor = o;
	// * Explode self at target
	attackTarget(o, u, "range", true, true);
}

// -----------------------------------------------------------------------------
// * Move
// -----------------------------------------------------------------------------

function getDestToTarget(o, u, d, s, b, t) { // o = origin entity, u = destination entity, d = diagonal flag, s = at sight flag, b = backward flag, t = teleport flag (no distance check) ; returns point [x,y]

	let l, r;

	// 1. Get destination list
	if (s) { // at sight
		l = u.getSightRange(null, null, [[ti(o.x), ti(o.y)]], hasBeamWeapon(o)); // get list from target sight
		l = l.filter(function(e) {return !getExcludeTypeList(o).includes(game.grid[e[0]][e[1]][0])}); // exclude type from list
		if (hasFourTiles(o)) l = l.filter(function(e) {return isPlinthEmpty(game.grid, e[0], e[1], o.plinth.width, o.plinth.height, d, null, getExcludeTypeList(o), !canStopOnDoorRail(o), o.id)}); // exclude non accessible tiles
	} else { // not at sight
		l = getEmptyTileAround(game.grid, ti(u.x), ti(u.y), o.plinth.width, o.plinth.height, d, null, getExcludeTypeList(o), !canStopOnDoorRail(o), o.id, [ti(o.x), ti(o.y)]);
	}

	// 2. Get destination point
	if (l.length > 0) {

		let a = [];

		// * Order point list by distance
		l.forEach(function(e) {
			d = getDist(ti(t ? u.x : o.x), ti(t ? u.y : o.y), e[0], e[1]);
			if (t || !b || d <= o.movement) a.push([d, e[0], e[1]]);
		});

		// * Sort destination point list
		(t && s) || b ? a.sort(arr_desc) : a.sort(arr_asc);

		// * Set destination
		r = [a[0][1], a[0][2]];

		// * Check at sight farest destination
		if (!t && s && !b) { // move at sight forward
			l = []; // reset var
			a.forEach(function(e) {
				if (e[0] <= o.movement) {
					d = o.findPath(e[1], e[2]).length; // origin path to tile
					if (d <= o.movement) l.push(e);
				}
			});
			if (l.length > 0) { // has point in movement range
				l.forEach(function(e) {
					e[0] = u.findPath(e[1], e[2]).length; // destination path to tile
				});
				l.sort(arr_desc);
				r = [l[0][1], l[0][2]]; // overwrite destination
			}
		}

	} return r;

}

function moveToTarget(o, u, d, s, b) { // o = origin entity, u = destination entity, d = diagonal flag, s = at sight flag, b = backward flag

	if (ents.Line.sight.hidden == false) ents.Line.sight.clear(); // TEMP DEBUG

	// ---------------------------------------------------------------------------
	// * Move to closest tile around surrounded target -- UNUSED
	// ---------------------------------------------------------------------------
	//if (!s && l.length == 0) {
	//	// a. Set destination
	//	x = ti(u.x);
	//	y = ti(u.y);
	//	// s. Set muppet acting
	//	mupt.acting = true;
	//	// c. Move entity to appropriate tile (nearest or farest)
	//	console.log("[" + o.id + "] move from (" + ti(o.x) + "," + ti(o.y) + ") " + "toward" + " [" + u.id + "] closest to (" + x + "," + y + ")"); // DEBUG
	//	o.moveTo(x, y, true);
	//}
	// ---------------------------------------------------------------------------

	// * Get destination point
	let p = getDestToTarget(o, u, d, s, b);

	if (Array.isArray(p)) { // point found

		// * Select character
		selectAlien(o);

		// * Activate action button
		if (!o.hidden) activateAlienActionButton("move");

		// * Set move to closest
		let c = hasFourTiles(o) && s && b; // large character moving at sight backward -- TEMP

		// * Move entity to appropriate tile (nearest or farest)
		console.log("[" + o.id + "] move from (" + ti(o.x) + "," + ti(o.y) + ") " + (s ? "at sight of" : (b ? "back of" : "toward")) + " [" + u.id + "] to (" + p[0] + "," + p[1] + ")"); // DEBUG
		o.moveTo(p[0], p[1], c);

		// * Set acting
		mupt.acting = true;

	} else { // no point found
		console.log("[" + o.id + "] cannot move ; no empty tile around [" + u.id + "]"); // DEBUG
		checkAlienAttack(o);
	}

}

function moveToward(o, u, d) { // o = origin entity, u = destination entity, d = diagonal flag
	moveToTarget(o, u, d, false);
}

function moveAtSight(o, u) { // o = origin entity, u = destination entity
	moveToTarget(o, u, true, true);
}

function moveBackward(o, u) { // o = origin entity, u = destination entity
	moveToTarget(o, u, true, true, true);
}

////////////////////////////////////////////////////////////////////////////////
// @ Acting Loop
////////////////////////////////////////////////////////////////////////////////

// -----------------------------------------------------------------------------
// * Acting
// -----------------------------------------------------------------------------

function enactAlienActor(o) { // o = entity

	let r, u, s, b, f = false;

	// * Set game actor
	game.actor = o;

	// * Detect hostiles
	o.updateSense(); // sense hostile
	o.updateSight(); // see hostile

	// * Get target
	r = o.getTarget(false, (o.conduct == "rusher" || o.conduct == "walker")); // nearest hostile in sight or sense for rusher or walker ; nearest hostile in sight then nearest hostile in sense for gunner and sniper
	u = pawn[r[0]];
	s = r[1];

	// * Set target
	if (s != null) o.target = u.id;
	else o.target = null;

	// * Take action
	if (s == "sight" || s == "sense") { // has target in sight or sense

		if (conf.debug.mupt.target) console.log("[" + o.id + "] targetted [" + u.id + "] (" + s + ")"); // DEBUG

		// * Set move to target lineally
		b = hasMeleeWeapon(o) || o.conduct == "rusher";

		// * Adjust walker move destination direction
		if (o.conduct == "walker" && getDistEnt(o, u) <= conf.mupt.walker_melee_dist) { // walker in melee dist
			if (hasEmptyTileAround(game.grid, ti(u.x), ti(u.y), o.plinth.width, o.plinth.height)) b = true; // move lineally if possible
		}

		// * Apply appropriate action to target
		if (hasAction(o, "attack_melee") && o.conduct != "sniper" && o.conduct != "gunner" && isAdjacentEnt(o, u)) {
			attackTarget(o, u, "melee");
		} else if (mupt.loop > 0 && hasAction(o, "move") && hasAction(o, "attack") && o.conduct == "sniper" && getDistEnt(o, u) <= conf.mupt.sniper_backward_dist) {
			moveBackward(o, u); // move to farest tile in target sight
		} else if (mupt.loop > 0 && hasAction(o, "attack_range") && hasLofEnt(o, u) &&
			(o.conduct == "sniper" || o.conduct == "gunner"
			|| (o.conduct == "walker" && getDistEnt(o, u) > conf.mupt.walker_melee_dist)
			|| (!hasMeleeWeapon(o) && !hasEmptyTileAround(game.grid, ti(u.x), ti(u.y), o.plinth.width, o.plinth.height)))) {
			attackTarget(o, u, "range");
		} else if (mupt.loop > 0 && hasAction(o, "move") && hasAction(o, "attack") && (o.conduct == "sniper" || o.conduct == "gunner")) {
			moveAtSight(o, u); // move to farest tile in target sight
		} else if (mupt.loop > 0 && hasAction(o, "move") && (o.conduct == "rusher" || o.conduct == "walker") && !isAdjacentEnt(o, u)) {
			moveToward(o, u, !b); // move to nearest tile in direction of target
		} else { // no action
			f = true; // skip acting
		}

	} else {
		f = true; // skip acting
	}

	if (f) checkAlienActor(); // skip acting

}

// -----------------------------------------------------------------------------
// * Loop
// -----------------------------------------------------------------------------

function checkAlienActor() {

	if (!mupt.active) return;

	if (ents.Line.sight.hidden == false) ents.Line.sight.clear(); // TEMP DEBUG

	let o;

	mupt.index++;

	if (mupt.index <= mupt.actor.length) { // continue loop

		o = pawn[mupt.actor[mupt.index - 1]];

		if (isAlive(o) && hasAction(o)) { // is still alive and has any action

			enactAlienActor(o);

		} else { // has been killed or has executed all its actions during turn

			checkAlienActor();

		}

	} else if (mupt.loop == conf.mupt.loop_max) { // break loop

		console.error(">---| ALIEN LOOP AT MAX! |---<");
		endAlienPlay();

	} else if (mupt.loop == 0 || mupt.acting) { // restart loop

		if (conf.debug.time.mupt_loop) { // DEBUG
			console.timeEnd("muppetLoop");
			console.time("muppetLoop");
		}

		mupt.acting = false; // reset acting
		mupt.index = 0; // reset index
		mupt.loop++; // increment loop

		console.info("%c>---| ALIEN LOOP #" + mupt.loop + " |---<", conf.console["alien"]); // DEBUG

		checkAlienActor();

	} else { // end loop

		endAlienPlay();

	}

}

////////////////////////////////////////////////////////////////////////////////
// @ Play
////////////////////////////////////////////////////////////////////////////////

// -----------------------------------------------------------------------------
// * Start
// -----------------------------------------------------------------------------

function startAlienPlay() {

	if (conf.debug.time.alien_play) console.time("alienPlay"); // DEBUG
	if (conf.debug.time.mupt_loop) console.time("muppetLoop"); // DEBUG

	// ---------------------------------------------------------------------------
	// * Skip Alien Play -- DEBUG
	// ---------------------------------------------------------------------------
	if (conf.debug.skip.alien_play) { // DEBUG
		endAlienPlay();
		return;
	}
	// ---------------------------------------------------------------------------

	console.info("%c>---| ALIEN PLAY |---<", conf.console["alien"]); // DEBUG

	mupt.active = true;

	hideReport(); // TEMP

	showIcon("alien_play");

	mupt.actor = []; // reset actors list
	mupt.index = 0; // reset index
	mupt.loop = 0; // reset loop

	let l = pawn, k, o, i;

	for (k in l) {
		if (isAlien(l[k])) {

			o = l[k];

			if (!isGone(o)) { // only not gone alien

				// * Order actors by conduct (lower to higher)
				switch (o.conduct) {
					case "sniper"      : i = 10; break;
					case "gunner"      : i = 20; break;
					case "walker"      : i = 30; break;
					case "rusher"      : i = 40; break;
					default            : i = 50; break;
				}

				// * Order actors by subtype (lower to higher)
				switch (o.subt) {
					// 1. Snipers
					case "limbo_hw"    : i += 1; break;
					case "gremkin"     : i += 2; break;
					// 2. Gunners
					case "juggernaut"  : i += 3; break;
					case "limbo_cc"    : i += 4; break;
					// 3. Walkers
					case "cyborg"      : i += 5; break;
					case "limbo_lw"    : i += 6; break;
					// 4. Rushers
					case "scrof"       : i += 7; break;
					case "fleshripper" : i += 8; break; // melee only
				}

				// * Prioritize muppets altered by alien event
				if (isGrenater(o) || isMechatek(o) || o.condition.frenzy || o.condition.elite) i = 0; // play first

				// * Add actor to actors list
				mupt.actor.push([i, o.id]);

			}
		}
	}

	mupt.actor.sort(arr_asc);

	mupt.actor = mupt.actor.map(function(e) {return e[1]});

	checkAlienActor(); // begin alien action loop

}

// -----------------------------------------------------------------------------
// * End
// -----------------------------------------------------------------------------

function endAlienPlay() {

	mupt.active = false;

	hideIcon("alien_play");

	if (conf.debug.time.mupt_loop) console.timeEnd("muppetLoop"); // DEBUG
	if (conf.debug.time.alien_play) console.timeEnd("alienPlay"); // DEBUG

	startAlienReinforcement();

}

// -----------------------------------------------------------------------------
// * Stop
// -----------------------------------------------------------------------------

function stopAlienPlay() {
	mupt.active = false;
	mupt.acting = false;
	mupt.actor = [];
	mupt.index = 0;
	mupt.loop = 0;
}

// =============================================================================
// -----------------------------------------------------------------------------
// # Alien Reinforcement
// -----------------------------------------------------------------------------
// =============================================================================

function recoverAlienReinforcementTokens(n) { // n = number of reinforcement tokens to recover ; returns integer
	let l = getAlienReinforcementTokens(true); // all unused tokens
	let i = j = 0;
	if (l.length > 0) {
		l = shuffle(l);
		for (j; j < n; j++) {
			game.team.alien.reinforcement.token[l[j]]++;
			i++;
		}
	} return i;
}

function getAlienReinforcementTokens(b) { // b = unused tokens flag ; returns subtype array
	let c = conf.game.alien.reinforcement.token;
	let l = game.team.alien.reinforcement.token;
	let k, i, r = [];
	for (k in l) for (i = 0; i < (b ? c[k] - l[k] : l[k]); i++) r.push(k)
	return r;
}

function getAlienReinforcement(n, e) { // n = number of reinforcements, e = exclude subtype array ; returns id list
	if (!Number.isInteger(n)) n = getAlienReinforcementTokens().length;
	let k, i, m, a = [], r = [], l = game.team.alien.reinforcement;
	for (k in l.token) {
		if (Array.isArray(e) && e.includes(k)) continue;
		if (l.token[k] > 0 && l.pawn[k].length > 0) { // has token and pawn
			for (i = 0; i < Math.min(l.token[k], l.pawn[k].length); i++) a.push(l.pawn[k][i]);
		}
	}
	if (a.length > 0) { // has reinforcement
		m = Math.min(a.length, n);
		r = shuffle(a);
		r.splice(m, r.length - m);
	} return r;
}

function useAlienReinforcement(o) { // o = entity ; returns boolean
	let l = game.team.alien.reinforcement;
	let n = l.pawn[o.subt].indexOf(o.id);
	if (n > -1) {
		l.pawn[o.subt].splice(n, 1);
		l.token[o.subt]--;
		return true;
	} return false;
}

function reviveAlien(o, x, y) { // o = entity, x, y = tile
	let q;
	let k = o.id;
	let s = o.subt;
	delete o; // destroy entity
	q = createAlien(k, px(x), px(y), s); // recreate entity
	q.setPosition(); // reset position at once (differed at next frame update otherwise)
	console.log("[" + k + "] revived at (" + x + "," + y + ")"); // DEBUG
}

function startAlienReinforcement() {

	// ---------------------------------------------------------------------------
	// * Skip Alien Reinforcement -- DEBUG
	// ---------------------------------------------------------------------------
	if (conf.debug.skip.alien_reinforcement) { // DEBUG
		endAlienReinforcement();
		return;
	}
	// ---------------------------------------------------------------------------

	console.info("%c>---| ALIEN REINFORCEMENT |---<", conf.console["alien"]); // DEBUG

	if (conf.debug.time.alien_reinforcement) console.time("alienReinforcement"); // DEBUG

	let a = getAlienReinforcement(), b = false;
	if (a.length > 0) { // alien reinforcement available
		let l, n, k, o, i = 0;
		let r = getMarineSight();
		for (k = 0; k < a.length; k++) {
			o = pawn[a[k]];
			l = getAlienSpawns(r, false, hasFourTiles(o)); // exclude marine sight, exclude occupied tiles
			if (l.length > 0) { // at least one spawn point suitable
				n = Math.floor(Math.random() * l.length); // random index in spawn points
				if (useAlienReinforcement(o)) { // has spent token and removed pawn from reinforcement pool
					reviveAlien(o, l[n][0], l[n][1]); // replace dead pawn
					b = true;
					i++;
				}
			} if (i == conf.game.alien.reinforcement.max_per_turn) break; // maximum number of reinforcements per turn reached
		}
		if (i > 0) console.info("%c" + i + " alien reinforcements placed up", conf.console["debug"]); // DEBUG
		else console.info("%cno spawn point suitable for alien reinforcement", conf.console["debug"]); // DEBUG
	} else { // no alien reinforcement available
		console.info("%cno alien token or pawn available", conf.console["debug"]); // DEBUG
	}

	if (conf.debug.time.alien_reinforcement) console.timeEnd("alienReinforcement"); // DEBUG

	if (b) {
		showReport(lang["reinforcing"], "red");
		showIcon("alien_reinforcement");
	}

	setFrameTimeout("alien_reinforcement", b ? conf.moni.alien.reinforcement.delay : 0, function() {
		endAlienReinforcement();
		hideReport(); // TEMP
	});

}

function endAlienReinforcement() {
	hideIcon("alien_reinforcement");
	endAlienTurn();
}

// =============================================================================
// -----------------------------------------------------------------------------
// # Alien Turn
// -----------------------------------------------------------------------------
// =============================================================================

/**

	& ALIEN TURN PHASES

		1. Game turn
		2. Alien event
		3. Alien play
		4. Alien reinforcement

*/

function startAlienTurn() {
	lockScroll(); // TEMP
	// ---------------------------------------------------------------------------
	// * Stop marine music theme
	// ---------------------------------------------------------------------------
	if (main.audio.music.enabled) fadeMusicOut();
	// ---------------------------------------------------------------------------
	if (conf.debug.skip.game_turn) { // DEBUG
		startAlienEvent();
	} else {
		showTurn(true);
	}
}

function endAlienTurn() {
	endTurn();
	unlockScroll(); // TEMP
}
