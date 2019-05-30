/*

	lang.js

*/

// =============================================================================
// -----------------------------------------------------------------------------
// # Language
// -----------------------------------------------------------------------------
// =============================================================================

/**

	& SPECIAL STRINGS

	# Comment Marks
		fstr            string embed variable tokens ; require fstr() parsing
		HTML            string embed HTML tags ; cannot be inserted as a text node

*/

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
	"click_on_fire"          : "Click on fire<br>to continue", // HTML -- WARNING : also used by transmission

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
	"identify_bleep"        : "Click on a bleep<br>to identify it", // HTML

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
	"blue"                  : "Blue Hyper",
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

	// * Bonus
	// ^ Marine
	// "marine_rank_bonus"     : "Equipment Card",
	// "marine_award_bonus"    : "Honor Badge",
	// ^ Alien
	// "alien_rank_bonus"      : "Event Card",
	// "alien_award_bonus"     : "Mark of Chaos",

	// * Game Modes
	"campaign"         : "Campaign",
	"skirmish"         : "Skirmish",

	// * Menu
	"menu"             : "Menu",
	"restart"          : "Restart",
	"settings"         : "Settings",

	// * Keymap
	"keymap"           : "Keymap",
	"reset"            : "Reset",
	"azerty"           : "AZERTY (fr)",
	"qwerty"           : "QWERTY (us)",

	// * Settings
	"audio"            : "Audio",
	"sound"            : "Sound",
	"music"            : "Music",
	"language"         : "Language",

	// * Save/Load
	"save_game"        : "Save Game",
	"load_game"        : "Load Game",
	"save"             : "Save",
	"load"             : "Load",
	"delete"           : "Delete",

	// * Save Slots
	"autosave"         : "Autosave",
	"quicksave"        : "Quicksave",
	"save_1"           : "Save n°1",
	"save_2"           : "Save n°2",
	"save_3"           : "Save n°3",
	"save_4"           : "Save n°4",
	"save_5"           : "Save n°5",
	"save_6"           : "Save n°6",
	"save_7"           : "Save n°7",
	"save_8"           : "Save n°8",
	"empty"            : "Empty",
	"thumbnail"        : "Thumbnail",

	// * Storage
	"storage" : {
		"no_data"            : "No data... Import?", // storage empty
		"no_file"            : "No file to import...", // file input empty
		"wrong_file_type"    : "Wrong file type!", // file type is not JSON
		"wrong_file_size"    : "Wrong file size!", // file size greater than 2 MB
		"wrong_data_type"    : "Wrong data type!", // file parsing exception
		"wrong_data_table"   : "Wrong data table!", // invalid storage table
		"wrong_data_format"  : "Wrong data format!", // invalid storage format
		"export_success"     : "Storage exported",
		"import_success"     : "Storage imported",
		"data_cleared"       : "Data cleared!"
	},

	// * Commands
	"commands" : {
		"keymap"           : "<u>Key</u>map", // HTML
		"toolbar"          : "<u>Tool</u>bar", // HTML
		"save_game"        : "<u>Save</u> game", // HTML
		"load_game"        : "<u>Load</u> game", // HTML
		"quicksave"        : "Quick<u>save</u>", // HTML
		"quickload"        : "Quick<u>load</u>", // HTML
		"pause"            : "<u>Pause</u>", // HTML
		"fullscreen"       : "<u>Full</u>screen", // HTML
		"center_to_focus"  : "<u>Center</u> to focus", // HTML
		"scroll_by_mouse"  : "<u>Scroll</u> by mouse", // HTML
		"scroll_left"      : "Scroll <u>left</u>", // HTML
		"scoll_up"         : "Scroll <u>up</u>", // HTML
		"scroll_down"      : "Scroll <u>down</u>", // HTML
		"scroll_right"     : "Scroll <u>right</u>", // HTML
		"zoom_in"          : "Zoom <u>in</u>", // HTML
		"zoom_out"         : "Zoom <u>out</u>", // HTML
		"zoom_reset"       : "Zoom <u>100%</u>", // HTML
		"select_commander" : "<u>Select</u> 1<sup>st</sup> marine", // HTML
		"select_trooper_1" : "<u>Select</u> 2<sup>nd</sup> marine", // HTML
		"select_trooper_2" : "<u>Select</u> 3<sup>rd</sup> marine", // HTML
		"select_trooper_3" : "<u>Select</u> 4<sup>th</sup> marine", // HTML
		"select_trooper_4" : "<u>Select</u> 5<sup>th</sup> marine", // HTML
		"move"             : "<u>Move</u>", // HTML
		"attack_range"     : "Attack <u>Range</u>", // HTML
		"attack_melee"     : "Attack <u>Melee</u>", // HTML
		"give_order"       : "Give <u>Order</u>", // HTML
		"use_equipment"    : "Use <u>Equipment</u>", // HTML
		"switch_door"      : "Switch <u>Door</u>", // HTML
		"scan"             : "<u>Scan</u>", // HTML
		"end_turn"         : "<u>End</u> turn" // HTML
	},

	// * Languages
	"lang" : {
		"en" : "English",
		"fr" : "French"
	},

	// * Months
	"month" : [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December"
	],

	// * Maps
	"m01" : {
		"name"    : "Mission 764/06-Sector 50",
		"pri_obj" : "Eliminate Limbo Commander",
		"sec_obj" : "Destroy Boulders"
	},
	"m02" : {
		"name"    : "Mission 764/07-Sector 51",
		"pri_obj" : "Eliminate Limbo Troopers",
		"sec_obj" : "Destroy Control Panel"
	},
	"m03" : {
		"name"    : "Mission 764/08-Sector 46",
		"pri_obj" : "Exterminate Aliens (I)",
		"sec_obj" : "Retrieve Cube of Chaos"
	},
	"m04" : {
		"name"    : "Mission 764/09-Sector 68",
		"pri_obj" : "Destroy Hull",
		"sec_obj" : "Eliminate Scrofs"
	},
	"m05" : {
		"name"    : "Mission 764/10-Sector 53",
		"pri_obj" : "Destroy Eggs",
		"sec_obj" : "Eliminate Juggernaut"
	},
	"m06" : {
		"name"    : "Mission 764/11-Sector 16",
		"pri_obj" : "Retrieve Brain",
		"sec_obj" : "Eliminate Aliens"
	},
	"m07" : {
		"name"    : "Mission 764/12-Sector 45",
		"pri_obj" : "Eliminate Juggernaut",
		"sec_obj" : "Destroy Control Panels"
	},
	"m08" : {
		"name"    : "Mission 764/13-Sector 49",
		"pri_obj" : "Eliminate Cyborgs",
		"sec_obj" : "Destroy Secret Weapon"
	},
	"m09" : {
		"name"    : "Mission 764/14-Sector 46",
		"pri_obj" : "Exterminate Aliens (II)",
		"sec_obj" : "Retrieve Egg"
	},
	"m10" : {
		"name"    : "Mission 764/15-Sector 44",
		"pri_obj" : "Destroy Cube of Limbo",
		"sec_obj" : "Eliminate Gremkins"
	},
	"m11" : {
		"name"    : "Mission 764/16-Sector 23",
		"pri_obj" : "Destroy Plutonic Sources",
		"sec_obj" : "Eliminate Juggernaut"
	},
	"m12" : {
		"name"    : "Mission 764/17-Sector 85",
		"pri_obj" : "Retrieve Secret Weapon",
		"sec_obj" : "Exterminate Aliens"
	},

	// * Tips
	"tips" : {
		// -------------------------------------------------------------------------
		// Mono-line           : "The foe"                                                              => "<p>The foe</p>"
		// Multi-line          : ["The foe", "And the bar"]                                             => "<p>The foe</p><p>And the bar</p>"
		// FStr-Mono           : {"tip" : "The %1", "var" : {"1" : "foe"}}                              => "<p>The foe</p>
		// FStr-Multi          : {"tip" : ["The %1", "And the %2"], "var" : {"1" : "foe", "3" : "bar"}} => "<p>The foe</p><p>And the bar</p>"
		// -------------------------------------------------------------------------
		// FStr-KBd            : {"tip" : "Hit %1", "var" : {"kbd" : "keymap"}}                         => "<p>Hit <kbd>F1</kbd></p>"
		// -------------------------------------------------------------------------
		// * Tool
		"scroll_cc"            : "Center to focus",
		"move_cc"              : "Show move range",
		"zoom_out"             : "Zoom out",
		"zoom_reset"           : "Reinitialize zoom level",
		"zoom_in"              : "Zoom in",
		"detect_sight"         : "Show sight range",
		"detect_sense"         : "Show sense range",
		"detect_los"           : "Show line of sight",
		"limbo_luck"           : "All dice score max",
		"limbo_jinx"           : "All dice score zero",
		"limbo_haste"          : "Move speed increased",
		"limbo_life"           : "Life points increased",
		"gimme_move"           : "More moves for this turn",
		"gimme_attack"         : "More attacks for this turn",
		"gimme_scan"           : "More scans for this turn",
		"export_storage"       : "Export game data to file",
		"import_storage"       : "Import game data from file",
		"clear_storage"        : "Delete game data from browser",
		// * Main
		"member_1"             : {"tip" : "Select commander %1", "var" : {"kbd" : "select_commander"}}, // fstr
		"member_2"             : {"tip" : "Select 1<sup>st</sup> trooper %1", "var" : {"kbd" : "select_trooper_1"}}, // HTML fstr
		"member_3"             : {"tip" : "Select 2<sup>nd</sup> trooper %1", "var" : {"kbd" : "select_trooper_2"}}, // HTML fstr
		"member_4"             : {"tip" : "Select 3<sup>rd</sup> trooper %1", "var" : {"kbd" : "select_trooper_3"}}, // HTML fstr
		"member_5"             : {"tip" : "Select 4<sup>th</sup> trooper %1", "var" : {"kbd" : "select_trooper_4"}}, // HTML fstr
		"action_move"          : {"tip" : "Move %1", "var" : {"kbd" : "move"}}, // fstr
		"action_attack_range"  : {"tip" : "Attack Range %1", "var" : {"kbd" : "attack_range"}}, // fstr
		"action_attack_melee"  : {"tip" : "Attack Melee %1", "var" : {"kbd" : "attack_melee"}}, // fstr
		"action_give_order"    : {"tip" : "Give Order %1", "var" : {"kbd" : "give_order"}}, // fstr
		"action_use_equipment" : {"tip" : "Use Equipment %1", "var" : {"kbd" : "use_equipment"}}, // fstr
		"action_switch_door"   : {"tip" : "Switch Door %1", "var" : {"kbd" : "switch_door"}}, // fstr
		"action_scan"          : {"tip" : "Scan %1", "var" : {"kbd" : "scan"}}, // fstr
		"action_end_turn"      : {"tip" : "End Turn %1", "var" : {"kbd" : "end_turn"}}, // fstr
		"mouse_scroll"         : {"tip" : "Scroll %1", "var" : {"kbd" : "scroll_by_mouse"}}, // fstr
		"screen_enlarge"       : {"tip" : "Fullscreen %1", "var" : {"kbd" : "fullscreen"}}, // fstr
	}

};
