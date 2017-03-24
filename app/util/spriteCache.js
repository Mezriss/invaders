import {cache as cfg} from '../config';
import {initCanvas, drawImage} from '../util';

const canvases = {},
	canvasUsage = {};

export function cacheSprite(ctx, width, height) {
	const name = `${width}x${height}`;
	if (!canvases[name] || canvasUsage[name] === cfg.itemsPerCanvas) {
		canvases[name] = canvases[name] || [];
		canvases[name].push(initCanvas(width * cfg.itemsPerCanvas, height));
		canvasUsage[name] = 0;
	}

	drawImage(canvases[name][canvases[name].length - 1], ctx, [canvasUsage[name] * width, 0], [0, 0], [width, height]);
	canvasUsage[name] += 1;

	return {
		ctx: canvases[name][canvases[name].length - 1],
		coords: [(canvasUsage[name] - 1) * width, 0]
	};
}