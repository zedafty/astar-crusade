/*

	zoom.js (scen.js ext)

*/

// =============================================================================
// -----------------------------------------------------------------------------
// # Zoom
// -----------------------------------------------------------------------------
// =============================================================================

function scaleScreen(value, revert) { // value = float, revert = flag

	let scale = 1 / value;

	if (revert) {
		scen.zoom.last.x = scen.screen.x + Math.floor(scen.screen.width / 2);
		scen.zoom.last.y = scen.screen.y + Math.floor(scen.screen.height / 2);
		scen.zoom.last.width = scen.screen.width;
		scen.zoom.last.height = scen.screen.height;
	}

	scrollToPixelInstant(0, 0); // TEMP

	scen.context.scale(value, value);
	scen.screen.scale *= scale;
	scen.screen.width *= scale;
	scen.screen.height *= scale;

	for (let k in ents.Text) {
		if (ents.Text[k].fixed) {
			ents.Text[k].x *= scale;
			ents.Text[k].y *= scale;
		}
	}

	if (!revert) {

		resizeArea();

		let last_x = scen.zoom.last.width / conf.tile.size % 2 != 0; // odd number of horizontal tiles
		let last_y = scen.zoom.last.height / conf.tile.size % 2 != 0; // odd number of vertical tiles
		let curr_x = scen.screen.width / conf.tile.size % 2 != 0; // odd number of horizontal tiles
		let curr_y = scen.screen.height / conf.tile.size % 2 != 0; // odd number of vertical tiles

		let adj = halfti(); // center on tile

		let x = scen.zoom.last.x;
		let y = scen.zoom.last.y;

		if (!last_x && curr_x) x -= adj;
		if (last_x && !curr_x) x += adj;
		if (!last_y && curr_y) y -= adj;
		if (last_y && !curr_y) y += adj;

		centerToPixelInstant(x, y, false, false);
		snapToBoardInstant();
	}

}

function getScaleValue() {
	return 1 + (scen.zoom.time * conf.scen.zoom.factor);
}

function getScalePercent() {
	return 100 + scen.zoom.time * conf.scen.zoom.factor * 100;
}

function revertScale() {
	// if (scen.zoom.time != 0) scaleScreen(1 / getScaleValue(), true);
	scaleScreen(1 / getScaleValue(), true);
}

function resetScale() {
	let n = scen.zoom.time;
	if (n > 0) zoomOut(n)
	else if (n < 0) zoomIn(-n);
}

function zoomIn(n) { // n = integer
	if (scen.zoom.locked || scen.zoom.time > conf.scen.zoom.max - 1) return;
	n = n || 1;
	revertScale();
	scen.zoom.time += n;
	scaleScreen(getScaleValue());
	showHint(getScalePercent() + "%");
}

function zoomOut(n) { // n = integer
	if (scen.zoom.locked || scen.zoom.time < -conf.scen.zoom.min + 1) return;
	n = n || 1;
	revertScale();
	scen.zoom.time -= n;
	scaleScreen(getScaleValue());
	showHint(getScalePercent() + "%");
}

