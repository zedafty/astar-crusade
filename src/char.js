/*

	char.js (ents.js ext)

*/

// =============================================================================
// -----------------------------------------------------------------------------
// # Characters
// -----------------------------------------------------------------------------
// =============================================================================

/**

	& RANGE DISAMBIGUATION

	# Action          Method          Char.range      Configuration*
		sight           sightRange()    sight           range_sight
		sense           senseRange()    sense           range_sense
		move            moveRange()     move            range_move
		attack_range    shootRange()    shoot           range_shoot
		attack_melee    meleeRange()    melee           range_melee
		switch_door     doorRange()     door            range_door

		* lang.js and conf.js (colors)

	& MOVEMENT CYCLES

		1 path = n moves [tile]
		1 move = n steps [px]
		1 step = n pixel [px]
		e.g. 1 path = 10 moves = 40 steps

*/

class Char extends Pawn {

	//////////////////////////////////////////////////////////////////////////////
	// @ Constructor
	//////////////////////////////////////////////////////////////////////////////

	constructor(id, x, y, type, subt, dir, weapon) {

		// * Global
		super(id, x, y, type, subt);
		this.width = conf.Char.width;
		this.height = conf.Char.height;

		// * Local
		this.dir = dir || conf.Char.dir;

		// * Game
		this.action = {"move" : 1, "attack_range" : 1, "attack_melee" : 1};
		this.movement = conf.game.movement;
		this.weapon = weapon || null;
		this.last_weapon = null;
		this.attack = {};
		this.condition = {"invisible" : false, "frenzy" : false, "elite" : false}; // NEW

		// * Action
		this.range = null; // move, shoot, melee, door

		// * Movement
		this.moving = false; // move flag
		this.stopped = false; // stop flag

		// * Path
		this.has_path = false;
		this.path = [];
		this.path_index = 0;

		// * Move
		this.has_move = false;
		this.add = {"x" : 0, "y" : 0}; // tile
		this.dest = {"x" : 0, "y" : 0}; // tile
		this.move = {"x" : 0, "y" : 0, "last_x" : 0, "last_y" : 0, "count" : 0}; // tile

		// * Step
		this.step_speed = 0; // pixel
		this.step = {"x" : 0, "y" : 0, "count" : 0}; // pixel
		this.step_rest = {"x" : 0, "y" : 0}; // pixel
		this.step_stop = {"x" : 0, "y" : 0}; // pixel

		// * Conduct
		this.conduct = null;

		// * Targetting
		this.target = null; // targetted hostile
		this.hostile = {"sight" : null, "sense" : []}; // detected hostile list

		// * Graphics
		this.angle = 0; // bitmap rotation (radian)
		this.img = null; // character bitmap source
		this.wmg = null; // weapon bitmap source
		this.src_x = 0; // character bitmap source x
		this.src_y = 0; // character bitmap source y
		this.wrc_x = 0; // weapon bitmap source x
		this.wrc_y = 0; // weapon bitmap source y
		this.anim = {
			"playing" : false, // animation active flag
			"track" : 0, // track index
			"slide" : 0, // slide index
			"count" : 0, // number of frames
			"angle" : null, // bitmap rotation override (radian)
			"callback" : null // callback function
		};

	}

	//////////////////////////////////////////////////////////////////////////////
	// @ Set Position
	//////////////////////////////////////////////////////////////////////////////

	setPosition() {
		if (hasFourTiles(this)) { // TEMP

			this.last_tile = [
				[ti(this.x), ti(this.y), game.grid[ti(this.x)][ti(this.y)]], // register last tile (which is current tile actually)
				[ti(this.x)+1, ti(this.y), game.grid[ti(this.x)+1][ti(this.y)]], // register last tile (which is current tile actually)
				[ti(this.x), ti(this.y)+1, game.grid[ti(this.x)][ti(this.y)+1]], // register last tile (which is current tile actually)
				[ti(this.x)+1, ti(this.y)+1, game.grid[ti(this.x)+1][ti(this.y)+1]] // register last tile (which is current tile actually)
			];

			game.grid[ti(this.x)][ti(this.y)] = [this.type, this.id]; // update grid
			game.grid[ti(this.x)+1][ti(this.y)] = [this.type, this.id]; // update grid
			game.grid[ti(this.x)][ti(this.y)+1] = [this.type, this.id]; // update grid
			game.grid[ti(this.x)+1][ti(this.y)+1] = [this.type, this.id]; // update grid

		} else {
			super.setPosition();
		}
	}

	//////////////////////////////////////////////////////////////////////////////
	// @ Reset Position
	//////////////////////////////////////////////////////////////////////////////

	resetPosition() {
		if (hasFourTiles(this)) { // TEMP
			game.grid[this.last_tile[0][0]][this.last_tile[0][1]] = this.last_tile[0][2]; // recall last tile
			game.grid[this.last_tile[1][0]][this.last_tile[1][1]] = this.last_tile[1][2]; // recall last tile
			game.grid[this.last_tile[2][0]][this.last_tile[2][1]] = this.last_tile[2][2]; // recall last tile
			game.grid[this.last_tile[3][0]][this.last_tile[3][1]] = this.last_tile[3][2]; // recall last tile
		} else {
			super.resetPosition();
		}
	}

	//////////////////////////////////////////////////////////////////////////////
	// @ Update Bitmap Direction
	//////////////////////////////////////////////////////////////////////////////

	updateBitmapDirection() {
		this.angle = 0;
		if (!(isAlien(this) && this.unseen)) { // not bleep
			if (this.dir == "nn" || this.dir == "nw") this.angle = Math.PI;
			else if (this.dir == "ww" || this.dir == "sw") this.angle = 1/2 * Math.PI;
			else if (this.dir == "ee" || this.dir == "ne") this.angle = -1/2 * Math.PI;
		}
	}

	//////////////////////////////////////////////////////////////////////////////
	// @ Update Bitmap Source
	//////////////////////////////////////////////////////////////////////////////

	updateBitmapSource(key) { // key = weapon key (optional)
		this.wmg = null;
		if (this.unseen) {
			this.img = spr.char.bleep.img;
		} else {
			if (key === undefined) key = this.last_weapon != null ? this.last_weapon : this.weapon;
			this.img = spr.char[this.subt == "limbo_lw" || this.subt == "limbo_hw" ? "limbo_tr" : this.subt].img; // TEMP
			if (key != null) this.wmg = spr.weap[getBaseWeapon(key)].img;
		}
	}

	//////////////////////////////////////////////////////////////////////////////
	// @ Change weapon
	//////////////////////////////////////////////////////////////////////////////

	changeWeapon(s) { // s = weapon key
		if (s === undefined) s = this.weapon; // TEMP
		if (s === null) s = "unarmed";
		this.weapon = s;
		setWeaponAttack(this);
		this.updateBitmapSource(s);
	}

	//////////////////////////////////////////////////////////////////////////////
	// @ Conceal
	//////////////////////////////////////////////////////////////////////////////

	conceal(b) { // b = update minimap flag
		// * Reset four-tiles sprite size
		if (hasFourTiles(this)) { // TEMP -- only if not hidden or not size doubled ?
			this.width /= 2;
			this.height /= 2;
		}
		super.conceal(b);
		this.updateBitmapSource();
		this.updateBitmapDirection();
	}

	//////////////////////////////////////////////////////////////////////////////
	// @ Reveal
	//////////////////////////////////////////////////////////////////////////////

	reveal(b, s) { // b = update minimap flag, s = entity id
		// * Reset four-tiles sprite size
		if (hasFourTiles(this)) { // TEMP -- only if hidden or size doubled ?
			this.width *= 2;
			this.height *= 2;
		}
		super.reveal(b, s);
		this.updateBitmapSource();
		this.updateBitmapDirection();
	}

	//////////////////////////////////////////////////////////////////////////////
	// @ Leave (area)
	//////////////////////////////////////////////////////////////////////////////

	leave() {
		// * Clear range(s)
		this.clearRange();
		super.leave();
	}

	//////////////////////////////////////////////////////////////////////////////
	// @ Sort Hostile
	//////////////////////////////////////////////////////////////////////////////

	static sortHostile(o, s) { // o = entity, s = detect stack (stack or sense)
		// console.time("sortHostile"); // DEBUG
		let l = [], a = [], b, k, u, d, p;
		for (k in o.hostile[s]) {
			u = pawn[o.hostile[s][k]]
			if (u !== undefined && !isGone(u)) {
				p = getEmptyTileAround(game.grid, ti(u.x), ti(u.y), o.plinth.width, o.plinth.height, true, null, getExcludeTypeList(o), !canStopOnDoorRail(o), o.id, [ti(o.x), ti(o.y)]);
				if (p.length > 0) {
					d = o.findPath(p[0][0], p[0][1], true).length; // path length to hostile
					if (d > 0 && d < conf.mupt.track_dist) {
						l.push([d, u.id]);
						b = true;
					}
				}
				if (!b) a.push(u.id); // inaccessible hostile -- TEMP
				/*
					// TODO !!! what if adjacent ??? then distance is null or 0
					BEFORE, out of tracking range hostile were removed
					but, there is possibility that an hostile is at sight but out of path
					FOR NOW put out path of hostile at the end of the hostile loop (i.e. will match only if no other hostile exists)
					---
					SOLUTION is lower path to nearest tile in sight OR lower to destination
				*/
			} else {
				console.log("BUG"); // DEBUG
			}
		}
		l.sort(arr_asc); // sort array
		l.forEach(function(e, i, a) {a[i] = e[1]}); // reduce array

		o.hostile[s] = l.concat(a); // reset hostile list -- TEMP

		// console.timeEnd("sortHostile"); // DEBUG
		// console.log("[" + o.id + "] nearest hostile in " + s + (o.hostile[s].length > 0 ? " : " + o.hostile[s].join(", ") : " not found")); // DEBUG
	}

	//////////////////////////////////////////////////////////////////////////////
	// @ Get Nearest Hostile
	//////////////////////////////////////////////////////////////////////////////

	static getNearestHostile(o, s) { // o = entity, s = detect stack (stack or sense)
		// console.time("getNearestHostile"); // DEBUG
		let k, u, r1, r2;
		if (o.hostile[s].length > 0) {
			// 1. Sort hostile list by path length
			Char.sortHostile(o, s);
			// 2. Get first hostile accessible
			for (k in o.hostile[s]) {
				u = pawn[o.hostile[s][k]];
				if (!isVisible(u)) continue; // skip invisible
				if (hasBlastWeapon(o)
				 && (!u.hasSightGreaterThan(1)
				 || hasAdjacentCellOfValue(game.grid, ti(u.x), ti(u.y), getFriendTypeList(o), true))) { // blaster's target sight equal to one or friend around target
					r2 = u.id;
					continue;
				}
				if (u !== undefined && (isAdjacentEnt(o, u)
				 || hasEmptyTileAround(game.grid, ti(u.x), ti(u.y), o.plinth.width, o.plinth.height, true))) { // is adjacent or reachable
					r1 = u.id;
					break;
				}
			}
		}
		// console.timeEnd("getNearestHostile"); // DEBUG
		return r1 === undefined && r2 !== undefined ? r2 : r1;
	}

	//////////////////////////////////////////////////////////////////////////////
	// @ Get Target
	//////////////////////////////////////////////////////////////////////////////

	getTarget(b, f) { // b = sight only flag, f = nearest in sight or sense flag

		if (conf.debug.time.target) console.time("getTarget"); // DEBUG

		let u, u1, u2, s, q;

		// * Get nearest hostile in sight
		s = "sight";
		u1 = Char.getNearestHostile(this, s);

		// * Get nearest hostile in sense
		if (!b && (f || u1 === undefined)) {
			s = "sense";
			u2 = Char.getNearestHostile(this, s);
		}

		// * Compare nearest in sight and nearest in sense path length
		if (f && u1 !== undefined && u2 !== undefined && u1 != u2) {
			let d1 = this.findPath(ti(pawn[u1].x), ti(pawn[u1].y), true).length; // path length to hostile
			let d2 = this.findPath(ti(pawn[u2].x), ti(pawn[u2].y), true).length; // path length to hostile
			if (d1 <= d2) q = true; // target hostile in sight
		}

		// * Set target
		if (u1 === undefined && u2 === undefined) {
			s = null;
		} else if (q || (!f && u1 !== undefined)) {
			u = u1;
			s = "sight";
		} else if (!b) {
			u = u2;
		}

		// console.log("[" + this.id + "] " + (u == null ? "no target found" : "targetted [" + u + "] (" + s + ")")); // DEBUG
		if (conf.debug.time.target) console.timeEnd("getTarget"); // DEBUG

		return [u, s];
	}

	//////////////////////////////////////////////////////////////////////////////
	// @ Detect
	//////////////////////////////////////////////////////////////////////////////

	/**

		& DETECT UPDATE

			Marine sense is never updated (useless).
			Marine sight is updated on each move (detect hidden and unseen entities).
			Alien sense is updated on action start (detect hostiles in sense).
			Alien sight is updated on action start and is also update on each move (detect hostiles in sight).

		& DETECT ALIAS

		# Method                  Update          Return
			updateSight()           sight (list)    *
			updateSense()           sense (list)    *
			getSightRange()         *               point list (seen tiles)
			getSenseRange()         *               point list (sensed tiles)
			drawSightRange()        range (rect)    *
			drawSenseRange()        range (rect)    *
			hasSightGreaterThan()   *               boolean (seen tiles)

	*/

	detect(blind, sense, beg, end, pts, grt, draw, card, empty) { // blind = no update flag, sense = pass through obstacles flag, beg, end = segment (brad), pts = excluded points, grt = sight greater than (int), draw = draw range flag, card = cardinal angle flag, empty = only empty tiles flag ; returns point list

		let lim = sense ? conf.Char.sense : conf.Char.sight; // scan length in tiles
		let max = (card ? 1 : conf.Char.radian_segment) * 8; // number of rays
		let ang = card ? cardToOcto(this.dir) : cardToBrad(this.dir); // base angle in octo or brad
		let rad = 2 * Math.PI / max; // angle increment in radian
		let cos; // ray x angle
		let sin; // ray y angle
		let l = [];
		let i, j, k, q, n, m, x, y, c, v, o;
		let r = false; // sight greater than p

		let orig_x = ti(this.x);
		let orig_y = ti(this.y);

		if (beg == null) beg = 0; // beginning segment relative to base angle
		if (end == null) end = max - 1; // ending segment relative to base angle
		if (!pts) pts = [];

		this.hostile.sight = []; // reset hostiles in sight

		if (conf.debug.draw.detect) draw = true; // DEBUG

		if (conf.debug.time.detect) console.time("detect"); // DEBUG

		for (i = 0; i < (hasFourTiles(this) ? 4 : 1); i++) { // TEMP

			if (hasFourTiles(this)) { // TEMP
				switch(i) { // override begin segment
					case 0 : ang = 160; break; // top-left corner
					case 1 : ang = 224; break; // top-right corner
					case 2 : ang = 96; break; // bottom-left corner
					case 3 : ang = 32; break; // bottom-right corner
				}
				orig_x = ti(this.x) + (i % 2); // move horizontal origin
				orig_y = ti(this.y) + (i < 2 ? 0 : 1); // move vertical origin
				end = 64; // override end segment
			}

			outer:
			for (j = beg; j <= end; j++) { // ray

				// * Spread rays alternatively clockwise and counter-clockwise
				if (!card) {
					q = Math.floor(j / 2);
					k = j % 2 == 0 ? ang + q : ang - j + q;
					if (k > 255) k = Math.abs(255 - k);
				} else k = ang + j; // only clockwise

				cos = Math.cos(k * rad);
				sin = Math.sin(k * rad);

				inner:
				for (n = 0; n <= lim; n++) { // tile

					x = orig_x + Math.round(n * cos);
					y = orig_y + Math.round(n * sin);

					if (!isTileOnBoard(x, y)) break inner; // out of board
					if (x == orig_x && y == orig_y) continue inner; // origin
					if (hasPointOfValue(l, x, y, 0)) continue inner; // blank tile already scanned
					if (hasPoint(l, x, y)) { // any tile already scanned
						if (sense) continue inner;
						else break inner;
					}

					if (hasPoint(pts, x, y)) { // excluded point
						v = 0; // set empty
					} else if (!sense && !hasLos(orig_x, orig_y, x, y, pts)) { // no line of sight
						v = -1; // set blocked
					} else {
						c = game.grid[x][y]; // store current cell
						v = isCellEmpty(c) ? 0 : -1; // -1 = block, 0 = empty, 1 = target
						if (!((isItem(c[0]) || isAlien(c[0])) && pawn[c[1]].hidden)
						 && getAttackableTypeList(this, conf.game.friendly_fire).includes(c[0])) v = 1; // entity is visible and type matches any allowed target type
						if (isItem(c[0]) || isMarine(c[0]) || isAlien(c[0])) v = 1; // target tile
						if (!blind) {
							if (isMarine(this)) { // marine
								if (isItem(c[0]) || isAlien(c[0])) { // is item or alien
									o = pawn[c[1]];
									if (o.hidden || o.unseen) {
										o.reveal(false, this.id); // revealed by
									}
								}
							} else { // alien
								if (getHostileTypeList(this).includes(c[0])) { // is hostile to this
									o = pawn[c[1]];
									if (!this.hostile.sense.includes(o.id)) this.hostile.sense.push(o.id); // remember hostile in sense if not already detected
									if (!sense) {
										this.hostile.sight.push(o.id); // remember hostile in sight
										if (!isHoveringEnt(this, i) && (this.hidden || this.unseen)) { // in sight range, if this see hostile then hostile see this
											this.reveal(false, o.id); // revealed by
											if (this.moving) this.setPath(true); // reset path while moving
										}
									}
								}
							}
						}
						// A. Strict sight
						l.push([x, y, v]);
						if (v == -1 || v == 1) break inner; // block or target
					}
					// B. Loose sight
					// l.push([x, y, v]);
					// if (v == -1 || v == 1) break inner; // block or target
					// C. Sight greater than
					if (Number.isInteger(grt) && n > grt) {
						r = true;
						break outer;
					}
				}
			}
		}

		if (conf.debug.time.detect) console.timeEnd("detect"); // DEBUG

		// * Get result (1)
		if (Number.isInteger(grt)) return r;

		// * Update minimap
		if (!blind && isMarine(this)) term.updateMiniMap();

		// * Remove positive value
		if (empty) l = l.filter(function(e) {return e[2] < 1}); // only negative

		// * Transform zero value to positive
		l.forEach(function(e) {if (e[2] == 0) e[2] = 1}); // floor tile

		// * Remove negative value
		l = l.filter(function(e) {return e[2] > 0}); // only positive

		// * Remove third value (i.e. reduce to a value-less point list)
		l.forEach(function(e) {e.splice(2, 1)}); // remove element at index 2

		// * Draw detected tiles
		if (draw) ents.Rect.range.draw(l, "range_" + (sense ? "sense" : "sight"), true); // DEBUG

		// console.log("Point list length = " + l.length); // DEBUG

		// * Get result (2)
		if (blind) return l;

	}

	updateSight(beg, end, pts) {
		this.detect(false, false, beg, end, pts);
	}

	updateSense(beg, end, pts) {
		this.detect(false, true, beg, end, pts);
	}

	getSightRange(beg, end, pts, card, empty) {
		return this.detect(true, false, beg, end, pts, null, false, card, empty);
	}

	getSenseRange(beg, end, pts, card, empty) {
		return this.detect(true, true, beg, end, pts, null, false, card, empty);
	}

	drawSightRange(beg, end, pts, card) {
		// * Draw walkable tiles
		this.detect(true, false, beg, end, pts, null, true, card);
		// * Set action range
		this.range = "sight";
	}

	drawSenseRange(beg, end, pts, card) {
		// * Draw walkable tiles
		this.detect(true, true, beg, end, pts, null, true, card);
		// * Set action range
		this.range = "sense";
	}

	hasSightGreaterThan(len) {
		return this.detect(true, false, null, null, null, len);
	}

	//////////////////////////////////////////////////////////////////////////////
	// @ Clear Sight Range
	//////////////////////////////////////////////////////////////////////////////

	clearSightRange() {
		// * Reset range
		ents.Rect.range.clear();
		// * Unset action range
		this.range = null;
	}

	//////////////////////////////////////////////////////////////////////////////
	// @ Clear Sight Range
	//////////////////////////////////////////////////////////////////////////////

	clearSenseRange() {
		// * Reset range
		ents.Rect.range.clear();
		// * Unset action range
		this.range = null;
	}

	//////////////////////////////////////////////////////////////////////////////
	// @ Get Move Range
	//////////////////////////////////////////////////////////////////////////////

	getMoveRange(len) { // len = movement length (tile)

		if (!Number.isInteger(len)) len = this.movement;
		let lim = len - 1; // arbitrary value ; at max, the unknow tiles are located at range minus first ring
		let orig_x = ti(this.x);
		let orig_y = ti(this.y);
		let min_x, max_x, x;
		let min_y, max_y, y;
		let i, j, k, n, v, s;
		let l = [];
		let h = getPassThroughTypeList(this, true); // hoverable tiles (excluding doors)
		let r = false; // reverse loop

		if (conf.debug.time.range_move) console.time("getMoveRange"); // DEBUG

		// A. Range first pass
		for (k = 1; k <= len; k++) {

			min_x = min_y = -k;
			max_x = max_y = k;

			outer:
			for (j = min_y; j <= max_y; j++) { // -2, -1, 0, 1, 2

				if (!r && j > min_y && j < max_y) { min_x = max_x = -k; }
				if (!r && j == max_y) { r = true; min_x = max_x = k; j = min_y; continue outer; }
				if (r && j == max_y) { r = false; min_x = -k; max_x = k; }

				for (i = min_x; i <= max_x; i++) { // -2, -1, 0, 1, 2

					x = orig_x + i;
					y = orig_y + j;

					if (!isTileOnBoard(x, y)) continue; // skip out of area tiles

					if (!isPlinthEmpty(game.grid, x, y, this.plinth.width, this.plinth.height, isMarine(this), getPassThroughTypeList(this), getExcludeTypeList(this), false, this.id)) { // anything but floor, closed door, hidden pawns and pawns of this type

						l.push([x, y, 0]); // unwalkable (red)

					} else if (k == 1) { // first ring ; always in range if walkable

							s = h.includes(game.grid[x][y][0]) && game.grid[x][y][1] != this.id  ? -1 : 1; // not of same type if not self
							l.push([x, y, 1 * s]);

					} else { // check if adjacent tile is different than zero and if absolute value is lower than range

						v = getLowestAdjacentPoint(l, x, y);

						if (v != null) {

							if (v != 0 && Math.abs(v) < len) {

								s = h.includes(game.grid[x][y][0]) ? -1 : 1; // not of same type
								l.push([x, y, (Math.abs(v) + 1) * s]); // in range (green)

							} else {
								l.push([x, y, NaN]); // out of range (yellow)
							}

						} else {
							l.push([x, y, null]); // unknow (cyan)
						}

					}
				}
			}
		}

		// console.log("range : first pass"); // DEBUG
		// console.log(l.join("\n")); // DEBUG

		// B. Range subsidiary passes

		// console.log("range : subsidiary passes"); // DEBUG

		while (lim > 0) {
			// console.log("pass #" + lim + ); // DEBUG
			for (k = 0; k < l.length; k++) {
				if (l[k][2] == null || Number.isNaN(l[k][2])) { // only unknow and out of range
					x = l[k][0];
					y = l[k][1];
					v = getLowestAdjacentPoint(l, x, y);
					if (v != null) {
						if (Math.abs(v) < len) {
							s = h.includes(game.grid[x][y][0]) ? -1 : 1; // not of same type
							l[k][2] = (Math.abs(v) + 1) * s;
						} else {
							l[k][2] = NaN;
						}
					}
				}
			}
			lim--;
		}

		if (conf.debug.time.range_move) console.timeEnd("getMoveRange"); // DEBUG

		// console.log(l.sort().join("\n")); // DEBUG

		// * Remove negative value
		l = l.filter(function(e) {return e[2] > 0}); // only positive

		// * Get result
		return l;

	}

	//////////////////////////////////////////////////////////////////////////////
	// @ Draw Move Range
	//////////////////////////////////////////////////////////////////////////////

	drawMoveRange(len) { // len = movement length
		// * Get tiles
		let l = this.getMoveRange(len);
		// * Draw walkable tiles
		ents.Rect.range.draw(l, "range_move", true);
		// * Set action range
		this.range = "move";
	}

	//////////////////////////////////////////////////////////////////////////////
	// @ Clear Move Range
	//////////////////////////////////////////////////////////////////////////////

	clearMoveRange() {
		// * Reset range
		ents.Rect.range.clear();
		// * Unset action range
		this.range = null;
		// * Hide report
		hideReport();
	}

	//////////////////////////////////////////////////////////////////////////////
	// @ Get Shoot Range
	//////////////////////////////////////////////////////////////////////////////

	getShootRange(beg, end) { // beg, end = segment (octo or brad)

		let blast = hasBlastWeapon(this); // blast weapon flag
		let beam = hasBeamWeapon(this); // beam weapon flag
		let lim = conf.Char.sight; // scan length in tiles
		let max = (beam ? 1 : conf.Char.radian_segment) * 8; // number of rays
		let ang = beam ? cardToOcto(this.dir) : cardToBrad(this.dir); // base angle in octo or brad
		let rad = 2 * Math.PI / max; // angle increment in radian
		let cos; // ray x angle
		let sin; // ray y angle
		let l = [];
		let i, j, k, q, n, m, x, y, c, v;

		let orig_x = ti(this.x);
		let orig_y = ti(this.y);

		if (beg == null) beg = 0; // beginning segment relative to base angle
		if (end == null) end = max - 1; // ending segment relative to base angle

		if (conf.debug.time.range_shoot) console.time("getShootRange"); // DEBUG

		for (i = 0; i < (hasFourTiles(this) ? 4 : 1); i++) { // TEMP

			if (hasFourTiles(this)) { // TEMP
				switch(i) { // override begin segment
					case 0 : ang = 160; break; // top-left corner
					case 1 : ang = 224; break; // top-right corner
					case 2 : ang = 96; break; // bottom-left corner
					case 3 : ang = 32; break; // bottom-right corner
				}
				orig_x = ti(this.x) + (i % 2); // move horizontal origin
				orig_y = ti(this.y) + (i < 2 ? 0 : 1); // move vertical origin
				end = 64; // override end segment
			}

			outer:
			for (j = beg; j <= end; j++) { // ray

				cos = Math.cos((ang + j) * rad);
				sin = Math.sin((ang + j) * rad);

				inner:
				for (n = 0; n <= lim; n++) { // tile

					x = orig_x + Math.round(n * cos);
					y = orig_y + Math.round(n * sin);

					if (!isTileOnBoard(x, y)) break inner; // out of board
					if (x == orig_x && y == orig_y) continue inner; // origin

					if (beam) { // beam

						if (hasPoint(l, x, y)) continue inner; // blank or target tile already scanned
						if (hasPointOfValue(l, x, y, -1)) break inner; // block tile already scanned

						c = game.grid[x][y]; // store current cell
						v = isWall(c[0]) || isDoor(c[0], true) ? -1 : j; // wall or closed door

						l.push([x, y, v]);
						if (v == -1) break inner; // block tile

					} else { // blast or bullet

						if (hasPointOfValue(l, x, y, 0)) continue inner; // blank tile already scanned
						if (hasPoint(l, x, y)) break inner; // any tile already scanned

						if (!hasLos(orig_x, orig_y, x, y)) { // no line of sight
							v = -1; // set blocked
						} else {
							c = game.grid[x][y]; // store current cell
							v = isCellEmpty(c, true) ? 0 : -1 // -1 = block, 0 = empty, 1 = target
							if (!((isItem(c[0]) || isAlien(c[0])) && pawn[c[1]].hidden)
							 && getAttackableTypeList(this, conf.game.friendly_fire).includes(c[0])) v = 1; // entity is visible and type matches any allowed target type
							// A. Strict sight
							l.push([x, y, v]);
							if (v == -1 || v == 1) break inner; // block or target
						}
					// B. Loose sight
					// l.push([x, y, v]);
					// if (v == -1 || v == 1) break inner; // block or target
					}
				}
			}
		}

		if (conf.debug.time.range_shoot) console.timeEnd("getShootRange"); // DEBUG

		// * Transform zero value to positive (i.e. target ground)
		if (blast) {
			l.forEach(function(e) {if (e[2] == 0) e[2] = 1}); // floor tile
		}

		// * Convert third-value to Pi quarter numerators (i.e. register proper direction)
		else if (beam) {
			// Order       Formula         Source      Result      Cardinal
			// #1          8/4 * Pi        0           8           "ee"
			// #2          7/4 * Pi        1           7           "se"
			// #3          6/4 * Pi        2           6           "ss"
			// #4          5/4 * Pi        3           5           "sw"
			// #5          4/4 * Pi        4           4           "ww"
			// #6          3/4 * Pi        5           3           "nw"
			// #7          2/4 * Pi        6           2           "nn"
			// #8          1/4 * Pi        7           1           "ne"
			l.forEach(function(e) {
				if (e[2] >= 0 && e[2] < 8) e[2] = 8 - e[2]; // pi quarter
			});
		}

		// * Remove negative value
		l = l.filter(function(e) {return e[2] > 0}); // only positive

		// * Remove third value (i.e. reduce to a value-less point list)
		if (!beam) {
			l.forEach(function(e) {e.splice(2, 1)}); // remove element at index 2
		}

		// * Get result
		return l;

	}

	//////////////////////////////////////////////////////////////////////////////
	// @ Draw Shoot Range
	//////////////////////////////////////////////////////////////////////////////

	drawShootRange(beg, end) { // beg, end = segment (brad)
		// * Get tiles
		let l = this.getShootRange(beg, end);
		// * Set hilite
		if (hasBlastWeapon(this)) ents.Rect.hilite.setSquare(l);
		else if (hasBeamWeapon(this)) ents.Rect.hilite.setLine(l);
		// * Draw targets
		ents.Rect.range.draw(l, "range_shoot", true);
		// * Set action range
		this.range = "shoot";
		// * Report target range
		showReport(lang["range_shoot"]);
	}

	//////////////////////////////////////////////////////////////////////////////
	// @ Clear Shoot Range
	//////////////////////////////////////////////////////////////////////////////

	clearShootRange() {
		// * Reset hilite
		ents.Rect.hilite.setSlab();
		// * Reset range
		ents.Rect.range.clear();
		// * Unset action range
		this.range = null;
		// * Hide report
		hideReport();
	}

	//////////////////////////////////////////////////////////////////////////////
	// @ Draw Melee Range
	//////////////////////////////////////////////////////////////////////////////

	drawMeleeRange() {

		// * Get targets
		let a = game.grid, d = this.attack.assault_blade;
		let x = ti(this.x), y = ti(this.y);
		let v = getAttackableTypeList(this, conf.game.friendly_fire);
		let i, j, n, l = [];
		for (i = x - 1; i <= x + 1; i++) {
			for (j = y - 1; j <= y + 1; j++) {
				if (!(i == x && j == y)) { // not myself
					if (d || (i == x || j == y)) { // diagonal or lineal
						for (n in v) {
							if (a[i][j][0] == v[n]) { // entity type matches target type
								l.push([i, j]);
							}
						}
					}
				}
			}
		}

		// * Draw targets
		ents.Rect.range.draw(l, "range_melee", true);

		// * Set action range
		this.range = "melee";

		// * Report target melee
		showReport(lang["range_melee"]);

	}

	//////////////////////////////////////////////////////////////////////////////
	// @ Clear Melee Range
	//////////////////////////////////////////////////////////////////////////////

	clearMeleeRange() {
		// * Reset range
		ents.Rect.range.clear();
		// * Unset action range
		this.range = null;
		// * Hide report
		hideReport();
	}

	//////////////////////////////////////////////////////////////////////////////
	// @ Draw Door Range
	//////////////////////////////////////////////////////////////////////////////

	drawDoorRange() {

		let e, l, k;

		// 1. Airlock Control Event, show all doors on map
		if (hasEventActive("airlock_control", getTypeKey(this))) {
			l = [];
			for (k in pawn) {
				e = pawn[k];
				if (isDoor(e)) { // any door (closed or opened)
					l.push([ti(e.x), ti(e.y)]);
				}
			}
		}

		// 2. No airlock control, show only nearby door
		else {
			e = pawn[getDoorAround(this)];
			l = [[ti(e.x), ti(e.y)], [ti(pawn[e.opposite].x), ti(pawn[e.opposite].y)]];
		}

		// * Draw targets
		ents.Rect.range.draw(l, "range_door", true);

		// * Set action range
		this.range = "door";

		// * Report target door
		showReport(lang["range_door"]);

	}

	//////////////////////////////////////////////////////////////////////////////
	// @ Clear Door Range
	//////////////////////////////////////////////////////////////////////////////

	clearDoorRange() {
		// * Reset range
		ents.Rect.range.clear();
		// * Unset action range
		this.range = null;
		// * Hide report
		hideReport();
	}

	//////////////////////////////////////////////////////////////////////////////
	// @ Switch Door
	//////////////////////////////////////////////////////////////////////////////

	switchDoor(x, y) { // x, y = tile
		// 1. Clear target door
		this.clearDoorRange();
		// 2. Get door
		let o = pawn[game.grid[x][y][1]];
		let door = isDoor(o) ? o : pawn[o.last_tile[2][1]];
		// 3. Update scroll when door is switched while moving
		if (this.moving) {
			if ((isMarine(this) && conf.scen.scrl.auto_scroll.marine == "center")
			 || (isAlien(this) && conf.scen.scrl.auto_scroll.alien == "center"))
				updateScrollCenter(this.hidden ? door : this); // scroll on door if character hidden
			else if ((isMarine(this) && conf.scen.scrl.auto_scroll.marine == "bound")
			 || (isAlien(this) && conf.scen.scrl.auto_scroll.alien == "bound"))
				updateScrollAtBound(this.hidden ? door : this); // scroll on door if character hidden
		}
		// 4. Turn to door
		if (!hasEventActive("airlock_control", getTypeKey(this))) // not if airlock_control
			this.turnTo(getDir(this.x, this.y, door.x, door.y));
		// 5. Switch door
		let instant = conf.Char.switch_door_instant ? this.hidden : false;
		if (door.hidden) {
			door.close(instant);
		} else {
			// A. Open Door
			door.open(instant);
			// B. Update sight for all here and alive marines
			updateMarineSight(); // NEW
		}
	}

	//////////////////////////////////////////////////////////////////////////////
	// @ Clear Range
	//////////////////////////////////////////////////////////////////////////////

	clearRange() {
		switch(this.range) {
			case "sight" : this.clearSightRange(); break;
			case "sense" : this.clearSenseRange(); break;
			case "move" : this.clearMoveRange(); break;
			case "shoot" : this.clearShootRange(); break;
			case "melee" : this.clearMeleeRange(); break;
			case "door" : this.clearDoorRange(); break;
		}
	}

	//////////////////////////////////////////////////////////////////////////////
	// @ Turn To (entity or direction)
	//////////////////////////////////////////////////////////////////////////////

	turnTo(v) { // v = entity or cardinal direction
		this.dir = typeof(v) === "object" ? getDirEnt(this, v) : v;
		this.updateBitmapDirection();
	}

	//////////////////////////////////////////////////////////////////////////////
	// @ Move Of (distance)
	//////////////////////////////////////////////////////////////////////////////

	moveOf(x, y) { // x, y = tile
		// * Set destination
		this.dest.x = ti(this.x) + x;
		this.dest.y = ti(this.y) + y;
		// * Set move increments from origin
		this.add.x = x;
		this.add.y = y;
		// * Set path
		this.setPath(); // new path
	}

	//////////////////////////////////////////////////////////////////////////////
	// @ Move To (point)
	//////////////////////////////////////////////////////////////////////////////

	moveTo(x, y, b) { // x, y = tile, b = move to closest
		// * Set destination
		this.dest.x = x;
		this.dest.y = y;
		// * Set move increments from origin
		this.add.x = x - ti(this.x);
		this.add.y = y - ti(this.y);
		// * Set path
		this.setPath(false, b); // new path
	}

	//////////////////////////////////////////////////////////////////////////////
	// @ Start Move
	//////////////////////////////////////////////////////////////////////////////

	startMove() {
		// * Lock scroll during auto-scroll
		if ((isMarine(this) && conf.scen.scrl.auto_scroll.marine != null)
		 || (isAlien(this) && conf.scen.scrl.auto_scroll.alien != null))
			lockScroll();
		// * Set moving
		this.moving = true; // move start
		// * Play character animation
		this.playAnimation("move");
		// * Clear move range
		this.clearMoveRange();
		// * Unset focus
		unsetFocus();
		// * Set move action done
		this.action.move--; // set move action done
		// * Draw path lines
		if (conf.debug.draw.path) ents.Line.path.draw(this.x, this.y, null, null, this.path); // DEBUG
	}

	//////////////////////////////////////////////////////////////////////////////
	// @ End Move
	//////////////////////////////////////////////////////////////////////////////

	endMove() {
		console.log("[" + this.id + "] moved " + this.move.count + " tile" + (this.move.count > 1 ? "s" : "") + " (" + ti(this.x) + "," + ti(this.y) + ")"); // DEBUG
		// * Clear path lines
		if (conf.debug.draw.path) ents.Line.path.clear(); // DEBUG
		// * Stop character animation
		this.stopAnimation();
		// * Reset vars
		this.has_path = false;
		this.path = [];
		this.path_index = 0;
		this.add.x = 0;
		this.add.y = 0;
		this.dest.x = 0;
		this.dest.y = 0;
		this.move.count = 0;
		this.move.x = 0;
		this.move.y = 0;
		this.move.last_x = 0;
		this.move.last_y = 0;
		this.step_speed = 0;
		this.step.count = 0;
		this.step.x = 0;
		this.step.y = 0;
		this.step_rest.x = 0;
		this.step_rest.y = 0;
		this.step_stop.x = 0;
		this.step_stop.y = 0;
		this.moving = false; // move end
		// * Unlock scroll after auto-scroll
		if ((isMarine(this) && conf.scen.scrl.auto_scroll.marine != null)
		 || (isAlien(this) && conf.scen.scrl.auto_scroll.alien != null))
			unlockScroll();
		// * Reset focus
		if (!this.hidden && ents.Reti.focus.hidden) setFocus(this);
		// * Handle alien controls
		if (isAlien(this) && isPlayerAlien()) {
			deactivateAlienActionButton("move");
			checkAlienAttack(this);
		}
	}

	//////////////////////////////////////////////////////////////////////////////
	// @ Find Path
	//////////////////////////////////////////////////////////////////////////////

	findPath(x, y, b) { // x, y = tile, b = find closest flag

		if (conf.debug.time.find_path) console.time("findPath"); // DEBUG

		// * Find path (A* Algorithm)
		let graph = new Graph(createPathGrid(game.grid, isMarine(this), getPassThroughTypeList(this), getExcludeTypeList(this), hasFourTiles(this), true, true), {"diagonal" : true}); // hidden excluded only for marines (i.e. stumble upon hidden)
		let start = graph.grid[ti(this.x)][ti(this.y)];
		let end = graph.grid[x][y];
		let result = astar.search(graph, start, end, {"closest" : b});

		if (conf.debug.time.find_path) console.timeEnd("findPath"); // DEBUG

		return result;

	}

	//////////////////////////////////////////////////////////////////////////////
	// @ Set Path
	//////////////////////////////////////////////////////////////////////////////

	setPath(r, b) { // r = reset flag, b = move to closest flag

		// * Set path
		this.path = this.findPath(this.dest.x, this.dest.y, b);
		this.has_path = true;

		// * Reroute alien to farest accessible tile toward destination
		if (isAlien(this) && isPlayerAlien()) {

			let n, m, l, i, t = 0;

			// * Restrict path to maximum move
			n = this.path.length;
			m = this.unseen ? conf.game.movement : Math.max(0, this.movement - this.move.count);
			if (n > m) {
				this.path.splice(m, n - m);
				n = m;
			}

			// * Check tiles emptiness in path starting from last
			for (i = n - 1; i >= 0; i--) {
				if (!isPlinthEmpty(game.grid, this.path[i].x, this.path[i].y, this.plinth.width, this.plinth.height, false, getDoorTypeList(), null, !canStopOnDoorRail(this), this.id)) { // last tile in path is filled with anything but a door rail
					t++; // remove last tile from path

					// -------------------------------------------------------------------
					// * Reroute to nearest accessible tile in path -- UNUSED
					// -------------------------------------------------------------------
					//if (false || n > 1) {
					//	l = getEmptyTileAround(game.grid, this.path[i-1].x, this.path[i-1].y, this.plinth.width, this.plinth.height, true, null, null, null, null, [ti(this.x), ti(this.y)]); // get empty tiles around
					//	if (l.length > 0) { // has empty tile around ; reroute to nearest empty tile around
					//		let dest_x = this.dest.x;
					//		let dest_y = this.dest.y;
					//		l.forEach(function(ele, idx, arr) {ele.unshift(getDist(dest_x, dest_y, ele[0], ele[1]))}); // order list by distance
					//		l.sort(arr_asc); // sort list from lowest to highest
					//		l.forEach(function(ele, idx, arr) {ele.shift()}); // remove first value
					//		this.path[i].x = l[0][0]; // change last tile x
					//		this.path[i].y = l[0][1]; // change last tile y
					//		console.log("[" + this.id + "] rerouted to nearest empty tile toward destination (" + l[0][0] + "," + l[0][1] + ")"); // DEBUG
					//		break;
					//	} else {
					//		t++; // not has empty tile around ; remove last tile from path
					//	}
					//} else {
					//	t++; // last and only tile is not empty ; remove last tile from path
					//}
					// -------------------------------------------------------------------

				} else {
					break; // last tile is empty ; proceed move
				}
			}

			// * Remove unreachable tiles from path
			if (t > 0) {
				console.log("[" + this.id + "] path reduced " + t + " time" + (t > 1 ? "s" : "")); // DEBUG
				this.path.splice(n - t, t);
			}

		}

		if (this.path.length > 0) {
			if (!r) { // set path (i.e. first run)
				if (this.path.length > 0) this.startMove();
			} else { // reset path (i.e. second run)
				// * Reset path index
				this.path_index = 0;
				// * Reget path
				this.getPath();
				// * Redraw path lines
				if (conf.debug.draw.path) ents.Line.path.draw(this.x, this.y, null, null, this.path, {"mark" : {"color" : "lime"}, "line" : {"color" : "rgba(255,255,255,.75)"}}); // DEBUG
			}
		} else { // path empty ; stop move
			this.endMove();
		}

	}

	//////////////////////////////////////////////////////////////////////////////
	// @ Get Path
	//////////////////////////////////////////////////////////////////////////////

	getPath() { // before move ; checked on each new tile

		let next_tile_x = this.path[this.path_index].x;
		let next_tile_y = this.path[this.path_index].y;
		let next_dist_x = next_tile_x - ti(this.x);
		let next_dist_y = next_tile_y - ti(this.y);
		let next_dir = getDirFromDist(next_dist_x, next_dist_y);

		if (hasFourTiles(this)) { // TEMP
			if (next_dir == "ne" || next_dir == "ee" || next_dir == "se") next_tile_x += 1;
			if (next_dir == "se" || next_dir == "ss" || next_dir == "sw") next_tile_y += 1;
		}

		let next_cell = game.grid[next_tile_x][next_tile_y];

		if (!isCellEmpty(next_cell, false, getPassThroughTypeList(this), null, false, this.id)) { // stumble upon hidden
			console.log("[" + this.id + "] stumble upon hidden at (" + (next_tile_x) + "," + (next_tile_y) + ")"); // DEBUG
			let o = this;
			let u = pawn[next_cell[1]];
			shakeScreen(1, 0.125);
			playSound("stumble"); // NEW
			if (u !== undefined && !isGone(u) && u instanceof Char) {
				u.turnTo(reverseDir(next_dir));
				u.playAnimation("stumble");
			}
			o.turnTo(next_dir);
			o.endMove();
			this.playAnimation("stumble");
		}

		else if (next_cell[0] == 3) { // closed door
			console.log("[" + this.id + "] open door and wait for opening"); // DEBUG
			this.switchDoor(next_tile_x, next_tile_y); // open door
			this.stopped = true; // prompt move at closed door
			this.stopAnimation(); // prompt character animation
		}

		else { // continue move if not in front of an opening door

			if (this.stopped && next_cell[0] == -1 && !pawn[next_cell[1]].opening) {
				console.log("[" + this.id + "] continue move after door opening"); // DEBUG
				this.stopped = false; // resume move when door opened
				this.playAnimation("move"); // resume character animation
			}

			if (!this.stopped) {

				this.move.x = px(next_dist_x); // set x move value in pixel
				this.move.y = px(next_dist_y); // set y move value in pixel
				this.add.x += -next_dist_x; // decrement add_x (used as a counter)
				this.add.y += -next_dist_y; // decrement add_y (used as a counter)

				this.has_move = true;

				this.path_index++;

				if (this.path_index == this.path.length) { // end of path
					this.add.x = 0;
					this.add.y = 0;
				}
			}
		}
	}

	//////////////////////////////////////////////////////////////////////////////
	// @ Set Move
	//////////////////////////////////////////////////////////////////////////////

	setMove() {

		this.has_move = false; // is now stepping ; waiting for step complete before adding new move

		// A. Reset step count
		this.step.count = 0;

		// B. Get number of steps for current move
		// |> 16 steps per diagonal move and 12 steps per lineal move
		// |> 2px per step when moving diagonally and 2.67px per step when moving lineally based on a 32px tile
		let diag_speed = this.hidden ? 1 : conf.Char.diag_speed;
		let line_speed = this.hidden ? 1 : conf.Char.line_speed;
		this.step_speed = this.move.x != 0 && this.move.y != 0 ? diag_speed : line_speed;

		// C. Compute step
		this.step.x = this.move.x / this.step_speed;
		this.step.y = this.move.y / this.step_speed;
		this.step.x = this.step.x > 0 ? Math.ceil(this.step.x) : Math.floor(this.step.x);
		this.step.y = this.step.y > 0 ? Math.ceil(this.step.y) : Math.floor(this.step.y);

		// D. Compute step rest
		this.step_rest.x = this.step.x != 0 ? conf.tile.size - Math.abs(this.step_speed * this.step.x) : 0;
		this.step_rest.y = this.step.y != 0 ? conf.tile.size - Math.abs(this.step_speed * this.step.y) : 0;
		this.step_stop.x = this.step_rest.x != 0 ? Math.abs(this.step_speed / this.step_rest.x) : 0;
		this.step_stop.y = this.step_rest.y != 0 ? Math.abs(this.step_speed / this.step_rest.y) : 0;

		// E. Set new direction
		this.turnTo(getDirFromDist(this.move.x, this.move.y));
	}

	//////////////////////////////////////////////////////////////////////////////
	// @ Make Move (i.e. do step)
	//////////////////////////////////////////////////////////////////////////////

	makeMove() {

		this.step.count++;

		let step_x_adj = 0;
		let step_y_adj = 0;

		if (this.step_rest.x != 0 && this.step.count % this.step_stop.x == 0) {
			if (this.step.x > 0 && this.step_rest.x > 0) step_x_adj = 1;
			else if (this.step.x > 0 && this.step_rest.x < 0) step_x_adj = -1;
			else if (this.step.x < 0 && this.step_rest.x > 0) step_x_adj = -1;
			else if (this.step.x < 0 && this.step_rest.x < 0) step_x_adj = 1;
		}

		if (this.step_rest.y != 0 && this.step.count % this.step_stop.y == 0) {
			if (this.step.y > 0 && this.step_rest.y > 0) step_y_adj = 1;
			else if (this.step.y > 0 && this.step_rest.y < 0) step_y_adj = -1;
			else if (this.step.y < 0 && this.step_rest.y > 0) step_y_adj = -1;
			else if (this.step.y < 0 && this.step_rest.y < 0) step_y_adj = 1;
		}

		this.move.last_x = this.move.x;
		this.move.last_y = this.move.y;

		this.x += this.step.x + step_x_adj;
		this.y += this.step.y + step_y_adj;
		this.move.x -= (this.step.x + step_x_adj);
		this.move.y -= (this.step.y + step_y_adj);

		// -------------------------------------------------------------------------
		// * Step done -- UNUSED
		// -------------------------------------------------------------------------
		// if (this.step.count == this.step_speed) { // step done
			// console.log("this.move.x = " + this.move.x + " this.step_rest.x = " + this.step_rest.x); // DEBUG
			// console.log("this.move.y = " + this.move.y + " this.step_rest.y = " + this.step_rest.y); // DEBUG
		// }
		// -------------------------------------------------------------------------

		// * Update scroll during auto-scroll
		if ((isMarine(this) && conf.scen.scrl.auto_scroll.marine == "center")
		 || (isAlien(this) && conf.scen.scrl.auto_scroll.alien == "center")) {
			if (!this.hidden) updateScrollCenter(this);
		} else if ((isMarine(this) && conf.scen.scrl.auto_scroll.marine == "bound")
		 || (isAlien(this) && conf.scen.scrl.auto_scroll.alien == "bound")) {
			if (!this.hidden) updateScrollAtBound(this);
		}

		// * Update visibility on tile change
		if (this.move.x == 0 && this.move.y == 0) { // last step done

			// 1. Play sound effect
			if (!this.hidden) {
				playSound("step_" + (this.unseen ? "bleep" : this.move.count % 2 == 0 ? "even" : "odd")); // NEW
			}

			// 2. Increment move count
			this.move.count++;

			// 3. Update position
			this.updatePosition();

			// 4. Update sight
			this.updateSight();

			// 5. Update minimap
			term.updateMiniMap();

			// 6. Update path lines list
			if (conf.debug.draw.path) ents.Line.path.list.shift(); // DEBUG

			// -----------------------------------------------------------------------
			// 7. Check alien attack action during move -- UNSUSED
			// -----------------------------------------------------------------------
			// if (isAlien(this) && isPlayerAlien() && this.last_tile[2] == 0) checkAlienAttack(this, true); // only if this tile empty
			// -----------------------------------------------------------------------

		}
	}

	//////////////////////////////////////////////////////////////////////////////
	// @ Play Animation
	//////////////////////////////////////////////////////////////////////////////

	playAnimation(k, g, f) { // k = animation track identifier (move, attack_range or attack_melee), g = animation angle (rad), f = callback function
		this.anim.playing = true;
		this.anim.track = k;
		this.anim.slide = 0;
		this.anim.count = null;
		if (g !== undefined) this.anim.angle = g;
		this.anim.callback = f;
	}

	//////////////////////////////////////////////////////////////////////////////
	// @ Stop Animation
	//////////////////////////////////////////////////////////////////////////////

	stopAnimation() {
		this.anim.playing = false;
		this.anim.track = null;
		this.anim.slide = 0;
		this.anim.count = null;
		this.anim.angle = null;
		this.anim.callback = null;
	}

	//////////////////////////////////////////////////////////////////////////////
	// @ Initialize
	//////////////////////////////////////////////////////////////////////////////

	init() {
		setColorScheme(this);
		super.init();
	}

	//////////////////////////////////////////////////////////////////////////////
	// @ Spawn
	//////////////////////////////////////////////////////////////////////////////

	spawn() {
		if (!this.inited) this.init();
		this.updateBitmapDirection();
		this.updateBitmapSource();
		super.spawn();
	}

	//////////////////////////////////////////////////////////////////////////////
	// @ Update
	//////////////////////////////////////////////////////////////////////////////

	update() {

		super.update();

		// -------------------------------------------------------------------------
		// * Path
		// -------------------------------------------------------------------------

		if (this.has_path) {
			if (this.move.x == 0 && this.move.y == 0) { // no more move (but path can still exist)
				if (this.add.x == 0 && this.add.y == 0) { // no more path (and also no more move)
					this.endMove();
				} else { // new move
					if (this.path.length > 0) { // search path success for next move
						this.getPath();
					} else { // search path failed for next move
						if (isAlien(this) && isPlayerAlien() && mupt.loop < conf.mupt.retry_move) {
							console.log("[" + this.id + "] cannot find path ; retry later"); // DEBUG
							this.action.move++; // reset move action
						} else {
							console.log("[" + this.id + "] cannot find path..."); // DEBUG
						}
						this.endMove();
					}
				}
			}
		}

		// -------------------------------------------------------------------------
		// * Move
		// -------------------------------------------------------------------------

		if (this.has_path && !this.stopped) {
			if (this.has_move) this.setMove(); // new move
			this.makeMove(); // new step
			// * Reset path lines origin
			if (conf.debug.draw.path) { // DEBUG
				ents.Line.path.orig.x = this.x + halfti();
				ents.Line.path.orig.y = this.y + halfti();
			}
		}

		// -------------------------------------------------------------------------
		// * Animation
		// -------------------------------------------------------------------------

		let track, slide;
		if (this.anim.playing) {
			// * Get current track and slide
			track = conf.Char.anim_set[hasProperty(conf.Char.anim_set, this.subt + "." + this.anim.track) ? this.subt : "default"][this.anim.track];
			slide = track[this.anim.slide]; // set slide
			// * Check counter and change slide
			if (this.anim.count == null && conf.debug.anim.slide) console.log("[" + this.id + "] " + this.anim.track + " started"); // DEBUG
			if (this.anim.count != null) this.anim.count--; // decrement counter
			if (this.anim.count <= 0) { // slide ended
				if (slide[7]) { // repeat animation
					if (conf.debug.anim.slide) console.log("[" + this.id + "] " + this.anim.track + " repeated"); // DEBUG
					this.anim.slide = 0; // first slide
				} else if (this.anim.count != null) this.anim.slide++; // new slide
				slide = track[this.anim.slide]; // reset slide
				if (this.anim.slide == track.length) { // last slide
					if (conf.debug.anim.slide) console.log("[" + this.id + "] " + this.anim.track + " stopped"); // DEBUG
					this.stopAnimation();
				} else {
					this.anim.count = Math.round(slide[4] * conf.Char.anim_speed);
					if (conf.debug.anim.slide) console.log("[" + this.id + "] " + this.anim.track + " slide " + this.anim.slide + " count " + this.anim.count); // DEBUG
				}
			}
		}

		// -------------------------------------------------------------------------
		// * Draw
		// -------------------------------------------------------------------------

		if (!this.hidden && isOnScreen(this, true)) { // not hidden and on screen ofset

			// * Skip invisible
			if (this.condition.invisible && isMarine(this) && !isPlayerMarine()) return;

			// * Set sprite variables
			let x = 0;
			let y = 0;
			let w = this.width;
			let h = this.height;

			// * Get scene context
			let ctx = scen.context;

			// * Get buffers canvas
			let bf1 = scen.buffer1;
			let bf2 = scen.buffer2;

			// * Get buffers context
			let bx1 = scen.buffer1_context;
			let bx2 = scen.buffer2_context;

			// * Reset buffers size
			bf1.width = bf2.width = w;
			bf1.height = bf2.height = h;

			// * Set bitmap sources positions
			this.src_x = this.wrc_x = isDiag(this.dir) ? w : 0;
			this.src_y = this.wrc_y = 0;

			// * Set bitmap output position adjustment
			let adj_n = 0, adj_x = 0, adj_y = 0;

			// * Change bitmaps position
			if (this.anim.playing) { // animation not stopped
				if (slide[6] && typeof(this.anim.callback) == "function") { // callback ready and exists
					this.anim.callback(); // execute function
					this.anim.callback = null; // erase callback
				}
				this.src_x += (2 * slide[0]) * w;
				this.src_y = slide[1] * h;
				this.wrc_x += (2 * slide[2]) * w;
				this.wrc_y = slide[3] * h;
				adj_n = Number.isInteger(slide[5]) ? slide[5] : 0; // translation
			}

			// * Merge bitmaps on buffer 1
			bx1.drawImage(this.img, this.src_x, this.src_y, w, h, x, y, w, h);
			if (this.wmg != null) bx1.drawImage(this.wmg, this.wrc_x, this.wrc_y, w, h, x, y, w, h);

			// * Recolor sprite on buffer 1 using color scheme
			recolorSprite(this, bx1, x, y, w, h, conf.Char.brightness);

			// * Rotate sprite on buffer 2
			bx2.translate(w/2, h/2);
			if (this.anim.angle != null) { // radian rotation
				bx2.rotate(this.anim.angle - (Math.PI / (isDiag(this.dir) ? 4 : 2)));
				if (adj_n != 0) { // has translation
					adj_x = Math.round(Math.cos(this.anim.angle) * adj_n);
					adj_y = Math.round(Math.sin(this.anim.angle) * adj_n);
				}
			} else { // cardinal rotation
				bx2.rotate(this.angle);
				if (adj_n != 0) { // has translation
					let d = getCoordFromDir(this.dir);
					adj_x = d.x * adj_n;
					adj_y = d.y * adj_n;
				}
			}
			// if (adj_n != 0) console.log(this.dir + " adj_x = " + adj_x + " adj_y = " + adj_y); // DEBUG

			// * Add transparency effect
			if (this.condition.invisible) bx2.globalAlpha = 0.5; // 50% opacity

			// * Draw sprite on buffer 2
			bx2.drawImage(bf1, x, y, w, h, w/-2, h/-2, w, h);

			// * Draw buffer 2 on scene
			ctx.drawImage(bf2, x, y, w, h, this.x + adj_x, this.y + adj_y, w, h);

		}

	}

}

// =============================================================================
// -----------------------------------------------------------------------------
// # Marines
// -----------------------------------------------------------------------------
// =============================================================================

class Marine extends Char {

	//////////////////////////////////////////////////////////////////////////////
	// @ Constructor
	//////////////////////////////////////////////////////////////////////////////

	constructor(id, x, y, type, subt, dir, weapon, name) {

		// * Global
		super(id, x, y, type, subt, dir, weapon);

		// * Game
		this.name = name || "";

	}

	//////////////////////////////////////////////////////////////////////////////
	// @ Leave
	//////////////////////////////////////////////////////////////////////////////

	leave(b) { // b = dead flag

		if (game.player[0] == getTypeKey(this.type)) { // current playing team
			// * Cancel actions
			cancelAction(this);
			// * Set gone buttons
			setGoneSelectButtons(getIndexFromId(this), b);
		}

		if (game.actor != null && game.actor.id == this.id) { // is acting
			// * Reset status
			resetStatus();
			// * Disable action buttons
			disableActionButtons("end_turn");
			// * Disable tool buttons
			if (tool.active) disableToolButtons(); // TEMP DEBUG
		}

		super.leave();
	}

	//////////////////////////////////////////////////////////////////////////////
	// @ Quit
	//////////////////////////////////////////////////////////////////////////////

	quit() {
		// * Set member state
		game.team[getTypeKey(this)].members[this.id].state = "quit";
		// * Leave area
		this.leave(); // is playing team member
	}

	//////////////////////////////////////////////////////////////////////////////
	// @ Die
	//////////////////////////////////////////////////////////////////////////////

	die() {
		// * Play sound effect
		playSound("die"); // NEW
		super.die();
		let team = getTypeKey(this);
		// * Set member state
		game.team[team].members[this.id].state = "dead";
		// * Check med_pack
		if (this.subt == "commander" && hasEquipmentUseable(team, "med_pack")) game.team[team].equipment.med_pack = false;
		// * Leave area
		this.leave(true); // is playing team member
	}

	//////////////////////////////////////////////////////////////////////////////
	// @ Change weapon
	//////////////////////////////////////////////////////////////////////////////

	changeWeapon(s) { // s = weapon key
		super.changeWeapon(s);
		if (game.actor != null && game.actor.id == this.id) { // is acting
			checkActionButtons(this);
			updateStatus(this);
		}
	}

	//////////////////////////////////////////////////////////////////////////////
	// @ Clear Shoot Range
	//////////////////////////////////////////////////////////////////////////////

	clearShootRange() {
		if (this.last_weapon != null) {
			this.weapon = this.last_weapon;
			this.last_weapon = null;
		}
		super.clearShootRange();
	}

	//////////////////////////////////////////////////////////////////////////////
	// @ Switch Door
	//////////////////////////////////////////////////////////////////////////////

	switchDoor(x, y) { // x, y = tile
		super.switchDoor(x, y);
		// * Check action buttons
		if (isAlive(this) && !this.moving) { // is still alive (i.e. not killed by door) and still not moving
			checkActionButtons(this);
		}
	}

	//////////////////////////////////////////////////////////////////////////////
	// @ Start Move
	//////////////////////////////////////////////////////////////////////////////

	startMove() {
		// * Disable controls
		disableSelectButtons(getIndexFromId(this));
		disableActionButtons();
		super.startMove();
		// * Apply active order(s) effect(s)
		if (this.subt == "trooper") { // trooper subtype only
			if (hasOrderActive("by_sections")) {
				this.action.attack_range = 0; // no range attack if moved
				this.action.attack_melee = 0; // no melee attack if moved
			}
			if (hasOrderActive("heavy_weapon") && hasHeavyWeapon(this)) {
				// a. Increase actions
				this.action.move++;
				this.action.attack_range++;
				// b. Remove order from active order
				let l = game.team[getTypeKey(this)].active.order;
				l.splice(l.indexOf("heavy_weapon"), 1);
			}
		}
	}

	//////////////////////////////////////////////////////////////////////////////
	// @ End Move
	//////////////////////////////////////////////////////////////////////////////

	endMove() {

		// * Reset controls
		resetSelectButtons();
		checkActionButtons(this);

		// * Change direction in front of a wall
		if (conf.Char.dont_look_at_the_wall_dumbass) {
			let p = getCoordFromDir(this.dir);
			let c = game.grid[ti(this.x) + p.x][ti(this.y) + p.y];
			if (isWall(c[0])) { // cell type is wall
				if (!isDiag(this.dir)) {
					this.turnTo(reverseDir(this.dir));
				} else {
					let c_x = game.grid[ti(this.x) + p.x][ti(this.y)];
					let c_y = game.grid[ti(this.x)][ti(this.y) + p.y];
					if (isWall(c_x[0]) && isWall(c_y[0])) this.turnTo(reverseDir(this.dir));
					else if (isWall(c_x[0])) this.turnTo(getDirFromDist(0, p.y));
					else this.turnTo(getDirFromDist(p.x, 0));
				}
			}
		}

		super.endMove();

	}

	//////////////////////////////////////////////////////////////////////////////
	// @ Check Docking Claws
	//////////////////////////////////////////////////////////////////////////////

	checkDockingClaws() { // returns boolean
		if (isAtDockingClaws(this)) {
			console.log("[" + this.id + "] is at " + getTypeKey(this) + " docking claws and goes out"); // DEBUG
			// playEffect(this.x, this.y, "reveal"); // DEPRECATED
			this.quit();
			showReport(lang["marine_quit"], "mult");
			return true;
		} return false;
	}

	//////////////////////////////////////////////////////////////////////////////
	// @ Initialize
	//////////////////////////////////////////////////////////////////////////////

	init() {
		setMarineAttributes(this);
		super.init();
	}

	//////////////////////////////////////////////////////////////////////////////
	// @ Spawn
	//////////////////////////////////////////////////////////////////////////////

	spawn() {
		// * Show marine
		this.unseen = false;
		this.hidden = false;
		super.spawn();
	}

	//////////////////////////////////////////////////////////////////////////////
	// @ Update
	//////////////////////////////////////////////////////////////////////////////

	update() {
		super.update();
	}

}

// =============================================================================
// -----------------------------------------------------------------------------
// # Aliens
// -----------------------------------------------------------------------------
// =============================================================================

class Alien extends Char {

	//////////////////////////////////////////////////////////////////////////////
	// @ Constructor
	//////////////////////////////////////////////////////////////////////////////

	constructor(id, x, y, type, subt, dir) {

		// * Global
		super(id, x, y, type, subt, dir);

	}

	//////////////////////////////////////////////////////////////////////////////
	// @ Leave
	//////////////////////////////////////////////////////////////////////////////

	leave() {
		// * Update reinforcement pawn pool
		game.team.alien.reinforcement.pawn[this.subt].push(this.id);
		super.leave();
	}

	//////////////////////////////////////////////////////////////////////////////
	// @ Leave
	//////////////////////////////////////////////////////////////////////////////

	die() {
		// * Play sound effect
		let k = "die";
		if (isGreen(this)) k += "_green";
		else if (isLimbo(this)) k += "_limbo";
		else if (isRobot(this)) k += "_robot";
		else if (isXeno(this)) k += "_xeno";
		playSound(k); // NEW
		super.die();
	}

	//////////////////////////////////////////////////////////////////////////////
	// @ Initialize
	//////////////////////////////////////////////////////////////////////////////

	init() {
		setAlienAttributes(this);
		super.init();
	}

	//////////////////////////////////////////////////////////////////////////////
	// @ Spawn
	//////////////////////////////////////////////////////////////////////////////

	spawn() {
		super.spawn();
	}

	//////////////////////////////////////////////////////////////////////////////
	// @ Update
	//////////////////////////////////////////////////////////////////////////////

	update() {
		super.update();
	}

}
