/*

	ctrl.js

*/

// =============================================================================
// -----------------------------------------------------------------------------
// # Game Commands
// -----------------------------------------------------------------------------
// =============================================================================

/**

	& GAME COMMANDS

	# Command         Inputs                                  Statement
		Fire            Enter, Space, Left Mouse Button         validTurn(), validTransmission()
		Cancel          Escape, Backspace, Right Mouse Button   cancelAction()

*/

function fire() {
	if (moni.turn.prompt) validTurn(); // TEMP
	else if (scen.transmission.active) validTransmission(); // TEMP
}

function cancel() {
	if (main.ctrl.action != null) forceClick("action_" + main.ctrl.action); // TEMP
}

// =============================================================================
// -----------------------------------------------------------------------------
// # Select Commands
// -----------------------------------------------------------------------------
// =============================================================================

function selectMarine(o, f) { // o = entity, f = force flag

	// * Skip if already selected
	if (!f && game.actor != null && game.actor == o) return;

	// * Enable tool buttons
	if (!tool.active) enableToolButtons(); // TEMP DEBUG

	// * Update status
	showStatus(o);

	// * Set focus
	setFocus(o);

	// * Cancel previous member pending action
	if (game.actor != null && game.actor != o) {
		// a. Cancel previous member action
		cancelAction(game.actor);
	}

	// * Cancel team pending action
	else {
		// a. Cancel previous team action
		cancelAction(null);
		// b. Set team order action done
		let p = game.player[0];
		if (game.team[p].action.order > 0) game.team[p].action.order = 0;
	}

	// * Set focus on sprite
	game.actor = o;

	// * Turn Select light on
	turnLight(getIndexFromId(o), "select", true);

	// * Check action buttons
	checkActionButtons(o);

	// * Play sound effect
	playSound("member_select");

	if (game.xeno_sensor.active) stopXenoSensor();

}

// =============================================================================
// -----------------------------------------------------------------------------
// # Action Commands
// -----------------------------------------------------------------------------
// =============================================================================

/**

	& ACTION TYPES

	# Individual                      time            condition       start           limit           modifiers
		1. Move                         focus           *               confirm         1 per member    move_it, by_sections
		2. Attack Range                 focus           *               confirm         1 per member    fire, by_sections
		3. Attack Melee                 focus           char adjacent   confirm         1 per member    close_assault

	# Team                            time            condition       start           limit           modifiers
		4. Give Order                   turn start      *               confirm         1 per turn      *
		5. Use Equipment                focus           has equipment   confirm         unlimited       *
		6. Switch Door                  focus           door adjacent   instant         unlimited       airlock_control
		7. Scan                         focus           *               instant         1 per turn      (mothership_scan)
		8. End Turn                     any time        *               instant         1 per turn      *

*/

function checkActionButtons(o) { // o = entity (leave empty to restore action buttons default state)
	disableActionButtons();
	if (isPlayerMarine()) {
		let p = game.player[0];
		if (o != null && isAlive(o) && !(o.subt == "commander" && hasEventActive("report_in"))) {
			if (hasAction(o, "move")) {
				turnLight(getIndexFromId(o), "move", true);
				if (o.getMoveRange().length > 0) resetActionButton("move");
			} else turnLight(getIndexFromId(o), "move");
			if (hasAction(o, "attack")) {
				turnLight(getIndexFromId(o), "attack", true);
				if (hasAction(o, "attack_range") && !hasMeleeWeapon(o)) resetActionButton("attack_range");
				if (hasAction(o, "attack_melee") && hasAdjacentCellOfValue(game.grid, ti(o.x), ti(o.y), getAttackableTypeList(o, conf.game.friendly_fire), o.attack.assault_blade)) resetActionButton("attack_melee");
			} else turnLight(getIndexFromId(o), "attack");
			if (hasEquipmentUseable(p)) resetActionButton("use_equipment");
			if (hasEventActive("airlock_control") || isDoorAround(o, !conf.game.close_door)) resetActionButton("switch_door");
			if (!isAtDockingClaws(o) && game.team[p].action.scan > 0) resetActionButton("scan");
		} else {
			if (hasTrooper(p) && hasCommander(p) && hasOrderGiveable(p) && game.team[p].action.order > 0) resetActionButton("give_order");
		}
		resetActionButton("end_turn");
	}
}

function startAction(o, s) { // o = entity, s = action key
	switch(s) {
		case "move" :
			main.ctrl.action = s;
			o.drawMoveRange();
			break;
		case "attack_range" :
			main.ctrl.action = s;
			if (o.weapon == "heavy_bloter_plasma") showChoice("weapon");
			else o.drawShootRange();
			break;
		case "attack_melee" :
			main.ctrl.action = s;
			o.drawMeleeRange();
			break;
		case "give_order" :
			main.ctrl.action = s;
			showChoice("order");
			break;
		case "use_equipment" :
			main.ctrl.action = s;
			showChoice("equipment");
			break;
		case "switch_door" :
			main.ctrl.action = s;
			o.drawDoorRange();
			break;
		case "scan" :
			// * Disable button
			disableActionButton("scan");
			// * Play sound effect
			playSound("scan_" + o.subt);
			// * Do action
			startScan(o.x, o.y, conf.game.scan_radius[o.subt]);
			// * Set action as done
			game.team[game.player[0]].action.scan--;
			break;
		case "end_turn" :
			// * Disable button
			disableActionButton("end_turn");
			// * Do action
			endTurn();
			break;
	}
}

function cancelAction(o, s) { // o = entity (null for team action only), s = action key (leave empty for all)
	s = s || null;
	main.ctrl.action = null;
	let b = s == null;
	if (o != null) {
		if (b || s == "move") o.clearMoveRange();
		if (b || s == "attack_range") {
			o.clearShootRange();
			if (game.chained) endAttack();
		}
		if (b || s == "attack_melee") o.clearMeleeRange();
		if (b || s == "use_equipment") hideChoice();
		if (b || s == "switch_door") o.clearDoorRange();
	}
	if (b || s == "give_order") hideChoice();
	if (game.xeno_sensor.active) stopXenoSensor(); // TEMP
	if (term.choice.active) hideChoice(); // TEMP
}

// =============================================================================
// -----------------------------------------------------------------------------
// # Attack Routine
// -----------------------------------------------------------------------------
// =============================================================================

function startAttack(o, t, x, y, h) { // o = attacker entity, t = attack type, x, y = targetted point (tile), h = chain attack flag
	let u;
	// 1. Prevent save
	if (isMarine(o)) main.save.prevented = true;
	// 2. Lock scroll
	lockScroll();
	// 3. Center on attacker
	if (!isOnScreen(o, false)) centerToPixelInstant(o.x, o.y); // screen inner, instant scroll
	// 4. Handle character animation, controls, action and display
	if (o instanceof Char) { // character
		// a. Play character animation
		if (t == "range" && o.conduct != "bomber"
		&& (o.subt == "juggernaut"
		 || getBaseWeapon(o) == "bloter"
		 || getBaseWeapon(o) == "heavy_bloter"
		 || getBaseWeapon(o) == "machine_gun"
		 || getBaseWeapon(o) == "rocket_launcher"
		 || getBaseWeapon(o) == "plasma_cannon"
		 || getBaseWeapon(o) == "pistol_axe"
		 || getBaseWeapon(o) == "pistol_knife"
		 || getBaseWeapon(o) == "grenade")) {
			o.playAnimation("aim", conf.Char.radian_rotation ? Math.atan2(y - ti(o.y), x - ti(o.x)) : null);
		}
		// b. Handle controls and action
		if (!game.chained) {
			if (isMarine(o)) {
				// 1) Lock buttons
				lockButtons("member_" + getIndexFromId(o));
				// 2) Disable select buttons
				disableSelectButtons(getIndexFromId(o));
				// 3) Disable action buttons
				disableActionButtons("attack_" + t);
				// 4) Remove invisible condition
				if (o.condition.invisible) o.condition.invisible = false;
				// 5) Apply active order(s) effect(s)
				if (o.subt == "trooper") { // trooper only
					if (hasOrderActive("by_sections")) o.action.move = 0; // no move if attacked
					if (hasOrderActive("heavy_weapon") && hasHeavyWeapon(o)) {
						// * Increase actions
						o.action.move++;
						o.action.attack_range++;
						// * Remove order from active order
						let l = game.team[game.player[0]].active.order;
						l.splice(l.indexOf("heavy_weapon"), 1);
					}
				}
			}
			// * Set attack done
			o.action.attack_range--;
			o.action.attack_melee--;
		}
		// b. Reset focus
		if (hasFocus(o)) setFocus(o, hasFourTiles(o));
		// c. Turn to targetted point
		o.turnTo(getDir(o.getTiX(), o.getTiY(), x, y));
	}
	// 5. Reset target list
	game.target = [];
	// 6. Get target(s)
	if (t == "range" && (hasBlastWeapon(o) || hasBeamWeapon(o))) { // area of effect
		let a, b, n, c;
		// a. Create target(s) list
		a = ents.Rect.hilite.list;
		for (n in a) {
			c = game.grid[a[n][0]][a[n][1]];
			u = pawn[c[1]];
			if (o.conduct == "bomber" && o == u) continue; // exclude self bomber from target(s) list
			if (u !== undefined && c[0] != -1 && !hasValue(game.target, u.id)) { // all existing pawns but closed doors and already targetted
				// * Add target to list
				game.target.push([a[n][0], a[n][1], u.id]);
				// * Set target corner to impact point
				if (hasFourTiles(u)) u.setCorner(a[n][0], a[n][1]); // set corner
			}
		}
		// b. Reduce range at targetted area
		ents.Rect.range.list = ents.Rect.hilite.list.slice();
		ents.Rect.range.list.forEach(function(e, i) {e[2] = true}); // overwrite third-value
		// c. Reset hilite
		ents.Rect.hilite.setSlab();
	} else { // targetted point
		// a. Create target list
		u = pawn[game.grid[x][y][1]];
		if (u !== undefined) {
			// * Add target to list
			game.target.push([x, y, u.id]);
			// * Set target corner to impact point
			if (hasFourTiles(u)) u.setCorner(x, y); // set corner
		}
		// b. Reduce range at selected point
		ents.Rect.range.list = [[x, y]];
	}
	// 7. Register targetted point
	game.point.x = px(x);
	game.point.y = px(y);
	// 8. Attack target(s)
	game.chained ? performAttack() : showRoll(o, t);
}

function performAttack() {
	let o = game.actor; // attacker
	let u = game.target.length > 0 ? pawn[game.target[0][2]] : null; // defender
	if (o instanceof Char) { // character
		// 1. Melee attack
		if (o.range == "melee") { // no projectile
			if (u instanceof Char) { // character
				if (!game.defense) { // do defense roll
					if (isMarine(u)) showStatus(u); // a marine defends on melee
					u.turnTo(o);
					hideReport();
					game.defense = true;
					let n = 0;
					if (o.attack.assault_blade && isDiag(getDirEnt(o, u))) n++; // reduce one die on defender roll
					if (o.subt == "trooper" && hasOrderActive("photon_grenades")) n++;// reduce one more die on defender roll
					setFrameTimeout("attack_def", conf.game.delay.defense, function() {
						// * Reset timer
						term.roll.timer = 0;
						// * Roll dice for defender
						rollDice(u, "melee", n);
					});
				} else { // resolve opposite roll
					let result = term.roll.attack.reduce(sum) - term.roll.defense.reduce(sum);
					if (result == 0) {
						console.log("[" + o.id + "] melee against [" + u.id + "] is a draw"); // DEBUG
						// * Play sound effect
						playSound("draw");
						// * Play attacker melee animation
						o.playAnimation(getMeleeAnimation(o) + "_draw", undefined, function() {
							let d = getCoordFromDir(o.dir)
							playEffect(o.x + px(d.x / 2), o.y + px(d.y / 2), "hit");
						});
						// * Play defender melee animation
						u.playAnimation(getMeleeAnimation(u) + "_draw");
						setRollButton(lang["draw_roll"]);
						// * End attack
						setFrameTimeout("attack_end", conf.game.delay.attack_end, function() {
							endAttack();
						});
					} else if (result > 0) {
						console.log("[" + o.id + "] wins melee against [" + u.id + "]"); // DEBUG
						// * Play attacker melee animation
						let k = getMeleeAnimation(o);
						o.playAnimation(k, undefined, function() {
							// * Play attacker sound effect
							playSound(getMeleeSoundKey(o, k));
							// * Perform damage
							performDamage(result);
						});
					} else if (result < 0) {
						console.log("[" + o.id + "] loses melee against [" + u.id + "]"); // DEBUG
						// * Set defender as game actor cover
						game.cover = u;
						// * Play defender melee animation
						let k = getMeleeAnimation(u);
						u.playAnimation(k, undefined, function() {
							// * Play defender sound effect
							playSound(getMeleeSoundKey(u, k));
							// * Perform damage
							performDamage(Math.abs(result), true);
						});
					}
				}
			} else { // furniture
				console.log("[" + o.id + "] attacks [" + u.id + "] on melee"); // DEBUG
				// * Play attacker melee animation
				let k = getMeleeAnimation(o);
				o.playAnimation(k, undefined, function() {
					// * Play attacker sound effect
					playSound(getMeleeSoundKey(o, k));
					// * Perform damage
					performDamage();
				});
			}
		}
		// 2. Range attack
		else if (o.range == "shoot") { // fire projectile
			let x1, y1, x2, y2, p;
			// * Define projectile slug
			let slug = "bullet";
			// * Define firing origin
			x1 = o.getX();
			y1 = o.getY();
			// * Adjust firing origin
			if (!hasFourTiles(o)) {
				let adj_u = (hasBeamWeapon(o) ? 12 : 7) * 2; // plasma centered, bullet and rocket at gun muzzle
				let adj_v = (hasBeamWeapon(o) ? isDiag(o.dir) ? 12 : 0 : 3) * 2; // plasma centered, bullet and rocket at gun muzzle
				switch (o.dir) {
					case "ss" : x1 -= adj_v; y1 += adj_u; break; // base line
					case "se" : x1 += adj_v; y1 += adj_u; break; // base diag
					case "ee" : x1 += adj_u; y1 += adj_v; break;
					case "ne" : x1 += adj_u; y1 -= adj_v; break;
					case "nn" : x1 += adj_v; y1 -= adj_u; break;
					case "nw" : x1 -= adj_v; y1 -= adj_u; break;
					case "ww" : x1 -= adj_u; y1 -= adj_v; break;
					case "sw" : x1 -= adj_u; y1 += adj_v; break;
				}
			}
			x1 += halfti();
			y1 += halfti();
			// * Define firing destination
			x2 = game.point.x;
			y2 = game.point.y;
			if (hasBlastWeapon(o)) {
				slug = "rocket";
			} else if (hasBeamWeapon(o)) {
				slug = "plasma";
				p = ents.Rect.range.list[ents.Rect.range.list.length - 1];
				x2 = px(p[0]);
				y2 = px(p[1]);
			}
			// * Set muzzle animation
			let muz_x, muz_y, muz_w, muz_h, muz_a, muz_s, muz_g;
			if (conf.Anim.muzzle) {
				muz_x = 0;
				muz_y = 0;
				muz_w = ents.Anim.muzzle.width;
				muz_h = ents.Anim.muzzle.height;
				muz_a = (hasBeamWeapon(o) ? isDiag(o.dir) ? 20 : 16 : 6);
				muz_s = slug + "_" + (isDiag(o.dir) ? "diag" : "line");
				muz_g = o.anim.angle != null ? o.anim.angle - (Math.PI / (isDiag(o.dir) ? 4 : 2)) : o.angle;
				switch (o.dir) {
					case "nn" : muz_x = -muz_w/2;       muz_y = -muz_h + muz_a; break;
					case "ss" : muz_x = -muz_w/2;       muz_y = -muz_a;         break;
					case "ww" : muz_x = -muz_w + muz_a; muz_y = -muz_h/2;       break;
					case "ee" : muz_x = -muz_a;         muz_y = -muz_h/2;       break;
					case "se" : muz_x = -muz_a;         muz_y = -muz_a;         break;
					case "ne" : muz_x = -muz_a;         muz_y = -muz_h + muz_a; break;
					case "nw" : muz_x = -muz_w + muz_a; muz_y = -muz_h + muz_a; break;
					case "sw" : muz_x = -muz_w + muz_a; muz_y = -muz_a;         break;
				}
			}
			// * Set fire callback
			let f = function() {
				// * Reset grenade thrower bitmap
				if (o.weapon == "grenade") o.updateBitmapSource("unarmed");
				// * Explode mechatek
				else if (isMechatek(o)) {
					console.log("[" + o.id + "] blew up himself with its experimental weapon"); // DEBUG
					o.explode();
				}
				// * Play muzzle animation
				else if (conf.Anim.muzzle) playMuzzle(x1 + muz_x, y1 + muz_y, muz_s, muz_g);
				// * Fire projectile
				ents.Proj.pang.fire(x1, y1, x2, y2, slug);
			};
			// * Play fire animation
			if (o.anim.playing && o.anim.track == "aim") {
					o.playAnimation(o.weapon == "grenade" ? "throw" : "fire", undefined, function() {
						// * Play sound effect
						o.playSound(getRangeSoundKey(o));
						f(); // fire callback
				});
			} else f(); // fire callback
		}
	} else { // dummy
		performDamage(null, null, o.id == "lure_of_limbo");
	}
}

function lureOfLimbo(o, b) { // o = target, b = success flag
	if (b) { // success
		let i = "limbo_" + o.id;
		let s = "limbo_" + (hasHeavyWeapon(o) ? "hw" : "lw");
		let x = o.x;
		let y = o.y;
		let d = o.dir;
		let u;
		o.die();
		u = createAlien(i, x, y, s);
		u.dir = d;
		u.reveal(true); // also update minimap
		scoreKill(o);
		showReport(lang["lure_success"], "red");
		console.log("[" + o.id + "] succumbed to limbo's lure and became a limbo trooper..."); // DEBUG
	} else { // failure
		showReport(lang["lure_failure"], "blue");
		console.log("[" + o.id + "] valiantly resisted to limbo's lure!"); // DEBUG
	}
}

function inflictLethalDamage(o, u, l, d, h) { // o = attacker, u = target, l = damage roll, d = damage value, h = highest die flag ; returns array [damage, killed] => [int, bool]
	let b, n;
	// a. Get damage
	if (!Number.isInteger(d)) {
		if (h && hasBlastWeapon(o) && o.conduct != "bomber") d = l.sort(desc)[0]; // only highest die
		else d = l.reduce(sum); // roll result
		d -= Math.max(0, u.armor); // reduce armor from result
	}
	// b. Apply damage
	if (d > 0) { // hit with damage
		n = u.life;
		u.life = Math.max(0, n - d);
		if (u.life == 0) { // killed
			console.log("[" + o.id + "] killed [" + u.id + "] (" + d + " damage point" + (d > 1 ? "s" : "") + ")");
			scoreKill(u);
			u.explode();
			b = true;
		} else { // wounded
			console.log("[" + o.id + "] wounded [" + u.id + "] (" + d + " damage point" + (d > 1 ? "s" : "") + ")");
			u.hit(true);
			if (moni.status.active && isMarine(u)) updateStatus(u); // a marine is wounded on melee
		}
		d -= Math.max(0, n);
	} else { // hit without damage
		console.log("[" + o.id + "] did nothing to [" + u.id + "]");
		u.hit(false);
	}
	return [d, b];
}

function performDamage(d, b, c) { // d = damage, b = defender won melee flag, c = lure of limbo
	// ---------------------------------------------------------------------------
	if (ents.Line.sight.hidden == false) ents.Line.sight.clear(); // TEMP DEBUG
	// ---------------------------------------------------------------------------
	let i, s, l = term.roll[b ? "defense" : "attack"];
	let o = b ? pawn[game.target[0][2]] : game.actor, u;
	// 1. Set attacker as target if defender won melee
	if (b) game.target = [[ti(game.actor.x), ti(game.actor.y), game.actor.id]];
	// 2. Stop sound
	if (o.range == "shoot" && o.audio != null) o.stopSound();
	// 3. Play buffet animation
	if (o.range == "shoot" && hasBlastWeapon(o)) playBuffet(game.point.x, game.point.y, "blast");
	// 4. Explode bomber
	if (o.conduct == "bomber") o.explode();
	// 5. Damage target
	if (!hasBeamWeapon(o)) {
		let h, r = [];
		for (i = 0; i < game.target.length; i++) {
			u = pawn[game.target[i][2]]; // target in list
			h = ti(game.point.x) == game.target[i][0] && ti(game.point.y) == game.target[i][1]; // target at center of aoe
			if (c) lureOfLimbo(u, l.reduce(sum) == 3); // execute lure of limbo
			else r = inflictLethalDamage(o, u, l, d, !h); // inflict lethal damage
			if (r[1]) s = true; // any target killed
		}
		d = r[0]; // last target damage rest
	}
	// 6. Update sight for all here and alive marines if beam weapon or if any pawn dies
	if (hasBeamWeapon(o) || s) updateMarineSight();
	// 7. Chain attack
	if (o.range == "shoot" && hasChainWeapon(o)) {
		let v, k = 0, q;
		// a. Update roll result
		v = l.reduce(sum) - d;
		l.forEach(function(e, i, a) {
			if (e > 0 && v > 0) {
				a[i] = Math.max(0, e - v);
				v -= e;
			}
		});
		// b. Update roll display
		document.querySelectorAll("#roll output").forEach(function(e) {
			if (e.style.display != "none") {
				e.innerHTML = l[k];
				k++;
			}
		});
		// c. Redraw shoot range
		q = o.getShootRange();
		// d. Set chain flag
		game.chained = d > 0 && q.length > 0; // roll score not exhausted and target list not empty
		// e. Check chain attack
		if (game.chained) {
			delete document.getElementById("action_attack_range").dataset.state; // unlock attack range button
			o.drawShootRange(); // redraw shoot range
			unlockScroll(); // unlock scroll
			setRollButton(lang["end_chain"], "chain", true); // show stop attack button
		} else {
			resetRollButton(); // reset roll button
		}
	}
	// 8. End Attack
	if (!game.chained) {
		setFrameTimeout("attack_end", conf.game.delay.attack_end, function() {
			endAttack();
		});
	}
}

function endAttack() {
	let o = game.actor;
	// * Unset chain flag
	if (game.chained) game.chained = false;
	// * Unset defense flag
	if (game.defense) game.defense = false;
	// * Hide roll
	hideRoll();
	// * Unlock scroll
	unlockScroll();
	if (!(o instanceof Char) || o.conduct == "bomber") { // dummy or bomber
		// * Clear range
		if (hasBlastWeapon(o)) {
			// * Reset hilite
			ents.Rect.hilite.setSlab();
			// * Reset range
			ents.Rect.range.clear();
		}
		// * Reset game actor
		game.actor = null;
		// * Unset focus
		unsetFocus(true); // also update minimap
		// * Hide report
		hideReport();
		// * End alien event
		endAlienEvent();
	} else { // character
		// * Stop character animation
		if (o.anim.playing && o.anim.track == "fire") o.playAnimation("sheathe");
		// * Center on attacker
		if (!isGone(o) && !isOnScreen(o, false)) centerToPixel(o.x, o.y); // screen inner, delayed scroll
		// * Clear range
		if (o.range == "shoot") o.clearShootRange();
		else if (o.range == "melee") o.clearMeleeRange();
		// * Reset game actor cover
		if (game.cover != null) game.cover = null;
		// * Reset grenade thrower properties
		if (o.weapon == "grenade") {
			if (isGrenater(o)) o.changeWeapon("gremkin_rifle");
			else o.updateBitmapSource(); // update bitmap
		}
		// * Handle marine controls
		if (isMarine(o)) {
			// 1. Update status
			if (isAlive(o)) updateStatus(o); // another marine was defender on melee
			// 2. Unlock buttons
			unlockButtons();
			// 3. Reset select buttons
			resetSelectButtons();
			// 4. Check action buttons
			checkActionButtons(o);
			// 5. Allow save
			main.save.prevented = false;
		}
		// * Handle alien controls
		else if (isAlien(o) && isPlayerAlien()) {
			// 1. Hide status
			if (moni.status.active) hideStatus(); // a marine was defender on melee
			// 2. Deactivate action buttons
			deactivateAlienActionButton();
			// 3. End alien acting
			checkAlienActor();
		}
	}
}

// =============================================================================
// -----------------------------------------------------------------------------
// # Buttons
// -----------------------------------------------------------------------------
// =============================================================================

/**

	& BUTTONS STATES

	# State           data-attr       tabindex        class           SET             UNSET           *
		Ready           *               *               *               reset()         *               can be clicked, can be focused
		Activated       *               *               .active         activate()      deactivate()    can be clicked, can be focused, appareance changed
		Locked          locked          -1              *               lock()          unlock()        cannot be clicked, cannot be focused
		Disabled        locked          -1              .disabled       disable()       enable()        cannot be clicked, cannot be focused, appareance changed

*/

function lockButtons(s) { // s = button id (except clause)
	let a = document.getElementById("members").children, i;
	let b = document.getElementById("action").children, j;
	for (i = 0; i < a.length; i++) if (a[i].id != s) a[i].dataset.state = "locked";
	for (j = 0; j < b.length; j++) if (b[j].id != s) b[j].dataset.state = "locked";
}

function unlockButtons() {
	let a = document.getElementById("members").children, i;
	let b = document.getElementById("action").children, j;
	for (i = 0; i < a.length; i++) delete a[i].dataset.state;
	for (j = 0; j < b.length; j++) delete b[j].dataset.state;
}

// =============================================================================
// -----------------------------------------------------------------------------
// # Select
// -----------------------------------------------------------------------------
// =============================================================================

/**

	& SELECT BUTTONS

	# member_n_ + light_m || light_s || light_s
		member_1_ + select  || attack  || move
		member_2_ + select  || attack  || move
		member_3_ + select  || attack  || move
		member_4_ + select  || attack  || move
		member_5_ + select  || attack  || move

*/

////////////////////////////////////////////////////////////////////////////////
// @ Select Lights
////////////////////////////////////////////////////////////////////////////////

function turnSelectLights(b) { // b = on/off
	let a = document.querySelectorAll("#select .light [id$='select']"), i;
	for (i = 0; i < a.length; i++) {
		if (b) a[i].classList.add("active");
		else a[i].classList.remove("active");
	}
}

function resetSelectLights() {
	let a = document.querySelectorAll("#select .light span"), i, e;
	for (i = 0; i < a.length; i++) {
		a[i].classList.remove("disabled");
	}
}

function disableSelectLights(n, b) { // n = member index (only clause), b = skip select light
	let a = document.querySelectorAll("#select .light"), l, i, j, e;
	for (i = 0; i < a.length; i++) {
		if (n !== undefined && n!= null && i + 1 != n) continue;
		l = a[i].querySelectorAll("span");
		for (j = 0; j < l.length; j++) {
			l[j].classList.remove("active");
			if (!(b && l[j].getAttribute("id").indexOf("select") != -1)) l[j].classList.add("disabled");
		}
	}
}

function turnLight(n, s, b) { // n = member index, s = light type (select, move or attack), b = on/off
	let q = document.getElementById("member_" + n + "_" + s);
	if (q.classList.contains("disabled")) q.classList.remove("disabled");
	if (s == "select" && b) turnSelectLights();
	if (b) q.classList.add("active");
	else q.classList.remove("active");
}

////////////////////////////////////////////////////////////////////////////////
// @ Select Buttons
////////////////////////////////////////////////////////////////////////////////

function resetSelectButtons() {
	let a = document.getElementById("members").children, i, o;
	for (i = 0; i < a.length; i++) {
		if (isPlayerMarine(game.player[0])) {
			o = pawn[game.player[0] + leadZero(i + 1)];
			if (typeof(o) === "undefined" || isGone(o)) continue;
		}
		delete a[i].dataset.state;
		a[i].classList.remove("disabled", "active");
		a[i].removeAttribute("tabindex");
	}
}

function disableSelectButtons(n, b) { // n = member index (except clause), b = lock only flag
	n = n || 0;
	let a = document.getElementById("members").children, i;
	for (i = 0; i < a.length; i++) {
		if (i != n - 1) {
			a[i].dataset.state = "locked";
			a[i].classList.remove("active");
			if (!b) a[i].classList.add("disabled");
			else a[i].classList.remove("disabled");
			a[i].setAttribute("tabindex", "-1");
		}
	}
}

// -----------------------------------------------------------------------------

function resetSelectButton(n) { // n = member index
	let q = document.getElementById("member_" + n);
	delete q.dataset.state;
	q.classList.remove("disabled", "active");
	q.removeAttribute("tabindex");
}

function disableSelectButton(n) { // n = member index
	let q = document.getElementById("member_" + n);
	q.dataset.state = "locked";
	q.classList.remove("active");
	q.classList.add("disabled");
	q.setAttribute("tabindex", "-1");
}

/*
function activateSelectButton(n) { // n = member index
	let q = document.getElementById("member_" + n);
	q.classList.add("active");
}
*/

// -----------------------------------------------------------------------------

function setAwolSelectButtons(n) { // n = member index
	let q = document.getElementById("member_" + n);
	q.classList.remove("dead");
	q.classList.add("awol");
}

function unsetAwolSelectButtons(n) { // n = member index
	let q = document.getElementById("member_" + n);
	q.classList.remove("awol");
}

function setGoneSelectButtons(n, b) { // n = member index, b = dead flag
	let q = document.getElementById("member_" + n);
	if (b) q.classList.add("dead");
	disableSelectButton(n);
	disableSelectLights(n);
}

function unsetGoneSelectButtons(n) { // n = member index
	let q = document.getElementById("member_" + n);
	q.classList.remove("dead");
	resetSelectButton(n);
}

////////////////////////////////////////////////////////////////////////////////
// @ Select Controls
////////////////////////////////////////////////////////////////////////////////

function checkSelectControls() {
	let p = game.player[0];
	if (isPlayerMarine(p)) {
		let l = game.team[p].members, k, n, o;
		for (k in l) {
			o = pawn[k];
			n = getIndexFromId(k);
			if (o === undefined) { // awol
				setAwolSelectButtons(n);
			} else if (isGone(o)) { // quit or dead
				unsetAwolSelectButtons(n);
				setGoneSelectButtons(n, isDead(o));
			} else {
				unsetAwolSelectButtons(n);
				unsetGoneSelectButtons(n);
				turnLight(getIndexFromId(o), "move", hasAction(o, "move"));
				turnLight(getIndexFromId(o), "attack", hasAction(o, "attack"));
				turnLight(getIndexFromId(o), "select");
			}
		}
	}
}

// =============================================================================
// -----------------------------------------------------------------------------
// # Action Buttons
// -----------------------------------------------------------------------------
// =============================================================================

/**

	& ACTION BUTTONS

	# action_ + name
		action_ + move
		action_ + attack_range
		action_ + attack_melee
		action_ + order
		action_ + equipment
		action_ + door
		action_ + scanner
		action_ + next

*/

function resetActionButtons() {
	let a = document.getElementById("action").children, i;
	for (i = 0; i < a.length; i++) {
		delete a[i].dataset.state;
		a[i].classList.remove("disabled", "active");
		a[i].removeAttribute("tabindex");
	}
}

function disableActionButtons(s) { // s = action key (except clause)
	let a = document.getElementById("action").children, i;
	for (i = 0; i < a.length; i++) {
		if (s !== undefined && a[i].id == "action_" + s) continue;
		a[i].dataset.state = "locked";
		a[i].classList.remove("active");
		a[i].classList.add("disabled");
		a[i].setAttribute("tabindex", "-1");
	}
}

function deactivateActionButtons() {
	let a = document.getElementById("action").children, i;
	for (i = 0; i < a.length; i++) {
		a[i].classList.remove("active");
	}
}

// -----------------------------------------------------------------------------

function resetActionButton(s) { // s = action key
	let q = document.getElementById("action_" + s);
	delete q.dataset.state;
	q.classList.remove("disabled", "active");
	q.removeAttribute("tabindex");
}

function disableActionButton(s) { // s = action key
	let q = document.getElementById("action_" + s);
	q.dataset.state = "locked";
	q.classList.remove("active");
	q.classList.add("disabled");
	q.setAttribute("tabindex", "-1");
}

function deactivateActionButton(s) { // s = action key
	let q = document.getElementById("action_" + s);
	q.classList.remove("active");
}

/*
function isActionButtonActivated(s) { // s = action key
	let q = document.getElementById("action_" + s);
	return q.classList.contains("active");
}
*/

// =============================================================================
// -----------------------------------------------------------------------------
// # Select Events
// -----------------------------------------------------------------------------
// =============================================================================

function bindSelectButton(e, b) { // e = DOM object, b = force scroll center
	let q = document.getElementById("main");
	if (!(q.classList.contains("red") || q.classList.contains("gold") || q.classList.contains("blue"))) return;
	if (e.dataset.state != "locked" && !e.classList.contains("disabled")) {
		let n = parseInt(e.id.slice(-1));
		let o = pawn[game.player[0] + leadZero(n)];
		// * Select entity
		selectMarine(o);
		// * Scroll to entity if out of screen
		if (b || !isOnScreen(o)) centerToPixel(o.x, o.y);
	}
}

(function() {
	let q = document.getElementById("members"), i;
	for (i = 1; i <= q.children.length; i++) {
		document.getElementById("member_" + i).addEventListener("click", function() {bindSelectButton(this)});
		document.getElementById("member_" + i).addEventListener("dblclick", function() {bindSelectButton(this, true)});
	}
}());

// =============================================================================
// -----------------------------------------------------------------------------
// # Action Events
// -----------------------------------------------------------------------------
// =============================================================================

function bindActionButton(e, s, b) { // e = DOM object, s = action key, b = no actor action flag
	if (e.dataset.state != "locked" && !e.classList.contains("disabled")) {
		let o = game.actor != null ? game.actor : null;
		if (!b && o == null) return;
		if (!e.classList.contains("active")) {
			let k = main.ctrl.action;
			// * Cancel previous action
			if (k != null && k != s) cancelAction(o, k);
			// * Deactivate other action buttons
			deactivateActionButtons();
			// * Deactivate tool buttons
			deactivateToolButtons(tool.button.range); // DEBUG
			// * Activate this button
			e.classList.add("active");
			// * Start this action
			startAction(o, s);
			// * Play sound effect
			if (s == "move"
			 || s == "attack_range"
			 || s == "attack_melee"
			 || s == "switch_door"
			 || s == "end_turn") playSound("member_action");
		} else {
			// * Cancel this action
			cancelAction(o, s);
			// * Play sound effect
			if (s != "give_order"
			 && s != "use_equipment") playSound("action_cancel");
			// * Deactivate this action button
			e.classList.remove("active");
		}
	}
}

document.getElementById("action_move").addEventListener("click", function() {bindActionButton(this, "move")});
document.getElementById("action_attack_range").addEventListener("click", function() {bindActionButton(this, "attack_range")});
document.getElementById("action_attack_melee").addEventListener("click", function() {bindActionButton(this, "attack_melee")});
document.getElementById("action_switch_door").addEventListener("click", function() {bindActionButton(this, "switch_door")});
document.getElementById("action_give_order").addEventListener("click", function() {bindActionButton(this, "give_order", true)});
document.getElementById("action_use_equipment").addEventListener("click", function() {bindActionButton(this, "use_equipment")});
document.getElementById("action_scan").addEventListener("click", function() {bindActionButton(this, "scan")});
document.getElementById("action_end_turn").addEventListener("click", function() {bindActionButton(this, "end_turn", true)});
