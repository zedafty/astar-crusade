/*

	term.js

*/

// =============================================================================
// -----------------------------------------------------------------------------
// # Module
// -----------------------------------------------------------------------------
// =============================================================================

var term = {

	//////////////////////////////////////////////////////////////////////////////
	// @ Variables
	//////////////////////////////////////////////////////////////////////////////

	"mouse" : {
		"x" : 0,
		"y" : 0,
		"last_x" : 0,
		"last_y" : 0,
		"swift_x" : 0,
		"swift_y" : 0,
		"hover" : false,
		"down" : false
	},

	"minimap" : {
		"canvas" : null,
		"context" : null,
		"mult_x" : 0,
		"mult_y" : 0,
		"update" : {
			"pending" : false,
			"list" : null,
			"color" : null
		}
	},

	"miniscope" : {
		"canvas" : null,
		"context" : null,
		"mult_x" : 0,
		"mult_y" : 0
	},

	"noise" : {
		"count" : 0
	},

	"choice" : {
		"active" : false,
		"list" : [],
		"type" : "",
		"index" : 0,
		"weapon" : null
	},

	"roll" : {
		"active" : false,
		"delay" : 0,
		"timer" : 0,
		"attack" : [],
		"defense" : []
	},

	//////////////////////////////////////////////////////////////////////////////
	// @ Start
	//////////////////////////////////////////////////////////////////////////////

	"start" : function() {

		// * Set Canvas
		this.minimap.canvas = document.createElement("canvas");
		this.miniscope.canvas = document.createElement("canvas");

		// * Set ID
		this.minimap.canvas.id = "minimap";
		this.miniscope.canvas.id = "miniscope";

		// * Set Size
		this.minimap.canvas.width = conf.term.canvas.width;
		this.minimap.canvas.height = conf.term.canvas.height;
		this.miniscope.canvas.width = conf.term.canvas.width;
		this.miniscope.canvas.height = conf.term.canvas.height;

		// * Define Context
		this.minimap.context = this.minimap.canvas.getContext("2d");
		this.miniscope.context = this.miniscope.canvas.getContext("2d");

		// * Insert Canvas
		document.getElementById("terminal").appendChild(this.minimap.canvas);
		document.getElementById("terminal").appendChild(this.miniscope.canvas);

		// * Define MiniMap Multipliers
		this.minimap.mult_x = this.minimap.canvas.width / conf.board.width;
		this.minimap.mult_y = this.minimap.canvas.height / conf.board.height;
		this.miniscope.mult_x = conf.board.width * conf.tile.size / this.minimap.canvas.width;
		this.miniscope.mult_y = conf.board.height * conf.tile.size / this.minimap.canvas.height;

		// * Attach Events
		this.miniscope.canvas.addEventListener("mouseenter", function() {
			term.mouse.hover = true;
			if (!scen.scrl.mouse.active) updateCursorState("grab"); // NEW
		});
		this.miniscope.canvas.addEventListener("mouseleave", function() {
			term.mouse.hover = false;
			if (!scen.scrl.mouse.active) resetCursor(); // NEW
		});
		this.miniscope.canvas.addEventListener("mousedown", function(e) {
			if (e.button == 0) { // left mouse button
				if (scen.scrl.locked <= 0) {
					if (!term.mouse.down) {
						let p = getMiniMousePos();
						let x = Math.round(p.x * term.miniscope.mult_x);
						let y = Math.round(p.y * term.miniscope.mult_y);
						centerToPixelInstant(x, y, true);
						term.mouse.last_x = p.x;
						term.mouse.last_y = p.y;
						term.mouse.down = true;
					}
				}
			}
		});
		document.addEventListener("mouseup", function() { // WARNING : event attached to document and not element
			if (term.mouse.down) {
				if (!scen.scrl.mouse.active && main.cursor.state != "pointer") updateCursorState("pointer");
				if (term.mouse.swift_x != 0 || term.mouse.swift_y != 0)
					snapToBoard(term.mouse.swift_x, term.mouse.swift_y);
				term.mouse.down = false;
				term.mouse.swift_x = 0;
				term.mouse.swift_y = 0;
			}
			if (!scen.scrl.mouse.active && term.mouse.hover) updateCursorState("grab");
		});
		document.addEventListener("mousemove", function(e) { // WARNING : event attached to document and not element
			if (scen.scrl.locked <= 0) {
				term.mouse.x = e.clientX;
				term.mouse.y = e.clientY;
				if (term.mouse.down) {
					let p = getMiniMousePos(), swift_x, swift_y;
					if (term.mouse.last_x >= 0 && term.mouse.last_y >= 0) {
						swift_x = Math.round((term.mouse.last_x - p.x) * term.miniscope.mult_x);
						swift_y = Math.round((term.mouse.last_y - p.y) * term.miniscope.mult_y);
						scrollOfPixelInstant(swift_x, swift_y);
						term.mouse.swift_x += swift_x;
						term.mouse.swift_y += swift_y;
					}
					term.mouse.last_x = p.x;
					term.mouse.last_y = p.y;
					updateCursorState("grabbing"); // TEMP
				}
			}
		});
	},

	//////////////////////////////////////////////////////////////////////////////
	// @ Clear
	//////////////////////////////////////////////////////////////////////////////

	"clearMiniMap" : function() {
		this.minimap.context.clearRect(0, 0, this.minimap.canvas.width, this.minimap.canvas.height);
	},

	"clearMiniScope" : function() {
		this.miniscope.context.clearRect(0, 0, this.minimap.canvas.width, this.minimap.canvas.height);
	},

	//////////////////////////////////////////////////////////////////////////////
	// @ Draw Mini Map
	//////////////////////////////////////////////////////////////////////////////

	"drawMiniMap" : function() {

		this.clearMiniMap();

		let ctx = this.minimap.context;

		let x = 0;
		let y = 0;
		let w = this.minimap.canvas.width;
		let h = this.minimap.canvas.height;
		let c;

		// * Draw cross straight
		// ctx.beginPath();
		// ctx.moveTo(w / 2, 0);
		// ctx.lineTo(w / 2, h);
		// ctx.moveTo(0, h / 2);
		// ctx.lineTo(w, h / 2);
		// ctx.lineWidth = 1;
		// ctx.strokeStyle = "rgba(255,255,255,.5)";
		// ctx.stroke();

		// * Draw cross diagonal
		// ctx.beginPath();
		// ctx.moveTo(x + 10, y + 10);
		// ctx.lineTo(x + w - 10, y + h - 10);
		// ctx.moveTo(x + w - 10, y + 10);
		// ctx.lineTo(x + 10, y + h - 10);
		// ctx.lineWidth = 1;
		// ctx.strokeStyle = "rgba(255,255,255,.5)";
		// ctx.stroke();

		// 1. Draw grid content
		let a = createPointListFromGrid(game.grid, conf.board.width, conf.board.height);
		let mx = term.minimap.mult_x;
		let my = term.minimap.mult_y;
		let i, t, k;
		for (i = 0; i < a.length; i++) {
			c = "transparent";
			t = a[i][2]; // type
			k = a[i][3]; // identifier
			if (isWall(t)) c = conf.color.mini.wall; // wall
			else if (isDoor(t) && !pawn[k].hidden) c = conf.color.mini.door; // door
			else if (isItem(t) && !pawn[k].hidden) c = pawn[k].unseen ? conf.color.mini.bleep : conf.color.mini.item; // bleep or item
			else if (isMarine(t) && !pawn[k].hidden) c = conf.color.mini.marine; // marine
			else if (isAlien(t) && !pawn[k].hidden) { // alien
				if (pawn[k].unseen) {
					if (!hasFourTiles(pawn[k])
					 || (hasFourTiles(pawn[k])
					 && ti(pawn[k].x) == a[i][0]
					 && ti(pawn[k].y) == a[i][1])) c = conf.color.mini.bleep;
				} else {
					c = conf.color.mini.alien;
				}
			}
			ctx.fillStyle = c;
			ctx.fillRect(a[i][0] * mx, a[i][1] * my, mx, my);
		}

		// 2. Draw range
		let l = term.minimap.update.list;
		c = term.minimap.update.color;
		if (l != null) {
			ctx.fillStyle = c != null ? c : "transparent";
			for (i = 0; i < l.length; i++) {
				if (Number.isNaN(l[i][2]) || l[i][2] <= 0) continue;
				ctx.fillRect(l[i][0] * mx, l[i][1] * my, mx, my);
			}
		}

		// 3. Draw focus
		let e = ents.Reti.focus;
		if (!e.hidden) {
			ctx.fillStyle = conf.color.mini.focus;
			ctx.fillRect(ti(e.x) * mx, ti(e.y) * my, ti(e.width) * mx, ti(e.height) * my);
		}

		// * Reset minimap update variables
		term.minimap.update.pending = false;
		term.minimap.update.list = null;
		term.minimap.update.color = null;

		// console.info("%c>---| minimap updated at " + scen.frame_count + " |---<", conf.console["game"]); // DEBUG

	},

	//////////////////////////////////////////////////////////////////////////////
	// @ Update Mini Map
	//////////////////////////////////////////////////////////////////////////////

	"updateMiniMap" : function(l, c) { // l = range point list, c = range color

		term.minimap.update.pending = true;

		// * Case 1 : First range update requested prevails
		// term.minimap.update.list = term.minimap.update.list == null && l !== undefined ? l : null;
		// term.minimap.update.color = term.minimap.update.color == null && c !== undefined ? c : null;

		// * Case 2 : Last range update requested prevails
		term.minimap.update.list = l !== undefined ? l : null;
		term.minimap.update.color = c !== undefined ? c : null;

	},

	//////////////////////////////////////////////////////////////////////////////
	// @ Update Mini Scope
	//////////////////////////////////////////////////////////////////////////////

	"updateMiniScope" : function() {

		this.clearMiniScope();

		let ctx = this.miniscope.context;

		let x = scen.screen.x / conf.tile.size * this.minimap.mult_x;
		let y = scen.screen.y / conf.tile.size * this.minimap.mult_y;
		let w = this.miniscope.canvas.width / ((conf.board.width * conf.tile.size) / scen.screen.width);
		let h = this.miniscope.canvas.height / ((conf.board.height * conf.tile.size) / scen.screen.height);
		let b = 2; // lineWidth

		ctx.beginPath();
		ctx.lineWidth = b;
		ctx.strokeStyle = conf.color.mini.scope;
		// ctx.rect(x, y, w, h); // stroke centered
		// ctx.rect(x + b/2, y + b/2, w - b, h - b); // stroke inset
		ctx.rect(x - b/2, y - b/2, w + b, h + b); // stroke outset
		ctx.stroke();

	}

};

// =============================================================================
// -----------------------------------------------------------------------------
// # Mouse (controller)
// -----------------------------------------------------------------------------
// =============================================================================

function getMiniMousePos() { // returns position {x,y} in pixel
	let r = term.minimap.canvas.getBoundingClientRect();
	let p = window.getComputedStyle(term.minimap.canvas);
	let l = parseInt(p.borderLeftWidth);
	let t = parseInt(p.borderTopWidth);
	let x = Math.round((term.mouse.x - r.left - l) * main.screen.scale);
	let y = Math.round((term.mouse.y - r.top - t) * main.screen.scale);
	if (x < 0) x = 0; else if (x > term.minimap.canvas.width) x = term.minimap.canvas.width;
	if (y < 0) y = 0; else if (y > term.minimap.canvas.height) y = term.minimap.canvas.height;
	return {"x" : x, "y" : y};
}

// =============================================================================
// -----------------------------------------------------------------------------
// # Noise
// -----------------------------------------------------------------------------
// =============================================================================

function showNoise(b, f) { // b = easter egg flag, f = callback function
	if (typeof(f) !== "function") f = function() {};
	if (mupt.active) b = false; // shortest duration during alien play
	else if (Math.round(Math.random()) == 0) b = false; // only 1 chance on 2 to get easter egg
	let q = document.getElementById("noise");
	let n = Math.floor(Math.random() * 4); // 0-3
	let d = conf.term.noise.duration;
	let i = Math.floor(d / (b ? 5 : 4));
	term.noise.count = 0;
	q.style.display = "";
	q.style.opacity = "1.0";
	q.style.backgroundPosition = "0 0";
	setFrameInterval("noise", i, function() {
		term.noise.count++;
		q.style.opacity = (1 / term.noise.count + 0.25).toString();
		q.style.backgroundPosition = "-" + (term.noise.count * 200) + "px 0";
		if (b && term.noise.count == 2) q.style.backgroundPosition = "-" + (n * 200) + "px -200px";
		if (b && term.noise.count == 4) q.style.backgroundPosition = "-400px 0";
		if ((b && term.noise.count == 5) || (!b && term.noise.count == 4)) {
			q.style.display = "none";
			f();
			clearFrameInterval("noise");
		}
	});
}

function hideNoise() {
	let q = document.getElementById("noise");
	clearFrameInterval("noise");
	term.noise.count = 0;
	q.style.display = "none";
	q.style.opacity = "";
	q.style.backgroundPosition = "";
}

// =============================================================================
// -----------------------------------------------------------------------------
// # Choice
// -----------------------------------------------------------------------------
// =============================================================================

////////////////////////////////////////////////////////////////////////////////
// @ Functions
////////////////////////////////////////////////////////////////////////////////

function getChoiceList(s) { // s = choice string (order, equipment or weapon)
	let l = game.team[game.player[0]][s], k, a = [];
	for (k in l) if ((isOrderGiveable(k) || isEquipmentUseable(k)) && l[k]) a.push(k);
	term.choice.list = a;
	term.choice.index = 0;
	updateChoice();
}

function updateChoice(e, n) { // e = HTML caller, n = choice index increment
	if (main.pause || (e !== undefined && e.style.opacity == "0")) return;
	n = n || 0;
	let q = document.getElementById("choice");
	term.choice.index += n;
	q.querySelector(".prev").style.opacity = typeof(term.choice.list[term.choice.index - 1]) !== "undefined" ? "1" : "0";
	q.querySelector(".next").style.opacity = typeof(term.choice.list[term.choice.index + 1]) !== "undefined" ? "1" : "0";
	q.querySelector("div").setAttribute("class", term.choice.list[term.choice.index]);
	q.querySelector("p").innerHTML = lang[term.choice.list[term.choice.index]];
}

function confirmChoice(s) { // s = choice string (weapon name)
	if (main.pause) return;
	let choice = term.choice.type == "weapon" ? s : term.choice.list[term.choice.index];
	console.log("[choice] " + term.choice.type + " " + choice + " chosen"); // DEBUG
	if (term.choice.type != "weapon") main.ctrl.action = null;
	if (term.choice.type == "order") giveOrder(term.choice.list[term.choice.index]);
	else if (term.choice.type == "equipment") useEquipment(term.choice.list[term.choice.index]);
	else if (term.choice.type == "weapon") {
		game.actor.last_weapon = game.actor.weapon;
		game.actor.weapon = choice;
		term.choice.weapon = choice;
	}
	setFrameTimeout("choice", conf.term.choice.delay, function() {
		if (term.choice.type == "weapon") game.actor.drawShootRange();
		hideChoice();
	});
}

function showChoice(s, n) { // s = choice string (order, equipment or weapon), n = choice index increment
	let q = document.getElementById("choice");
	if (!term.choice.active) showNoise(true);
	term.choice.active = true;
	term.choice.type = s;
	q.setAttribute("class", s);
	q.style.display = "";
	if (s == "weapon") {
		q.querySelector("div:nth-of-type(1)").setAttribute("class", "heavy_bloter");
		q.querySelector("div:nth-of-type(2)").setAttribute("class", "plasma_cannon");
		q.querySelector("p").innerHTML = lang["choose_weapon"];
	} else if (n !== undefined) {
		updateChoice(undefined, n);
	} else getChoiceList(s);
}

function hideChoice() {
	let q = document.getElementById("choice");
	if (term.choice.active) showNoise();
	q.style.display = "none";
	term.choice.active = false;
}

////////////////////////////////////////////////////////////////////////////////
// @ Events
////////////////////////////////////////////////////////////////////////////////

document.querySelector("#choice .prev").addEventListener("click", function() {updateChoice(this, -1)});
document.querySelector("#choice .next").addEventListener("click", function() {updateChoice(this, 1)});
document.querySelectorAll("#choice div").forEach(function(e) {
	e.addEventListener("click", function() {confirmChoice(e.getAttribute("class"))});
});

// =============================================================================
// -----------------------------------------------------------------------------
// # Roll
// -----------------------------------------------------------------------------
// =============================================================================

////////////////////////////////////////////////////////////////////////////////
// @ Functions
////////////////////////////////////////////////////////////////////////////////

function rollDie(b, e, i, a) { // b = reroll flag, e = HTML element, i = HTML node list index, a = attack array
	if (typeof(f) !== "function") f = function() {};
	if (b || i + 1 <= a[0]) {
		// 1. Define variables
		let q = e.querySelector("output");
		let n = Math.floor(Math.random() * 6); // 0-5
		let t = Math.round((conf.term.roll.duration * conf.term.roll.downtime) + (b ? 0 : conf.term.roll.duration * conf.term.roll.downtime * term.roll.timer));
		let r = (b ? e.classList.contains("heavy") : a[1]) ? conf.game.die.heavy[n] : conf.game.die.light[n];
		let p = b ? parseInt(q.innerText) : 0;
		let l = term.roll[game.defense ? "defense" : "attack"];
		// 2. Show die
		if (!b) {
			e.setAttribute("class", (a[1] ? "heavy" : "light") + " die");
			e.style.opacity = "0";
			e.style.display = "";
			if (r == 0) e.classList.add("zero");
		}
		// 3. Set roll animation
		if (r == 0) e.style.animationName = e.style.animationName == "roll_zero_1" ? "roll_zero_2" : "roll_zero_1";
		else e.style.animationName = e.style.animationName == "roll_1" ? "roll_2" : "roll_1";
		e.style.animationDuration = Math.round(conf.term.roll.duration * conf.scen.frame_rate) + "ms";
		e.style.animationDelay = (b ? 0 : Math.round(conf.term.roll.duration * conf.term.roll.downtime * term.roll.timer * conf.scen.frame_rate)) + "ms";
		e.style.animationTimingFunction = "ease-out";
		e.style.animationPlayState = "running";
		// 4. Reset output
		if (!b) {
			q.style.color = "black";
			q.innerHTML = "";
		}
		// 5. Update output
		setFrameTimeout("roll_" + term.roll.timer, t, function() {
			if (b) {
				r == 0 ? e.classList.add("zero") : e.classList.remove("zero");
			} else {
				e.style.opacity = "1";
				q.style.color = "";
			}
			q.innerHTML = r;
		});
		// 6. Update result
		if (b) {
			l.forEach(function(ele, idx) {
				if (idx + 1 == i) l[idx] = r;
			});
		} else {
			l.push(r);
		}
		// 7. Update delay
		term.roll.delay = t;
		// 8. Increment counter
		if (!b) term.roll.timer++;
	} else {
		e.style.display = "none";
	}
	if (b) console.log("[" + game.actor.id + "] reroll score [" + term.roll[game.defense ? "defense" : "attack"] + "] >> " + term.roll[game.defense ? "defense" : "attack"].reduce(sum)); // DEBUG
}

function rollDice(o, t, p) { // o = entity, t = attack type, p = roll penalty
	let a = o.attack[t], b = [], i, j;
	let q = document.getElementById("roll");
	let e, l, n;
	// * Set bomber damage
	if (o.conduct == "bomber") a = [[2, true]]; // overwrite attack damage
	// * Duplicate attack list
	for (i = 0; i < a.length; i++) {
		b.push([]);
		for (j = 0; j < a[i].length; j++) b[i][j] = a[i][j];
	}
	// * Set roll button
	setRollButton(lang["wait_roll"]);
	// * Adjust dice
	if (p > 0 && hasAttack(b)) b[0][0] -= p; // reduce first dice set (only juggernaut has more than one dice set)
	if (isMarine(o) && t == "melee" && o.attack.fission_bomb) {
		if (o.weapon == "glove_sword") b[0][0] += 2; // increase first dice set
		else b.push([2, true]); // add one heavy dice set
		delete o.attack.fission_bomb; // remove equipment
	}
	// * Show report
	if (game.defense) showReport(lang["defense_score"], "blue");
	else showReport(lang["attack_score"]);
	// * Roll dice
	if (!hasAttack(b)) { // no attack
		setRollButton(lang[game.defense ? "no_defense" : "no_attack"], "noroll");
		term.roll[game.defense ? "defense" : "attack"] = [0]; // set result as zero
		e = document.getElementById("roll");
		l = e.querySelectorAll("span");
		l.forEach(function(e) {
			e.style.display = "none";
		});
		setFrameTimeout("attack", conf.game.delay.attack, function() {
			performAttack();
		});
	} else { // roll die
		for (n = 0; n < 2; n++) {
			e = document.getElementById("roll_" + (n + 1));
			l = e.querySelectorAll("span");
			if (b.length > n) {
				l.forEach(function(ele, idx) {
					rollDie(false, ele, idx, b[n]);
				});
			} else {
				l.forEach(function(e) {
					e.style.display = "none";
				});
			}
		}
		setFrameTimeout("roll", Math.round(term.roll.delay + conf.term.roll.duration * conf.term.roll.downtime), function() {
			if (o.attack["reroll_" + t]) { // reroll
				showReport(lang["reroll"], "dark");
				setRollButton(lang["skip_reroll"], "reroll", true);
			} else { // no reroll
				setFrameTimeout("attack", conf.game.delay.attack, function() {
					performAttack();
				});
			}
		});
		console.log("[" + o.id + "] " + (game.defense ? "defense" : "attack") + " " + t + " score [" + term.roll[game.defense ? "defense" : "attack"] + "] >> " + term.roll[game.defense ? "defense" : "attack"].reduce(sum)); // DEBUG
	}
}

function endReroll() {
	let q = document.getElementById("roll");
	if (game.defense) showReport(lang["defense_score"], "blue");
	else showReport(lang["attack_score"]);
	resetRollButton();
}

function reroll(e) {
	if (main.pause) return;
	let q = document.getElementById("roll"), n = 0, i;
	if (q.classList.contains("reroll")) {
		q.querySelectorAll("span").forEach(function(ele) {
			if (ele.style.display != "none") n++;
			if (ele == e) i = n;
		});
		// * Reset timer
		term.roll.timer = 0;
		// * Reroll selected die
		rollDie(true, e, i);
		// * End reroll
		endReroll();
		// * Prepare attack
		setFrameTimeout("reroll", Math.round(conf.term.roll.duration * conf.term.roll.downtime), function() {
			setFrameTimeout("attack", conf.game.delay.attack, function() {
				performAttack();
			});
		});
	}
}

function resumeRoll() {
	if (main.pause) return;
	let q = document.getElementById("roll");
	if (q.classList.contains("chain")) {
		endAttack();
	} else if (q.classList.contains("reroll")) {
		endReroll();
		performAttack();
	}
}

function setRollButton(s, c, b) { // s = string, c = container class, b = activated and focus flag
	let q = document.getElementById("roll");
	let p = q.querySelector("button");
	p.innerHTML = s === undefined ? "" : s;
	if (c) q.classList.add(c);
	else q.removeAttribute("class");
	if (b) {
		p.removeAttribute("disabled");
		p.focus();
	}
	else p.setAttribute("disabled", "disabled");
}

function resetRollButton() {
	setRollButton();
}

function showRoll(o, t) { // o = entity, t = attack type
	let q = document.getElementById("roll");
	// 1. Hide report
	hideReport();
	// 2. Reset variables
	term.roll.timer = 0;
	term.roll.delay = 0;
	term.roll.attack = [];
	term.roll.defense = [];
	// 3. Roll dice
	if (!term.roll.active) showNoise(true, function() {rollDice(o, t)});
	else rollDice(o, t);
	// 4. Show container
	q.style.display = "";
	// 5. Set roll active
	term.roll.active = true;
}

function hideRoll() {
	let q = document.getElementById("roll");
	// 1. Show noise
	if (term.roll.active) showNoise();
	// 2. Hide all dice
	q.querySelectorAll(".die").forEach(function(e) {
		e.style.display = "none";
	});
	// 3. Hide container
	q.style.display = "none";
	// 4. Reset roll bytton
	resetRollButton();
	// 5. Unset roll active
	term.roll.active = false;
}

////////////////////////////////////////////////////////////////////////////////
// @ Events
////////////////////////////////////////////////////////////////////////////////

document.querySelectorAll("#roll .die").forEach(function(e) {
	e.addEventListener("click", function() {reroll(e)});
});

document.querySelector("#roll button").addEventListener("click", function() {
	resumeRoll();
});
