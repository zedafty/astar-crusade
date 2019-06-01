/*

	temp.js

*/

// =============================================================================
// -----------------------------------------------------------------------------
// # Variables
// -----------------------------------------------------------------------------
// =============================================================================

var setup = { // VERY TEMP

	//////////////////////////////////////////////////////////////////////////////
	// @ Game
	//////////////////////////////////////////////////////////////////////////////

	"mode" : "skirmish",
	"map" : "m01",
	"nb_player" : 1

};

var tempstorage = { // VERY TEMP
	"settings" : {
		"lang" : "en",
		"keyboard_layout" : null,
		"keymap" : {},
		"audio" : {
			"sound" : {
				"enabled" : true,
				"volume" : 0.5
			},
			"music" : {
				"enabled" : true,
				"volume" : 0.5
			}
		}
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

// =============================================================================
// -----------------------------------------------------------------------------
// # Functions
// -----------------------------------------------------------------------------
// =============================================================================

function initializeStorage() {
	// ---------------------------------------------------------------------------
	// TEST : feed local storage with defaults values
	// ---------------------------------------------------------------------------
	let l = tempstorage, k;
	for (k in l) {
		if (!hasLocalStorageKey(k)) {
			setLocalStorageItem(k, l[k]);
			if (k == "settings") {
				setLocalStorageItem("settings", {"keyboard_layout" : conf.keyboard_layouts[0], "keymap" : conf.keymap, "audio" : l[k].audio});
			}
		}
	}
	// ---------------------------------------------------------------------------
}
