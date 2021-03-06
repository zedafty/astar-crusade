/*

	maps.js

*/

// =============================================================================
// -----------------------------------------------------------------------------
// # Maps
// -----------------------------------------------------------------------------
// =============================================================================

/**

	& MAP CONTENT

	Script
		> id
		> turn
		> board (file)
	Alien
		> rank
		> awards
		> reinforcement
	Spawns
		> red
		> gold
		> blue
		> alien
		> door
	Pawns
		> door
		> item (sub)
		> alien (sub)
	Grid
		> walls
		> docks

*/

const maps = {

	//////////////////////////////////////////////////////////////////////////////
	// @ Mission One -- NEW
	//////////////////////////////////////////////////////////////////////////////

	"m01" : {
		// -------------------------------------------------------------------------
		// * Script
		// -------------------------------------------------------------------------
		"id" : "m653-04",
		"turn" : null,
		"board" : "res/map/m01/board.png",
		// -------------------------------------------------------------------------
		// * Alien
		// -------------------------------------------------------------------------
		"alien" : {
			"rank" : 0, // 0 to 4
			"awards" : 0, // 0 to 4
			"reinforcement" : ["green", "blue", "gray", "juggernaut"] // "green", "blue", "gray", "juggernaut"
		},
		// -------------------------------------------------------------------------
		// * Spawns
		// -------------------------------------------------------------------------
		"spawn" : {
			"red" : {
				"dir" : "ss",
				"pts" : [[10,4],[11,4],[10,3],[11,3],[10,2],[11,2]]
			},
			"gold" : {
				"dir" : "ss",
				"pts" : [[19,4],[20,4],[19,3],[20,3],[19,2],[20,2]]
			},
			"blue" : {
				"dir" : "ss",
				"pts" : [[28,4],[29,4],[28,3],[29,3],[28,2],[29,2]]
			},
			"alien" : {
				"pts" : [[14,22],[25,22],[14,23],[25,23],[7,30],[8,30],[9,30],[10,30],[17,30],[18,30],[19,30],[20,30],[21,30],[22,30],[29,30],[30,30],[31,30],[32,30],[7,31],[8,31],[9,31],[10,31],[17,31],[18,31],[21,31],[22,31],[29,31],[30,31],[31,31],[32,31],[7,32],[8,32],[9,32],[10,32],[17,32],[18,32],[21,32],[22,32],[29,32],[30,32],[31,32],[32,32]]
			}
		},
		// -------------------------------------------------------------------------
		// * Pawns
		// -------------------------------------------------------------------------
		"pawn" : {
			"door" : [[10,5],[11,5],[19,5],[20,5],[28,5],[29,5],[19,8],[20,8],[8,11],[14,11],[15,11],[24,11],[25,11],[31,11],[8,12],[31,12],[19,14],[20,14],[8,20],[9,20],[19,20],[20,20],[30,20],[31,20],[16,22],[23,22],[16,23],[23,23],[8,25],[9,25],[30,25],[31,25],[8,28],[9,28],[30,28],[31,28],[15,30],[24,30],[15,31],[24,31]],
			"item" : {
				"boulder" : [[9,15],[10,15],[29,15],[30,15],[9,16],[30,16]]
			},
			"alien" : {
				"gremkin" : [[9,9],[30,9],[12,12],[27,12],[7,16],[32,16],[15,18],[24,18],[13,19],[26,19],[17,21],[22,21]],
				"scrof" : [[13,10],[26,10],[6,18],[33,18],[18,22],[21,22],[13,26],[27,27]],
				"limbo_lw" : [[19,16],[20,16],[7,23],[32,23],[26,26],[12,27]],
				"limbo_hw" : [[16,19],[25,28]],
				"limbo_cc" : [[23,19],[14,28]],
				"cyborg" : [[9,22],[30,22],[13,30],[26,30]],
				"juggernaut" : [[19,31]]
			}
		},
		// -------------------------------------------------------------------------
		// * Grid
		// -------------------------------------------------------------------------
		"grid" : [
			[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
			[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
			[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
			[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
			[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
			[1,1,1,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,1,1,1,1],
			[1,1,1,1,1,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,2,0,0,0,0,2,0,0,2,0,0,0,0,0,2,1,1,1,1,1],
			[1,1,1,1,1,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,2,0,0,0,0,2,0,0,2,0,8,8,8,0,2,1,1,1,1,1],
			[1,2,2,2,2,2,0,0,2,2,2,0,0,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,8,8,8,0,2,1,1,1,1,1],
			[1,2,2,2,2,2,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8,8,8,0,2,1,1,1,1,1],
			[1,2,5,5,5,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,2,0,0,2,0,8,8,8,0,2,1,1,1,1,1],
			[1,2,5,5,5,0,0,0,2,0,0,2,2,2,2,2,2,2,2,2,2,0,0,0,0,2,0,0,2,0,0,0,0,0,2,1,1,1,1,1],
			[1,2,2,2,2,2,0,0,2,0,0,2,0,0,0,0,0,0,0,0,2,2,2,2,2,2,0,0,2,2,2,2,2,2,2,1,1,1,1,1],
			[1,2,2,2,2,2,0,0,2,0,0,2,0,0,0,0,0,0,0,0,2,0,0,0,0,2,0,0,0,0,0,0,0,0,2,1,1,1,1,1],
			[1,1,1,1,1,2,0,0,2,0,0,0,0,0,2,2,2,2,2,2,2,0,8,8,0,2,0,0,0,0,0,0,0,0,2,1,1,1,1,1],
			[1,1,1,1,1,2,2,2,2,0,0,0,0,0,2,0,0,0,0,0,2,0,0,0,0,2,0,0,2,2,0,0,2,2,2,1,1,1,1,1],
			[1,1,1,1,1,2,0,0,2,0,0,2,0,0,2,0,0,0,0,0,2,2,0,0,2,2,0,0,2,0,0,0,0,0,2,1,1,1,1,1],
			[1,2,2,2,2,2,0,0,2,0,0,2,0,0,2,0,0,0,0,0,2,0,0,0,0,2,0,0,2,0,8,8,8,0,2,1,1,1,1,1],
			[1,2,2,2,2,2,0,0,2,0,0,2,0,0,2,0,0,0,0,0,2,0,0,0,0,2,0,0,2,0,8,8,8,0,2,1,1,1,1,1],
			[1,2,6,6,6,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,2,0,8,0,0,0,2,1,1,1,1,1],
			[1,2,6,6,6,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,2,0,8,0,0,0,2,1,1,1,1,1],
			[1,2,2,2,2,2,0,0,2,0,0,2,0,0,2,0,0,0,0,0,2,0,0,0,0,2,0,0,2,0,8,8,8,0,2,1,1,1,1,1],
			[1,2,2,2,2,2,0,0,2,0,0,2,0,0,2,0,0,0,0,0,2,0,0,0,0,2,0,0,2,0,8,8,8,0,2,1,1,1,1,1],
			[1,1,1,1,1,2,0,0,2,0,0,2,0,0,2,0,0,0,0,0,2,2,0,0,2,2,0,0,2,0,0,0,0,0,2,1,1,1,1,1],
			[1,1,1,1,1,2,2,2,2,0,0,0,0,0,2,0,0,0,0,0,2,0,0,0,0,2,0,0,2,2,0,0,2,2,2,1,1,1,1,1],
			[1,1,1,1,1,2,0,0,2,0,0,0,0,0,2,2,2,2,2,2,2,0,8,8,0,2,0,0,0,0,0,0,0,0,2,1,1,1,1,1],
			[1,2,2,2,2,2,0,0,2,0,0,2,0,0,0,0,0,0,0,0,2,0,0,0,0,2,0,0,0,0,0,0,0,0,2,1,1,1,1,1],
			[1,2,2,2,2,2,0,0,2,0,0,2,0,0,0,0,0,0,0,0,2,2,2,2,2,2,0,0,2,2,2,2,2,2,2,1,1,1,1,1],
			[1,2,7,7,7,0,0,0,2,0,0,2,2,2,2,2,2,2,2,2,2,0,0,0,0,2,0,0,2,0,0,0,0,0,2,1,1,1,1,1],
			[1,2,7,7,7,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,2,0,0,2,0,8,8,8,0,2,1,1,1,1,1],
			[1,2,2,2,2,2,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8,8,8,0,2,1,1,1,1,1],
			[1,2,2,2,2,2,0,0,2,2,2,0,0,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,8,8,8,0,2,1,1,1,1,1],
			[1,1,1,1,1,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,2,0,0,0,0,2,0,0,2,0,8,8,8,0,2,1,1,1,1,1],
			[1,1,1,1,1,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,2,0,0,0,0,2,0,0,2,0,0,0,0,0,2,1,1,1,1,1],
			[1,1,1,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,1,1,1,1],
			[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
			[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
			[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
			[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
			[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
		]
	},

	//////////////////////////////////////////////////////////////////////////////
	// @ Mission One -- OLD
	//////////////////////////////////////////////////////////////////////////////

	"_01" : {
		// -------------------------------------------------------------------------
		// * Script
		// -------------------------------------------------------------------------
		"id" : "m653-04",
		"board" : "res/map/_01/board.png",
		"turn" : 40,
		// -------------------------------------------------------------------------
		// * Alien
		// -------------------------------------------------------------------------
		"alien" : {
			"rank" : 0,
			"awards" : 0,
			"reinforcement" : ["green", "blue", "gray", "juggernaut"]
		},
		// -------------------------------------------------------------------------
		// * Spawns
		// -------------------------------------------------------------------------
		"spawn" : {
			"red" : {
				"dir" : "ss",
				"pts" : [[3,5],[4,5],[3,4],[4,4],[3,3],[4,3]]
			},
			"gold" : {
				"dir" : "ss",
				"pts" : [[19,5],[20,5],[19,4],[20,4],[19,3],[20,3]]
			},
			"blue" : {
				"dir" : "ww",
				"pts" : [[34,2],[34,3],[35,2],[35,3],[36,2],[36,3]]
			},
			"alien" : {
				// EMPTY -- TODO ?
			}
		},
		// -------------------------------------------------------------------------
		// * Pawns
		// -------------------------------------------------------------------------
		"pawn" : {
			"door" : [[33,2],[33,3],[9,5],[13,5],[3,6],[4,6],[9,6],[13,6],[19,6],[20,6],[26,6],[30,6],[26,7],[30,7],[4,12],[5,12],[35,12],[36,12],[30,14],[9,15],[19,15],[20,15],[30,15],[9,16],[17,17],[22,17],[17,18],[22,18],[4,20],[5,20],[15,24],[24,24],[32,24],[15,25],[24,25],[32,25],[4,28],[5,28],[35,28],[36,28],[4,31],[5,31],[28,31],[29,31],[12,34],[22,34],[12,35],[22,35],[32,35],[32,36]],
			"item" : {
				"boulder" : [
					[ 3,  10],
					[ 3,  11],
					[ 7,  10],
					[ 33, 10],
					[ 34, 10],
					[ 34, 11]
				]
			},
			"alien" : {
				"gremkin" : [
					[ 2,   7],
					[ 3,   8],
					[ 8,  13],
					[ 1,  13],
					[ 4,  10],
					[10,   6]
				],
				"scrof" : [
					[ 5, 11],
					[ 1,  8],
					[ 7,  6],
					[ 8,  1],
					[ 8,  5]
				],
				"limbo_lw" : [
					[14,  8],
					[29,  2],
					[16, 13]
				],
				"limbo_hw" : [
					[16,  8],
					[ 8, 19]
				],
				"limbo_cc" : [
					[20,  8],
					[ 7,  4],
				],
				"fleshripper" : [
					[ 8,  8],
					[11, 10],
					[28, 10]
				],
				"cyborg" : [
					[12,  5],
					[34,  7],
					[ 4, 16]
				],
				"juggernaut" : [
					[19, 26]
				]
			}
		},
		// -------------------------------------------------------------------------
		// * Grid
		// -------------------------------------------------------------------------
		"grid" : [
			[1,1,1,1,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
			[1,1,1,1,1,1,2,0,0,2,0,0,2,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,2,0,0,2,0,0,0,0,0,0,0,2],
			[1,1,2,2,2,2,2,0,0,2,0,0,2,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,2,0,0,2,0,0,0,0,0,0,0,2],
			[1,1,2,5,5,5,0,0,0,2,0,0,2,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,2,0,0,2,0,0,0,0,0,0,0,2],
			[1,1,2,5,5,5,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
			[1,1,2,2,2,2,2,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
			[2,2,2,2,2,2,2,0,0,2,0,0,2,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,2,0,0,2,0,0,0,0,0,0,0,2],
			[2,0,0,0,0,0,0,0,0,2,0,0,2,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,2,0,0,2,0,0,0,0,0,0,0,2],
			[2,0,0,0,0,0,0,0,0,2,0,0,2,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,2,0,0,2,0,0,0,0,0,0,0,2],
			[2,0,0,2,2,0,0,2,2,2,0,0,2,2,2,0,0,2,2,2,2,2,2,2,2,2,2,2,2,0,0,2,2,2,2,2,2,2,2,2],
			[2,0,0,2,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,2],
			[2,0,0,2,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,2],
			[2,0,0,2,0,0,0,0,0,0,0,0,2,0,0,2,2,2,2,2,2,0,0,0,0,0,0,0,2,0,0,2,2,2,0,0,2,2,2,2],
			[2,0,0,2,2,0,0,2,2,2,0,0,2,0,0,2,0,0,0,0,2,0,0,0,0,0,0,0,2,0,0,2,0,0,0,0,0,0,0,2],
			[2,0,0,0,0,0,0,0,0,2,0,0,2,0,0,2,0,0,0,0,2,0,0,0,0,0,0,0,2,0,0,2,0,0,0,0,0,0,0,2],
			[2,0,0,0,0,0,0,0,0,2,0,0,2,0,0,2,0,0,0,0,2,2,2,2,0,0,2,2,2,0,0,2,0,0,0,0,0,0,0,2],
			[2,2,2,2,2,2,2,0,0,2,0,0,2,0,0,2,0,0,0,0,2,0,0,0,0,0,0,0,2,0,0,2,0,0,0,0,0,0,0,2],
			[1,1,1,1,1,1,2,0,0,2,0,0,2,0,0,2,2,0,0,2,2,0,0,0,0,0,0,0,2,0,0,2,0,0,0,0,0,0,0,2],
			[1,1,2,2,2,2,2,0,0,2,0,0,2,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,2,0,0,0,0,0,0,0,2],
			[1,1,2,6,6,6,0,0,0,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,2,0,0,0,0,0,0,0,2],
			[1,1,2,6,6,6,0,0,0,2,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,2,0,0,0,0,0,0,0,2],
			[1,1,2,2,2,2,2,0,0,2,0,0,2,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,2,0,0,0,0,0,0,0,2],
			[1,1,1,1,1,1,2,0,0,2,0,0,2,0,0,2,2,0,0,2,2,0,0,0,0,0,0,0,2,0,0,2,2,2,0,0,2,2,2,2],
			[2,2,2,2,2,2,2,0,0,2,0,0,2,0,0,2,0,0,0,0,2,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,2],
			[2,0,0,0,0,0,0,0,0,2,0,0,2,0,0,2,0,0,0,0,2,2,2,2,0,0,2,2,2,0,0,0,0,0,0,0,0,0,0,2],
			[2,0,0,0,0,0,0,0,0,2,0,0,2,0,0,2,0,0,0,0,2,0,0,0,0,0,0,0,2,0,0,2,2,2,2,2,2,2,2,2],
			[2,0,0,2,2,2,0,0,2,2,0,0,2,0,0,2,0,0,0,0,2,0,0,0,0,0,0,0,2,0,0,2,0,0,0,0,0,0,0,2],
			[2,0,0,2,0,0,0,0,0,0,0,0,2,0,0,2,2,2,2,2,2,0,0,0,0,0,0,0,2,0,0,2,0,0,0,0,0,0,0,2],
			[2,0,0,2,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,2],
			[2,0,0,2,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,2],
			[2,0,0,2,2,2,0,0,2,2,0,0,2,2,0,0,2,2,2,2,2,0,0,0,0,0,0,0,2,0,0,2,0,0,0,0,0,0,0,2],
			[2,0,0,0,0,0,0,0,0,2,0,0,2,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,2,0,0,2,0,0,0,0,0,0,0,2],
			[2,0,0,0,0,0,0,0,0,2,0,0,2,0,0,0,0,0,0,0,2,2,2,2,0,0,2,2,2,0,0,2,2,2,2,0,0,2,2,2],
			[2,2,0,0,2,2,2,0,0,2,0,0,2,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,2,0,0,2,0,0,0,0,0,0,0,2],
			[1,2,7,7,2,1,2,0,0,2,0,0,2,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,2,0,0,2,0,0,0,0,0,0,0,2],
			[1,2,7,7,2,1,2,0,0,2,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,2],
			[1,2,7,7,2,1,2,0,0,2,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,2],
			[1,2,2,2,2,1,2,0,0,2,0,0,2,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,2,0,0,2,0,0,0,0,0,0,0,2],
			[1,1,1,1,1,1,2,0,0,2,0,0,2,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,2,0,0,2,0,0,0,0,0,0,0,2],
			[1,1,1,1,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2]
		]
	}
};
