import {core as coreCfg, missile as cfg, ship as shipCfg} from '../config';
import {missile as missileConst} from '../const';
import {roll, initCanvas, shuffle, drawPixel, hexToRgba, drawImage, cacheSprite} from '../util';

const defaultOptions = {
		color: cfg.defaultColor
	},
	pixelWidth = cfg.width * coreCfg.pixelSize,
	pixelHeight = cfg.height * coreCfg.pixelSize,
	paddedPixelWidth = pixelWidth + coreCfg.pixelSize * 2,
	paddedPixelHeight = pixelHeight + coreCfg.pixelSize * 2,
	sprite = initCanvas(paddedPixelWidth, paddedPixelHeight),
	partWidth = Math.ceil(cfg.width / 2),
	partHeight = Math.ceil(cfg.height / 2),
	missileProto = {
		speed: 0.2,
		damage: 1,
		launcher: null,
		sprite: null,
		status: null,
		x: null,
		y: null,
		show: function(ctx) {
			drawImage(ctx, this.sprite.ctx, [this.x, this.y], this.sprite.coords, [paddedPixelWidth, paddedPixelHeight])
		},
		alignWithShip() {
			this.x = this.launcher.x + (shipCfg.width - cfg.width - 2) / 2 * coreCfg.pixelSize;
			this.y = this.launcher.y + (shipCfg.height - cfg.height - 2) / 2 * (this.launcher.player ? 1 : -1) * coreCfg.pixelSize;
		},
		arm: function() {
			this.alignWithShip();
			this.status = missileConst.armed;
		},
		behavior: function() {},
		move: function (dt) {
			if (this.status === missileConst.armed) {
				this.alignWithShip();
				return;
			}
		}

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

	sprite.clearRect(0, 0, paddedPixelWidth, paddedPixelHeight);
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


	missile.sprite = cacheSprite(sprite, paddedPixelWidth, paddedPixelHeight);

	return missile;
}