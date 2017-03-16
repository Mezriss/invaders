import {core as cfg, drawing as drawingCfg} from '../config';
import {hexToRgba} from './color';

export function initCanvas(width = cfg.screenWidth, height = cfg.screenHeight) {
	const canvas = document.createElement('canvas');
	canvas.width = width;
	canvas.height = height;
	return canvas.getContext('2d');
}

export function drawPixel(ctx, x, y, color, pixelSize = cfg.pixelSize) {
	ctx.fillStyle = color;
	ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize)
}

export function drawImage(ctx, target, coords, sourceCoords, dimensions) {
	if (drawingCfg.preventSubPixelDrawing) {
		coords = coords.map(c => Math.floor(c));
	}
	if (drawingCfg.stickToPixelGrid) {
		coords = coords.map(c => c - c % cfg.pixelSize);
	}
	if (sourceCoords && dimensions) {
		ctx.drawImage(target.canvas, ...sourceCoords, ...dimensions, ...coords, ...dimensions);
	} else {
		ctx.drawImage(target.canvas, ...coords);
	}

}

//drawing pixels with a mask over them; for shitty "3d" pixel effect
const palette = initCanvas(cfg.pixelSize * drawingCfg.paletteSize, cfg.pixelSize),
	paletteIndex = {transparent: 0};
let paletteLength = 0;

drawingCfg.mask.forEach((line, j) => line.forEach((color, i) => {
	palette.fillStyle = hexToRgba(...color);
	palette.fillRect(i, j, 1, 1);
}));

export function drawBeveledPixel(ctx, x, y, color) {
	if (!paletteIndex[color]) {
		paletteLength += 1;
		paletteIndex[color] = paletteLength;
		palette.fillStyle = color;
		palette.fillRect(paletteLength * cfg.pixelSize, 0, cfg.pixelSize, cfg.pixelSize);
		drawImage(palette, palette, [cfg.pixelSize * paletteLength, 0], [0, 0], [cfg.pixelSize, cfg.pixelSize]);
	}
	ctx.drawImage(palette.canvas, paletteIndex[color] * cfg.pixelSize, 0, cfg.pixelSize, cfg.pixelSize,
		x * cfg.pixelSize, y * cfg.pixelSize, cfg.pixelSize, cfg.pixelSize)
}