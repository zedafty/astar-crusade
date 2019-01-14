/*

	lang.js

*/

// =============================================================================
// -----------------------------------------------------------------------------
// # Language
// -----------------------------------------------------------------------------
// =============================================================================

const lang = {

	// * Screen
	"enlarged"              : "Enlarged",
	"reduced"               : "Reduced",
	"docked"                : "Docked",
	"undocked"              : "Undocked",

	// * Loading
	"loading"               : ".: Loading :.",

	// * Game
	"game_save_forbidden"   : "Can't save right now...",
	"game_saved"            : "Game saved",
	"game_loaded"           : "Game loaded",

	// * State
	"marine_quit"           : "Marine outgoing to mothership",

	// * Target
	"range_sight"           : "",
	"range_sense"           : "",
	"range_move"            : "",
	"range_shoot"           : "Choose a target",
	"range_melee"           : "Choose a target",
	"range_door"            : "Choose a door",

	// * Turn
	"remaining_turn"         : "Remaining turns = ",
	"click_on_fire"          : "Click on fire<br>to continue", // also used by transmission

	// * Report
	"xeno_sensor_failed"    : "No xeno sensed",
	"xeno_sensor_stopped"   : "Xeno-sensor stopped",
	"choose_weapon"         : "Choose weapon",
	"attack_score"          : "Attack score",
	"defense_score"         : "Defense score",
	"reroll"                : "Reroll?",

	// * Roll
	"wait_roll"             : "Wait",
	"skip_reroll"           : "No reroll",
	"end_chain"             : "Stop attack",
	"no_attack"             : "Harmless!",
	"no_defense"            : "Defenseless!",
	"draw_roll"             : "Draw...",

	// * Identify
	"identify_mode"         : "Identify mode",
	"unidentified"          : "Unidentified",
	"identify_bleep"        : "Click on a bleep<br>to identify it",

	// * Choice
	"choose_dual_weapon"    : "Choose dual-weapon",

	// * Types
	"spawn"                 : "Alien Spawn",
	"dock"                  : "Docking Claws",
	"floor"                 : "Floor",
	"void"                  : "Void",
	"wall"                  : "Wall",
	"door"                  : "Door",
	"item"                  : "Item",
	"red"                   : "Red Angel",
	"gold"                  : "Golden Arm",
	"blue"                  : "Hyperblue",
	"bleep"                 : "Bleep",
	"alien"                 : "Alien",
	"unknow"                : "Unknow",

	// * Subtypes
	"none"                  : "None",
	// ^ Marines
	"commander"             : "Commander",
	"trooper"               : "Trooper",
	// ^ Aliens
	"gremkin"               : "Gremkin",
	"scrof"                 : "Scrof",
	"limbo_lw"              : "Limbo Trooper",
	"limbo_hw"              : "Limbo Trooper BFG",
	"limbo_cc"              : "Limbo Commander",
	"fleshripper"           : "Fleshripper",
	"cyborg"                : "Cyborg",
	"juggernaut"            : "Juggernaut",
	// ^ Doors
	"airlock"               : "Airlock",
	// ^ Items
	"boulder"               : "Boulder",
	"c_panel_1"             : "Control Panel",
	"c_panel_2"             : "Control Panel",
	"weapon"                : "Experimental Weapon",
	"brain"                 : "Brain Container",
	"nuke"                  : "Radioactive Source",
	"egg"                   : "Nuclear Energy Pack",
	"breach"                : "Breached Hull",
	"cube"                  : "Cube of Limbo",

	// * Weapons
	"unarmed"               : "Unarmed",
	"bloter"                : "Bloter",
	"bloter_pistol"         : "Bloter+Pistol",
	"bloter_blade"          : "Bloter+Blade",
	"bloter_blade_pistol"   : "Bloter+Blade+Pistol",
	"machine_gun"           : "Machine Gun",
	"rocket_launcher"       : "Rocket Launcher",
	"plasma_cannon"         : "Plasma Cannon",
	"heavy_bloter"          : "Heavy Bloter",
	"heavy_bloter_plasma"   : "Heavy Bloter+Plasma",
	"pistol_axe"            : "Pistol+Axe",
	"glove_sword"           : "Glove+Sword",

	// * Orders
	"fire"                  : "Fire!",
	"move_it"               : "Move It!",
	"close_assault"         : "Close Assault!",
	"by_sections"           : "By Sections!",
	"photon_grenades"       : "Photon Grenades!",
	"heavy_weapon"          : "Heavy Weapon!",

	// * Equipments
	"flash_grenade"         : "Flash Grenade",
	"fission_bomb"          : "Fission Bomb",
	"blot_pistols"          : "Blot Pistols",
	"targeter"              : "Targeter",
	"assault_blades"        : "Assault Blades",
	"bionic_arm"            : "Bionic Arm",
	"force_field"           : "Force Field",
	"suspensors"            : "Suspensors",
	"bionic_eye"            : "Bionic Eye",
	"dual_weapon"           : "Dual Weapon",
	"xeno_sensor"           : "Xeno Sensor",
	"bionic_hand"           : "Bionic Hand",
	"med_pack"              : "Med-Pack",

	// * Events
	"intercom_malfunc"      : "Intercom Malfunction",
	"self_destruction"      : "Self-Destruction",
	"robotic_fault"         : "Robotic Fault",
	"lure_of_limbo"         : "Lure of Limbo",
	"airlock_control"       : "Airlock Control",
	"exploding_trap"        : "Exploding Trap",
	"out_of_ammo"           : "Out of Ammo",
	"report_in"             : "Report In",
	"auto_defence"          : "Auto-Defence",
	"robotic_assault"       : "Robotic Assault",
	"weapons_jammed"        : "Weapons Jammed",
	"psychic_attack"        : "Psychic Attack",
	"mothership_trans"      : "Mothership Transmission",
	"gremkin_grenater"      : "Gremkin Grenater",
	"mothership_scan"       : "Mothership Scan",
	"fleshripper"           : "Fleshripper",
	"equipment_malfunc"     : "Equipment Malfunction",
	"alien_elite"           : "Alien Elite",
	"frenzy"                : "Frenzy",
	"re_deploy"             : "Re-Deploy",
	"new_order"             : "New Order",
	"battle_plan"           : "Battle Plan",
	"alien_task_force"      : "Alien Task Force",
	"scrof_mechatek"        : "Scrof Mechatek",
	"alien_teleporter"      : "Alien Teleporter",

	// * Events Report
	"gain_f"                : "Gain %1!", // fstr
	"lose_f"                : "Lose %1...", // fstr
	"door_master"           : "Door master!",
	"no_order"              : "Can't give order...",
	"no_action"             : "Can't act...",
	"no_heavy_weapon"       : "Can't fire heavy...",
	"no_alien_action"       : "Can't act!",
	"more_alien_action"     : "More actions...",
	"more_alien_attack"     : "More attacks...",
	"gain_alien_weapon"     : "Gain weapon...",
	"alien_teleported"      : "Teleported...",
	"alien_spawned"         : "Spawned...",
	"lure_success"          : "Succumbed...",
	"lure_failure"          : "Resisted!",
	"event_success"         : "Something happens",
	"event_failure"         : "Nothing happens",

	// * Reinforcement
	"reinforcing"           : "Reinforcing...",

	// * Game over
	"marine_out"            : "No more marine",
	"turn_over"             : "No more turn",

	// * Ranks
	// ^ Marine
	"marine_rank_0"         : "Sergeant",
	"marine_rank_1"         : "Lieutenant Primus",
	"marine_rank_2"         : "Lieutenant Senioris",
	"marine_rank_3"         : "Captain Primus",
	"marine_rank_4"         : "Captain Senioris",
	// ^ Alien
	"alien_rank_0"          : "Chaos Renegade",
	"alien_rank_1"          : "Chaos Warrior",
	"alien_rank_2"          : "Champion of Chaos",
	"alien_rank_3"          : "Chaos Commander",
	"alien_rank_4"          : "Lord of Chaos",

	// * Award
	// ^ Marine
	// "marine_award_rank"     : "Equipment Card",
	// "marine_award_mission"  : "Honor Badge",
	// ^ Alien
	// "alien_award_rank"      : "Event Card",
	// "alien_award_mission"   : "Mark of Chaos",

};

