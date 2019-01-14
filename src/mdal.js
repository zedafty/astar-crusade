/*

	mdal.js

*/

// =============================================================================
// -----------------------------------------------------------------------------
// # Module
// -----------------------------------------------------------------------------
// =============================================================================

var mdal = {

	//////////////////////////////////////////////////////////////////////////////
	// @ Accessors
	//////////////////////////////////////////////////////////////////////////////

	"transition" : {
		"delay" : 10, // milliseconds
		"duration" : 250 // milliseconds
	},

	//////////////////////////////////////////////////////////////////////////////
	// @ Mutators
	//////////////////////////////////////////////////////////////////////////////

	"active" : false,

	"timeout" : null

};

// =============================================================================
// -----------------------------------------------------------------------------
// # Functions
// -----------------------------------------------------------------------------
// =============================================================================

function setModalTransitionProperties(o) { // o = DOM object
	o.style.transform = "scale(0,0)";
	o.style.top = "0";
	o.style.opacity = "0";
}

function resetModalTransitionProperties(o) { // o = DOM object
	o.style.transform = "";
	o.style.top = "";
	o.style.opacity = "";
}

function openModal() {
	let q = document.getElementById("modal_wrap");
	let o = document.getElementById("modal");
	let d = mdal.transition.duration;

	mdal.active = true;

	q.style.display = "";
	q.classList.add("open");
	q.style.transitionDuration = d + "ms";
	q.querySelector(".close").focus();

	setModalTransitionProperties(o);

	mdal.timeout = setTimeout(function() {
		q.style.backgroundColor = "rgba(0,0,0,.5)";
		o.style.transition = "transform " + d + "ms, top " + d + "ms, opacity " + d + "ms"; // TEMP
		resetModalTransitionProperties(o);
	}, mdal.transition.delay); // TEMP

}

function closeModal() {
	let q = document.getElementById("modal_wrap");
	let o = document.getElementById("modal");

	q.classList.remove("open");
	q.style.backgroundColor = "";

	setModalTransitionProperties(o);

	mdal.active = false;
}

// =============================================================================
// -----------------------------------------------------------------------------
// # Events
// -----------------------------------------------------------------------------
// =============================================================================

////////////////////////////////////////////////////////////////////////////////
// @ Window
////////////////////////////////////////////////////////////////////////////////

document.getElementById("modal_wrap").addEventListener("click", function(e) {
	closeModal();
});

document.getElementById("modal_wrap").addEventListener("transitionend", function(e) {
	if (e.target == this) {
		if (!this.classList.contains("open")) {
			this.style.display = "none";
			this.querySelector("#modal").style.transition = "";
		}
	}
});
