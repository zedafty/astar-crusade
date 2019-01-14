/*

	furn.js (ents.js ext)

*/

// =============================================================================
// -----------------------------------------------------------------------------
// # Furnitures
// -----------------------------------------------------------------------------
// =============================================================================

class Furn extends Pawn {

	//////////////////////////////////////////////////////////////////////////////
	// @ Constructor
	//////////////////////////////////////////////////////////////////////////////

	constructor(id, x, y, type, subt) {

		// * Global
		super(id, x, y, type, subt);

	}

	//////////////////////////////////////////////////////////////////////////////
	// @ Leave
	//////////////////////////////////////////////////////////////////////////////

	leave() {
		// * Clear grid cell
		game.grid[ti(this.x)][ti(this.y)] = [0, null]; // empty tile (floor)
		super.leave();
	}

	//////////////////////////////////////////////////////////////////////////////
	// @ Spawn
	//////////////////////////////////////////////////////////////////////////////

	spawn() {
		// * Set size
		this.width = this.img.width;
		this.height = this.img.height;
		super.spawn();
	}

	//////////////////////////////////////////////////////////////////////////////
	// @ Update
	//////////////////////////////////////////////////////////////////////////////

	update(x, y) { // x, y = pixel

		super.update();

		// -------------------------------------------------------------------------
		// * Draw
		// -------------------------------------------------------------------------

		if (!this.hidden && isOnScreen(this, true)) { // not hidden and on outer screen

			// * Set sprite variables
			if (x === undefined) x = 0;
			if (y === undefined) y = 0;
			let w = this.width;
			let h = this.height;

			// * Get context
			let ctx = scen.context;

			// * Get buffer 1 canvas
			let bf1 = scen.buffer1;

			// * Get buffer 1 context
			let bx1 = scen.buffer1_context;

			// * Reset buffer 1 size
			bf1.width = w;
			bf1.height = h;

			// * Draw bitmap on buffer 1
			bx1.drawImage(this.img, 0, 0);

			// * Recolor sprite using color scheme
			let imgData = bx1.getImageData(0, 0, w, h);
			let i, r, g, b;
			for (i = 0; i < imgData.data.length; i += 4) {
				// * Get pixel data
				r = imgData.data[i+0];
				g = imgData.data[i+1];
				b = imgData.data[i+2];
				// * Set brightness
				r = Math.round(r * conf.Furn.brightness);
				g = Math.round(g * conf.Furn.brightness);
				b = Math.round(b * conf.Furn.brightness);
				// * Set pixel data
				imgData.data[i+0] = r > 255 ? 255 : r;
				imgData.data[i+1] = g > 255 ? 255 : g;
				imgData.data[i+2] = b > 255 ? 255 : b;
			}

			// * Output image data on buffer 1
			bx1.putImageData(imgData, 0, 0);

			// * Draw buffer 1 on scene
			ctx.drawImage(bf1, -x, -y, w, h, this.x, this.y, w, h);

		}

	}

}

// =============================================================================
// -----------------------------------------------------------------------------
// # Doors
// -----------------------------------------------------------------------------
// =============================================================================

class Door extends Furn {

	//////////////////////////////////////////////////////////////////////////////
	// @ Constructor
	//////////////////////////////////////////////////////////////////////////////

	constructor(id, x, y, type, subt) {

		// * Global
		super(id, x, y, type, subt);

		// * Local
		this.dir = null;
		this.opposite = null; // opposite door id
		this.opening = false; // TEMP
		this.closing = false; // TEMP

		// * Variables
		this.count = 0;

	}

	//////////////////////////////////////////////////////////////////////////////
	// @ Open
	//////////////////////////////////////////////////////////////////////////////

	open(instant, end) { // instant = instant flag, end = animation end flag

		let that = pawn[this.opposite];

		if (instant || !end) {
			// * Change types to opened door
			game.grid[ti(this.x)][ti(this.y)][0] = -1;
			game.grid[ti(that.x)][ti(that.y)][0] = -1;
			this.type = -1;
			that.type = -1;
			if (!instant) {
				// * Set opening
				this.opening = true;
				that.opening = true;
				// * Prevent save
				main.save.prevented = true;
			}
		}

		if (instant || end) {
			// * Hide doors
			this.hidden = true;
			if (instant) {
				that.hidden = true;
			} else {
				// * Reset counter
				this.count = 0;
				// * End opening
				this.opening = false;
				// * Allow save
				main.save.prevented = false;
			}
			// * Update minimap
			term.updateMiniMap();
		}
	}

	//////////////////////////////////////////////////////////////////////////////
	// @ Close
	//////////////////////////////////////////////////////////////////////////////

	close(instant, end) { // instant = instant flag, end = animation end flag

		let that = pawn[this.opposite];

		if (instant || !end) {
			// * Show doors
			this.hidden = false;
			that.hidden = false;
			if (!instant) {
				// * Prevent save
				main.save.prevented = true;
				// * Set closing
				this.closing = true;
				that.closing = true;
				// * Reset counters
				this.count = conf.Door.switch_duration;
				that.count = conf.Door.switch_duration;
			}
		}

		if (instant || end) {
			// * Change types to closed door
			game.grid[ti(this.x)][ti(this.y)][0] = 3;
			this.type = 3;
			if (instant) {
				game.grid[ti(that.x)][ti(that.y)][0] = 3;
				that.type = 3;
			} else {
				// * End closing
				this.closing = false;
				// * Allow save
				main.save.prevented = false;
			}
			// * Update minimap
			term.updateMiniMap();
		}
	}

	//////////////////////////////////////////////////////////////////////////////
	// @ Kill
	//////////////////////////////////////////////////////////////////////////////

	kill() {
		// * Explode characters on rail
		let c = game.grid[ti(this.x)][ti(this.y)];
		if (c[1] != this.id) {
			pawn[c[1]].explode();
			console.log("[" + c[1] + "] was in the wrong place at the wrong time... (" + ti(this.x) + "," + ti(this.y) + ")"); // DEBUG
		}
	}

	//////////////////////////////////////////////////////////////////////////////
	// @ Initialize
	//////////////////////////////////////////////////////////////////////////////

	init() {
		setDoorAttributes(this);
		super.init();
	}

	//////////////////////////////////////////////////////////////////////////////
	// @ Spawn
	//////////////////////////////////////////////////////////////////////////////

	spawn() {

		if (!this.inited) this.init();

		let dir_x = ti(this.x) - ti(pawn[this.opposite].x);
		let dir_y = ti(this.y) - ti(pawn[this.opposite].y);

		if (dir_x > 0) this.dir = "ww";
		else if (dir_x < 0) this.dir = "ee";
		else if (dir_y > 0) this.dir = "nn";
		else if (dir_y < 0) this.dir = "ss";

		this.img = spr.door[this.dir].img;

		super.spawn();

		this.unseen = false;
	}

	//////////////////////////////////////////////////////////////////////////////
	// @ Update
	//////////////////////////////////////////////////////////////////////////////

	update() {
		let x, y;
		if (this.opening || this.closing) {
			let p = getCoordFromDir(reverseDir(this.dir));
			x = Math.floor((p.x * this.count) / (conf.Door.switch_duration / (this.width - conf.Door.switch_margin)));
			y = Math.floor((p.y * this.count) / (conf.Door.switch_duration / (this.height - conf.Door.switch_margin)));
			if (this.opening) {
				if (this.count == conf.Door.switch_duration) this.open(false, true)
				this.count++;
			} else {
				if (this.count == conf.Door.switch_duration - Math.round(conf.Door.switch_duration * conf.Door.close_kill_time)) this.kill();
				if (this.count == 0) this.close(false, true)
				this.count--;
			}
		}
		super.update(x, y);
	}
}

// =============================================================================
// -----------------------------------------------------------------------------
// # Items
// -----------------------------------------------------------------------------
// =============================================================================

class Item extends Furn {

	//////////////////////////////////////////////////////////////////////////////
	// @ Constructor
	//////////////////////////////////////////////////////////////////////////////

	constructor(id, x, y, type, subt) {

		// * Global
		super(id, x, y, type, subt);

	}

	//////////////////////////////////////////////////////////////////////////////
	// @ Conceal
	//////////////////////////////////////////////////////////////////////////////

	conceal(b) { // b = update minimap flag
		// * Change image
		this.img = spr.item.bleep.img;
		super.conceal(b);
	}

	//////////////////////////////////////////////////////////////////////////////
	// @ Reveal
	//////////////////////////////////////////////////////////////////////////////

	reveal(b, s) { // b = update minimap flag, s = entity id
		// * Change image
		this.img = spr.item[this.subt].img;
		super.reveal(b, s);
	}

	//////////////////////////////////////////////////////////////////////////////
	// @ Initialize
	//////////////////////////////////////////////////////////////////////////////

	init() {
		setItemAttributes(this);
		super.init();
	}

	//////////////////////////////////////////////////////////////////////////////
	// @ Spawn
	//////////////////////////////////////////////////////////////////////////////

	spawn() {
		if (!this.inited) this.init();
		this.img = this.unseen ? spr.item.bleep.img : spr.item[this.subt].img;
		super.spawn();
	}

	//////////////////////////////////////////////////////////////////////////////
	// @ Update
	//////////////////////////////////////////////////////////////////////////////

	update() {
		super.update();
	}

}

