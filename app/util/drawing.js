import { coreCfg as cfg, drawingCfg } from '../conf';
import { hexToRgba } from './color';
import { cacheSprite } from './spriteCache';

export function n2c(color) {
	if (typeof color === 'string') {
		return color;
	}
	color = color.toString(16);
	color = '0'.repeat(6 - color.length) + color;
	return '#' + color;
}

export function initCanvas(width = cfg.screenWidth, height = cfg.fullScreenHeight) {
	const canvas = document.createElement('canvas');
	canvas.width = width;
	canvas.height = height;
	return canvas.getContext('2d');
}

export function drawPixel(ctx, x, y, color, pixelSize = cfg.pixelSize) {
	ctx.fillStyle = n2c(color);
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

const spriteCanvas = initCanvas(1, 1);
export function drawBitmap(data, color, width = 16) {
	spriteCanvas.canvas.width = width * cfg.pixelSize;
	spriteCanvas.canvas.height = data.length * cfg.pixelSize;

	for (let i = 0; i < data.length; i += 1) {
		for (let bit = 0; bit < width; bit += 1) {
			if ((data[i] >> bit) % 2) {
				drawPixel(spriteCanvas, (width - 1 - bit) * cfg.pixelSize, i * cfg.pixelSize, color);
			}
		}
	}
	return cacheSprite(spriteCanvas);
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
	color = typeof color === 'number' ? '#' + color.toString(16) : color;
	if (!paletteIndex[color]) {
		paletteLength += 1;
		paletteIndex[color] = paletteLength;
		palette.fillStyle = color;
		palette.fillRect(paletteLength * cfg.pixelSize, 0, cfg.pixelSize, cfg.pixelSize);
		drawImage(palette, palette, [cfg.pixelSize * paletteLength, 0], [0, 0], [cfg.pixelSize, cfg.pixelSize]);
	}
	drawImage(ctx, palette, [x, y], [paletteIndex[color] * cfg.pixelSize, 0], [cfg.pixelSize, cfg.pixelSize]);
}
