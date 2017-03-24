import {core as coreCfg, missile as cfg} from '../config';
import {roll, initCanvas, shuffle, drawPixel, hexToRgba, drawImage, cacheSprite} from '../util';

const defaultOptions = {
		color: cfg.defaultColor
	},
	pixelWidth = cfg.width * coreCfg.pixelSize,
	pixelHeight = cfg.height * coreCfg.pixelSize,
	sprite = initCanvas(pixelWidth + coreCfg.pixelSize * 2, pixelHeight + coreCfg.pixelSize * 2),
	partWidth = Math.ceil(cfg.width / 2),
	partHeight = Math.ceil(cfg.height / 2),
	missileProto = {
		speed: 0.2,
		damage: 1,
		sprite: null,
		x: null,
		y: null,
		show: ctx => drawImage(ctx, this.sprite.ctx, [this.x, this.y], this.sprite.coords, [pixelWidth, pixelHeight]),
		behavior: () => {}
};


export function create(options = defaultOptions) {
	const missile = Object.create(missileProto),
		bitCount = roll(cfg.minBits, cfg.maxBits),
		blueprint = [],
		shape = [];

	for (let i = 0; i < partWidth * partHeight; i += 1) {
		blueprint.push(i < bitCount);
	}
	missile.blueprint = shuffle(blueprint);

	sprite.clearRect(0, 0, pixelWidth, pixelHeight);
	for (let i = 0; i < partHeight; i += 1) {
		for (let j = 0; j < partWidth; j += 1) {
			if (missile.blueprint[i * partWidth + j]) {
				shape[(i + 1) * (cfg.width + 2) + j + 1] = 100;
				shape[(cfg.height - i) * (cfg.width + 2) + j + 1] = 100;
				if (j < partWidth - 1) {
					shape[(i + 1) * (cfg.width + 2) + cfg.width - j] = 100;
					shape[(cfg.height - i) * (cfg.width + 2) + cfg.width - j] = 100;
				}
			}
		}
	}
	//let's add some glow
	for (let i = 0; i < (cfg.width + 2) * (cfg.height + 2); i += 1) {
		if (shape[i] === 100) {
			shape[i - 1] = shape[i - 1] ? shape[i - 1] : 100 * cfg.glow;
			shape[i + 1] = shape[i + 1] ? shape[i + 1] : 100 * cfg.glow;
			shape[i - cfg.width - 2] = shape[i - cfg.width - 2] ? shape[i - cfg.width - 2] : 100 * cfg.glow;
			shape[i + cfg.width + 2] = shape[i + cfg.width + 2] ? shape[i + cfg.width + 2] : 100 * cfg.glow;
		}
	}

	for (let i = 0; i < (cfg.width + 2) * (cfg.height + 2); i += 1) {
		if (shape[i]) {
			drawPixel(sprite, i % (cfg.width + 2), Math.floor(i / (cfg.width + 2)), hexToRgba(options.color, shape[i]))
		}
	}


	missile.sprite = cacheSprite(sprite, pixelWidth, pixelHeight);

	return missile;
}