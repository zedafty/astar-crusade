/*

	tips.js

*/

// =============================================================================
// -----------------------------------------------------------------------------
// # Notes
// -----------------------------------------------------------------------------
// =============================================================================

/**

	& TIPS

	# Keys
		Attribute 'data-tip' is used as string key.
		If left empty, then attribute 'id' is used instead.

	# Timeouts
		Tips need to be shown even when the game is paused.
		So timeouts are regular 'Window' objects and not 'Scene' properties.

	# Uncovered cases
		Big elements: target are meant to be mere small element (i.e. not container) ; for big elements, the tip needs to be displayed inside the target, and not outside.
		Long texts: texts should be all pre-generated, so long texts should be avoided during development ; if any, the text will simply overflows the tip to the right.
		Resize events: tips aren't re-positioned after any resize event ; if the cursor remains on a displaced element, then the tip should remain in place.
		Window overflow: if the tip overflows the whole window in any axis for any reason then its coordinate in that axis is set to 0 (i.e. the top left corner is always visible, but the bottom right corner could not be).

*/

// =============================================================================
// -----------------------------------------------------------------------------
// # Module
// -----------------------------------------------------------------------------
// =============================================================================

var tips = {

	//////////////////////////////////////////////////////////////////////////////
	// @ Accessors
	//////////////////////////////////////////////////////////////////////////////

	"mouse" : {
		"move" : 2
	},

	"delay" : {
		"first" : 1000, // milliseconds -- first show => time elapsed pointer on of any tipped element before showing tip box -- Default : 3000
		"later" : 0, // milliseconds -- later show => time elapsed pointer on of any tipped element before re-showing tip box when tip box was previously shown -- Default : 0
		"reset" : 500 // milliseconds -- reset to first => time elapsed pointer out of any tipped element -- Default : 500
	},

	//////////////////////////////////////////////////////////////////////////////
	// @ Mutators
	//////////////////////////////////////////////////////////////////////////////

	"active" : false,

	"timer" : {
		"show" : null,
		"hide" : null
	}

}

// =============================================================================
// -----------------------------------------------------------------------------
// # Functions
// -----------------------------------------------------------------------------
// =============================================================================

function getTip(v) { // v = tip variable ; returns string
	if (typeof(v) == "string") { // mono
		return "<p>" + v + "</p>";
	} else if (typeof(v) == "object") {
		if (Array.isArray(v)) { // multi
			let k, r = "";
			for (k in v) r += "<p>" + v[k] + "</p>";
			return r;
		} else { // fstr, mono or multi
			let k, n, r = "", a = [];
			for (k in v) {
				if (k == "tip") {
					if (typeof(v[k]) == "string") { // mono
						r = "<p>" + v[k] + "</p>";
					} else if (Array.isArray(v[k])) { // multi
						for (n in v[k]) r += "<p>" + v[k][n] + "</p>";
					}
				} else if (k == "var") { // fstr
					for (n in (v[k])) {
						if (n == "kbd" || n.substring(0, n.length - 1) == "kbd") {
							a.push(createModalMenuKeyString(v[k][n])); // WARNING : function belonging to 'mdal'
						} else {
							a.push(v[k][n]);
						}
					}
				}
			} if (a.length > 0) r = fstr(r, a);
			return r;
		}
	}
}

function setTipPosition(o, u) { // o = target element, u = tip element

	let q = u.querySelector(".tail");
	let r = o.getBoundingClientRect();
	let w = u.offsetWidth;
	let h = u.offsetHeight;

	let s = 6; // spacing -- TODO : put in conf
	let x = y = 0;

	u.classList.remove("left", "right");
	q.classList.remove("down", "up", "off");

	// A. Horizontality
	x = (r.left + (r.width / 2)) - (w / 2);
	if (x + w > window.innerWidth) {
		x = window.innerWidth - w + 1; // WARNING : 1px safety adjustment
		s = 0;
		q.classList.add("off");
		u.classList.add("right");
		// console.log("out of window right ; tip positioned at window right"); // DEBUG
	} else if (x < 0) {
		x = 0;
		s = 0;
		q.classList.add("off");
		u.classList.add("left");
		// console.log("out of window left ; tip positioned at window left"); // DEBUG
	}

	// B. Verticality
	y = r.top - (h + s);
	if (y < 0) {
		y = r.bottom + s;
		q.classList.add("up");
		// console.log("out of window top ; tip positioned at target bottom"); // DEBUG
		if (y + h > window.innerHeight) {
			y = 0;
			q.classList.add("off");
			// console.log("out of window bottom ; tip positioned at window top"); // DEBUG
		}
	} else {
		q.classList.add("down");
	}

	u.style.top = y + "px";
	u.style.left = x + "px";

}

function showTip(o) { // o = HTML element
	clearTimeout(tips.timer.show);
	clearTimeout(tips.timer.hide);
	tips.timer.show = setTimeout(function() {
		let k = o.getAttribute("data-tip") == "" ? o.getAttribute("id") : o.getAttribute("data-tip");
		if (k != null) {
			let s = getTip(lang.tips[k]);
			if (s != null) {
				tips.active = true;
				let u = document.getElementById("tip");
				let r = o.getBoundingClientRect();
				u.style.transition = "";
				u.style.display = "";
				u.querySelector("div").innerHTML = s;
				setTipPosition(o, u);
				setTimeout(function() { u.style.opacity = "1" }, 10); // TEMP
			}
		}
	}, tips.delay[tips.active ? "later" : "first"]);
}

function hideTip() {
	clearTimeout(tips.timer.show);
	let u = document.getElementById("tip");
	u.style.transition = "opacity .5s";
	u.style.opacity = "0";
	tips.timer.hide = setTimeout(function() {
		tips.active = false;
	}, tips.delay.reset);
}

document.getElementById("tip").addEventListener("transitionend", function(e) {
	if (tips.active) this.style.display = "none";
});

// =============================================================================
// -----------------------------------------------------------------------------
// # Events
// -----------------------------------------------------------------------------
// =============================================================================

function bindTipEvents(o) { // o = HTML element
	o.addEventListener("mouseenter", function() { showTip(o) });
	o.addEventListener("mouseleave", function() { hideTip(o) });
}

function bindTipsEvents() {
	document.querySelectorAll("[data-tip]").forEach(function(o) {
		bindTipEvents(o);
	});
}

window.addEventListener("load", function() {
	bindTipsEvents(); // TEMP
});
