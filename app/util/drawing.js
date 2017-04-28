import { coreCfg as cfg, drawingCfg } from '../conf';
import { hexToRgba } from './color';

export function initCanvas(width = cfg.screenWidth, height = cfg.screenHeight) {
	const canvas = document.createElement('canvas');
	canvas.width = width;
	canvas.height = height;
	return canvas.getContext('2d');
}

export function drawPixel(ctx, x, y, color, pixelSize = cfg.pixelSize) {
	ctx.fillStyle = typeof color === 'number' ? '#' + color.toString(16) : color;
	ctx.fillRect(x, y, pixelSize, pixelSize);
}

export function drawImage(ctx, source, coords, sourceCoords, dimensions) {
	if (drawingCfg.preventSubPixelDrawing) {
		coords = coords.map(c => Math.floor(c));
	}
	if (drawingCfg.stickToPixelGrid) {
		coords = coords.map(c => c - c % cfg.pixelSize);
	}
	if (sourceCoords && dimensions) {
		ctx.drawImage(source.canvas, ...sourceCoords, ...dimensions, ...coords, ...dimensions);
	} else {
		ctx.drawImage(source.canvas, ...coords);
	}
}

//drawingCfg pixels with a mask over them; for shitty "3d" pixel effect
const palette = initCanvas(cfg.pixelSize * drawingCfg.paletteSize, cfg.pixelSize), paletteIndex = { transparent: 0 };
let paletteLength = 0;

drawingCfg.mask.forEach((line, j) =>
	line.forEach((color, i) => {
		palette.fillStyle = hexToRgba(...color);
		palette.fillRect(i, j, 1, 1);
	})
);

export function drawBeveledPixel(ctx, x, y, color) {
	color = typeof color === 'number' ? color.toString(16) : color;
	if (!paletteIndex[color]) {
		paletteLength += 1;
		paletteIndex[color] = paletteLength;
		palette.fillStyle = color;
		palette.fillRect(paletteLength * cfg.pixelSize, 0, cfg.pixelSize, cfg.pixelSize);
		drawImage(palette, palette, [cfg.pixelSize * paletteLength, 0], [0, 0], [cfg.pixelSize, cfg.pixelSize]);
	}
	drawImage(ctx, palette, [x, y], [paletteIndex[color] * cfg.pixelSize, 0], [cfg.pixelSize, cfg.pixelSize]);
}
