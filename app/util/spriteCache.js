import { cacheCfg as cfg } from '../conf';
import { initCanvas, drawImage } from '../util';

const canvases = {}, canvasUsage = {};

export function cacheSprite(ctx) {
	const width = ctx.canvas.width, height = ctx.canvas.height, name = `${width}x${height}`;

	if (!canvases[name] || canvasUsage[name] === cfg.itemsPerCanvas) {
		canvases[name] = canvases[name] || [];
		canvases[name].push(initCanvas((width + cfg.itemPadding) * cfg.itemsPerCanvas, height));
		canvasUsage[name] = 0;
	}

	drawImage(
		canvases[name][canvases[name].length - 1],
		ctx,
		[canvasUsage[name] * (width + cfg.itemPadding), 0],
		[0, 0],
		[width, height]
	);
	canvasUsage[name] += 1;

	return {
		ctx: canvases[name][canvases[name].length - 1],
		coords: [(canvasUsage[name] - 1) * (width + cfg.itemPadding), 0],
		widthPx: width,
		heightPx: height
	};
}
