/*

	main.js

*/

// =============================================================================
// -----------------------------------------------------------------------------
// # Module
// -----------------------------------------------------------------------------
// =============================================================================

var main = {

	//////////////////////////////////////////////////////////////////////////////
	// @ Shown
	//////////////////////////////////////////////////////////////////////////////

	"shown" : false,

	//////////////////////////////////////////////////////////////////////////////
	// @ Ready
	//////////////////////////////////////////////////////////////////////////////

	"ready" : false,

	//////////////////////////////////////////////////////////////////////////////
	// @ Load
	//////////////////////////////////////////////////////////////////////////////

	"load" : {
		"count" : 0,
		"index" : 0,
		"spin" : {
			"show" : null,
			"hide" : null
		},
		"main" : {
			"show" : null,
			"hide" : null
		}
	},

	//////////////////////////////////////////////////////////////////////////////
	// @ Window
	//////////////////////////////////////////////////////////////////////////////

	"window" : {
		"timeout" : 0
	},

	//////////////////////////////////////////////////////////////////////////////
	// @ Screen
	//////////////////////////////////////////////////////////////////////////////

	"screen" : {
		"docked" : true,
		"enlarged" : false,
		"scale" : 1,
		"x" : 0,
		"y" : 0
	},

	//////////////////////////////////////////////////////////////////////////////
	// @ Mouse
	//////////////////////////////////////////////////////////////////////////////

	"mouse" : {
		"x" : 0,
		"y" : 0,
		"down" : false
	},

	//////////////////////////////////////////////////////////////////////////////
	// @ Cursor
	//////////////////////////////////////////////////////////////////////////////

	"cursor" : {
		"state" : null // current cursor state
	},

	//////////////////////////////////////////////////////////////////////////////
	// @ Keymap
	//////////////////////////////////////////////////////////////////////////////

	"keymap" : null, // refreshed when modal is closed

	//////////////////////////////////////////////////////////////////////////////
	// @ Keys
	//////////////////////////////////////////////////////////////////////////////

	"key" : { // key vars
		"map" : {},
		"curr" : null,
		"last" : null,
		"twice" : null,
		"interval" : 0
	},

	//////////////////////////////////////////////////////////////////////////////
	// @ Controls
	//////////////////////////////////////////////////////////////////////////////

	"ctrl" : {
		"action" : null
	},

	//////////////////////////////////////////////////////////////////////////////
	// @ Pause
	//////////////////////////////////////////////////////////////////////////////

	"pause" : false,

	//////////////////////////////////////////////////////////////////////////////
	// @ Save
	//////////////////////////////////////////////////////////////////////////////

	"save" : {
		"forbidden" : false,
		"prevented" : false,
		"pending" : false,
		"savekey" : null
	},

	//////////////////////////////////////////////////////////////////////////////
	// @ Storage
	//////////////////////////////////////////////////////////////////////////////

	"storage" : {
		"timer" : null
	}

};

// =============================================================================
// -----------------------------------------------------------------------------
// # User Interface Resource Stack
// -----------------------------------------------------------------------------
// =============================================================================

var ui = {

	//////////////////////////////////////////////////////////////////////////////
	// @ Base
	//////////////////////////////////////////////////////////////////////////////

	"base" : {
		"main"                     : {"img" : null, "src" : "res/ui/main.png"},
		"scroll"                   : {"img" : null, "src" : "res/ui/scroll.png"},
		"weapons"                  : {"img" : null, "src" : "res/ui/weapons.png"},
		"orders_equip"             : {"img" : null, "src" : "res/ui/orders_equip.png"},
		"disabled_gray"            : {"img" : null, "src" : "res/ui/disabled_gray.png"},
		"disabled_black"           : {"img" : null, "src" : "res/ui/disabled_black.png"}
	},

	//////////////////////////////////////////////////////////////////////////////
	// @ Cursors
	//////////////////////////////////////////////////////////////////////////////

	"cursor" : {
		"green_pointer"            : {"img" : null, "src" : "res/ui/cur/green_pointer.png"},
		"green_click"              : {"img" : null, "src" : "res/ui/cur/green_click.png"},
		"green_grab"               : {"img" : null, "src" : "res/ui/cur/green_grab.png"},
		"green_grabbing"           : {"img" : null, "src" : "res/ui/cur/green_grabbing.png"},
		"red_pointer"              : {"img" : null, "src" : "res/ui/cur/red_pointer.png"},
		"red_click"                : {"img" : null, "src" : "res/ui/cur/red_click.png"},
		"red_grab"                 : {"img" : null, "src" : "res/ui/cur/red_grab.png"},
		"red_grabbing"             : {"img" : null, "src" : "res/ui/cur/red_grabbing.png"},
		"gold_pointer"             : {"img" : null, "src" : "res/ui/cur/gold_pointer.png"},
		"gold_click"               : {"img" : null, "src" : "res/ui/cur/gold_click.png"},
		"gold_grab"                : {"img" : null, "src" : "res/ui/cur/gold_grab.png"},
		"gold_grabbing"            : {"img" : null, "src" : "res/ui/cur/gold_grabbing.png"},
		"blue_pointer"             : {"img" : null, "src" : "res/ui/cur/blue_pointer.png"},
		"blue_click"               : {"img" : null, "src" : "res/ui/cur/blue_click.png"},
		"blue_grab"                : {"img" : null, "src" : "res/ui/cur/blue_grab.png"},
		"blue_grabbing"            : {"img" : null, "src" : "res/ui/cur/blue_grabbing.png"}
	},

	//////////////////////////////////////////////////////////////////////////////
	// @ Monitor
	//////////////////////////////////////////////////////////////////////////////

	"moni" : {
		"insignia"                 : {"img" : null, "src" : "res/ui/moni/insignia.png"},
		"life"                     : {"img" : null, "src" : "res/ui/moni/life.png"},
		"targeter"                 : {"img" : null, "src" : "res/ui/moni/targeter.png"},
		"identify_body"            : {"img" : null, "src" : "res/ui/moni/identify_body.png"},
		"identify_weap"            : {"img" : null, "src" : "res/ui/moni/identify_weap.png"},
		"alien"                    : {"img" : null, "src" : "res/ui/moni/alien.png"}
	},

	//////////////////////////////////////////////////////////////////////////////
	// @ Terminal
	//////////////////////////////////////////////////////////////////////////////

	"term" : {
		"noise"                    : {"img" : null, "src" : "res/ui/term/noise.png"},
		"roll"                     : {"img" : null, "src" : "res/ui/term/roll.png"}
	},

	//////////////////////////////////////////////////////////////////////////////
	// @ Controls
	//////////////////////////////////////////////////////////////////////////////

	"ctrl" : {
		"buttons"                  : {"img" : null, "src" : "res/ui/ctrl/buttons.png"},
		"faces"                    : {"img" : null, "src" : "res/ui/ctrl/faces.png"},
		"light_s"                  : {"img" : null, "src" : "res/ui/ctrl/light_s.png"},
		"light_m"                  : {"img" : null, "src" : "res/ui/ctrl/light_m.png"}
	}

};

// =============================================================================
// -----------------------------------------------------------------------------
// # Sprites Resource Stack
// -----------------------------------------------------------------------------
// =============================================================================

var spr = {

	//////////////////////////////////////////////////////////////////////////////
	// @ Background (always required -- varying)
	//////////////////////////////////////////////////////////////////////////////

	"back" : {
		"board"                         : {"img" : null, "src" : null}
	},

	//////////////////////////////////////////////////////////////////////////////
	// @ Animations (always required)
	//////////////////////////////////////////////////////////////////////////////

	"anim" : {
		// * File (raw)
		// "buffet"                        : {"img" : null, "src" : "res/spr/anim/buffet.png"},
		// "effect"                        : {"img" : null, "src" : "res/spr/anim/effect.png"},
		// "muzzle"                        : {"img" : null, "src" : "res/spr/anim/muzzle.png"}
		// * Data (base64)
		"buffet"                        : {"img" : null, "src" : "data:image/png;base64,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"},
		"effect"                        : {"img" : null, "src" : "data:image/png;base64,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"},
		"muzzle"                        : {"img" : null, "src" : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJAAAACQCAMAAADQmBKKAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAABJQTFRF4ODg4M5wS3Dz/10lEyXz/////A2KQwAAAAZ0Uk5T//////8As7+kvwAAAuJJREFUeNrsmtF2hCAMRJcu/f9frh5LYWEmwBFKQPIYlNyVLMmgr+8/ex/2DayVv8xeaoHeb3NYOlUr//xAxrwOMyad/vLHIfD13L8q0OXlI2ngzks2EAhPVA/U+W8/EAhPVJ/Ud00zEC4D5tdioLvJuwqQVCIu20A8cA+cGYF6BV4J6H9tA80IJMkZ9nfH/halVh+QK58oLCqr3o8alftIOoGYAHIj4Zjzx0iX7/4Wqg/IN6Px0oQNvh/z/viONu2aRqBzqpwECsfwUjbdqdUB4c3Op3uMawxr/dcFwmYMC403zecB+UKBZfYAGaQOqKckXAdo99QbaAO1AcIHU3xjHPQ2aBgQPtz0Xj7S+rhYKxBqS13QtEn7lEhxq/80IN/o+9Cxv0NSqwNCSRqG/QwtATVTHcqA0KPmQFJSrwuEj+hwUksb4/OAmJwe8AJPHZBUXAd1jOqAZCm9gbbq2EClQHyLYymN7mi1UeoDyn1uko7iO1p9vqMPiL0oYKWVNWdPBUrbM9bgN0tqdUAsqVmL31MC6QTin1RioJ4SSCtQrQjqJ4FmBMIiqJcEmgtojAiaC2iECJoNaKuODVQDZO3XYdaml1iLvW2uj/1agU73WSTiW7D/muTypyPl8yC/TiDnjm/B/tDLR/LznBb6NQPFAdLLQ/+nl4/k5pkfyNo48Pmw4wXzy4Cvl4FIUqsDYsmLAqQ4LggH4klNNkZ1QGzjQo+aA9UtTaa4qgPCxQ89ap7UdUszHxA29Kj5xlizNKsAoYaLF1epQVsZiLWjqEEbpDrUAdX8jdcAkiZnKcplTV7qSF6NQHwzk8QLSmoumkq9GoF4QSwRNfnSymZJ23utQCUSRRI1ufYsP8usQKxlZw0au57PT5JaHRBP3ZIA4Z35H4AOdZKNUR0Qf3ilRw1utHZxaHFVByQVv/xxVXjYULc4MwHViCBJBt0XQbMB4YZLlkH3RNCMQFuXbV2WsR8BBgBTAkW4uufh9gAAAABJRU5ErkJggg"}
	},

	//////////////////////////////////////////////////////////////////////////////
	// @ Doors (always required)
	//////////////////////////////////////////////////////////////////////////////
	"door" : {
		// * File (raw)
		// "ww"                            : {"img" : null, "src" : "res/spr/door/airlock_ww.png"},
		// "ee"                            : {"img" : null, "src" : "res/spr/door/airlock_ee.png"},
		// "nn"                            : {"img" : null, "src" : "res/spr/door/airlock_nn.png"},
		// "ss"                            : {"img" : null, "src" : "res/spr/door/airlock_ss.png"}
		// * Data (base64)
		"ww"                            : {"img" : null, "src" : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAABVQTFRFZmZmERERu7u7ACIiiIiIRERE////5ji0DQAAAAd0Uk5T////////ABpLA0YAAABPSURBVHja3NMxDgAgCARBxMP/P1k7gyYclLr1FECCDJI8AZSUARKXAi2oDlThygGArEmB2d4KMBcHaww3ZD+qg+tQKRBGQSdx8MVnTQEGAOtGDTl1jSSqAAAAAElFTkSuQmCC"},
		"ee"                            : {"img" : null, "src" : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAABVQTFRFZmZmERERACIiu7u7iIiIRERE////+Bt3agAAAAd0Uk5T////////ABpLA0YAAABQSURBVHja3NNLDgAQDEXR6sf+lyxioiRepSPu+ESUlCqIngACwuAcMwblUAyoS+Qe7GPNA0aAuVT7wSOzGOCl7ZIQ5F8y/5sMwuCLzWoCDAB8fQ0hMlIadgAAAABJRU5ErkJggg=="},
		"nn"                            : {"img" : null, "src" : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAABVQTFRFZmZmERERu7u7ACIiiIiIRERE////5ji0DQAAAAd0Uk5T////////ABpLA0YAAABBSURBVHjaYmADAyYkwAIGzMwQGQaiFTCgAXIUMAIBCwsrK4gmXwGMHlVAmQJIZDMzk6+AhYWJiZV1VMGQVQAQYAB5Rg05d4AOBwAAAABJRU5ErkJggg=="},
		"ss"                            : {"img" : null, "src" : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAABVQTFRFZmZmERERACIiu7u7iIiIRERE////+Bt3agAAAAd0Uk5T////////ABpLA0YAAABISURBVHja7Mo5EoAgEETRXma4/5FVCCiLRDGi5Ccd9EOp2QAZYWdKJCC1BxssCnwW8QVcB9l2FnT4bwBkzoN774GGHoJDgAEAIYwNIYxJQt4AAAAASUVORK5CYII="}
	},

	//////////////////////////////////////////////////////////////////////////////
	// @ Items (sometimes required)
	//////////////////////////////////////////////////////////////////////////////

	"item" : {
		// * File (raw)
		// "bleep"                         : {"img" : null, "src" : "res/spr/item/bleep.png"},
		// "boulder"                       : {"img" : null, "src" : "res/spr/item/boulder.png"},
		// "brain"                         : {"img" : null, "src" : "res/spr/item/brain.png"},
		// "breach"                        : {"img" : null, "src" : "res/spr/item/breach.png"},
		// "cube"                          : {"img" : null, "src" : "res/spr/item/cube.png"},
		// "c_panel_1"                     : {"img" : null, "src" : "res/spr/item/c_panel_1.png"},
		// "c_panel_2"                     : {"img" : null, "src" : "res/spr/item/c_panel_2.png"},
		// "egg"                           : {"img" : null, "src" : "res/spr/item/egg.png"},
		// "nuke"                          : {"img" : null, "src" : "res/spr/item/nuke.png"},
		// "weapon"                        : {"img" : null, "src" : "res/spr/item/weapon.png"}
		// * Data (base64)
		"bleep"                         : {"img" : null, "src" : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAAxQTFRFIkQAEWYAzMzMEZkzfq70OwAAAF1JREFUeNrEk0EOABAMBKv7/z9LyUovqFSYg4SdSFEClAUishXaMAD87K3AQNWLJ0KPAFWLqJ0Jtkwmp9gItj1hyVEB8KGXokK+hlv3kH2LG/3wt6uXHy8gpKkCDACOOgLxrO2+VAAAAABJRU5ErkJggg"},
		"boulder"                       : {"img" : null, "src" : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAABJQTFRFVSIAiDMAERERqncAiIiI////gEm+xgAAAAZ0Uk5T//////8As7+kvwAAAJxJREFUeNqck4sKwzAIRY12///L4+7sNgwGmgppm3jq9UHi1ViMgYj1scy1ngByVbGEZp4BDl91XQLYnwCElgmQCUJmAjg8EGnKDdIDPlRwC4FMAZXk1HBpZd4SI8DBaVGEBWaAxusjF4jAV6IFGNUOTXI/rW4BbSnN5elddUu0AMguTk9GNgeEuLj9dQbYaK9/+HM3W+DB7X4LMACiZAnFabAsrQAAAABJRU5ErkJggg"},
		"brain"                         : {"img" : null, "src" : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAA9QTFRFiIiIERERZmZmuwAA////FcJhOAAAAAV0Uk5T/////wD7tg5TAAAAUUlEQVR42mJgIQAY6KyAEQzIVQCSYgADVEXEKmBkZGJigAMmJoQS4hVApJiZIZhUBTBpZABTMnQUYCrBGQ54FFAaF5SnB2qkycGSs8hSABBgAExKCxmo3Xn1AAAAAElFTkSuQmCC"},
		"breach"                        : {"img" : null, "src" : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAABJQTFRFIkQAACIiEREREWYAEZkzu7u7kMKqNwAAAJ5JREFUeNqckwEOhCAMBFsp///ytY491KhUN1Fgd5IWRGlNJB5VcS2u1syVvhQAFuqK2IwY36wCIIoE0jvA5k8B1bUVoQhvikraU8Ab+QOEoF8AM5AY3wMZs8k8+hrAlmIMs/exrgJZgu2NluvAOGqKHN13QHzsPPQvANeF8PI+3AIp4qPn6wKwnLQvVgGYZsjVzx9gnZWAJ02BnwADAPAcBc1nPrfKAAAAAElFTkSuQmCC"},
		"cube"                          : {"img" : null, "src" : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAAxQTFRFERERuwAAu7u7////EqYMogAAAAR0Uk5T////AEAqqfQAAABESURBVHjaYmAmABiGkAJGLIBUBQxogHwFTEyUKYBJk6uAiQmiAESSowAmCaEpUYDTkQQVIIwnXwFlsUlpihriOQsgwAABHwhBySNGDAAAAABJRU5ErkJggg"},
		"c_panel_1"                     : {"img" : null, "src" : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAABtQTFRFu7u7ERERZmZmuwAAEZkzEWYAqncAZjNm////9S62GQAAAAl0Uk5T//////////8AU094EgAAAFRJREFUeNrU00sKwCAMRdFbX/3sf8UNSCelRExG3vGBBKKMRRwErp92AZ8ioFgg3VYMyIJm9R4Dc8RySQfMEVCru6QD3hFxIGVB9prZF3X4z3oEGAA7ZBVpEhtuGwAAAABJRU5ErkJggg"},
		"c_panel_2"                     : {"img" : null, "src" : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAABhQTFRFERERu7u7ZmZmqncAEZkzuwAAZjNm////udk40AAAAAh0Uk5T/////////wDeg71ZAAAAV0lEQVR42tSTSQoAIAwD07r9/8e2iBexBPXkQG5Do2jRCPhIwIZTQRZuhFKyIaIKeM6FZNTqw4NDUmESVlBBdSS8JhVmhvgi0Ar6WGEFEV5/1Oeb1QUYAA/qEmGPs1rpAAAAAElFTkSuQmCC"},
		"egg"                           : {"img" : null, "src" : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAABtQTFRFERERREREuwAAiDMAu7u7AFVVqncAACIi////4CRsXwAAAAl0Uk5T//////////8AU094EgAAAGxJREFUeNrM00sKwCAMBNB08rH3P3GN4kIoWmMpne08CGqkcxL6GFBJFHh1lPToKaglcpgrigBVyQFUHaS0ArwGRMyANqYNWQPADmAG4qAd00uzeszbi5oAH+MZvMUA7O/DGzv5l58VApcAAwAnohb1EFsSIAAAAABJRU5ErkJggg"},
		"nuke"                          : {"img" : null, "src" : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAABJQTFRFERERREREqncAZmZmiIiI////U6F1RwAAAAZ0Uk5T//////8As7+kvwAAAG5JREFUeNrM0+EKgDAIBGAv6/1fuW4iErRSg+j+BPOjdG2yPUQ+BjLSBSytR1TPKAtYVF1GVIEgecBXGxCpA37ARmSZCZIFNlykDgBv0J5V4MQbvdyHBOCyNdgB9rsBZ5PzcAven8m/3KwW2AUYAOjcDj0N9CV5AAAAAElFTkSuQmCC"},
		"weapon"                        : {"img" : null, "src" : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAB5QTFRFERERAFVVZmZmqncAuwAAu7u7iIiIACIiiDMA////EOnvwwAAAAp0Uk5T////////////ALLMLM8AAABnSURBVHja5JNBDsAgCAS3BdT+/8MFOZQeKvTsJBzcTAwGwZWAbQQsqAgAMxGzKK1ZGYAIKdNKBLuElfMFQFQXvtocoy64dEyA3hEf/1PwzBQ/hVkkwhPEpsM0U8HD5X9Ihc334hZgADHuGS1adq5BAAAAAElFTkSuQmCC"}
	},

	//////////////////////////////////////////////////////////////////////////////
	// @ Characters (usually required)
	//////////////////////////////////////////////////////////////////////////////

	"char" : {
		// * File (raw)
		// "bleep"                         : {"img" : null, "src" : "res/spr/char/bleep.png"},
		// "commander"                     : {"img" : null, "src" : "res/spr/char/commander.png"},
		// "trooper"                       : {"img" : null, "src" : "res/spr/char/trooper.png"},
		// "gremkin"                       : {"img" : null, "src" : "res/spr/char/gremkin.png"},
		// "scrof"                         : {"img" : null, "src" : "res/spr/char/scrof.png"},
		// "limbo_tr"                      : {"img" : null, "src" : "res/spr/char/limbo_tr.png"},
		// "limbo_cc"                      : {"img" : null, "src" : "res/spr/char/limbo_cc.png"},
		// "fleshripper"                   : {"img" : null, "src" : "res/spr/char/fleshripper.png"},
		// "cyborg"                        : {"img" : null, "src" : "res/spr/char/cyborg.png"},
		// "juggernaut"                    : {"img" : null, "src" : "res/spr/char/juggernaut.png"}
		// * Data (base64)
		"bleep"                         : {"img" : null, "src" : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAAxQTFRFIkQAEWYAzMzMEZkzfq70OwAAAF1JREFUeNrEk0EOABAMBKv7/z9LyUovqFSYg4SdSFEClAUishXaMAD87K3AQNWLJ0KPAFWLqJ0Jtkwmp9gItj1hyVEB8KGXokK+hlv3kH2LG/3wt6uXHy8gpKkCDACOOgLxrO2+VAAAAABJRU5ErkJggg"},
		"commander"                     : {"img" : null, "src" : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAACACAMAAACMX59YAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAACpQTFRFERERAMzMzMzMAIiImUQAu7u7AP//zADM7ndViIiIiACI/wD/VSIA////yqFhSAAAAA50Uk5T/////////////////wBFwNzIAAAB6ElEQVR42uyY646EIAyFEQW87fu/7u6xYQsKrtrGZCf0l5OWT6gD5wTzdTPMFslvNYDJoj6067zvOq7QAsQEIi/g4d73fQjeW5tW6AAwtf4naJLxKR+OIYhloddoApAMAUm3BZ5CyBq1DXfOWmSRwyu0AEhauyxUgEDRslgbEWhfzDo3DMbMszbAeyxhmggwTZgmfyq01ZiYG0cg0uXJAX1PTRyGcXSOCtJG4Rc1GMPXFfnsDy4E0BTnGYB1jQXcJloimowXoGL3F1MA8FYetsi3ND4iPiktMp++HqB2XOUbHcssbHNVQO0YxXDa5IXsCwBucjH3CuAU3gAfBbgq7/stpwW4Ju900OYVOoCSvB+3NGX3FkMDUJL3nZXL5J0sxu+xLwaU5T01GEd5D4GXqQM4yntuMI7yjiP+1B/cApTlPTUYR3m/YDAuA8ryzgbjoT+4BSjJe2owHvmDm4CzI+ORP3gMaP6gaeP/AbT7g3Z/0O4P2v1Buz9o9wfNHzRA8wdv+QM6WAX+QAyIrXvoD8SAaDAeyrsYwAajLu94OvUHYgAZjLq84+nEH4gBbDBK8s4WoyLvYgAbjLK85xajKO9iQO2qMd3I0WJU5F0M+Fve6TKSr5/eBRBCaDCEgFp73wR8tD/4FmAApzIO2OFrq3QAAAAASUVORK5CYII"},
		"trooper"                       : {"img" : null, "src" : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAACACAMAAACMX59YAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAABtQTFRFERERAMzMAIiIAP//zADMzMzMiACI/wD/////jJA9BQAAAAl0Uk5T//////////8AU094EgAAAdBJREFUeNrsmOuOhCAMhZWL7Ps/8c6Zhi2V4qg0Jjspfxwt/QaqcE5Yfi625d2aezPAIto4dV1jXFfuYQWoATTZgdNjDCGlGHNue9gAMLTwajTI+kumIwWtFPobSwCCKVGBKLQsKYlCvdMRAxoxXK0ACORcCpWxFqiUnCsC5aNeiCF126wBMWIKuKIhEa+LAehOUTyTJbYAhEBFxFUrFO5qFM94+DYAGuK21aHRlctEg0eRKS7TbQC8lEPgD5pfE15uneQ+3Qow2q7kQsc0lWVuChhto/QC++E/BeAiq7FHAIdwB3wV4Ky875ecFeCcvNOmKnvYADR575c0RfcWwwKgyfvOygl5J4vxt+1PA3R5bw1GL+8p8TRtAL28S4PRyzu2+EN/cAmgy3trMHp5P2EwTgN0eWeDcdMfXAJo8t4ajFv+4CLgaMu45Q9uA9wfuDb+H4CfH/j5gZ8f+PmBnx/4+YH7Awe4P3jKH9DGOuEPpgG1dDf9wTSgGoyb8j4NkAZDl3eawIE/mAaQwRjLO4n60B9MA9hgaPLeWgxV3qcBbDB0eZcWQ5X3acDoqLFdyNViDOR9GvBZ3ukj5uOnZwGEmDQYk4BReZ8EfLU/+BVgAIWAonnbaKbdAAAAAElFTkSuQmCC"},
		"gremkin"                       : {"img" : null, "src" : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAACACAMAAACMX59YAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAB5QTFRFERERAIiIAMzMiACIzADMAP//iIgA/wD/RGZm////W0dM4QAAAAp0Uk5T////////////ALLMLM8AAAGISURBVHja7JiNqsMgDEYTrdr7/i98yQ1ZtSq3NlkZLMI2sO3Bn+l3KvwoC3wdAF7lHQCpBJg/HkLO21ZKjK+7jQDUqBC4cfw7BiACEMIaALBtOSOGkFIIiHRLj6DH6SrhbQEApTAg/RUGlALQTh9fF0Q1jQYAHhQaPPnEWHeC6qSDAPveoE0AMRIAkRpJ31JzAHLmIQRIqR1eC8CxRPYdkRrYLheZZkK0zbcDtIt19BemiR5ftQXMl3GM7bA+DZh37jmAJ5MDPs0P3gm4Fu9nxbACnON9BpB4PxTDBtDH+3hrlXivFcMCMI536Db8Ot4vCMYSoI/3VjD6eP9XMBYBo3hvBeOGHywARvF+FoxlP1gEnAOsF4xFP7gNcD/wZHKAnx/4+YGfH/j5gZ8fuB94MjnA/eAT/aA+XLjlB2oAVSv8QA0QwbgZ72qAxIYi3tUAnpZ5vEsXpn6gBvDt83g/FGMY72rA/LW/V4xJvKsBVzYSmupRwD8HUAuGEsADrNrW3VDm5VeAAQDY8N0JDCAWYAAAAABJRU5ErkJggg"},
		"scrof"                         : {"img" : null, "src" : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAACACAMAAACMX59YAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAACdQTFRFERERzADMAIiIAMzMAP///wD/zMwAiACIiIgA//8Au5kARGZm////F7FlpgAAAA10Uk5T////////////////AD3oIoYAAAHWSURBVHja7JiNjoQgDISLPyDq+z/vZWzYoqKntjG5PUjMrlv4xIqdWWi+2Whp2bkhgD7tbKhzfe+c9LECIDQMfmnDUIIgPk1E/dIEYQMgQigEniQ+cb4e7j1R1xHF6JZmCUBiONg0bds0/H2VqGV4inrvHC5iBeAHEyN36DruFKMkCulDtOsQbVuc2wMwRQznTphmDpgm/JqiuEB+e3pACM5xkrjbNlH8cNMNEo0jrV8AJQAdQuA0ySFpkiRzAnGslpgBIE1yHHmpYIqSJn590k2up28HOCsoqYQ4d/CaGwKOyyiGhyDL922A3Fwx9grgFF4BXwa4Iu97i2EFuC7vW4thA7gj7xieWwwLQFneQ9gOT1G2GJ+yrwaU5R3SJoV9K+/eS4GzAmzlfW0wtvJ+wWDcApTlPQfs5f2CwbgMKMu7GIyH/uAWoCTvucF45A9uAvYFJTcYj/zBI0D1B1Ub/xKg7h/U/YO6f1D3D+r+Qd0/qP6gAqo/+C/+YJ4xROEP1AB0Th0eyLsakEuXwh+oAWfyzsvsxB+oAWIwSvKepOVQ3tUAMRhlec8txoG8qwHpz/5RQRGLgcsUi6oa8Lu8A1AW+DcAjFAaDCVgLyfvA77aH/wIMAACP/wBI6MAXgAAAABJRU5ErkJggg"},
		"limbo_tr"                      : {"img" : null, "src" : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAACACAMAAACMX59YAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAC1QTFRFERERAIiIAMzMAFVVAP//REREuwAARGZmqncAzLpnzMzMu7u7iIiIiDMA////Ovg/VgAAAA90Uk5T//////////////////8A1NyYoQAAAgRJREFUeNrsmYluwyAQRDGX7/z/5zbTFQLCuhEsctMKpMg2LC94MZ4JUY9nUc/yyEpZQ3XrqlTepjoAlPJ+WVRWlsX7HIGodV0WrY3ROrbJAQheV++pYZ7pSMHZUJUx3p+nMfNsbUTIAZQcNE8TnU2TMUWqFLqgOIcvQERPAKVl2/R32bZQE6cPV2jZdxzpy3oBUIG0KLXv1uIMQTijYWL6cEZRx+EcbrIvwBhrEeLccYSQUIcATDJu0D6Lc9Q5e5DEAEwbTZJzWqN7mig8UOeJGwQadXH4fQBg0LDyTwgjGLBc9z6A8DBTt/BAx2nC8qGbTKevLyB9aZUvN62xfMNiK150XQF8CZNaDv8uQEwy23YL4Ef4AHQC1Ml7f0CdvL/KnhxQK++0tAT+oABw8o6rKOC5vKMltRh9AKW8v6Qpk/fcYsgBvLzHNHHynlqMHgBO3lODwcn7W4NRBeDkPRoMXt7fGowKAC/vMU2N/qAKwMl7ajCa/EEl4FXec4PR4A+aAcMfDHn/S/5g7B98xv5BEJ1+gLF/MPYPxv7B2D8Y/mAAhj/4NH9AP/ZFfw+IAGG5NvsDMSCEN8q7GBANRrO8iwEhuNkfiAHBYFzJO+BkgVh5FwOiweDlPbUYF/IuBvA/+/OFHCzGhbyLAe/lPVqM3wBEiyEwGELAVXrvBPxrf/AlwACjlwsEsRSDewAAAABJRU5ErkJggg"},
		"limbo_cc"                      : {"img" : null, "src" : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAACACAMAAACMX59YAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAACdQTFRFERERAIiIAFVVAMzMzLpnqncAiDMAuwAAu5kAAP//RGZmd1UA////+UwfLQAAAA10Uk5T////////////////AD3oIoYAAAIPSURBVHja7JiNboQgEIRhQf6893/e3nRDEG+9ni6xaQNJU8+FT1iQGTGPZzHP8ujK6x2+570xfcwMABgT47KYrixLjD0CtbxfFueInGsxPQCVvY+RA6Xwf67cddUQxZgSUSk5N4QewMlB2Fq+spboJVUGTTiNeABqjAQQpWRMCOi29yEYk1I3yu/miGFYGAYeNgqAYClYIAiHgGq4LoW7ienDFcdiBH5dxwKIcuYhxJgzV0kp5wrAJDM+5xCs5WRvFpIagGkDAAjn0HybKDRElLuPe637YwBgWLuuHKh/LU1IMhESKzUfA6iLGcGaopYmJBlTimFwdLfNDAFsN63Xzc05vL5EGKaw0Q0FyIXTKHX/LkBLshi7BfAWPgGDAOfkfTzgnLzvF5UecF7ee4uhB0jyjl9NwHt5X9feYowBvMr7Lk2dvPcWQw+Q5b0ZDEnetxZjBECS963BkOQdW/xbf3AKIMt7NRiyvH9gMD4GyPLe0nTRH5wCSPK+NRiX/MFJwF7ee4NxwR9cBkx/MOX9L/mDeX4wzw/m+cE8P5jnB/P8YPqD6Q+mP7jHH/DHvkreVYD6ul72B2pANRgX5V0NaAajl/f3n//dQlIDqsG47A/UgGowjuQdj4CsHci7GtAMhizvW4txIO9qgPzZ37/I1WIcyLsa8LO8N4vxG4BmMRQGQwk4Su+dgH/tD74EGAAGXuxVPCoAHwAAAABJRU5ErkJggg"},
		"fleshripper"                   : {"img" : null, "src" : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAACACAMAAACMX59YAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAACFQTFRFERERREREZjNmZmZmAMzMAP//iIiIAIiIuwAAu7u7////wVG+ygAAAAt0Uk5T/////////////wBKTwHyAAAB7UlEQVR42uyY63KEIAyFWUXQff8Hbk+zWSJGrSTrTDsw0x+F+GnC5ZwlPEULP+152OqY4Ax4PDRAeSSEYZimGEuUJyCEcUxpi0A/etFinCYghuGNdAGEV0tpWVLi/2RiKQGO3uG7AZOzHwCdKAuCloUCYywfSUnQCFLB2CoFIyAElAQdCKA/+tBpKkEMp3LGmLMngEqCUo0jh+QslwsVmMZoVKZnByAUKTzejcrKKeAVhMfYPK+Xmh3AGwSfhcF5pgR4omiUX1A/7gNAEB6nzUzbRk4TTTPS0La7D+DoSKNpRpnl8vkUYO8YpTJqj98DKEVWx24BHMI7wBnwG3n/NOBM3rev8QScy7tmMXwAW3mvEyvyXlsMD4Am73XZpLyT8HISdoAu77XBqOW9HHAeAE3ea4OxlndK+dAfXAJo8i4NhibvpwbjAkCTdzaTITT6g4uArbyvDUaDP7gMqI+KtcFo8AfNgO4Pujr/HX/Q7w/6/UG/P+j3B/3+oN8fdH/Q/UH3B3f5gyIejf7ADGB70egPzAA2GI3ybgYUg7Ev74zYlXcjoBgMXd55Knf9gRlAwoUkNHmXFkOVdzNAGgxN3qXF2JF3M6D83NePtGIxZFq+gLNjFFMKiFxadwJ4u5kMhhFwJDl3Af61P/gSYABArtWhn2CaRwAAAABJRU5ErkJggg"},
		"cyborg"                        : {"img" : null, "src" : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAACACAMAAACMX59YAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAABVQTFRFERERAMzMAP//AIiIRGZm7lUi////sX+0sgAAAAd0Uk5T////////ABpLA0YAAAGnSURBVHja7JiNjgMhCIRF3Xv/R27oxIB/267YvbsGk+bSgl88gszE8HNxhedS37cBQrXmW1OKkUgydgFCyJkoPhdRzj0iBKKUci45JWMPgA+GDw6JT709Rv0v7AXw4WLkYxMhxAetCvXczjHA8XcXANuRIAXSheJIiaLAKd0N4HQd1a22A8BFkUMipRSsNBmyOHocdZvZATgiJ+d8HERIkDKhdRDnaNdiGwC4qKWBpamliXjht/6a7QHMxlVpI1wfjf0UYDZGsb0t330AGbjD2C2AU7gDvgrwrry3V24X4F15x7gx+IMJoJX3/uKKvLcWYwegl/cW0cq7thh2wExcVZkG8q6F71OAc3k3G4wKMJL3GtDL+0uDcQEwlncxGIv+4BKgl/faYCz4g8uAs5Gx5A+WAe4PXBv/D8DfD/z9wN8P/P3A3w/8/cD9gQPcH9zlD2SoLfoDM4B/NvgDMwBjc1nezYC/4A9GgEv+wAwoBmMs74KYyLsZIAZjLO/aYkzk3QyYPTXqRhaLMRyqZsBreReL8RsAsRgGg2EEzMp7J+Cr/cFDgAEAFIJ99RElVPwAAAAASUVORK5CYII"},
		"juggernaut"                    : {"img" : null, "src" : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAAEACAMAAABMJ46VAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAACFQTFRFERERAIiIAMzMu5kAzADMiIgAzMwA//8AAP///wD/////TYwrEgAAAAt0Uk5T/////////////wBKTwHyAAADI0lEQVR42uydgXKiMBBAQxFQ/v+Dz529vQ2YAPVUFnyZqbWWJK/ZTaDkjabxzSXdy+LvTw6Q0s9P0ywhnBtAupeyhBAPIC2W36ReSs29aPfHAfBq8yKvbkXQNqwteazXjAOQD7QNnXXt3W8JhU09/fKasQHyCeOD5inkr+txC0mVLGDW8XLw4gDkA938LZ5+09/UAaz7HNmDFx0gnzK+hEzB/Ljl7qdBOArAdNLYUOdTMIesd58H7kgA05Sx59b9+sKaD78HTo/te32MDPB4Gp5Ow7XTsodnmoZ69DDIY9cdC0Cb7PtS92WAxwXMIdp2JQkDAMwRtKFhKIWgfAlmKWql7zUdjwig00YqD4N1bq/VA5CfxjQMjq8ARfRAAI6g00aqtq0FQF+rLUHThdeWK0FYS8NYAONoA62HK4D/XFpO/WLOl+k8GPYnSAtdV8APBqAH1QCKDSS/dJlPWEOQem3b38vjchwNwBNRujQAC0DtQmx6MS+B8pRtmq4TBHmUduIDGIImjQ3f8j9kpX/k21Y71NDJ89vtci/zViICaIOSNArQ9/VTydqNDcWQdrTzIwFIt1Z0edp+a0bQ81ObD//1OkeICTCOMmha6XK53WQQn71NqyGUbiUAj2kYFUDS5/KvlBaQ7RASDmlFhv9IADppapPnmWCUuo8LIFWuV+1avr9q62LTySgMgCdheuNN/bgAjpDeu6kRGKCWNt8E8IkCAADnB8AfwB/AH8AfwB/AH8AfwB/AH8AfwB/AH8AfwB/AH8AfmG7fxwfAH8AfcAT8ge/2B6S5+fb9b27NvGD7fncA/IHXbd/LH7OrP/A0AP4A/gD+AP5APW2+CeAUW7cAALA7AP4A/gD+AP4A/gD+AP4A/gD+AP4A/gD+AP4A/gD+AP4A/gD+AP4A/gDvP3DM9x/QtNlx+353APwB/AGtgj+AP4A/gD9wkq1bAADYHQB/AH8AfwB/AH8AfwB/AH8AfwB/AH8AfwB/AH8AfwB/gM8vwB/AH8AfwB/g8wt4/4Gz+AOvuGn/X/7AxwHwB/AHcgT8gR03LvEHAADgE+WPAAMAEcFFlsddSpQAAAAASUVORK5CYII"},
	},

	//////////////////////////////////////////////////////////////////////////////
	// @ Weapons (usually required)
	//////////////////////////////////////////////////////////////////////////////

	"weap" : {
		// * File (raw)
		// "unarmed"                       : {"img" : null, "src" : "res/spr/weap/unarmed.png"},
		// "claw"                          : {"img" : null, "src" : "res/spr/weap/claw.png"},
		// "glove_sword"                   : {"img" : null, "src" : "res/spr/weap/glove_sword.png"},
		// "pistol_axe"                    : {"img" : null, "src" : "res/spr/weap/pistol_axe.png"},
		// "pistol_knife"                  : {"img" : null, "src" : "res/spr/weap/pistol_knife.png"},
		// "bloter"                        : {"img" : null, "src" : "res/spr/weap/bloter.png"},
		// "heavy_bloter"                  : {"img" : null, "src" : "res/spr/weap/heavy_bloter.png"},
		// "plasma_cannon"                 : {"img" : null, "src" : "res/spr/weap/plasma_cannon.png"},
		// "machine_gun"                   : {"img" : null, "src" : "res/spr/weap/machine_gun.png"},
		// "rocket_launcher"               : {"img" : null, "src" : "res/spr/weap/rocket_launcher.png"},
		// "grenade"                       : {"img" : null, "src" : "res/spr/weap/grenade.png"},
		// "dual_heavy_smg"                : {"img" : null, "src" : "res/spr/weap/dual_heavy_smg.png"}
		// * Data (base64)
		"unarmed"                       : {"img" : null, "src" : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAACACAMAAABqWpZZAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAA9QTFRFERERAIiIAMzMAP//////KiDcqAAAAAV0Uk5T/////wD7tg5TAAACd0lEQVR42uyc7XrDIAiF0e3+r3l1WZaPgpJiHgOe/msT0NdIjAdS+nb+IQAAAAAAAAAAJgUgI3wf+3kBUrJ1oJf9rAAp5ZySpfle9nMCEKVkmQI97SMASI5qDRBtR8faxwBYQuL/p9P3ltux9hEAzkFVCzH+yEj7GADHoDp/Oy8f3LFx9lEAdMtHubiW5ecO+5kAsCcGAAAAAAAAAAAAAADAcwCQH/ANYJPXU1q39/MCjJXXV/ErBsD1SzlaXt97iAHAC05KefvX1dUgb8vrLcTVQwQATlyVJUApnPYdqsnjckDqPCjldWcA50sqXT6NOF6352XbKx4U6rRLADnEzotPWxyvyeNSx3Qe1PK6ewAJyr74XAluXQ/mAeiy/SNrkc3gPbF7AKgSAAAAAAAAAAAAIA7AWHk9Z+f5ATPA2PL7DvK6c4DR5fdEOZvyA84B9sJT6YrFvhamMuJBXncPYCt/lyeDVV6vT7JDfsA9gKn8/W062OX12iTr/v7AAwCM5e9sesIur/NDcMP7A48AsJXPc5OIsy+22vJ7fghuen/gEQC6YJPEWQm4Haya22y9/ZkAOmz/kB/Aph4AAAAAAAAAgDAANBTe/N8q7gHsj2XO5fXBAFZx1r28PhjAXrzdo/y++CCKDKAv/r5nAFrF31+vz+ucAACcUKUXZ7eXQT4bAP68dg/WQYgB8C6vy8a64m97+X1b3l8GIQIA1wW5cV7cLUnP9gDInTrK+0sK9UL5vXsArTy7SOT8JCo3Nap4W6aJnOLYbP9uj9fK790D6IJNFmfbS9NiXUB1t0dt+zMBtPHa5+TcAtBPZwB8+hjcVwxwD/AjwABDVl1IbDJUlQAAAABJRU5ErkJggg"},
		"claw"                          : {"img" : null, "src" : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAACACAMAAABqWpZZAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAABhQTFRFERERZmZmu7u7REREiIiIAIiIAMzM////tS0CTQAAAAh0Uk5T/////////wDeg71ZAAAEAElEQVR42uyc65qjIAxAsWr3/d94NxPzhUsCapx2A/TnFJIcR9Ae0PDH+SdMgAkwASbA3dRhAtgArAW83+GB7CMD2ArY9xDW9X4Eyj4ugLWAELZtWe725+zjAtgKgP6v1/3+nH1kACwghPd7338DYN/1aYJ7+weAAu5Mk3EIGFJS21oE6I+9pfwQD6Keye4dQCqg1T0tYFm2LW/bjkD9tQNQnySi3u4BtAJakyQDrOuyUDgu//UqI2Ch/MG2kB/6pxHgFNEvlH0BSAXI3aUCsASOwMWnEWCwwmF5HR/uDflTCMx/Br8HgLwArbtWABWNEbj48gBQqXj5k/5OEHSJPJO9B4C4gPgWoRw4cgEMcVwZk39x2ab2DUc4m70PgLIAbfKqffv7GkbK3g/AVIsTYAJ8fkg+IYcnwH0xZlWT2H9kgG+qXY4wMoDlFLCKSfwRsP77jAtgOwmeAIAIIwNQCbqabGmxNn5LTW5bDwD3Coh/et6V6+0TqCUnQcj5B9D1+Dm9DkNZTtRaoCCJJS+QQFX1kwxj+AeQ5O41vb6uKKTacle6mdblLg7REQBKuXtVr8cAXPzPhT60hzO0yyFKgFTt8u2kf4BS7mp6PQ8RnwQ8JFmtp+mpt45AEPEUwQMaDinJ3UwtugdI5a6s1+tyPV/gyEvF3nyaaGpYW+CA/oj4c+sQCq3iHiCVu7Jer8n1GL81VPEgtKfo/ABqYrkfgBxEvvjUv2tPl3gKtCbXKxK/P4ApdyfABPhQ4uB897p7AKtenwDW7fdw+2HV66MD2PQ63NpZ+j+wxOQcwKrXa1v6zspl0xKTewDbEgWltwI8sD7gGMD6AIN1Gj7Uj3sA+/Z7TZFb9Hr7RqMfAOv2e1Z/aX+rXm/lry4xuQKwbr/PH4HQ9bomZGS9XuYvN+6rKzTOAOzb7zmCptdjwS5Jy1Sv5/nxhGI12RfAM9vvKUKJF/dntVtI8uST54e+fFDivz/2/MBXAZ7Yfk8RauI8PVXklpBdyt/Q6+4BuIll+/0ziv3qBv9+AKbcnQAT4MOJ5/rAl+20e73+HwBYX69j0+sTwCp3bXp9Atjlrk2v8xQwMoBV7tper2ReYnIAcF7u3gOw6nXcHO4fQNLrVrnbvllo6fVz+fHHv3cA+QGIK3K3TGjV6+fkei8A8gMQ9ZfjlD9I8EQgLaNtv88hwyGXU73OU6QsdXiD7jGI3QPkel2Wu1SAqvgCaVtZr+PEzBGgNR64WDnSN/kBzfV68pYz5wDl9nlt87eu12kwkt7VH3UABOyfvz6JsWS1n+p1fpSxB4Bcr+sbvGuv56EodclOMYQHGaLiWw9IxLcifQBwk7aMqreytLjy8p/kJWG+Af4KMADJaiLnLofpowAAAABJRU5ErkJggg"},
		"glove_sword"                   : {"img" : null, "src" : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAACACAMAAABqWpZZAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAB5QTFRFERERAIiIAMzMiIiIu7u7zMzMREREAP//ZmZm////ceGbigAAAAp0Uk5T////////////ALLMLM8AAAQbSURBVHja7JzZloMgDEBxqdr//+E5KYdhS0KUugTq0xyGAFfA6gU1793H62XMu+KoizdmnsN40x2AMdNU04Rvx/cHcB0ClSMeRD0C5BPpjHhjKMj4BLQNQHdi7SAox9MA8QloGUBaxDnxfPQ0ufh+AXwR58QvCzfIlmWaWgfgqxgGKGJZ+J+r4/ElwGHYtlYAqEx8FxoDTYD/w1918XgDueb76DYAhsF8DlkX2vyfQONTbJos/r9i48uL64cUCiDN3wbAMIyjb4L5pNHNX9dxjB7qzPg53FDi48OaPH6caoy/TJbqbwNgHNfVJ9tOwhrg8uYANt4NLjo+rCcuM2sW0fy0fv0ALjkeRHgX2nzpIHCDyE9lLN4OEzwaT8curnn9LQDYDos7Le9CO9lsI7HBEZeAxbsSytHU5ROrvw0A6aN4uRpJCXXR2YnpCOCZR48A9+r1H8Bdep1SBP0BXIGA38jNM3Z70yPA2Xqd+i+k5+BtA9yj17mljXwYtQxwl17n4kCXWYT/h6duAc7T6/zJWZZ5BrH7ryDUAxxr4pl6HQC2jSt525alaKfVAaRV3afXHTqtWUDbBCJUPYCTq/JJFuvxUOyW4yV63U7jWEGmeh2x04oBUrlL6/H3m1a7Mj0v0+swTXEFJtLrqgByuUrpcUqup8qV1uuxho9LjU+Bv0yWWtACAKZmMb1Oy3WvXen4UK/ngyiT5ugPrFivqwOgL3bH5Dqv1/PJeYJeVw9whlyvLaNSr6sHaEivqwf4rQ/0uT7wA3gqQo8AZ+n1YyW2DXClXj96UloGuFavc7nzG3R4tHnY+sDlAN/W63yJUNY8+wf9QCE0C3C9XucHkZ34DiLYYKgeoHb7PXXs1+ulYQnT2EOA+moFoG77vdVS+/R6Gu/TANqVSEVP07aB/P3SCxCPAKjZfu/iJXod/pOqxbB+0OowteltyB73ay9APALgmu33EFXS6zA5/fCQ1K8foH77PbbEkcb7gVbS65x8POn9gdsB6rff5xvrL9br6gHq5bhMm9+s19UDNKPXVQN8QwveqtfVA/zWB56xPlCrdm9fH1ADIPk8zh16vhcAfhu8pAG1ev4HQFdSVrv1er53AF70ldTufr2+9zJQaacVAHBytqx26/V8qflOG+gHoH+sSqqbr6Tu8zyS2xHQ7C0BxEqE3vydv5hghe3eScptvw+XUan6QZ69XnAS9APkep3+QBH+eR65ns8VDF4/vvk+rd8O0xYAsO3v+AeK7Bb6tHtjaUidAKcFY8GO6X17iRVuv1cPsGf7OzSf/sDO+jncBMO230MktcQRynm4AEj1fgsAcunK63VbePySFZ4nX+JIJzby6vm+9QFlANKfb06vU4sXcXw5F30jfvL6gAKA43h7c+25xVMP8CfAAL2OrnMJ2huCAAAAAElFTkSuQmCC"},
		"pistol_axe"                    : {"img" : null, "src" : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAACACAMAAABqWpZZAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAB5QTFRFERERu7u7iIiIREREzMzMZmZmAIiIAMzMExMT////NVr0bQAAAAp0Uk5T////////////ALLMLM8AAASUSURBVHja7JzrkqQgDIVpbXX6/V9450yWUiQXFG0EpWr3R2uAbwQMJ0H32Vjcb3n/lq777Co59s71fdc5F/zWLIBz/K9o+vVbrC7k2fPWr9cwAL7v2wdw7vXCw+avDAM6EVZ0pD1Zc797+NmyXYCuw+PSu6AB5NjDWrIly3n4tQswDPJEoy7wQ+QIe1yXbYeh750bR7K+J4A8zY6x1wB83R6hXQBrocR1rQs59gSgLxF+mW4bQF7oxhFuldXEXnuylmv3y3TrAPRPuo4u6ENovz0sYasv08YyWhFAfBuql5yx5cZEcn3z7edl0nK42wAYR0youUKY6i+qeDj4R7rPfm4fYH1v4QcbmuoBZudK2zzTXdzEc26a4OTa9p8PP3HD9nlrqf12AEIT7gHiQaOhnx/p1a7ZY6DACZO6Fv4BOEy+/TYAJJN44eNfTTEAb42hISHsbb8VgHRxz3ot6YWfnjnt3w0gv7iDW7wfQEl5/V4AJeX1LUtFqwAl5XXZFQd+4ousAYBS8vratV+7Emu4dgHKyOvYTL7fEgDCHu93CH5PgPPkdeqi5PARHiFcNMBxIEAZed0PEqlmIKD7lw1wHAzwfXmdOmj9aSjYeskAxy4A1kUqJK/Dxm87NXHXB1tbAQjF3e3y+DgeJ6+jHwCYJlumEdTp6gBicXWrPD5NywGh2/PhkFDeH4Zx1MMbqjpdKYAtj/Piup+Qy0VREshp+eTF3VBel+5KlNerA4iXUk4el8R177oFTi4rzyMQwom7J8jr1QGkTVbpxURbDS01wE92upND+IK8Xj2AJjilAPgFNu3eU+T16gG0ijXXbj0Q9nb/xPhARQBPfOAO8YEHoHT6/QNQOv1+00u0WYDvy+t6fVIa5j0BzpHXtTpRF216koN81QNsk8edC6veLq/TtJcQvOxOKd9wy73w1TZAqjzuj00tgWL75fVYiEENtLxyCBRcoqlPEF76ahkgVR4nB7nvl6+t2J7SBJbyY7gFgj2GyCxxheIi7sY1vyVayOvVA+Snz6M6ICy7F9pziEt5nSQTCqBSAI+T18M2DzwAURwgN/1+mqz0ey9o8ekdvn2ShOn/VIG9BYD89Pt1Y7E9rvtpJzt3fjjhzmFYD6ITzw9cAiAv/d4WazEtpUHBBVjilJtTzw8UBshNv08VtLQNi725OfH8wAUAcrfW3yqnnR+oBuB6pV0AacHLFceLy+uVAPDi7BZx/JLyelUAkjibJo5fWF6vBkCWBlPE8ePl9QdgjWBt+fPk+QfAEmftw7d58vwDYIm7eup3fvp+ikPSPoCWYqanfuen71sFrWd83ebyALa4ay2Buen7ehsU4lDiA5UBxJLG9o+7bP0DWJ/nmYeI7Kj8v6sJgPgAxJbPJ6TI66owEsn78yfA5EkMZ+Sv1QYAuCOw/AOU5XW4x1b6PaXVcx1bt++7p8nrCFj9pR40A2APGTkBP/6wHS/Po/ucC7FuHwAx6lpeX5zkqx4g//M8aNAWWujzX/wwDAcw3MA1wKnfFyoOkO7Gyp1LT/6271mGzY1F+GYA3ynpyfwNAPwTYADB1667d35oAQAAAABJRU5ErkJggg"},
		"pistol_knife"                  : {"img" : null, "src" : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAACACAMAAABqWpZZAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAACRQTFRFERERAIiIiIiIzMzMRGZmAMzMREREu7u7ZmZmAP//ExMT////32tmHgAAAAx0Uk5T//////////////8AEt/OzgAAA4ZJREFUeNrsnNuSgyAMQEHFyvb//3c3wzjlEm6bthhMn3YrAY5VkRNUPZl/lAAIgAAIgADcFECpuwNsm1JqWLy1xkD0fQGsXf8+yzImXmtj3A64K8CrgjHxSmm9LOv6V8dNAZSincDUeKiBdAhdCiBXUWsDY+PnAIATYt/PAPhd4CRr74DW+34clPj/tz8DAIQ8Hn4HtIZhBk6SsKHH49WM/70xx7Es9fjnE4vH2jfGWq3TUmn8PACvDrgfcdvWNSwMPzQ09POTdgC2lOOhW8cRtuN3LWwforctHvyw9ucAcE3Whhr4H2s+BcDi4b99h3I4QhydlsLbnwWgbxqH3xq0xAMC7RaEOKlnD/CuqThjrcIeQMSWAAiAAAiAAAjAuwBG6nWt35ChYQ4wWq9bS8zQMAcYr9eduJkB4D/VXEOvg7iZAyCUq72TP4inTB5xUWMMXmu8E2YASOVqrx6Hxlr1OCa14h0INUIiu/lWYgqAuh7H5fqZ4IAulOPd5RMX9P4OzMndZr3OECC+lOJ6PCfXYRuI8xMgr+chEYLJ3VivwzdxdJdeZwjQMtTk5Lrbsq4vgFw8nNhQElfntbY69Tp7gJ6hCQPIDXmtZVt7cC+AUsX4JTZX9nJWgj2AeCEBEAABEAABEIBvA4xdfn9Kg/sChHq8XxVS9Tp83vgABDuAUI+7SUoNwd/+Dr1OegSFPYB/yMBfMElMRUgY4SO2HHJnGg+vzVpSiulSAPTl87D0GxDSpcZ+93OIuO4t63VQNF6KiT0Adfm9MbXl96fQwqbzuF4vHUCuTDbFxA6Avvz+HFTy8bD9OHLqJW7fpTcwBRxiZlNMLAFoy+/Thd9xvDst8wB+ggVLb3z4+YHBANTl97Whrj50xWWxC+4Hnx+4AED7LcRXpomFVApxSskeQKyEAAiAAAiAAAjAVQCoclcAKAAglmiLvwfrdfYAVDlL1evG3B2Aunib/nofYoKDBcAnL5E0ve7LyxkAMH3S+3IXyg7AypU02HkZ9xIc7AFivZ5fvI1XVtfrRTGC6PXaDqwkOJgBYMvfMbmbW4DvXvtSX34PqSgf1N8St48dQKFeLyQ4mALEMg9f/F16PU99+T10P32NTKrX8QRHrNcLCQ52AK0Pw+VfzwPdD2/McD2/77nDsPYASnd+gBlA+y0A9eaupRye4MhchG8G8KWJek8qizvArwADAOZppM5D4Vg/AAAAAElFTkSuQmCC"},
		"bloter"                        : {"img" : null, "src" : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAACACAMAAABqWpZZAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAABhQTFRFERERAIiIREREZmZmiIiIzMzMAMzM////AGi50wAAAAh0Uk5T/////////wDeg71ZAAADVElEQVR42uyc24KjIAxAERn3//94N5PJRi5BLnYQjE8zrcGcFkQPsebP5JtRAAVQAAVQgEEAxijASABj9v0JCG8FMMa5r68ehF54in8nQH/629YHwPFvBIDhC+mfk7C27vAhQHv8+wCMsda5fT+OUyP/XitPwfzfzm22xq8BYMy2cRPOwRCFLR5ocKh9t9ZPALsVxUNr8iB1LtV+e/waAPi1bNtx2O9t/9nCRvCr9lP3h7Zz+cPL7bfGrwJwHhzHgQM0bgQQjyPdOMRRCuk9MDGp/db4lQB8EPkEJp3c4AA4xcnRciut8SsCtF/gwtZ+idcWrwCfulFRADVzCqAACqAACvDZKUsB+gB0fWAsgK4PrLY+UCd3H7g+8KsAvl7Hm/EOPd4bvwQAyt3S9EO9DtGsZksO78sxXy1LG7/vq8c1ALCR48C/Zb0O/8d6HQGco0Ok5SwkCTHWhgAs7XPxpJUh3sNfBIC0Uk6v07spLYgAkJqkhXGoQucLUzjHk8BNdyLYK8pqGQDGkPS6LNdxYrMW3pUmN0iNBXrqxBwvXMWnTthvbQDuTOWvM0Du0gIXsXDPFIKcOu/Bin1tgNaLu+upDNNMIwy1EtMDlHQBH/e+m1EFUDOnAAqgAArwVgBdHxgLoOsDYwFCvVtzMXdPB7x5fWAygDh9+L/sppBu0R+1PjAZQKzXrYUbylSp8jmKER+3PjAVQKzXSZbkTquQPiGG8vYWvT45QF/5PRYN5/U4yRSAPD86wUcv1+vB8sgSAL3l9/R6rmwchj4kGSZApwXQ6xCd1+vhw0frAPDlQFv5PatXaSBDnPT4BKlJOXnqWPHJYiWAa01Yf8kWfzwllya5eF5MXBdgyG1J8UfzkQUOBVAvpAAKoAAKMCGA2umxAGqnxwL0Fx8rQA/AHelPXn4/fIEj1ht12+DfF5ocADUUCUIUg3XpPGB94OEAstxlvc4/kuCr2brDUwvt5ftrAPh6XZa7Z70eI13pcYSOy+/7yvfXAAj1uiR303oWInFiy2lhLL7H6S9+AIL0en35/ioABBH/gFc4fFJ6ncuJ6/U4x1/r9VT5/koAJVOYVJgPHcC561jcUwJoKd9/F0A9WnrPdBdsK99XgN/+AMLy/ekB/gowAAZNTceEVp3GAAAAAElFTkSuQmCC"},
		"heavy_bloter"                  : {"img" : null, "src" : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAACACAMAAABqWpZZAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAACFQTFRFERERREREAIiIiDMAZmZmu7u7qncAiIiIAMzMzMzM////SLZPcgAAAAt0Uk5T/////////////wBKTwHyAAAEeklEQVR42uyc25qrIAyFsWht9/s/8O6a9aUoJ7VxhoJwaYVkKcc/seZf5cV0AV1AF3BhAaawfNi/sgBj5rmkBNq/rgBjxnGa5vnT2lrpt9vjMY7DcFUB4v6nbtxeRdd9H4/b7eW+uaYAuD/P4yi1h1c53oWM4vHNrwL3P5xGKxdgjLXTBPd/GjBw/9hgRo3xp+QlxH919j/cSnydgNjLxJW4AVa/342RYYgr9/s07XXfWgieXuX5NEn7HOY5++/NXAMC+EKt5SW8HgwSmAgbZnVrXeOov5Qgxv1uw/ZRm90HHclE7Fs7jlimsFDl7LckALeLE2JgGMTAsjpe/rK663CoDdNx97F00QJrYxmSRxDah2W0ssd+CwJkGKUMLKtDmO/+cthzeYv9/l76TbiIhfZjC13cfhsC1st7apnnq05tADitYosXX55SXStuP2UhtN+SAO0xhKbn+fmMb7P1h5joY72UgG886ncBnY12AV1AF1BOQI8PlBXQ4wNlBejwur4Ujg8UF6DF69oJoHh8oLCAEK8f7wDa6ePk+EBRAUdDDSFeP4J26f4+AQq8XpkAwtXw+LwHrzsgdWQCXGMtgNw4hDmE1ysWIHCVl9J4nRA3jtddoC8F19nNMPR8AahxCl6vVICDq3m8TrhNjO53AUima/EXL3CdeNZHu7S1jdch3LffhgD3etJ4XeB2iNfRBURAekKmBC6AYeBiD17n4M/i9coF+IA9nNhScJ1bO98t/54lgI/du43XKTOD16sXsLWwpxzcI8C5kAbwezwIHuyFBBxt+m9gQBfQ2WgX0AV0AeUE9PhAWQE9PlBWQI8PlBWwxuv5w+RvTAAnxweqE7DG62gGh5QtCcvf9XhdDlBXFBDidWufz2FgKne6Fu7hHVq8bszJ3w8UFqBLv8d99zu6UO5QT/d5j+8+r4TTZAqvw/0Tvx/4CgGa9HtBgqif7iACU1BzDdcFmbk69lXSeN3Hu20I0KXfE9sixJEODBHs0n1fHlP2+SDweKYJbcXwOuEm7jr1+4HiArTp9zBPsXjt8YHsRIZD3QU9aB8DNDaxsKMtA+ztCFjiwU/S7+X+HP6lyBxW3/pAUfC8F/hqSMA+hKvZgum2cBIO/LUPICoQ0MlcF9AFdAHfJcCYLqCkgNJwt3q8rhRQGu5Wj9eVAvTJ39pSPP2+qAA/+bvEFHxq+n2FAnAQd8eb7VSnsANojzbK+MDXC0gnfwteXCd/C5bc674Gr9N9wbstCAhRRhruhunXAsT2S9DhdfHgbb8JASFej8PdWPq7SECNdAdhN5PE1RhgX+P1cYzjdT5uAtD3droBAWu8noK7KbzO5G9uLFLp9w4cx9LvXdiaeB0J+CFeZ9u4uhHgqE6Aj9fTcFcS8OMBJAz5FHwUvI6pQT5hk0LhcG8Lr6MwBT8b4KhQgHuVOXybw+twKhfolmGKLuinfmPSdqn1ObwuHiwHd0sC9iztuca3Uz3opJtwZYAv/7Rt24N1/WsJOOcoHgteH0neV4SYvlHAfwEGANVWHvrhCQHsAAAAAElFTkSuQmCC"},
		"plasma_cannon"                 : {"img" : null, "src" : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAACACAMAAABqWpZZAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAACdQTFRFERERZmZmREREAIiIiDMAu7u7AMzMRGZmVSIAqncAiIiIuwAA////LAIQBAAAAA10Uk5T////////////////AD3oIoYAAASbSURBVHja7JyLkqMgFETRGGOS/f/v3XR1GB5y0XhTw4BQldraUaFbeZ6Lmn+VJ9MNdAPdwIkNmFcqKl4roHIDxtxuz2dJ+Sj/vAaMmabbK5WSP78Syj+rAci/XqfJKG6ArvpcXknRiCs3QPn3+3ERKFwjH7eO6s9owMk/KgKPf56/8/xbMGCSbYHdZOrvwzCOuNxWAzaoYYglSvLMO9n80+Wjm0zrsuX/TOYaMHC5jOMwWAl4PPytpwq4/PG4XsfRz9yYeUYOYRcXXzmO+Hcc4/xT5TOPfPktGZhn/BkHcGialoW/uArZy4dhLY8WIGua8PDj43L+UvmYrG2X34IBNiM+RCQ8nnnmQB3KsOekmifzQPOKpxiuirj8bfKv9Y+nl0up8tsw4Hdu7wHarCsBBh9IlIcfXi1ZYJKGr7D89PQtVX47BnYuoXcM/3apE1rgwKRewq9v7IkMfLzcNr+BYLqBzka7gW6gGyhnoMcHyhrQ4XW99cLxgeIGdHidCyaN/MLxgeIGtHg9B772lV84PlDYgI9Xj+UwjprlzVfjA3/AgPnwSezF63IlAR7Ryd+B16syQPAUnpZCixYShnidYolurcDLRRaAxu/DkTQMPoDXKzZg4aotQMLryJBwNcbr/i3A0Vz1icEXkYsLkSjweqUGHFzN43UHt9d4kXidg5vURUIkSoktWJS8hddxzgZer9aANZHH6xZup/Euzl6W+x0Fp4+74GoMH9d4fY0RcS1VZfB61QZCfBqLcHBbxutbE7wwpBHCR2O28TrlZ/F69QY2F9DZSQdExVj9m0BAiderN7CviBiqV0bmqjfQ2Wg30A10A79roMcHyhrQ4XUt3C0eHyhuQLv9Xrv1o/j7A4UNaPE6lidVxwcKG9Bvv5e3nu1LRAcF3x8oaiDE63iYn3aUy6LB61RAgNOGgfRSXcbrqe33qBR+BcnJh3kWHgKTdTcpITJAMJtDGwZ02+/tCxDTxP9P0zDIYVQ8fNwaZ8F2ifYW5PC6le8AbxsGtNvvOSwB7d5urB7pYYqFI9/n00e7NsBBFfL2e9qEgsfjqy9AFDbwje33zMEKSzU+4nEeWxZfGqsLhbnwVZwLFDnA7rqMNgz46PT49nsK8ztICc2u4b27gVL+OIeNPTynHQM7l9DZKZhRTdD35R7fwjMZ6GSuG+gGuoG/ZqA03D27gdIfh6n+8zxKA1q4W/n2++IG9B+HqXz7fXED+o/DaAMcyvhA9QZ0H4fB5thvhHgPxweqMCDBXeIpNN/jzRAAy4fBRzuRVgysF9My3CVeDDd/f4rXgcbXeD3VTcpbMLnF9j2Za8BAiNdluOvw7npbLGTZyge8LstnF2zPXgc4CHYlvG5DLJkAR4UGQrwuw93853lgGcGLZZEGKdgEPmcVXQc4WDlZfdN43QL2xyMT4KjOQIzX03CXjTP3eR7Kx0/afg9juD04y21SdgEOCmP1XeN1H7C7l1DaMOCGZnmA1+L11Pb7d0eYDHCkr2Yl8itxOwb2Tp/y2+/94N1Wbn5Huh3gCM+LXsM6iYF9orQBjvz1NsBxKMT0Nw38F2AA2e+/qvFI6koAAAAASUVORK5CYII"},
		"machine_gun"                   : {"img" : null, "src" : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAACACAMAAABqWpZZAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAACFQTFRFERERREREZmZmiIiIExMTAIiIu7u7cHBwAMzMzMzM////QvX8RwAAAAt0Uk5T/////////////wBKTwHyAAAEVUlEQVR42uyci5KrIAyGQT263fd/4NN/02yQa71sEQwzO7O1SPgUAv0TNd+NF6MACqAACqAAlQBMZXiyf18AYx6PmghfzwL7dwUwZp6H4QjCMXhj/j2LQbklgDHjOAzzbO0wvKbSxnZg/Ej3xxF9/7F/QwCcaC13HzcTRz7ZfVj+td8FgInOBmuXZZrC09HAOPLwIYBhKCFI+/ZVpHXfvrXGwE2m7A+DY78TAHwcR6qC/8ZxfpbQTeLk3+lj2KHRJ0YgBxcOGvo+1npof57ZTRbtdwHAE3N4lmmyNrzJcjocKJqQb3ga47bCvcWmKEGmW/ftczfL9nsB4MmJU9D0sow/xW2AbhymKybZuuFpwnFsL+Y57iKBkG/dtY9vUa9svx8AcWduCRcwmIh1kVxpeotnTL71vfb7Aigv4rn9KyH85c+cmP17AZQN8PLSqC7UPIAqcwqgAAqgAHcC0PhAXQCND9QF0PjAdeIDdCSUAPPlQvGBBgFCeR2iyie7f3p8oDqA/2OZRQ1f2hMBai2vkxj43qQNpUc6cmp8oEEAEu2oSlpexydf3sbRZSGk3ADhIAg657eKzp4QH2gY4D15ncMQobzOALy8xKYtBto0sQQfDqEPxAcuDVCW18VEKK6jW3BrOemRnG1cghenkZPXv77o8uyMD1wewG0oJm+nxXUXIL/92i7Br6c6dX9nfKAJgNJSFB8gAFiWx2NZ8hsEOn+/BB8Pi9wJIF2mCbf1vS312RK8AqgypwAKoAAKcFcAjQ/UBdD4QF0AX17fjnKx+EBjAL68vjX5+6i8+/19cnygMQBfXt+W+n1G90+OD1wA4Fj6PQHkEWSQhfIjHfHrp+R1FhhPfH7gEgD70+/pbPcSxJPveZil5HUWlSFApuV1vtgnPj9wCYCj6fdY1ugvLq9zEIpkWdQLhxA6jho5eV2kXWmhF4Aj6ffSfVpe4gsXXRKpt74wNHBwcQgkJa+TwOtKY/0AuPLptvR7cqsksqcWKJ56jBoGZadXAYwUf7Kj+zSI+wQobyJSAjtN0dIGAWcT6t5dMA3i0x+AaAZgO1qs3hF5PTKwFUCVOQVQAAWoBGCMAtQEqC3uNi+vHwQ4nvx9tFRPv68KECZ/f9oFnJ5+3xgA5Cn35Tyffj0Py2O74wMNAKSTv+l0/+UwW1/PczQBHwMY4osxfQD4P9TS4q4IYO7LYfCDfkv6vS+vQy7xa+fkdVxAQugHwJXX0+KuK6+74i4NqFL6Pb+ex9oYAORdsS9uMj28kwGOBgF8eT0u7q7l9fW2opx+T4gy+f1FyQ9whE6EWnYF9p4A5MbIlzFxN55+P88wmUu/pwcgKEncF4E5xLQOcPjyOuqQw6aLyG30AyAYOWmVbnI4sV3HmlsY4fr8mjzwJMBBg3ctr1MtCXH0CrBHwqXNdS68sXa4objuPt6CC+SHNsS63/27AeTB3pPX4wMtFVZKbWR2hpiuCPBfgAEA5CsT+la61k0AAAAASUVORK5CYII"},
		"rocket_launcher"               : {"img" : null, "src" : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAACACAMAAABqWpZZAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAB5QTFRFERERREREAIiIZmZmiIiIAMzMqncAiDMAu7u7////t7dNYQAAAAp0Uk5T////////////ALLMLM8AAARCSURBVHja7JyLsqMgDECjeFv3/394bzabyysBW+xFMJ3pdKY+kqNI6QkKfwZ/gQEYgAEYgAHcFADg3gAAzkFH/HX9+sL4dwUA2LZ937Z3Eda1DR7Tx30A3BOA0m9pRBT8/eYLsK77jvHnBdADACwLJr9t+Im7erVB4B62rYSPe9Xj/0sc/sefAIDfxwLgsufz8SAMDrYszoUNZF319JcF945NkDoBKT5epNRN1uLPAYAJ4AmRA5TT59ONCM8nbS+dflwDP2lrPDh8iPL4GJcaZj3+HAB4spxblsf36/n9igOEJx+/idMPEWiZTyUNjS9MCj8xHjfBND52ELRePf4MAHwSaee0MAwQX364i3yJ39I5eYjBTSJ8hQfg3fhzAHACWgA+0RhGSj/ufgHwR17++dd+9N6PPwvA0SEUVEawdPK1YTZA6xBOALsRwPGB2m/+1TQAE1sGYAAGYAAG0Cl1qw806fXW4Ub3+kBnAKsPXK0+8Op+2gA+UB/oCpDLVV6p9Jcl1Osk/M5Mv1GvDwdAcjXVI8f0OgM8HnGKereZJkdqMU1f1+sokUW9PjAAy1Va5TW97sUuby/LK1wDmxk1uzxdv02DXh8UIJSrZb1OcKleJyHLF7WcfqzfUwA6CM6doNcHBeAkuPyg622S2+kSAqahhdz9Epam38PoWnxuZgW9PjRAqk/TREK5LZU36MLTB9j+B0/W70f1eh5/LoDaAErX4zS0KA8QuIHU13wlg/sAHNn9sfXO1e8GYGLLAAzAAAzAADqlbvUBqw90BEj1+u/K3Q/UBwYDSPU6KavfAzi9PnBJgFf0eqp26+nXAEp6nTM48f6BzgBt0+8RAWFiUZLq9XiaayzOSUemDUTT6yzYT7t/4BIArdPvqUtlBKmBkE7Bb3Nl6ZWVPxyaXvcFjlPvH+gO0Db9HlUhvZ3TTvy6Ylr7TqDx9Hxf4MDUKLqk1xmTD+DPcHp4gNbp96TMf7o10LpFWgvf6Q0SYYGDBXoeHxsVDyBOvQHiAgCt0++5Iy1PCy/dwOhvUPEHMo8iCfZZAI4OoTTBfmxivVweyQ9hKYO0md4JwLSKARiAARiAARjAdQB6Pxxm+MfzNAK0Tv4efvp9Z4BzHg7Tmn73x/N8GKC2jOXuew2iq14fAKD2+Bz++x1O/j43/WN6fRaAXK/rctfr3Xjyd6oLS9PvU/nLuiRuICW9TnqN1NccAKle1yd/53I1vKTjn5h8S967VOAACMslJb1ODwJivTIHQK7XS5O/pcfzcImDTr5WmsLtSwUO6jp4amwuMXnycngIZwCQ9Lqs+LTH83CJg26P0qbf47as4dMuMy5wxA9Q8g2T1yrcgjIoQKrX5c6rptfLD+4Jp97n24cFDjpI0iOYfIkjuAlyEoCjQyhdr+viPO4E5D9BmBI1Gr1M5S/3sHndCeDTf9G5G6kfxDdLTNcE+CvAALD2vM+WoHv4AAAAAElFTkSuQmCC"},
		"grenade"                       : {"img" : null, "src" : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAACACAMAAABqWpZZAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAB5QTFRFERERAIiIAMzMiIiIZmZmu7u7zMzMREREAP//////pOTbVAAAAAp0Uk5T////////////ALLMLM8AAANMSURBVHja7JzreoMgDEBB25W9/wtv1FEhJFyMTonZv/ZrTA4qrodQ8z34n1EABVAABVAABbgpgGHC7xN/XwBreQXsFX9XAGunydr1ZPYWYy0PYM1/TwBj4gKM8QfrKWeaeiPo/BIAjFkuAnjAUoL108Y4Z+08Px6t8Sk+O78IAF/A8xlK8K+pU5wn8p9+Pr++5jlELwXCeP86xKbHYOYXATBNaQn0JBcnWg/6eMzz62VMSJ6n9+9isWES2J5fAkBaAv1gghcLfmKx9P495/BYbn4ZAPg0hp3qNFFtikuTl2K355cC0PoIb0m0f2zpGPcCUCuhAAqgAAqgAAqgAArQoj3+L17XB7ao3TR+W/bwxfWuAJHeNs5NU79ej/X8lssnHEECQJCrfeEfvf2W630ImHrsB/hcQgIAFrnaM83FIosSVrRe9/KxptdriB9RLAIgl6u43saXIaBsCoI3/uRyowf9Cxc4Ur3eV4EEAFgErbdxQR4vXAS5DuP9MlSIhUXAAeyrQAYAPCilZ2lBDqc3qNdhifXLsLUCKQAtj47tch0rsT49tFVwHwCuIOfLdbZeHx5ArYQCKIACKIACKIACKECbdjk+PkiD+wKc236/6/rAkABcPd6rg7GvlzutDwwJANvve1Hayi8NUaLXhwfgtt9TlxOv/b52kSZ6fXgAXvu9c17dxgVRW0za2u8xyEJ+EQCs9vffaBib691wU+LSFtPr+BAcsH/gAgDM9nckFov2JfkWfHwLBDwGNoQH7R+4BACv/b5N2y6bIOgtEPDGxi+1Q/YPXAKg9V8InmD3G4FqCyS9+e8FwP4CvsMix6lWYngA9UIKoAAKoACSAMyp8OzfVhkegCt3h9frJwNw5e7wev1kgJJ4+Z8BWCp4N9MKBmiTu1tux7YBqDV//ylNAQBQb5fkLvVlnTMAmF6vV/BpsRUBkOt1KhhfCEnbvUvN81Qpeft9Xe//tfOLAMj1NnXy8J/nyTc0YOnpQYF6n/4Rsab1geEA6q3Za2FYE32+FQ4bgNJtmf7EElyyKueXAcDV63hCbNpzjlo8ibexUDfwYesDFwBofWTh02jbQ89H+mWmWpsBPZQHrQ8MBNCfsuVBeAEvdCbAjwADAGNo8M/WRCjiAAAAAElFTkSuQmCC"},
		"dual_heavy_smg"                : {"img" : null, "src" : "data:image/png;base64,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"}
	}

};

// =============================================================================
// -----------------------------------------------------------------------------
// # Load
// -----------------------------------------------------------------------------
// =============================================================================

/**

	& LOAD RESOURCES

	Load ALL images before starting game (no matter if they are to be used or not)
	Prepare spritesets for convenience and to reduce the number of contingent HTTP Requests
	Display a progress bar using the 'onload' image event
	At entity spawn, set entity image as a reference of corresponding already loaded image

	This allows several things to be done:
	1) load images before starting the game
	2) display a precise progress bar of loaded images
	3) change all sprites sharing the same bitmap resource at once

	Images resources can be of two kinds:
	1) User Interface
	2) Sprites

	Logically, User Interface images should rely only on standard HTTP Request methods (should it be HTML images or CSS backgrounds)
	which means they are displayed when they are ready to be output (supposingly at window.load for every visible elements)
	On the other hand, Sprites should be pre-cached because those images are generated within the canvas
	and a loading latency result immediately in a game experience decrease
	Issue is for CSS background images of invisible elements
	If only sprites are pre-cached, those images will be requested when the element holding them is turned to visible
	This can produce a slight 'blank' (especially true for 'cursor' images which can't be defined in spritesets)
	An elegant solution could be to simply display an outside 'main' progress bar on page load,
	then charge all images (User Interface + Sprites) and when ready start main process
	In that configuration, 'main' container should start hidden

*/

////////////////////////////////////////////////////////////////////////////////
// @ Display
////////////////////////////////////////////////////////////////////////////////

function setTitle() {
	let q = document.getElementById("title");
	q.querySelector("#stage").innerHTML = prog.stage;
	q.querySelector("#version").innerHTML = prog.version;
}

function showSpinner() {
	let q = document.getElementById("spin");
	q.style.display = "";
	clearTimeout(main.load.spin.hide);
	main.load.spin.show = setTimeout(function() {
		q.style.opacity = "";
	}, 125);
}

function hideSpinner(f) { // f = callback function
	if (f === undefined) f = function() {};
	let q = document.getElementById("spin");
	q.style.opacity = "0";
	clearTimeout(main.load.spin.show);
	main.load.spin.hide = setTimeout(function() {
		q.style.display = "none";
		f();
	}, 125);
}

function showMain(t) { // t = timeout (ms)
	let q = document.getElementById("main");
	q.style.display = "";
	clearTimeout(main.load.main.hide);
	main.load.main.show = setTimeout(function() {
		q.style.opacity = "";
	}, t !== undefined ? t : 250);
}

function hideMain(t) { // t = timeout (ms)
	let q = document.getElementById("main");
	q.style.opacity = "0";
	clearTimeout(main.load.main.show);
	main.load.main.hide = setTimeout(function() {
		q.style.display = "none";
	}, t !== undefined ? t : 250);
}

////////////////////////////////////////////////////////////////////////////////
// @ Routine
////////////////////////////////////////////////////////////////////////////////

function loadResources(s, p, f) { // s = resource stack, p = progress key (spin or load), f = callback function

	if (f === undefined) f = function() {};

	// * Reset load variables
	main.load.count = 0;
	main.load.index = 0;

	// * Prepare progress
	var o, q;
	if (p == "spin") {
		o = document.getElementById("spin");
	} else if (p == "load") {
		o = document.getElementById("load");
		q = o.querySelector(".progress div");
		o.querySelector("p").innerHTML = lang["loading"];
		o.style.display = "";
	}

	// * Set loading variables
	var l = s,  a = [];
	let k, u;

	// * Count number of resources
	for (k in l) {
		for (u in l[k]) {
			a.push([k, u]);
			main.load.count++;
		}
	}

	console.info("%cloading " + main.load.count + " "+ (p == "spin" ? "user interface" : "sprites") + " resources", conf.console["debug"]); // DEBUG

	// * Set function
	function loadImage(key, sub) {
		// console.log("loading " + key + " " + sub + "..."); // DEBUG
		l[key][sub].img = new Image();
		l[key][sub].img.src = l[key][sub].src;
		l[key][sub].img.onload = function() {
			main.load.index++;
			if (p == "spin") {
				let v = Math.round(main.load.index / main.load.count * 400);
				let d = Math.round(1 / main.load.count * 400);
				let r = conf.main.load.spin.rgb[0];
				let g = conf.main.load.spin.rgb[1];
				let b = conf.main.load.spin.rgb[2];
				let c = (r + (255 - r) / 400 * v) + "," + (g + (255 - g) / 400 * v) + "," + (b + (255 - b) / 400 * v);
				if (v <= 100) {
					if (v + d >= 100) v = 100;
					q = o.querySelector("span:nth-of-type(1)");
					q.style.width = v + "%";
				} else if (v > 100 && v <= 200) {
					if (v + d >= 200) v = 200;
					q = o.querySelector("span:nth-of-type(2)");
					q.style.height = (v - 100) + "%";
				} else if (v > 200 && v <= 300) {
					if (v + d >= 300) v = 300;
					q = o.querySelector("span:nth-of-type(3)");
					q.style.width = (v - 200) + "%";
				} else {
					if (v + d >= 400) v = 400;
					q = o.querySelector("span:nth-of-type(4)");
					q.style.height = (v - 300) + "%";
				}
				o.querySelectorAll("span").forEach(function(e) {
					e.style.backgroundColor = "rgb(" + c + ")";
				});
			} else if (p == "load") {
				q.style.width = Math.round(main.load.index / main.load.count * 100) + "%";
			}

			// console.log("image " + main.load.index + " of " + main.load.count + " loaded -- " + (Math.round(main.load.index / main.load.count * 400))); // DEBUG

			if (main.load.index == main.load.count) {
				if (p == "load") o.style.display = "none";
				f();
			}
		}
	}

	// * Load images
	var i = 0; // TEST
	var j = 0;
	while (i < main.load.count) {
		// -------------------------------------------------------------------------
		// * TEST : load resources
		// -------------------------------------------------------------------------
		setTimeout(function() {
			loadImage(a[j][0], a[j][1]);
			j++;
		}, (p == "spin" ? conf.main.load.spin_latency * i : conf.main.load.load_latency * i));
		// -------------------------------------------------------------------------
		// * STABLE : load resources
		// -------------------------------------------------------------------------
		// loadImage(a[i][0], a[i][1]);
		// -------------------------------------------------------------------------
		i++;
	}

}

////////////////////////////////////////////////////////////////////////////////
// @ Event
////////////////////////////////////////////////////////////////////////////////

window.addEventListener("load", function() {

	disableToolButtons(true); // TEMP
	disableActionButtons(); // TEMP

	// game.map = "_01"; // TEMP (original map)
	game.map = "m01"; // TEMP (resized map)

	spr.back.board.src = maps[game.map].board;

	dockMain(true); // TEMP

	hideMain(0);
	showSpinner();

	loadResources(ui, "spin", function() {

		hideSpinner(function() {
			showMain(0);
			resetCursor();
			main.shown = true;
		});

		loadResources(spr, "load", function() {
			startScene();
			showStatus();
			setTitle();
			main.ready = true;
		});

	});

});

// =============================================================================
// -----------------------------------------------------------------------------
// # Screen
// -----------------------------------------------------------------------------
// =============================================================================

////////////////////////////////////////////////////////////////////////////////
// @ Drag
////////////////////////////////////////////////////////////////////////////////

document.getElementById("main").addEventListener("mousedown", function(e) {
	if (!main.screen.enlarged && e.button == 0 && e.target == this) { // left mouse button
		let q = document.getElementById("main");
		q.style.transition = "none";
		main.mouse.x = e.clientX - q.offsetLeft;
		main.mouse.y = e.clientY - q.offsetTop;
		main.mouse.down = true;
	}
});

document.addEventListener("mouseup", function() {
	if (main.mouse.down) {
		let q = document.getElementById("main");
		q.style.transition = "";
		main.mouse.down = false;
		if (!main.screen.enlarged) resetCursor();
	}
});

document.addEventListener("mousemove", function(e) {
	if (!main.screen.enlarged && main.mouse.down) {
		if (main.screen.docked) {
			main.screen.docked = false; // set main screen undocked
			showHint(lang.undocked); // advertise user
		}
		let q = document.getElementById("main");
		q.style.left = Math.round(e.clientX - main.mouse.x) + "px";
		q.style.top = Math.round(e.clientY - main.mouse.y) + "px";
		updateCursorState("grabbing");
	}
});

////////////////////////////////////////////////////////////////////////////////
// @ Move
////////////////////////////////////////////////////////////////////////////////

function moveMain(b, f, g) { // b = center flag, f = force flag, g = ground flag (ignore toolbar)

	let q = document.getElementById("main");
	let s = document.getElementById("spin");
	let t = document.getElementById("tool"); // DEBUG
	let u = document.getElementById("tool_menu"); // DEBUG

	let w = window.innerWidth;
	let h = window.innerHeight;

	let min_x, min_y;
	let adj_x, adj_y;
	let x, y;

	let pad = conf.main.load.spin.padding; // spinner padding

	let rim_t = conf.main.screen.margin.top;
	let rim_l = conf.main.screen.margin.left;
	let rim_r = conf.main.screen.margin.right;
	let rim_b = conf.main.screen.margin.bottom;

	min_x = min_y = adj_x = adj_y = x = y = 0;

	if (!g) {
		if (t.classList.contains("open")) { // DEBUG
			min_x = t.clientWidth;
			adj_x = min_x;
			x = min_x;
		} else {
			rim_l += u.clientWidth;
		}
	}

	let c1 = q.offsetLeft < min_x + rim_l; // out of left or covered by tool
	let c2 = q.offsetLeft + q.offsetWidth > w - rim_l - rim_r; // out of right
	let c3 = q.offsetTop < min_y + rim_t; // out of top
	let c4 = q.offsetTop + q.offsetHeight > h - rim_t - rim_b; // out of bottom

	if (b) { // center
		x = Math.max(min_x, x + Math.round((w - q.clientWidth - adj_x) / 2));
		y = Math.max(min_y, y + Math.round((h - q.clientHeight - adj_y) / 2));
	} else { // dock
		x = rim_l + adj_x;
		y = rim_t + adj_y;
	}

	if (f || c1 || c2) { // move horizontally
		if (!main.shown) s.style.left = (x + pad) + "px";
		q.style.left = x + "px";
	}
	if (f || c3 || c4) { // move vertically
		if (!main.shown) s.style.top = (y + pad) + "px";
		q.style.top = y + "px";
	}

}

function dockMain(f, g) { // f = force flag, g = ground flag
	moveMain(false, f, g);
}

function centerMain(f, g) { // f = force flag, g = ground flag
	moveMain(true, f, g);
}

document.getElementById("main").addEventListener("dblclick", function(e) {
	if (!main.screen.enlarged && !main.screen.docked && e.target == this) {
		main.screen.docked = true; // set main screen docked
		showHint(lang.docked); // advertise user
		dockMain(true);
	}
});

////////////////////////////////////////////////////////////////////////////////
// @ Resize
////////////////////////////////////////////////////////////////////////////////

function resizeMain(b, s) { // b = enlarge flag, s = silent flag
	let p = document.getElementById("page");
	let q = document.getElementById("main");
	if (b) { // enlarge
		// 1. Hide background color
		p.style.backgroundColor = "transparent";
		// 2. Set main screen enlarged
		main.screen.enlarged = true;
		// 3. Register current position
		main.screen.x = q.offsetLeft;
		main.screen.y = q.offsetTop;
		// 4. Maximize main size
		let m = conf.main.screen.enlarged.margin;
		let w = (window.innerWidth - m.left - m.right) / q.offsetWidth;
		let h = (window.innerHeight - m.top - m.bottom) / q.offsetHeight;
		let n = Math.max(Math.min(w, h), 1); // minimum scale set to 1 (i.e. no size reduction) -- TEMP
		q.style.transform = "scale(" + n + "," + n + ")";
		// 5. Set main screen scale
		main.screen.scale = 1 / n;
		// 6. Center main
		centerMain(true, true);
	} else { // reduce
		// 1. Show background color
		p.style.backgroundColor = "";
		// 2. Reset main size
		q.style.transform = "";
		// 3. Restore position
		if (main.screen.docked) dockMain(true);
		else {
			q.style.left = main.screen.x + "px";
			q.style.top = main.screen.y + "px";
		}
		// 4. Reset main screen scale
		main.screen.scale = 1;
		// 5. Unset main screen enlarged
		main.screen.enlarged = false;
	}
	if (!s) showHint(b ? lang.enlarged : lang.reduced); // advertise user
}

document.getElementById("screen_enlarge").addEventListener("click", function() {
	// if (main.pause) return;
	let p = document.getElementById("page");
	if (!this.classList.contains("active")) {
		// * Active enlarge button
		this.classList.add("active");
		// * Request browser fullscreen
		if (conf.main.screen.enlarged.fullscreen) requestFullscreen(p);
		// * Enlarge main screen
		resizeMain(true);
	} else {
		// * Unactive enlarge button
		this.classList.remove("active");
		// * Exit browser fullscreen
		if (conf.main.screen.enlarged.fullscreen) exitFullscreen(p);
		// * Reduce main screen
		resizeMain();
	}
});

window.addEventListener("resize", function(e) {
	if (mdal.active) centerModal();
	if (main.screen.enlarged) {
		if (conf.main.window.resize_delay > 0) {
			clearTimeout(main.window.timeout);
			main.window.timeout = setTimeout(function() {
				resizeMain(true, true);
			}, conf.main.window.resize_delay);
		} else {
			resizeMain(true, true);
		}
	}
});

// =============================================================================
// -----------------------------------------------------------------------------
// # Cursor
// -----------------------------------------------------------------------------
// =============================================================================

function updateCursor(b) { // b = change state flag (remove cursor if not true)
	let q = document.getElementById("main");
	q.classList.remove(
		"pointer",
		"click",
		"grab",
		"grabbing"
	);
	if (b) q.classList.add(main.cursor.state);
}

function updateCursorState(state) { // state = string (pointer, click, grab or grabbing)
	if (!main.pause) {
		main.cursor.state = state;
		updateCursor(true);
	}
}

function resetCursor() {
	if (!isScrollLocked && term.mouse.hover) updateCursorState("grab"); // TEMP
	else updateCursorState("pointer");
}

function removeCursor() {
	updateCursor();
}

// =============================================================================
// -----------------------------------------------------------------------------
// # Mouse
// -----------------------------------------------------------------------------
// =============================================================================

document.getElementById("main").addEventListener("contextmenu", function(e) {
	e.preventDefault(); // WARNING
});

document.addEventListener("mouseup", function(e) {
	if (main.ready && !mdal.active && !main.pause) {
		if (e.button == 0) { // left mouse button
			if (!scen.scrl.mouse.active && main.cursor.state != "pointer") updateCursorState("pointer");
			fire();
		} else if (e.button == 1) { // middle mouse button
			resetScale();
		} else if (e.button == 2) { // right mouse button
			cancel();
		}
	}
});

document.getElementById("main").addEventListener("mousedown", function(e) {
	if (e.button == 0) { // left mouse button
		if (!scen.scrl.mouse.active && main.cursor.state != "click") updateCursorState("click");
	}
});

document.addEventListener("wheel", function(e) {
	if (main.ready && !mdal.active && !e.ctrlKey) { // TEMP
		e.preventDefault(); // WARNING
		// console.log("wheel: deltaX " + e.deltaX + " -- deltaY " + e.deltaY + " -- deltaZ " + e.deltaZ + " -- deltaMode " + e.deltaMode); // DEBUG
		if (e.deltaY > 0) zoomOut(); // wheel down
		else zoomIn(); // wheel up
	}
});

// =============================================================================
// -----------------------------------------------------------------------------
// # Pause
// -----------------------------------------------------------------------------
// =============================================================================

function startPause() {
	main.pause = true;
	lockScroll();
	lockZoom();
	lockButtons();
	document.getElementById("main").classList.add("pause");
	document.getElementById("roll").querySelectorAll(".die").forEach(function(e) {
		if (e.style.animationPlayState == "running") e.style.animationPlayState = "paused";
	});
	showIcon("pause");
	removeCursor()
	scen.stop();
}

function stopPause() {
	main.pause = false;
	unlockScroll();
	unlockZoom();
	unlockButtons();
	document.getElementById("main").classList.remove("pause");
	document.getElementById("roll").querySelectorAll(".die").forEach(function(e) {
		if (e.style.animationPlayState == "paused") e.style.animationPlayState = "running";
	});
	hideIcon("pause");
	if (term.mouse.down) updateCursor("grabbing");
	else if (term.mouse.hover) updateCursor("grab");
	else resetCursor();
	scen.continue();
}

// =============================================================================
// -----------------------------------------------------------------------------
// # Save
// -----------------------------------------------------------------------------
// =============================================================================

////////////////////////////////////////////////////////////////////////////////
// @ Save Game
////////////////////////////////////////////////////////////////////////////////

function saveData(k, s) { // k = savegame key, s = base64 encoded thumbnail
	// * Set vars
	let save = {
		"img" : "data:image/png;base64," + s,
		"time" : Date.now(),
		"setup" : setup,
		"game" : game,
		"main" : {
			"ctrl" : main.ctrl,
			"pause" : main.pause
		},
		"scen" : {
			"frame_count" : scen.frame_count,
			"screen" : scen.screen,
			"zoom" : scen.zoom
		},
		"term" : {
			"choice" : term.choice
		},
		"tool" : {
			"toggle" : tool.toggle
		},
		"pawn" : pawn
	};
	// * Save vars
	setLocalStorageItem(k, save);
	// * Show caption
	showCaption(lang["game_saved"]);
	console.info("%c" + k + " saved (data registered in web storage)", conf.console["debug"]); // DEBUG
}

function getSaveGameThumbnail(k) { // k = savegame key
	scen.canvas.toBlob(function(blob) {
		let reader = new FileReader();
		reader.readAsBinaryString(blob);
		reader.addEventListener("loadend", function() {
			saveData(k, btoa(this.result))
		});
	});
}

function saveGame(k) { // k = savegame key
	if (main.save.forbidden) {
		showCaption(lang["game_save_forbidden"]);
	} else if (!main.save.prevented) {
		if (main.save.pending) {
			hideWait();
			main.save.pending = false;
			main.save.savekey = null;
		} getSaveGameThumbnail(k);
	} else {
		hideCaption();
		showWait();
		main.save.pending = true;
		main.save.savekey = k;
		console.info("%c" + k + " pending (data will be registered in web storage later)", conf.console["debug"]); // DEBUG
	}
}

////////////////////////////////////////////////////////////////////////////////
// @ Load Game
////////////////////////////////////////////////////////////////////////////////

function loadGame(k) { // k = savegame key
	if (!hasLocalStorageItem(k)) {
		console.warn(k + " loading failed (no such data registered in web storage)"); // DEBUG
	} else {
		// * Load vars
		let save = getLocalStorageItem(k);
		let date = new Date (save.time);
		// * Stop scene
		scen.stop();
		// * Restart scene
		restartScene(save.game, save.main, save.scen, save.term, save.tool, save.pawn);
		// * Show caption
		showCaption(lang["game_loaded"]);
		console.info("%c" + k + " loaded (data retrieved from web storage) [" + date.toLocaleDateString() + " " + date.toLocaleTimeString() + "]", conf.console["debug"]); // DEBUG
	}
}

// =============================================================================
// -----------------------------------------------------------------------------
// # Storage
// -----------------------------------------------------------------------------
// =============================================================================

function showStorageReport(s, c) { // s = string, c = css class
	let o = document.getElementById("report_storage"); // TEMP : toolbar element for now
	let u = o.querySelector("span");
	c == null ? o.removeAttribute("class") : o.setAttribute("class", c);
	u.innerHTML = s;
	u.style.opacity = "";
	u.style.transition = "opacity " + conf.storage.report.duration.show + "ms";
	clearTimeout(main.storage.timer);
	main.storage.timer = setTimeout(hideStorageReport, conf.storage.report.delay);
}

function hideStorageReport() {
	let o = document.getElementById("report_storage"); // TEMP : toolbar element for now
	let u = o.querySelector("span");
	u.style.opacity = "0";
	u.style.transition = "opacity " + conf.storage.report.duration.hide + "ms";
	clearTimeout(main.storage.timer);
}

function loadStorageFile() {
	document.getElementById("browse_storage").click(); // WARNING : placed in a dummy container displayed off-page
}

function getStorageTable() { // returns array
	return conf.storage.roaming.concat(conf.storage.save_slots);
}

function isValidStorageTable() { // returns boolean
	let l = getStorageTable();
	for (k in l) if (!hasLocalStorageItem(l[k])) return false; // missing key
	return true;
}

function isValidStorageFormat(v) { // v = storage data ; returns boolean
	if (typeof(v) != "object" || Array.isArray(v)) return false; // not javascript object
	let l = getStorageTable();
	for (k in v) if (l.includes(k)) return false; // missing key
	return true;
}

function exportStorage() {
	hideStorageReport(); // TEMP
	if (!isValidStorageTable()) {
		showStorageReport(lang.storage.wrong_data_table, "error");
		console.error("Storage export failed: invalid storage table"); // DEBUG
	} else {
		let o = document.getElementsByTagName("body")[0];
		let a = document.createElement("a");
		let r = {};
		let l = getStorageTable();
		for (k in l) r[l[k]] = getLocalStorageItem(l[k]);
		let blob = new Blob([JSON.stringify(r)], {type : "application/json"});
		let url = window.URL.createObjectURL(blob);
		o.appendChild(a);
		a.setAttribute("href", url);
		a.setAttribute("download", conf.storage.filename + ".json");
		a.click();
		o.removeChild(a);
		showStorageReport(lang.storage.export_success);
		console.info("%cStorage export succeed", conf.console["debug"]); // DEBUG
	}
}

function importStorage() {
	hideStorageReport(); // TEMP
	if (this.files.length == 0) {
		showStorageReport(lang.storage.no_file, "error");
		console.error("Storage import failed: file input empty"); // DEBUG
	} else {
		// * File API
		let file = this.files[0]; // only first in list ; no multiple selection allowed
		if (file.type != "application/json") {
			showStorageReport(lang.storage.wrong_file_type, "error");
			console.error("Storage import failed: file type is not JSON"); // DEBUG
			return;
		}
		if (Number.isInteger(conf.storage.filesize_max) && file.size > conf.storage.filesize_max) {
			showStorageReport(lang.storage.wrong_file_size, "error");
			console.error("Storage import failed: file size greater than "+ (conf.storage.filesize_max / 1000000).toPrecision(4) + " MB");  // DEBUG
			return;
		}
		// * FileReader API
		let reader = new FileReader();
		reader.readAsText(file);
		reader.addEventListener("loadend", function() {
			let v = this.result;
			try {
				v = JSON.parse(v);
				if (!isValidStorageFormat(v)) {
					hideStorageReport();
					for (k in v) setLocalStorageItem(k, v[k]);
					showStorageReport(lang.storage.import_success);
					console.info("%cStorage import succeed", conf.console["debug"]); // DEBUG
				} else {
					showStorageReport(lang.storage.wrong_data_format, "error");
					console.error("Storage import failed: invalid storage format"); // DEBUG
				}
			} catch (e) {
				showStorageReport(lang.storage.wrong_data_type, "error");
				console.error("Storage import failed: file parsing exception"); // DEBUG
			}
		});
	}
}

function clearStorage() {
	localStorage.clear();
	showStorageReport(lang.storage.data_cleared, "warning");
	console.warn("Storage cleared! All game data erased ; please reload the document or import a previously exported storage before continue playing"); // DEBUG
}
