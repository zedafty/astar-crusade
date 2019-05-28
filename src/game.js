/*

	game.js

*/

// =============================================================================
// -----------------------------------------------------------------------------
// # Notes
// -----------------------------------------------------------------------------
// =============================================================================

/**

	& (GAME) STATES

	Teams and members have both (game) states (i.e. same attribute, different level).

	Only marine teams and marine members have states ; aliens are either dead or alive (pawn property).

	# State     Description
		null      alive and still in game
		dead      has been killed during game
		quit      has left game alive
		awol      never in game

*/

// =============================================================================
// -----------------------------------------------------------------------------
// # Module
// -----------------------------------------------------------------------------
// =============================================================================

var game = {

	//////////////////////////////////////////////////////////////////////////////
	// @ Map
	//////////////////////////////////////////////////////////////////////////////

	"map" : null, // current map key

	//////////////////////////////////////////////////////////////////////////////
	// @ Grid
	//////////////////////////////////////////////////////////////////////////////

	"grid" : [],

	//////////////////////////////////////////////////////////////////////////////
	// @ Actor
	//////////////////////////////////////////////////////////////////////////////

	"actor" : null, // acting entity reference
	"cover" : null, // covering entity reference (as actor's understudy)

	//////////////////////////////////////////////////////////////////////////////
	// @ Attack
	//////////////////////////////////////////////////////////////////////////////

	"point" : {"x" : 0, "y" : 0}, // targetted point
	"target" : [], // targets list [[x, y, v]] => [tile, tile, id]
	"chained" : false, // chain attack pending flag
	"defense" : false, // melee attack defense flag

	//////////////////////////////////////////////////////////////////////////////
	// @ Play
	//////////////////////////////////////////////////////////////////////////////

	"played" : [], // teams at start
	"player" : [], // ingame teams
	"turn" : 1, // current turn

	//////////////////////////////////////////////////////////////////////////////
	// @ Xeno Sensor
	//////////////////////////////////////////////////////////////////////////////

	"xeno_sensor" : {
		"active" : false,
		"count" : 0
	},

	//////////////////////////////////////////////////////////////////////////////
	// @ Teams
	//////////////////////////////////////////////////////////////////////////////

	"team" : {
		// -------------------------------------------------------------------------
		// * Red Team
		// -------------------------------------------------------------------------
		"red" : {
			"state" : null,
			"members" : {
				// * STABLE
				"red01" : { "subt" : "commander", "weapon" : "glove_sword"        , "name" : "Mason"    , "state" : null },
				"red02" : { "subt" : "trooper"  , "weapon" : "bloter"             , "name" : "Connor"   , "state" : null },
				"red03" : { "subt" : "trooper"  , "weapon" : "bloter"             , "name" : "Teller"   , "state" : null },
				"red04" : { "subt" : "trooper"  , "weapon" : "bloter"             , "name" : "Dogget"   , "state" : null },
				"red05" : { "subt" : "trooper"  , "weapon" : "rocket_launcher"    , "name" : "Brian "   , "state" : null },
				// * TEST
				// "red01" : { "subt" : "commander", "weapon" : "unarmed"            , "name" : "Mason"    , "state" : null },
				// "red02" : { "subt" : "trooper"  , "weapon" : "cyborg_rifle"       , "name" : "Connor"   , "state" : null },
				// "red03" : { "subt" : "trooper"  , "weapon" : "claw"               , "name" : "Teller"   , "state" : null },
				// "red04" : { "subt" : "trooper"  , "weapon" : "grenade"            , "name" : "Dogget"   , "state" : null },
				// "red05" : { "subt" : "trooper"  , "weapon" : "pistol_knife"       , "name" : "Brian "   , "state" : null }
			},
			"order" : {
				"fire" : true,
				"move_it" : true,
				"photon_grenades" : true,
				"close_assault" : true
			},
			"equipment" : {
				"flash_grenade" : true,
				"fission_bomb" : true,
				// "bionic_arm" : true,
				"bionic_arm" : false,
				"force_field" : true,
				"assault_blades" : true,
				"blot_pistol" : true,
				"targeter_1" : "bloter",
				"targeter_2" : "rocket_launcher"
				// "targeter_1" : "machine_gun",
				// "targeter_2" : "plasma_cannon"
			},
			"action" : {
				"order" : 1,
				"scan" : 1,
			},
			"active" : {
				"order" : [],
				"equipment" : [],
				"event" : []
			},
			"score" : {
				"gain" : [],
				"loss" : []
			}
		},
		// -------------------------------------------------------------------------
		// * Gold Team
		// -------------------------------------------------------------------------
		"gold" : {
			"state" : null,
			"members" : {
				// * STABLE
				"gold01": { "subt" : "commander", "weapon" : "heavy_bloter"       , "name" : "Kellog"   , "state" : null },
				"gold02": { "subt" : "trooper"  , "weapon" : "bloter"             , "name" : "Bergson"  , "state" : null },
				"gold03": { "subt" : "trooper"  , "weapon" : "machine_gun"        , "name" : "Cooker"   , "state" : null },
				"gold04": { "subt" : "trooper"  , "weapon" : "rocket_launcher"    , "name" : "Reyce"    , "state" : null },
				"gold05": { "subt" : "trooper"  , "weapon" : "plasma_cannon"      , "name" : "Clark"    , "state" : null }
				// * TEST
				// "gold01": { "subt" : "commander", "weapon" : "heavy_bloter"       , "name" : "Kellog"   , "state" : null },
				// "gold02": { "subt" : "trooper"  , "weapon" : "bloter"             , "name" : "Bergson"  , "state" : null },
				// "gold03": { "subt" : "trooper"  , "weapon" : "machine_gun"        , "name" : "Cooker"   , "state" : "awol" },
				// "gold04": { "subt" : "trooper"  , "weapon" : "rocket_launcher"    , "name" : "Reyce"    , "state" : "awol" },
				// "gold05": { "subt" : "trooper"  , "weapon" : "plasma_cannon"      , "name" : "Clark"    , "state" : "awol" }
			},
			"order" : {
				"fire" : true,
				"move_it" : true,
				"by_sections" : true,
				"heavy_weapon" : true
			},
			"equipment" : {
				"flash_grenade" : true,
				"fission_bomb" : true,
				"bionic_eye" : true,
				"dual_weapon" : true,
				"suspensors" : true,
				"blot_pistol" : true,
				"targeter_1" : "rocket_launcher",
				"targeter_2" : "plasma_cannon"
			},
			"action" : {
				"order" : true,
				"scan" : true,
			},
			"active" : {
				"order" : [],
				"equipment" : [],
				"event" : []
			},
			"score" : {
				"gain" : [],
				"loss" : []
			}
		},
		// -------------------------------------------------------------------------
		// * Blue Team
		// -------------------------------------------------------------------------
		"blue" : {
			"state" : null,
			"members" : {
				// * STABLE
				"blue01" : { "subt" : "commander", "weapon" : "pistol_axe"         , "name" : "Lockhart" , "state" : null },
				"blue02" : { "subt" : "trooper"  , "weapon" : "bloter"             , "name" : "Pfeifer"  , "state" : null },
				"blue03" : { "subt" : "trooper"  , "weapon" : "bloter"             , "name" : "Bolton"   , "state" : null },
				"blue04" : { "subt" : "trooper"  , "weapon" : "rocket_launcher"    , "name" : "Quaker"   , "state" : null },
				"blue05" : { "subt" : "trooper"  , "weapon" : "plasma_cannon"      , "name" : "Hartman"  , "state" : null }
				// * TEST
				// "blue01" : { "subt" : "commander", "weapon" : "pistol_axe"         , "name" : "Lockhart" , "state" : null },
				// "blue02" : { "subt" : "trooper"  , "weapon" : "bloter"             , "name" : "Pfeifer"  , "state" : null },
				// "blue03" : { "subt" : "trooper"  , "weapon" : "bloter"             , "name" : "Bolton"   , "state" : "awol" },
				// "blue04" : { "subt" : "trooper"  , "weapon" : "rocket_launcher"    , "name" : "Quaker"   , "state" : "awol" },
				// "blue05" : { "subt" : "trooper"  , "weapon" : "plasma_cannon"      , "name" : "Hartman"  , "state" : "awol" }
			},
			"order" : {
				"fire" : true,
				"move_it" : true,
				"by_sections" : true,
				"close_assault" : true
			},
			"equipment" : {
				"flash_grenade" : true,
				"fission_bomb" : true,
				"bionic_hand" : true,
				"xeno_sensor" : true,
				"med_pack" : true,
				"blot_pistol" : true,
				"targeter_1" : "rocket_launcher",
				"targeter_2" : "plasma_cannon"
			},
			"action" : {
				"order" : true,
				"scan" : true,
			},
			"active" : {
				"order" : [],
				"equipment" : [],
				"event" : []
			},
			"score" : {
				"gain" : [],
				"loss" : []
			}
		},
		// -------------------------------------------------------------------------
		// * Alien Team
		// -------------------------------------------------------------------------
		"alien" : {
			"event" : {
				"choice" : [],
				"random" : [
					"mothership_trans",
					"mothership_scan",
					"airlock_control",
					"auto_defence",
					"exploding_trap",
					"new_order",
					"battle_plan",
					"intercom_malfunc",
					"equipment_malfunc",
					"report_in",
					"weapons_jammed",
					"out_of_ammo",
					"lure_of_limbo",
					"psychic_attack",
					"robotic_fault",
					"robotic_assault",
					"frenzy",
					"alien_elite",
					"self_destruction",
					"gremkin_grenater",
					"scrof_mechatek",
					"re_deploy",
					"alien_teleporter",
					"alien_task_force",
					"fleshripper",
					// EXTRAS
					"auto_defence",
					"auto_defence",
					"fleshripper",
					"fleshripper",
					"fleshripper"
				]
			},
			"active" : {
				"event" : []
			},
			"score" : {
				"gain" : []
			},
			"reinforcement" : {
				"token" : {
					"gremkin"     : 0, // green
					"scrof"       : 0, // green
					"limbo_lw"    : 0, // blue
					"limbo_hw"    : 0, // blue
					"limbo_cc"    : 0, // blue
					"fleshripper" : 0, // none
					"cyborg"      : 0, // gray
					"juggernaut"  : 0  // juggernaut
				},
				"pawn" : {
					"gremkin"     : [],
					"scrof"       : [],
					"limbo_lw"    : [],
					"limbo_hw"    : [],
					"limbo_cc"    : [],
					"fleshripper" : [],
					"cyborg"      : [],
					"juggernaut"  : []
				}
			}
		}
	}

};

// =============================================================================
// -----------------------------------------------------------------------------
// # Campaign
// -----------------------------------------------------------------------------
// =============================================================================

function getCampaignMapTotal() {
	return conf.game.campaign.length;
}

function getCampaignMapIndex(s) { // s = map id
	return conf.game.campaign.indexOf(s) + 1;
}

// =============================================================================
// -----------------------------------------------------------------------------
// # Members
// -----------------------------------------------------------------------------
// =============================================================================

function hasMemberWithState(s, p, i) { // s = state, p = player (optional), i = member index (leave empty for all) ; returns boolean
	if (p == null) p = game.player[0];
	i = i || 0;
	let k, l = game.team[p].members;
	for (k in l) {
		if (i > 0 && i != getIndexFromId(k)) continue;
		if (l[k].state == s) return true;
	}
	return false;
}

function hasMemberWithSubtype(s, p, r) { // s = subtype, p = player (optional), r = return entity flag ; returns boolean or object/undefined
	if (p == null) p = game.player[0];
	let o, k, l = game.team[p].members;
	for (k in l) {
		o = pawn[k];
		if (typeof(o) === "undefined") continue;
		if (o.subt == s && !isGone(o)) return r ? o : true;
	} return r ? undefined : false;
}

function hasCommander(p, r) { // p = player (optional), r = return entity flag ; returns boolean or object/undefined
	return hasMemberWithSubtype("commander", p, r);
}

function getCommander(p) { // p = player (optional) ; returns object/undefined
	return hasCommander(p, true);
}

function hasTrooper(p, r) { // p = player (optional), r = return entity flag ; returns boolean
	return hasMemberWithSubtype("trooper", p, r);
}

function getTrooper(p) { // p = player (optional) ; returns object/undefined
	return hasTrooper(p, true);
}

function resetMemberConditions(o) { // o = entity
	o.condition.invisible = false;
}

function resetMemberActions(o, v) { // o = entity, v = actions value (integer)
	if (v === undefined) v = 1;
	o.action.move = o.action.attack_range = o.action.attack_melee = v;
}

// =============================================================================
// -----------------------------------------------------------------------------
// # Marine Teams
// -----------------------------------------------------------------------------
// =============================================================================

/**

	(equipment) useable / (order) giveable = available (i.e. ready to be spent) -- NOTE : all orders are giveable BUT not all equipment are useable (i.e. can be chosen by user at play time)
	spent = (equipment) used / (order) given
	unavailable = never available (i.e. not choosen by user during team configuration ; out of game)
	pickable = spent or unavailable

*/

function isOrderGiveable(s) { // s = order key string ; returns boolean
	switch(s) {
		case "fire"            :
		case "move_it"         :
		case "by_sections"     :
		case "close_assault"   :
		case "photon_grenades" :
		case "heavy_weapon"    : return true;
		default                : return false;
	}
}

function isEquipmentUseable(s) { // s = equipment key string ; returns boolean
	switch(s) {
		case "flash_grenade" :
		case "fission_bomb"  :
		case "xeno_sensor"   : return true;
		case "med_pack"      : return true;
		default              : return false;
	}
}

// -----------------------------------------------------------------------------

function getOrderPickable(p) { // p = marine player ; returns array
	let k, l = game.team[p].order, a = [];
	for (k in l) if (isOrderGiveable(k) && !l[k]) a.push(k);
	return a;
}

function getEquipmentUseable(p) { // p = marine player ; returns array
	let k, l = game.team[p].equipment, a = [];
	for (k in l) if (isEquipmentUseable(k) && l[k]) a.push(k);
	return a;
}

// -----------------------------------------------------------------------------

function hasOrderGiveable(p, s) { // p = player, s = order key string (optional) ; returns boolean
	if (!isPlayerMarine(p)) return false;
	let k, l = game.team[p].order;
	for (k in l) if (isOrderGiveable(k) && l[k] && (s === undefined || k == s)) return true;
	return false;
}

function hasEquipmentUseable(p, s) { // p = player, s = equipment key string (optional) ; returns boolean
	if (!isPlayerMarine(p)) return false;
	let k, l = game.team[p].equipment;
	for (k in l) if (isEquipmentUseable(k) && l[k] && (s === undefined || k == s)) return true;
	return false;
}

// -----------------------------------------------------------------------------

function hasOrderActive(s, p) { // s = order key string, p = player (optional) ; returns boolean
	if (p == null) p = game.player[0];
	if (!isPlayerMarine(p)) return false;
	return game.team[p].active.order.includes(s);
}

function hasEquipmentActive(s, p) { // s = equipment key string, p = player (optional) ; returns boolean
	if (p == null) p = game.player[0];
	if (!isPlayerMarine(p)) return false;
	return game.team[p].active.equipment.includes(s);
}

// -----------------------------------------------------------------------------

function hasEventActive(s, p) { // s = event key string, p = player (optional) ; returns boolean
	if (p == null) p = game.player[0];
	if (!isPlayerMarine(p)) return false;
	return game.team[p].active.event.includes(s);
}

function clearActiveEvent(s, p) { // s = event key string, p = player (optional)
	if (p == null) p = game.player[0];
	if (!isPlayerMarine(p)) return false;
	let a = game.team[p].active.event;
	if (a.includes(s)) a.splice(a.indexOf(s), 1);
}

// =============================================================================
// -----------------------------------------------------------------------------
// # Marine Teams Actions
// -----------------------------------------------------------------------------
// =============================================================================

function updateMarineSight() {
	let k;
	for (k in pawn) {
		o = pawn[k];
		if (isMarine(o) && !isGone(o)) {
			// console.log("[" + o.id + "] sight updated"); // DEBUG
			o.updateSight();
		}
	}
}

function stopScan() {
	// * Clear rectangles
	ents.Rect.scan.clear();
	// * Allow save
	main.save.prevented = false;
	// * Reset controls
	resetSelectButtons();
	if (game.actor != null) checkActionButtons(game.actor);
}

function startScan(x, y, r) { // orig_x = pixel, orig_y = pixel, r = range
	// let lim = r || conf.game.scan_radius.mothership; // scan length in tiles * DEPRECATED
	let lim = r; // scan length in tiles
	let max = conf.Rect.radian_segment * 8; // number of rays
	let adj = halfti(); // tile center adjustment
	let o_x = x + adj;
	let o_y = y + adj;
	let k, n, a = [];
	for (k = 0; k < lim; k++) {
		a[k] = [];
		for (n = 1; n < max; n++) {
			x = ti(o_x) + Math.round((k + 1) * Math.cos(n / conf.Rect.radian_segment));
			y = ti(o_y) + Math.round((k + 1) * Math.sin(n / conf.Rect.radian_segment));
			if (!isTileOnBoard(x, y)) continue;
			if (k > 0 && hasPoint(a[k - 1], x, y)) continue;
			if (!hasPoint(a[k], x, y)) a[k].push([x, y, false]);
		}
	}
	// * Disable controls
	disableSelectButtons(game.actor != null ? getIndexFromId(game.actor) : undefined);
	disableActionButtons();
	// * Prevent save
	main.save.prevented = true;
	// * Prepare rectangles
	ents.Rect.scan.clear();
	ents.Rect.scan.list = a;
	ents.Rect.scan.radius = lim;
	// * Move rectangles to destination
	ents.Rect.scan.x = o_x;
	ents.Rect.scan.y = o_y;
	// * Show rectangles
	ents.Rect.scan.hidden = false;
}

function stopXenoSensor(b) { // b = failed flag
	// * Show Report
	showReport(lang[b ? "xeno_sensor_failed" : "xeno_sensor_stopped"], b ? "gray": "red", true);
	// * Clear targets
	ents.Rect.range.clear();
	// * Reset Xeno Sensor counter
	game.xeno_sensor.count = 0;
	// * Set Xeno Sensor unactive
	game.xeno_sensor.active = false;
	// * Check action buttons
	checkActionButtons(game.actor);
	// * Allow save
	main.save.prevented = false;
}

function startXenoSensor() {
	let o, k, l = [], b = false;
	for (k in pawn) {
		o = pawn[k];
		if (o.hidden == false && o.unseen == true) { // any bleep
			l.push([ti(o.x), ti(o.y)]);
			b = true;
		}
	}
	if (b) {
		// * Prevent save
		main.save.prevented = true;
		// * Set Xeno Sensor active
		game.xeno_sensor.active = true;
		// * Disable action buttons
		disableActionButtons("use_equipment");
		// * Draw targets
		ents.Rect.range.draw(l, "range_bleep", true);
		// * Report identify bleep
		showReport(lang["identify_bleep"], "green mult");
	} else {
		stopXenoSensor(true);
		console.log("[xeno_sensor] no bleep to identify"); // DEBUG
	}
}

function giveOrder(s) { // s = order key string
	let l = game.team[game.player[0]], k, o;
	// 1. Apply order effect(s)
	switch(s) {
		case "fire"            : // all troopers can fire twice
		case "move_it"         : // all troopers can move twice
		case "by_sections"     : // all troopers can either attack twice or move twice (check done when action is initiated) ; use 'active' heap (cleared at turn end)
		case "close_assault"   : // all troopers equipped with bloter can fire and attack in melee or attack in melee twice
			for (k in l.members) {
				o = pawn[k];
				if (o !== undefined && o.subt == "trooper" && !isGone(o)) { // existing not gone trooper
					if (s == "close_assault") {
						if (getBaseWeapon(o) == "bloter") o.action.attack_melee++;
					} else {
						if (s != "fire") o.action.move++;
						if (s != "move_it") {
							o.action.attack_range++;
							if (s == "by_sections") o.action.attack_melee++;
						}
					}
				}
			} break;
		case "photon_grenades" : // any trooper attacking in melee reduces its opponent defense roll by 1 ; use 'active' heap (cleared at turn end)
		case "heavy_weapon"    : // first trooper equipped with heavy_weapon who plays can fire and move twice ; use 'active' heap (cleared when activated)
	}
	// 2. Set order active
	l.active.order.push(s);
	// 3. Set order given
	if (l.order.hasOwnProperty(s)) l.order[s] = false;
	// 4. Set team order action done
	l.action.order -= 1;
	// 5. Toggle action button
	if (l.action.order > 0) resetActionButton("give_order");
	else disableActionButton("give_order");
}

function useEquipment(s) { // s = equipment key string
	let l = game.team[game.player[0]], o;
	// 1. Apply equipment effect(s)
	switch(s) {
		case "flash_grenade" : // aliens can't attack marine team ; use 'active' heap (cleared at next turn begin)
			for (k in l.members) {
				o = pawn[k];
				if (o !== undefined && !isGone(o)) { // existing not gone member
					o.condition.invisible = true;
				}
			}
			l.active.equipment.push(s);
			break;
		case "fission_bomb"  : // selected team member gains two heavy dice on its next roll ; alter 'attack' property (cleared when used)
			game.actor.attack.fission_bomb = true;
			break;
		case "xeno_sensor"   : // identify up to 3 bleeps ; use 'active' heap (cleared on use, refreshed each turn)
			startXenoSensor();
			l.active.equipment.push(s);
			break;
		case "med_pack"      : // restore commander's life (cleared on use or when commander dies)
			o = getCommander();
			o.life = 6;
			if (game.actor == o) updateStatus(o);
			break;
	}
	// 2. Set equipment used
	if (l.equipment.hasOwnProperty(s)) l.equipment[s] = false;
	if (s != "xeno_sensor") {
		// 3. Handle action button
		if (hasEquipmentUseable(game.player[0])) deactivateActionButton("use_equipment");
		else disableActionButton("use_equipment");
	}
}

// =============================================================================
// -----------------------------------------------------------------------------
// # Teams Sights -- TEMP
// -----------------------------------------------------------------------------
// =============================================================================

function getMasterSight(d) { // d = draw flag ; returns point list
	// console.time("getMasterSight"); // DEBUG
	let x, y, a = game.grid, l = [];
	for (x = 0; x < a.length; x++) {
		for (y = 0; y < a[x].length; y++) {
			if (isCellEmpty(a[x][y], false, null, getDockTypeList())) l.push([x,y]);
		}
	}
	if (d) ents.Rect.range.draw(l, "debug", true); // DEBUG
	// console.timeEnd("getMasterSight"); // DEBUG
	return l;
}

function getMarineSight(d) { // d = draw flag ; returns point list
	// console.time("getMarineSight"); // DEBUG
	let k, o, r, l = [];
	for (k in pawn) {
		o = pawn[k];
		if (isMarine(o) && !isGone(o)) {
			r = o.getSightRange();
			r.forEach(function(e) {if (!hasPoint(l, e[0], e[1])) l.push(e)});
		}
	}
	if (d) ents.Rect.range.draw(l, "debug", true); // DEBUG
	// console.timeEnd("getMarineSight"); // DEBUG
	return l;
}

function getAlienSight(d) { // d = draw flag ; returns point list
	// console.time("getAlienSight"); // DEBUG
	let l = getMasterSight();
	let r = getMarineSight();
	l = l.filter(function(e) {return !hasPoint(r, e[0], e[1])});
	// l.sort(function(a, b) {return a[1] - b[1]}); // y (optional)
	// l.sort(function(a, b) {return a[0] - b[0]}); // x (optional)
	if (d) ents.Rect.range.draw(l, "debug", true); // DEBUG
	// console.timeEnd("getAlienSight"); // DEBUG
	return l;
}

function getAlienSpawns(p, h, f, d) { // p = exclude point list, h = include occupied tiles flag, f = four-tiles only flag, d = draw flag ; returns point list
	// console.time("getAlienSpawn"); // DEBUG
	let x, y, c, a = game.grid, l = [];
	for (x = 0; x < a.length; x++) {
		for (y = 0; y < a[x].length; y++) {
			if (f && !isPlinthEmpty(a, x, y, 2, 2, false, null, null, true)) continue; // 2x2 plinth, can't stop at door rail
			c = a[x][y];
			if (isSpawn(c[0]) || (h && isPawn(c[0]) && isSpawn(pawn[c[1]].last_tile[2][0]))) l.push([x,y]);
		}
	}
	if (Array.isArray(p)) l = l.filter(function(e) {return !hasPoint(p, e[0], e[1])});
	if (d) ents.Rect.range.draw(l, "debug", true); // DEBUG
	// console.timeEnd("getAlienSpawn"); // DEBUG
	return l;
}

// =============================================================================
// -----------------------------------------------------------------------------
// # Players
// -----------------------------------------------------------------------------
// =============================================================================

function isPlayerMarine(p) { // p = player (optional) ; returns boolean
	if (p === undefined) p = game.player[0];
	return p == "red" || p == "gold" || p == "blue";
}

function isPlayerAlien(p) { // p = player (optional) ; returns boolean
	if (p === undefined) p = game.player[0];
	return p == "alien";
}

function isPlayerInGame(p) { // p = player ; returns boolean
	return game.team[p].state == null;
}

function getPlayer(n) { // n = player index ; returns player
	n = n || 0;
	return game.player[n];
}

function setPlayerTheme(p) { // p = player
	let q = document.getElementById("main");
	q.classList.remove("red", "gold", "blue");
	if (isPlayerMarine(p)) q.classList.add(p);
}

function initAlien() {
	// 1. Set reinforcements (i.e. Mission Setting)
	let a = maps[game.map].alien.reinforcement;
	let c = conf.game.alien.reinforcement.token;
	let l = game.team.alien.reinforcement.token;
	let b, k, i, j, m, n;
	if (a.includes("green")) {
		l.gremkin = c.gremkin;
		l.scrof = c.scrof;
	}
	if (a.includes("blue")) {
		l.limbo_lw = c.limbo_lw;
		l.limbo_hw = c.limbo_hw;
		l.limbo_cc = c.limbo_cc;
	}
	if (a.includes("gray")) l.cyborg = c.cyborg;
	if (a.includes("juggernaut")) l.juggernaut = c.juggernaut;
	// 2. Adjust reinforcements (i.e. Award Bonus)
	m = maps[game.map].alien.awards;
	if (m > 0) {
		n = recoverAlienReinforcementTokens(m);
		console.info("%calien player gains " + n + " reinforcement token" + (n > 1 ? "s" : "") + " as award bonus (" + m + " available)", conf.console["debug"]); // DEBUG
	}
	// 3. Set chosen event cards (i.e. Rank Bonus)
	m = Math.min(3, maps[game.map].alien.rank);
	if (m > 0) {
		l = conf.game.alien.preferred_event; // source array
		let pi = game.team.alien.event.choice; // push-in array
		let po = game.team.alien.event.random; // pull-of array
		let val, a = [], b = []; // resting percentage value, probability array, spring array
		// a. Split source array
		for (k in l) {
			a.push(l[k][0]);
			b.push(l[k][1]);
		}
		// b. Loop over maximum of cards
		for (i = 0; i < m; i++) {
			k = 0; // incremental probability
			// * Generate random number between 1 and 100
			n =  Math.floor(Math.random() * 100 + 1);
			// * Iterate through spring array
			for (j = 0; j < b.length; j++) {
				k += a[j]; // increment probability
				if (n <= k) { // compare generated number to probability
					// ^ Add matching event to choice event stack
					pi.push(b[j]);
					// ^ Remove matching event from random event stack
					po.splice(po.indexOf(b[j]), 1);
					// ^ Compute resting percentage value
					val = Math.floor(a[j] / Math.max(1, (b.length - 1)));
					// ^ Delete element from probability array
					a.splice(j, 1);
					// ^ Delete element from spring array
					b.splice(j, 1);
					// ^ Distribute resting percentage value into probability array
					a.forEach(function(ele, idx, arr) {arr[idx] += val});
					break;
				}
			}
		}
		console.info("%calien player chose " + (game.team.alien.event.choice.join(", ")) + " event cards as rank bonus (" + m + " available)", conf.console["debug"]); // DEBUG
	}
}

function initPlayers() {
	let a = ["red", "gold", "blue"], b = [], i;
	for (i = 0; i < a.length; i++) {
		if (!hasMemberWithState(null, a[i])) { // not has any member alive and on board
			game.team[a[i]].state = "awol"; // set out of game
		} else {
			game.team[a[i]].state == null; // set in game
			b.push(a[i]); // add to active players
		}
	}
	b.push("alien");
	game.played = game.player = b;
	initAlien();
}

function switchPlayer(p, f) { // p = player, f = callback function
	// 1. Set player theme
	setPlayerTheme(p);
	// 2. Reset cursor
	resetCursor();
	// 3. Clear actor
	game.actor = null;
	// 4. Check marine team
	if (isPlayerMarine(p)) { // is marine team
		console.info("%c>---| " + p.toUpperCase() + " PLAYER BEGIN |---<", conf.console[p]); // DEBUG
		// a. Iterate through team members
		let o, b, k, n = 1, l = game.team[p].members
		for (k in l) {
			o = pawn[k];
			if (o !== undefined && !isGone(o)) { // only not gone marine
				// * Reset member actions
				if (hasEventActive("report_in", p) && o.subt == "commander") {
					resetMemberActions(o, NaN);
					n = 0; // no order giveable
				} else {
					resetMemberActions(o);
					if (hasEventActive("weapons_jammed", p) && hasHeavyWeapon(o)) {
						clearActiveEvent("weapons_jammed", p); // remove active event
						o.action.attack_range = NaN;
					}
				}
				// * Reset member conditions
				resetMemberConditions(o);
				// * Center on first member
				if (!b) {
					centerToPixel(o.x, o.y, undefined, undefined, undefined, f); // WARNING : callback function at scroll end
					b = true;
				}
			}
		}
		// b. Refresh re-useable equipments
		if (hasEquipmentActive("xeno_sensor", p)) game.team[p].equipment.xeno_sensor = true;
		// c. Clear active equipments
		game.team[p].active.equipment = [];
		// d. Clear active events
		if (hasEventActive("intercom_malfunc", p)) {
			clearActiveEvent("intercom_malfunc", p); // remove active event
			n = 0; // no order giveable
		}
		// e. Reset marine team actions
		game.team[p].action.order = hasOrderGiveable(p) ? n : 0;
		game.team[p].action.scan = 1;
		// f. Reset controls
		disableSelectButtons();
		disableSelectLights();
		checkSelectControls();
		checkActionButtons();
		// g. Reset status
		resetStatus();
		// h. Allow save
		main.save.forbidden = false;
	}
	// 5. Check alien team
	else { // is alien team
		// a. Iterate through pawns
		let o, k;
		for (k in pawn) {
			o = pawn[k];
			if (isAlien(o) && !isGone(o)) { // only not gone alien
				// * Reset member actions
				resetMemberActions(o);
			}
		}
		// b. Hide status
		hideStatus();
		// c. Reset controls
		// resetSelectButtons();
		disableSelectButtons(null, true); // NEW
		disableSelectLights();
		// d. Start alien turn
		startAlienTurn();
	}
}

// =============================================================================
// -----------------------------------------------------------------------------
// # Turn
// -----------------------------------------------------------------------------
// =============================================================================

function getTurn() { // returns integer
	return game.turn;
}

function getTurnMax() { // returns integer
	let n = maps[game.map].turn;
	return n > 0 ? n : conf.game.turn;
}

function getTurnRemaining() { // returns integer
	return getTurnMax() - game.turn;
}

function startTurn(b) { // b = first begin
	let i, q, f;
	// 1. Hide report
	hideReport();
	// 2. Set game turn
	if (isPlayerAlien()) q = true; // was alien player
	// 3. Set current player at last position
	if (!b) game.player.push(game.player.shift());
	// 4. Check if any marine team is out of game
	for (i = 0; i < game.player.length; i++) {
		if (isPlayerMarine(game.player[i])) {
			if (!hasMemberWithState(null, game.player[i])) { // no more marine member in game
				console.info("%c>---| " + game.player[i].toUpperCase() + " OUT OF GAME |---<", conf.console[game.player[i]]); // DEBUG
				game.team[game.player[i]].state = hasMemberWithState("quit", game.player[i]) ? "quit" : "dead"; // at least one marine has quit
				game.player.splice(i, 1); // remove marine team from active players
			}
		}
	}
	// 5. End game
	if (game.player.length <= 1) { // no more marine team in game
		endGame("marine_out");
	}
	// 6. Continue game
	else {
		if (b || q) console.info("%c>---| GAME TURN #" + game.turn + " |---<", conf.console["game"]); // DEBUG
		if (q) { // new game turn
			// a. Increment game turn
			game.turn++;
			// q. Queue save game callback
			f = function() {saveGame("autosave")};
		}
		// * Switch player
		switchPlayer(game.player[0], f);
	}
}

function endTurn() {
	let l, k, o, b, p;
	// * Disable tool buttons
	if (tool.active) disableToolButtons(); // TEMP DEBUG
	// * Forbid save
	main.save.forbidden = true;
	// * Unset focus
	unsetFocus(true); // also update minimap
	// * Handle marine turn end
	if (isPlayerMarine()) {
		l = game.team[game.player[0]];
		// 1. Disable controls
		disableSelectButtons();
		disableActionButtons();
		// 2. Clear active orders
		l.active.order = [];
		// 3. Clear active events
		if (hasEventActive("report_in")) clearActiveEvent("report_in"); // remove active event
		// 4. Iterate through current team members in search of marine at docking claws
		for (k in l.members) {
			o = pawn[k];
			if (typeof(o) === "undefined") continue;
			if (!isGone(o)) { // is alive and on board
				b = o.checkDockingClaws();
			}
		}
		// -------------------------------------------------------------------------
		// * Skip Marine Quit -- DEBUG
		// -------------------------------------------------------------------------
		if (conf.debug.skip.marine_quit) { // DEBUG
			startTurn();
		} else {
			// 5. Prompt and show docking claws if any marine is going out
			if (b) {
				lockScroll();
				updateStatus(null);
				p = maps[game.map].spawn[game.player[0]].pts[0];
				centerToPixel(px(p[0]), px(p[1]));
			}
			// * Process next turn
			setFrameTimeout("marine_quit", b ? conf.game.delay.marine_quit : 0, function() {
				if (b) unlockScroll();
				startTurn();
			});
		}
		// -------------------------------------------------------------------------
	}
	// * Handle alien turn end
	else { // is player alien

		// ---------------------------------------------------------------------------
		// * Play marine music theme
		// ---------------------------------------------------------------------------
		if (main.audio.music.enabled) crossfadeMusics();
		// ---------------------------------------------------------------------------

		// 1. Iterate through pawns in search of alien affected by condition
		for (k in pawn) {
			o = pawn[k];
			if (isAlien(o) && !isGone(o)) { // is alive alien
				if (o.condition.frenzy || o.condition.elite) {
					o.condition.frenzy = false; // remove frenzy condition
					o.condition.elite = false; // remove elite condition
					setColorScheme(o); // reset color scheme
				}
			}
		}
		// 2. Hide alien
		hideAlien();
		// 3. Handle game turn end
		if (game.turn >= getTurnMax()) { // no more remaining turn
			endGame("turn_over");
		} else {
			startTurn(); // process next turn
		}
	}
}

// =============================================================================
// -----------------------------------------------------------------------------
// # Score
// -----------------------------------------------------------------------------
// =============================================================================

function scoreKill(o) { // o = target
	if (isMarine(o)) {
		let k = o.subt + (o.subt == "trooper" ? hasHeavyWeapon(o) ? "_hw" : "_lw" : "");
		game.team[getTypeKey(o)].score.loss.push(k);
		if (isPlayerAlien()) game.team.alien.score.gain.push(k);
	} else if (isAlien(o)) {
		if (isPlayerMarine()) game.team[getPlayer()].score.gain.push(o.subt);
	}
}

function getScore(p) { // p = player (optional) ; returns integer
	if (p == null) p = game.player[0];
	let a = game.team[p].score.gain;
	let b = game.team[p].score.loss;
	let c = conf.game.score;
	let k, n = 0;
	for (k in a) n += c[a[k]];
	for (k in b) n -= c[b[k]];
	return n
}

function getScoreAll() {
	let k, n, l = game.played;
	for (k in l) {
		n = getScore(l[k]);
		console.log("[" + l[k] + "] " + lang[l[k]] + " team scores " + n + " point" + (n > 1 ? "s" : "")); // DEBUG
	}
}

// =============================================================================
// -----------------------------------------------------------------------------
// # Game
// -----------------------------------------------------------------------------
// =============================================================================

function startGame() {
	initPlayers();
	startTurn(true);
}

function endGame(s) { // s = game over type ("marine_out" or "turn_over")
	// ---------------------------------------------------------------------------
	console.info("%c>---| GAME OVER : " + lang[s].toUpperCase() + " |---<", conf.console["game"]); // DEBUG
	scen.fade("out"); // TEMP
	// ---------------------------------------------------------------------------
}
