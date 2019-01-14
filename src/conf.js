/*

	conf.js

*/

// =============================================================================
// -----------------------------------------------------------------------------
// # Program
// -----------------------------------------------------------------------------
// =============================================================================

const prog = {
	"name" : "A* Crusade", // title
	"version" : "0.0", // major.minor
	"stage" : "draft", // draft, test, stable
	"hijack" : null // hijack
};

// =============================================================================
// -----------------------------------------------------------------------------
// # Configuration
// -----------------------------------------------------------------------------
// =============================================================================

const conf = {

	//////////////////////////////////////////////////////////////////////////////
	// @ Debug
	//////////////////////////////////////////////////////////////////////////////

	"debug" : {
		"draw" : {
			"los" : false, // draw line of sight on muppet range attack -- Default : false
			"path" : true, // draw path line when a character is moving -- Default : false
			"detect" : false, // draw sight and sense ranges on move -- Default : false
		},
		"skip" : {
			"marine_quit" : true, // skip marine quit stage (i.e. show marine at docking claws leaving) -- Default : false
			"game_turn" : true, // skip game turn stage (i.e. display remaining turn and waiting for input) -- Default : false
			"alien_event" : true, // skip alien event stage (i.e. display picked up event and apply its effect) -- Default : false
			"alien_play" : false, // skip alien play stage (i.e. enact alien team members) -- Default : false
			"alien_reinforcement" : true // skip alien reinforcement stage (i.e. spawn aliens at unseen locations) -- Default : false
		},
		"time" : {
			"los" : false, // log line of sight computing time in console -- Default : false
			"detect" : false, // log sight and sense ranges computing time in console -- Default : false
			"target" : false, // log targetting computing time in console -- Default : false
			"find_path" : false, // log find path computing time in console -- Default : false
			"range_move" : false, // log move range computing time in console -- Default : false
			"range_shoot" : false, // log shoot range computing time in console -- Default : false
			"alien_event" : true, // log alien event computing time in console -- Default : false
			"alien_play" : true, // log alien play computing time in console -- Default : false
			"mupt_loop" : true, // log muppet loop computing time in console -- Default : false
			"alien_reinforcement" : true // log alien reinforcement computing time in console -- Default : false
		},
		"mupt" : {
			"target" : false // log target id and detect mode in console -- Default : false
		},
		"anim" : {
			"slide" : false // log character animation slides in console -- Default : false
		}
	},

	//////////////////////////////////////////////////////////////////////////////
	// @ Console
	//////////////////////////////////////////////////////////////////////////////

	"console" : {
		"debug" : "color: teal;",
		"game" : "font-weight: bold; color: darkorchid;",
		"red" : "font-weight: bold; color: crimson;",
		"gold" : "font-weight: bold; color: darkgoldenrod;",
		"blue" : "font-weight: bold; color: royalblue;",
		"alien" : "font-weight: bold; color: forestgreen;"
	},

	//////////////////////////////////////////////////////////////////////////////
	// @ Colors
	//////////////////////////////////////////////////////////////////////////////

	"color" : {
		"board" : {
			"debug" : "rgba(255,96,255,.5)", // debug >> pink 50% -- DEBUG
			"range_sight" : "rgba(0,255,255,.5)", // sight range >> turquoise 50% -- DEBUG
			"range_sense" : "rgba(96,192,255,.375)", // sense range >> light blue 37.5% -- DEBUG
			"range_move" : "rgba(0,255,0,.25)", // move range >> green 25%
			"range_shoot" : "rgba(224,176,0,.5)", // shoot range >> dark yellow 50%
			"range_melee" : "rgba(224,176,0,.5)", // melee range >> dark yellow 50%
			"range_door" : "rgba(224,176,0,.5)", // door range >> dark yellow 50%
			"range_bleep" : "rgba(224,176,0,.5)", // bleep range >> dark yellow 50%
			"hilite_blank" : "rgba(255,255,255,.25)", // hovered blank tile >> white 25%
			"hilite_point" : "rgba(255,224,96,.5)", // hovered point tile >> light yellow 50%
			"square_center" : "rgba(240,0,0,.625)", // blast square center >> red 62.5%
			"square_edge" : "rgba(240,128,0,.625)", // blast square edge >> orange 62.5%
			"line" : "rgba(255,255,255,.5)", // beam line >> white 50%
			"scan_odd" : "rgba(208,160,0,.75)", // scan ripple odd rings >> dark yellow 50%
			"scan_even" : "rgba(208,160,0,.75)" // scan ripple even rings >> dark yellow 50%
		},
		"mini" : {
			"debug" : "rgba(192,64,192)", // debug >> pink -- DEBUG
			"range_sight" : "rgb(0,144,144)", // sight range >> turquoise -- DEBUG
			"range_sense" : "rgb(48,96,160)", // sense range >> light blue -- DEBUG
			"range_move" : "rgb(144,48,0)", // move range >> copper
			"range_shoot" : "rgb(208,160,64)", // shoot range >> yellow
			"range_melee" : "rgb(208,160,64)", // melee range >> yellow
			"range_door" : "rgb(208,160,64)", // door range >> yellow
			"range_bleep" : "rgb(208,160,64)", // bleep range >> yellow
			"scope" : "rgba(255,255,255,.5)", // miniscope >> white alpha 50%
			"focus" : "rgb(255,255,255)", // reticle >> white
			"scan" : "rgb(144,48,0)", // scan ripple >> copper
			"wall" : "rgb(64,64,64)", // wall >> gray 25%
			"door" : "rgb(144,96,0)", // door >> brown
			"item" : "rgb(0,144,144)", // item >> aqua
			"marine" : "rgb(224,32,32)", // marine >> red
			"bleep" :"rgb(0,96,0)", // bleep >> green 37.5%
			"alien" : "rgb(0,192,0)" // alien >> green 75%
		},
		"palette" : [
			// * Base
			[  0,   0,   0], // 00 : Black           #000000
			[255, 255, 255], // 01 : White           #ffffff
			[  0, 153, 153], // 02 : Transparency    #009999
			[255, 102, 102], // 03 : Shadow          #ff6666
			[ 17,  17,  17], // 04 : Gray Darkest    #111111
			[ 34,  34,  34], // 05 : Gray Darker     #222222
			[ 68,  68,  68], // 06 : Gray Dark       #444444
			[102, 102, 102], // 07 : Gray            #666666
			[136, 136, 136], // 08 : Gray Light      #888888
			[187, 187, 187], // 09 : Gray Lighter    #bbbbbb
			[204, 204, 204], // 10 : Gray Lightest   #cccccc
			[ 85,  34,   0], // 11 : Flesh Darker    #552200
			[154,  68,   0], // 12 : Flesh Dark      #994400
			[238, 119,  85], // 13 : Flesh           #ee7755
			[255, 153, 102], // 14 : Flesh Light     #ff9966
			[102,  51, 102], // 15 : Purple          #663366
			[136,   0,   0], // 16 : Red Dark        #880000
			[187,   0,   0], // 17 : Red             #bb0000
			[238,  85,  34], // 18 : Red Light       #ee5522
			[119,  85,   0], // 19 : Gold Dark       #775500
			[170, 119,   0], // 20 : Gold            #aa7700
			[187, 153,   0], // 21 : Gold Light      #bb9900
			[204, 187, 102], // 22 : Gold Lighter    #ccbb66
			[  0,  17, 153], // 23 : Blue Dark       #001199
			[ 17,  34, 221], // 24 : Blue            #1122dd
			[ 68, 102, 221], // 25 : Blue Light      #4466dd
			[ 34,  68,   0], // 26 : Green Dark      #224400
			[ 17, 102,   0], // 27 : Green           #116600
			[ 17, 153,  51], // 28 : Green Light     #119933
			[  0,  34,  34], // 29 : Teal Darker     #002222
			[  0,  85,  85], // 30 : Teal Dark       #005555
			[ 68, 102, 102], // 31 : Teal            #446666
			// * Extension
			[  0, 136, 136], // 32 : Cyan Dark       #008888 <- Major dark   [mj_dk]
			[  0, 204, 204], // 33 : Cyan            #00cccc <- Major medium [mj_md]
			[  0, 255, 255], // 34 : Cyan Light      #00ffff <- Major light  [mj_lt]
			[136,   0, 136], // 35 : Magenta Dark    #880088 <- Minor dark   [mn_dk]
			[204,   0, 204], // 36 : Magenta         #cc00cc <- Minor medium [mn_md]
			[255,   0, 255], // 37 : Magenta Light   #ff00ff <- Minor light  [mn_lt]
			[136, 136,   0], // 38 : Yellow Dark     #888800 <- Third dark   [th_dk]
			[204, 204,   0], // 39 : Yellow          #cccc00 <- Third medium [th_md]
			[255, 255,   0]  // 40 : Yellow Light    #ffff00 <- Third light  [th_lt]
		],
		"scheme" : {
			"black"  : [ 0,  0,  0], // limbo black
			"white"  : [ 1,  1,  1], // skull white
			"iron"   : [ 6,  7,  8], // iron gray
			"steel"  : [ 8,  9, 10], // steel gray
			"brown"  : [11, 12, 20], // muddy brown
			"flesh"  : [12, 13, 14], // human flesh
			"grunt"  : [16, 18, 14], // grunt flesh
			"cadet"  : [24, 25, 28], // cadet blue
			"shine"  : [16, 13, 22], // shiny orange
			"red"    : [16, 17, 18], // blood red
			"gold"   : [19, 21, 22], // pure gold
			"blue"   : [23, 24, 25], // deep blue
			"green"  : [26, 27, 28], // snot green
			"hooker" : [26, 26, 27], // hooker green
			"teal"   : [29, 30, 31], // pale turquoise
			"purple" : [29, 15, 15]  // dark purple
		}
	},

	//////////////////////////////////////////////////////////////////////////////
	// @ Utility
	//////////////////////////////////////////////////////////////////////////////

	"util" : {
		"lead_zero" : 1, // number of leading zeros used for integer to string conversion -- Default : 1
	},

	//////////////////////////////////////////////////////////////////////////////
	// @ Input
	//////////////////////////////////////////////////////////////////////////////

	"input" : {
		"double_trigger_delay" : 375, // time elapsed in milliseconds for a key pressed twice trigger -- Default : 375
	},

	//////////////////////////////////////////////////////////////////////////////
	// @ Dimensions
	//////////////////////////////////////////////////////////////////////////////

	"board" : {
		"width" : 40, // board horizontal size in tiles -- Default : 40
		"height" : 40, // board vertical size in tiles -- Default : 40
	},

	"tile" : {
		"size" : 32, // tile size in pixel -- Default : 32
	},

	//////////////////////////////////////////////////////////////////////////////
	// @ Entities
	//////////////////////////////////////////////////////////////////////////////

	"Text" : {
		"size" : 16, // font size in pixel -- Default : 16
		"font" : "Segoe UI", // font family -- Default : "Segoe UI"
		"color" : "white", // font color -- Default : "white"
		"align" : "left" // text align toward x position -- Default : "left"
	},

	"Line" : {
		"mark" : {
			"length" : 3, // mark length
			"width" : 2, // mark width
			"color" : "white" // mark color
		},
		"line" : {
			"width" : 2, // line width
			"color" : "white" // line color
		}
	},

	"Reti" : {},

	"Anim" : {
		"tile_border" : false, // exclude the right and bottom sides tile width for animation centering -- Default : false
		"speed" : 5, // number of frames elapsed between each animation frame -- Default : 5
		"effect_num" : 10, // maximum number of simultaneous effect animations -- Default : 10
		"muzzle" : true // show fire weapons muzzle animations -- Default : true
	},

	"Proj" : {
		"thres" : 1, // threshold accuracy in pixel below which a projectile will hit -- Default : 1
		"bullet" : {
			"speed" : 12, // pixel increment at each scene frame update -- Default : 12
			"width" : 2, // width of trails in pixels -- Default : 2
			"number" : 6, // number of trails -- Default : 6
			"length" : 1, // trail length multiplier (affected by speed) -- Default : 1
			"velocity" : 3, // speed threshold toward distance (affect speed) -- Default : 3
			"quenching" : 250 // quenching duration in milliseconds -- Default 250
		},
		"rocket" : {
			"speed" : 6, // pixel increment at each scene frame update -- Default : 6
			"width" : 10, // head width in pixels -- Default : 10
			"number" : 4, // number of tails -- Default : 4
			"mult" : 4, // head width multiplier -- Default : 4
			"quenching" : 500 // quenching duration in milliseconds -- Default : 500
		},
		"plasma" : {
			"speed" : 8, // pixel increment at each scene frame update -- Default : 8
			"width" : 3, // beam width in pixels -- Default : 3
			"number" : 4, // number of glows (affect width) -- Default : 4
			"rgba" : [64,96,240,0.625], // glow color value -- Default : [64,96,240,0.625]
			"quenching" : 500 // quenching duration in milliseconds -- Default 500
		},
	},

	"Char" : {
		"dir" : "ss", // sprite direction on init -- Default : "ss" (i.e. south)
		"width" : 32, // sprite width in pixels -- Default : 32
		"height" : 32, // sprite height in pixels -- Default : 32
		"line_speed" : 12, // number of steps per lineal move -- Default : 12
		"diag_speed" : 16, // number of steps per diagonal move -- Default : 16
		"anim_speed" : 1.0, // animation speed modifier (float ; 0.5 for half speed, 2.0 for double speed) -- Default : 1.0
		"brightness" : 1.1, // sprite brightness modifier (float ; 0.5 for one half darker, 1.5 for one half lighter) -- Default : 1.1
		"sight" : 30, // number of tiles a character can see at -- Default : 30 >> 20 (low) 30 (medium) 40 (high)
		"sense" : 10, // number of tiles a character can sense at -- Default : 10 >> 5 (low) 10 (medium) 15 (high)
		"radian_segment" : 32, // number of segments per cardinal direction (radial scan) -- Default : 32 >> 32 (low) 64 (high) 128 (insane)
		"switch_door_instant" : false, // hidden characters switch doors without delay -- Default : false
		"dont_look_at_the_wall_dumbass" : false, // prevent marines from staring at walls after moving -- Default : true
		"radian_rotation" : true, // rotate animation using radian angle instead of cardinal direction (pixel interpolation) -- Default : true
		"anim_set" : {
			"default" : {
				"move" : [
					[0, 1, 0, 1, 6, 0],
					[0, 2, 0, 2, 3, 0],
					[0, 3, 0, 3, 6, 0],
					[0, 2, 0, 2, 3, 0, false, true] // no callback, repeat animation
				],
				"stumble" : [
					[0, 1, 0, 1, 5, 2],
					[0, 2, 0, 2, 10, 4],
					[0, 3, 0, 3, 10, 6],
					[0, 0, 0, 0, 5, 0]
				],
				"aim" : [
					[0, 0, 0, 0, 5, 0],
					[0, 0, 1, 0, 5, 0],
					[0, 0, 1, 1, Infinity, 0]
				],
				"fire" : [
					[0, 0, 1, 1, 5, 0], // fire projectile
					[0, 0, 1, 3, 5, -6, true],
					[0, 0, 1, 2, 15, -4],
					[0, 0, 1, 3, 5, -2],
					[0, 0, 1, 1, Infinity, 0]
				],
				"throw" : [
					[0, 0, 1, 2, 5, 0],
					[0, 0, 1, 3, 5, 0],
					[0, 0, 1, 3, 0, 0, true] // fire projectile
				],
				"sheathe" : [
					[0, 0, 1, 0, 5, 0],
					[0, 0, 0, 0, 5, 0]
				],
				"melee" : [
					[0, 0, 2, 0, 5, 0],
					[0, 0, 2, 1, 5, 0],
					[0, 0, 2, 2, 5, 4],
					[0, 0, 2, 3, 15, 12],
					[0, 0, 2, 1, 5, 4, true], // do damage
					[0, 0, 2, 2, 5, 0],
					[0, 0, 2, 0, 5, 0]
				],
				"melee_alt" : [
					[0, 0, 1, 0, 5, 0],
					[0, 0, 1, 1, 5, 0],
					[0, 0, 1, 2, 5, 4],
					[0, 0, 1, 3, 15, 12],
					[0, 0, 1, 1, 5, 4, true], // do damage
					[0, 0, 1, 2, 5, 0],
					[0, 0, 1, 0, 5, 0]
				],
				"melee_draw" : [
					[0, 0, 2, 0, 5, 0],
					[0, 0, 2, 1, 5, 0],
					[0, 0, 2, 2, 5, 4],
					[0, 0, 2, 1, 20, 4, true], // show effect
					[0, 0, 2, 2, 5, 0],
					[0, 0, 2, 0, 5, 0]
				],
				"melee_alt_draw" : [
					[0, 0, 1, 0, 5, 0],
					[0, 0, 1, 1, 5, 0],
					[0, 0, 1, 2, 20, 4, true], // show effect
					[0, 0, 1, 2, 5, 0],
					[0, 0, 1, 0, 5, 0]
				]
			},
			"commander" : {},
			"trooper" : {},
			"gremkin" : {},
			"scrof" : {},
			"limbo_lw" : {},
			"limbo_hw" : {},
			"limbo_cc" : {},
			"cyborg" : {},
			"fleshripper" : {},
			"juggernaut" : {}
		}
	},

	"Furn" : {
		"brightness" : 1.1, // sprite brightness modifier (float ; 0.5 for one half darker, 1.5 for one half lighter) -- Default : 1.1
	},

	"Door" : {
		"switch_duration" : 60, // number of frames of the door switch animation -- Default : 60
		"switch_margin" : 4, // number of pixels ignored by the door switch animation -- Default : 4
		"close_kill_time" : 0.125 // time at which a closing door kill a character on rail (from 0.0 for start to 1.0 for end) -- Default : 0.125
	},

	"Item" : {},

	"Rect" : {
		"tile_border" : true, // let the right and bottom sides of tiles uncovered by color -- Default : true
		"hilite_blank" : true, // hilite flat tiles on mouse hover -- Default : true
		"hilite_point" : true, // hilite pawn tiles on mouse hover -- Default : true
		"ripple_speed" : 5, // number of frames elapsed during each ripple wave -- Default : 5
		"radian_segment" : 32 // number of segments per cardinal direction (draw scan range) -- Default : 32 >> 32 (low) 64 (high)
	},

	"Back" : {},

	//////////////////////////////////////////////////////////////////////////////
	// @ Main
	//////////////////////////////////////////////////////////////////////////////

	"main" : {
		"window" : {
			"resize_delay" : 0 // time in milliseconds after which a window resize event is effectively triggered -- Default : 0
		},
		"screen" : {
			"margin" : {"top" : 20, "left" : 20, "right" : 20, "bottom" : 20}, // main screen margin in pixels -- Default : 20, 20, 20, 20
			"enlarged" : {
				"margin" : {"top" : 0, "left" : 0, "right" : 0, "bottom" : 0}, // main screen margin in pixels when enlarged -- Default : 0, 0, 0, 0
				"fullscreen" : false // request browser fullscreen when main screen is enlarged -- Default : false
			}
		},
		"load" : {
			// * STABLE
			"spin_latency" : 0, // loading user interface resources latency in milliseconds -- Default : 0
			"load_latency" : 0, // loading sprites resources latency in milliseconds -- Default : 0
			// * TEST (A) -- Short
			// "spin_latency" : 50,
			// "load_latency" : 25,
			// * TEST (B) -- Long
			// "spin_latency" : 250,
			// "load_latency" : 500,
			"spin" : {
				"padding" : 8, // loading spinner padding in pixels -- Default : 8
				"rgb" : [64,192,64] // line color value -- Default : [64,192,64]
			},
		}
	},

	//////////////////////////////////////////////////////////////////////////////
	// @ Game
	//////////////////////////////////////////////////////////////////////////////

	"game" : {
		"turn" : 28, // maximum number of turns of a standard game -- Default : 28 (40)
		"close_door" : false, // allow nearby doors to be closed -- Default : false
		"friendly_fire" : true, // allow allies to be targetted -- Default : true
		"scan_radius" : {
			// "mothership" : 28, // radius in tiles of mothership scan -- Default : 28 * DEPRECATED
			"commander" : 9, // radius in tiles of commander scan -- Default : 9 (12)
			"trooper" : 6 // radius in tiles of trooper scan -- Default : 6 (7)
		},
		"die" : {
			"light" : [0,0,0,0,1,2], // light die faces -- Default : [0,0,0,0,1,2]
			"heavy" : [0,0,0,1,2,3] // heavy die faces -- Default : [0,0,0,1,2,3]
		},
		"movement" : 5, // default character movement in tiles (used by bleep) -- Default : 5
		"alien" : {
			"preferred_event" : [
			// probability of choosing (integer), event key (string)
				[ 40, "lure_of_limbo"     ],
				[ 30, "out_of_ammo"       ],
				[ 15, "equipment_malfunc" ],
				[  5, "intercom_malfunc"  ],
				[  4, "fleshripper"       ],
				[  3, "fleshripper"       ],
				[  3, "fleshripper"       ]
			// 100, "str"
			],
			"reinforcement" : {
				"max_per_turn" : 6, // maximum number of reinforcement tokens the alien player can place up each turn -- Default : 6
				"token" : { // total number of alien reinforcement tokens (i.e. maximum in-game)
					"gremkin"     : 12, // green -- Default : 12
					"scrof"       : 8,  // green -- Default : 8
					"limbo_lw"    : 6,  // blue -- Default : 6
					"limbo_hw"    : 2,  // blue -- Default : 2
					"limbo_cc"    : 2,  // blue -- Default : 2
					"fleshripper" : 0,  // none -- Default : 0
					"cyborg"      : 4,  // gray -- Default : 4
					"juggernaut"  : 1   // gray -- Default : 1
				}
			}
		},
		"score" : { // number of points (either gain or loss) granted for objective achievement or character elimination
			"pri_obj"     : 30, // -- Default : 30
			"sec_obj"     : 15, // -- Default : 15
			"commander"   : 10, // -- Default : 10
			"trooper_lw"  : 5,  // -- Default : 5
			"trooper_hw"  : 10, // -- Default : 10
			"gremkin"     : 2,  // -- Default : 2
			"scrof"       : 3,  // -- Default : 3
			"limbo_lw"    : 5,  // -- Default : 5
			"limbo_hw"    : 10, // -- Default : 10
			"limbo_cc"    : 10, // -- Default : 10
			"fleshripper" : 0,  // -- Default : 0
			"cyborg"      : 10, // -- Default : 10
			"juggernaut"  : 25  // -- Default : 25
		},
		"delay" : {
			"marine_quit" : 90, // number of frames skipped on turn end when any marine goes out from docking claws -- Default : 90
			"alien_attack" : 30, // number of frames elapsed before an alien execute and attack (before rolling dice) -- Default : 30
			"attack" : 60, // number of frames elapsed before an attack is executed (after both attack and defense score) -- Default : 60
			"defense" : 0, // number of frames elapsed before a defense score is rolled (after attack score) -- Default : 0
			"attack_end" : 60, // number of frames elapsed before an attack is ended (after damage) -- Default : 90
		}
	},

	//////////////////////////////////////////////////////////////////////////////
	// @ Muppets
	//////////////////////////////////////////////////////////////////////////////

	"mupt" : {
		"track_dist" : 20, // distance in tiles below which a muppet will track a detected hostile (strictly lower) -- Default : 20
		"walker_melee_dist" : 4, // distance in tiles from which a walker will try to engage melee (lower or equal) -- Default : 4
		"sniper_backward_dist" : 2, // distance in tiles from which a sniper will try to move back (lower or equal) -- Default : 2
		"loop_max" : 8, // number of loops at which the acting loop is considered infinite and brokes itself (strictly equal) -- Default : 8
		"retry_move" : 2, // number of loops below which a muppet will retry an aborted move due to pathfinding failure (strictly lower) -- Default : 2
	},

	//////////////////////////////////////////////////////////////////////////////
	// @ Scene
	//////////////////////////////////////////////////////////////////////////////

	"scen" : {

		// -------------------------------------------------------------------------
		// * Canvas
		// -------------------------------------------------------------------------

		"canvas" : {
			"width" : 480, // screen width in pixel -- Default : 480
			"height" : 480, // screen height in pixel -- Default : 480
			"smooth" : false // canvas image smoothing -- Default : false
		},

		// -------------------------------------------------------------------------
		// * Screen
		// -------------------------------------------------------------------------

		"screen" : {
			"outer" : 2.0, // screen outer bound offset in tiles (outset) -- Default : 2.0
			"inner" : 1.0 // screen inner bound offset in tiles (inset) -- Default : 1.0
		},

		// -------------------------------------------------------------------------
		// * Frame
		// -------------------------------------------------------------------------

		"frame_rate" : 16.67, // number of milliseconds elapsed between each frame refresh -- Default : 16.67 (i.e. 1000 ms / 60 frames = 16.67 ms)

		// -------------------------------------------------------------------------
		// * Texts
		// -------------------------------------------------------------------------

		"frame_count" : {
			"show" : true // display frame elapsed since initialization on screen -- Default : false
		},
		"fps" : {
			"show" : true, // display frame per seconds on screen -- Default : false
			"delay" : 5 // number of frames elapsed between each fps check (the higher the cooler) -- Default : 5
		},
		"curpos" : {
			"show" : true // display board cursor position on screen (in tiles) -- Default : false
		},
		"caption" : {
			"show" : true, // display caption feedback on screen -- Default : false
			"delay" : 120 // number of frames during which the caption is displayed -- Default : 120
		},

		// -------------------------------------------------------------------------
		// * Icon
		// -------------------------------------------------------------------------

		"icon" : {},

		// -------------------------------------------------------------------------
		// * Hint
		// -------------------------------------------------------------------------

		"hint" : {
			"delay" : 2000 // number of time in milliseconds before hint box disappears -- Default : 2000
		},

		// -------------------------------------------------------------------------
		// * Wait
		// -------------------------------------------------------------------------

		"wait" : {},

		// -------------------------------------------------------------------------
		// * Transmission
		// -------------------------------------------------------------------------

		"transmission" : {
			"delay" : 0 // number of frames elapsed between transmission prompt and alien play start -- Default : 0
		},

		// -------------------------------------------------------------------------
		// * Scroll
		// -------------------------------------------------------------------------

		"scrl" : {
			"key_power" : 1, // number of tiles scrolled per keyboard trigger -- Default : 1
			"input_power" : 1, // number of tiles scrolled per input trigger -- Default : 1
			"shift_power" : 4, // number of tiles added to scroll when the shift key is hold -- Default : 4
			"move_speed" : 5, // scroll transition speed while moving (0 = instant ; 1 = slowest ; 10 = fastest) -- Default : 5
			"snap_speed" : 1, // scroll transition speed while snapping (0 = instant ; 1 = slowest ; 10 = fastest) -- Default : 1
			"shake_speed" : 7, // scroll transition speed while shaking (0 = instant ; 1 = slowest ; 10 = fastest) -- Default : 7
			"shake_delay" : 5, // number of frames elapsed between two screen shakes (independent from speed, be cautious) -- Default : 5
			"shake_times" : 2, // number of times the screen is shaken -- Default : 2
			"shake_power" : 0.25, // number of tiles displaced per screen shake (going increasingly) -- Default : 0.25
			"mouse_accel" : {
				"min" : 0.5, // minimal mouse move multiplier (float) -- Default : 0.5
				"max" : 2.0, // maximal mouse move multiplier (float) -- Default : 2.0
				"div" : 10, // mouse move divider (increase to lower accel, decrease to upper accel) -- Default : 10
				"pix" : 2, // minimal number of pixels to move before accelerating -- Default : 2
				"num" : 2 // number of frames elapsed before acceleration falls to minimal -- Default : 2
			},
			"auto_scroll" : {
				"margin" : 2, // auto-scroll screen bound margin in tiles (inset) -- Default : 2
				"marine" : "center", // screen follows marine characters while moving (null, "center" or "bound") -- Default : "center"
				"alien" : "center", // screen follows alien characters while moving (null, "center" or "bound") -- Default : "center"
				"proj" : "bound" // screen follows projectile while firing (null, "center" or "bound") -- Default : "bound"
			}
		},

		// -------------------------------------------------------------------------
		// * Zoom
		// -------------------------------------------------------------------------

		"zoom" : {
			"factor" : 0.25, // percentile to add or substract on each zoom (either in or out) -- Default : 0.25 (i.e. 25%)
			"max" : 2, // maximum number of times to zoom in (i.e. scale up) -- Default : 2 (up to 150%)
			"min" : 2 // maximum number of times to zoom out (i.e. scale down) -- Default : 2 (down to 50%)
		},

		// -------------------------------------------------------------------------
		// * Fade
		// -------------------------------------------------------------------------

		"fade" : {
			"duration" : 2500 // fade duration in milliseconds -- Default : 2500
		}

	},

	//////////////////////////////////////////////////////////////////////////////
	// @ Monitor
	//////////////////////////////////////////////////////////////////////////////

	"moni" : {
		"report" : {
			"delay" : 120 // number of frames elapsed before report closes itself -- Default : 120
		},
		"status" : {},
		"identify" : {
			"brightness" : 1.1, // identify brightness modifier (float ; 0.5 for one half darker, 1.5 for one half lighter) -- Default : 1.1
		},
		"turn" : {
			// * TEST -- Short
			// "delay" : 15,
			"delay" : 0, // number of frames elapsed between turn prompt and alien event -- Default : 0
		},
		"alien" : {
			"event" : {
				"delay" : 120, // number of frames elapsed between alien event and alien turn start -- Default : 120
			},
			"reinforcement" : {
				"delay" : 90, // number of frames elapsed between alien event and alien turn start -- Default : 90
			}
		}
	},

	//////////////////////////////////////////////////////////////////////////////
	// @ Terminal
	//////////////////////////////////////////////////////////////////////////////

	"term" : {
		"canvas" : {
			"width" : 200, // terminal canvas width in pixels -- Default : 200
			"height" : 200, // terminal canvas height in pixels -- Default : 200
		},
		"noise" : {
			"duration" : 15 // noise duration in frames -- Default : 15
		},
		"roll" : {
			"duration" : 40, // roll animation duration in frames -- Default : 40
			"downtime" : 0.25 // linked roll animations downtime ratio toward duration (0.0 for immediate transition, 1.0 for complete animation) -- Default : 0.25
		},
		"choice" : {
			"delay" : 5, // number of frames elapsed before the choice box is closed -- Default : 5
		}
	}

};

