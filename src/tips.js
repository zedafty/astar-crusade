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

	# Behaviour
		When a target is hovered for a certain time without any mouse movement, then the tip is displayed.
		After being displayed, the tip is dismissed if the mouse cursor move out a square of n pixel over origin coordinates.
		A tip cannot be re-displayed hover a target without leaving and re-entering it.

	# Uncovered cases
		Long lines: texts should be all pre-generated, so long lines should be avoided during development ; if any, the text will simply overflows the tip to the right.
		Vertical overflow: if the tip vertically overflows the whole window, then its coordinate in that axis is set to 0 (i.e. the top side is always visible, but the bottom side won't be).

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

	"delay" : 1250, // mouse movement idle time in milliseconds required for a tip to be displayed -- Default : 1250
	"offset" : 0, // tolerance in pixels between two checks for the mouse movement still considered as idle -- Default : 0
	"threshold" : 4, // mouse movement in pixels from origin coordinates above which a tip will be hidden -- Default : 4
	"spacing" : 4, // distance in pixels between cursor and tip box (can be negative) -- Default : 4
	"bottom" : false, // should the tip be vertically placed at cursor bottom by default -- Default : false

	//////////////////////////////////////////////////////////////////////////////
	// @ Mutators
	//////////////////////////////////////////////////////////////////////////////

	"mouse" : {"x" : 0, "y" : 0},
	"timer" : null,
	"source" : null,
	"active" : false

}

// =============================================================================
// -----------------------------------------------------------------------------
// # Functions
// -----------------------------------------------------------------------------
// =============================================================================

////////////////////////////////////////////////////////////////////////////////
// @ Content
////////////////////////////////////////////////////////////////////////////////

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
							a.push(createModalMenuKeyString(v[k][n])); // TODO : put at an higher level ; function belonging to 'mdal'
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

////////////////////////////////////////////////////////////////////////////////
// @ Position
////////////////////////////////////////////////////////////////////////////////

function setTipPosition(u) { // u = source element (tip)
	let r = getCursorSize();
	let w = u.offsetWidth;
	let h = u.offsetHeight;
	let s = tips.spacing;
	let x = y = 0;
	u.classList.remove("left", "right");
	// ---------------------------------------------------------------------------
	// A. Horizontality
	// ---------------------------------------------------------------------------
	x = (tips.mouse.x + (r.width / 2)) - (w / 2);
	if (x + w > window.innerWidth) {
		x = window.innerWidth - w + 1; // WARNING : 1px safety adjustment
		u.classList.add("right");
	} else if (x < 0) {
		x = 0;
		u.classList.add("left");
	}
	// ---------------------------------------------------------------------------
	// B. Verticality
	// ---------------------------------------------------------------------------
	if (tips.bottom) { // cursor bottom
		y = tips.mouse.y + r.height + s;
		if (y + h > window.innerHeight) {
			y = tips.mouse.y - (h + s);
			if (y < 0) y = 0;
		}
	} else { // cursor top
		y = tips.mouse.y - (h + s);
		if (y < 0) { y = tips.mouse.y + r.height + s;
			if (y + h > window.innerHeight) y = 0;
		}
	}
	u.style.top = y + "px";
	u.style.left = x + "px";
}

////////////////////////////////////////////////////////////////////////////////
// @ Visibility
////////////////////////////////////////////////////////////////////////////////

function showTip(o) { // o = HTML element
	let k = o.getAttribute("data-tip") == "" ? o.getAttribute("id") : o.getAttribute("data-tip");
	if (k != null) {
		let s = getTip(lang.tips[k]);
		if (s != null) {
			let u = document.getElementById("tip");
			let r = o.getBoundingClientRect();
			u.style.transition = "";
			u.style.display = "";
			u.style.opacity = "1";
			u.querySelector("div").innerHTML = s;
			setTipPosition(u);
		}
	}
}

function hideTip() {
	let u = document.getElementById("tip");
	u.style.transition = "opacity .5s";
	u.style.opacity = "0";
	tips.active = false;
}

////////////////////////////////////////////////////////////////////////////////
// @ Triggering
////////////////////////////////////////////////////////////////////////////////

function hangTip() {
	clearTimeout(tips.timer);
	tips.timer = setTimeout(function() {
		showTip(tips.source);
		tips.source = null;
		tips.active = true;
	}, tips.delay);
}

function haltTip() {
	clearTimeout(tips.timer);
	tips.source = null;
	hideTip();
}

////////////////////////////////////////////////////////////////////////////////
// @ Events Bindings
////////////////////////////////////////////////////////////////////////////////

function bindTipEvents(o) { // o = HTML element

	o.addEventListener("click", haltTip);

	o.addEventListener("mouseenter", function() {
		tips.source = o;
		hangTip();
	});

	o.addEventListener("mouseleave", haltTip);

	o.addEventListener("mousemove", function(e) {
		if (tips.source != null) { // never shown
			tips.mouse.x = e.clientX;
			tips.mouse.y = e.clientY;
			if (Math.abs(e.movementX) > tips.offset
			 || Math.abs(e.movementY) > tips.offset) {
				hangTip();
			}
		} else if (tips.active) { // shown and still visible
			if (Math.abs(tips.mouse.x - e.clientX) > tips.threshold
			 || Math.abs(tips.mouse.y - e.clientY) > tips.threshold) {
				hideTip();
			}
		}
	});

}

function bindTipsEvents() {
	document.querySelectorAll("[data-tip]").forEach(function(o) {
		bindTipEvents(o);
	});
}

// =============================================================================
// -----------------------------------------------------------------------------
// # Events
// -----------------------------------------------------------------------------
// =============================================================================

document.getElementById("tip").addEventListener("transitionend", function() {
	if (tips.active) {
		this.style.display = "none";
		tips.active = false;
	}
});
