/*
	Space

	* generates background with stars

 */

import {core as coreCfg, space as cfg} from '../config';
import {roll, roll0, initCanvas, drawPixel, hexToRgba, rollh, drawImage} from '../util';

const spaceProto = {
	ctx: initCanvas(),
	draw: function() {
		const pixelSize = cfg.pixelSize || coreCfg.pixelSize;

		this.ctx.fillStyle = cfg.background;
		this.ctx.fillRect(0, 0, coreCfg.screenWidth, coreCfg.screenHeight);

		this.stars.forEach(star => {

			drawPixel(this.ctx, star.x, star.y, hexToRgba(star.hue, star.intensity), pixelSize);

			let beam = 0,
				beamIntensity = star.intensity * cfg.initialBeamIntensity;

			while (beamIntensity > cfg.minBeamIntensity && beam <= cfg.maxBeamLength) {
				drawPixel(this.ctx, star.x - beam, star.y, hexToRgba(star.hue, beamIntensity), pixelSize);
				drawPixel(this.ctx, star.x + beam, star.y, hexToRgba(star.hue, beamIntensity), pixelSize);
				drawPixel(this.ctx, star.x, star.y - beam, hexToRgba(star.hue, beamIntensity), pixelSize);
				drawPixel(this.ctx, star.x, star.y + beam, hexToRgba(star.hue, beamIntensity), pixelSize);

				beam += 1;
				beamIntensity = star.intensity * cfg.initialBeamIntensity - beam * cfg.beamFadeRate;
			}
		})
	},
	show: function(ctx) {
		drawImage(ctx, this.ctx, [0, 0]);
	}
};

export function create() {
	const pixelSize = cfg.pixelSize || coreCfg.pixelSize,
		space = Object.create(spaceProto);

	space.ctx.canvas.width = coreCfg.screenWidth;
	space.ctx.canvas.height = coreCfg.screenHeight;
	space.stars = [];

	const starCount = rollh(cfg.maxStars, 2);

	for (let i = 0; i < starCount; i += 1) {
		const star = {
			x: roll0(coreCfg.screenWidth / pixelSize),
			y: roll0(coreCfg.screenHeight / pixelSize),
			intensity: roll(cfg.maxIntensity),
			hue: cfg.hue[roll0(cfg.hue.length)]
		};
		space.stars.push(star);
	}

	space.draw();

	return space;
}