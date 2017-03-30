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
		sprites: null,
		armStart: null,
		armProgress: 0,
		armSpeed: 1000,
		status: null,
		x: null,
		y: null,
		show: function(ctx) {
			drawImage(ctx, this.sprites[this.armProgress].ctx, [this.x, this.y], this.sprites[this.armProgress].coords, [paddedPixelWidth, paddedPixelHeight])
		},
		alignWithShipX() {
			this.x = this.launcher.x + (shipCfg.width - cfg.width - 2) / 2 * coreCfg.pixelSize;
			this.x += this.launcher.formation ? this.launcher.formation.x : 0;
		},
		alignWithShipY() {
			if (this.launcher.player) {
				this.y = this.launcher.y + (shipCfg.height - cfg.height - 2) / 2 * coreCfg.pixelSize;
			} else {
				this.y = this.launcher.formation.y + this.launcher.y - (shipCfg.height - cfg.height + 2) / 2 * coreCfg.pixelSize;
			}
		},
		arm: function() {
			this.alignWithShipX();
			this.alignWithShipY();
			this.armStart = Date.now();
			this.status = missileConst.arming;
		},
		launch() {
			if (this.status === missileConst.armed) {
				this.status = missileConst.launched
			}
		},
		behavior: function() {
			if (this.status === missileConst.arming) {
				this.armProgress = Math.floor((Date.now() - this.armStart) / (this.armSpeed / cfg.armSteps));
				this.armProgress = this.armProgress >= cfg.armSteps ? cfg.armSteps - 1 : this.armProgress;
				if (this.armProgress === cfg.armSteps - 1) {
					this.status = missileConst.armed;
					if (this.launcher.barrage) {
						this.launch();
					}
				}
			}
		},
		move: function (dt) {
			if (this.status !== missileConst.launched) {
				this.alignWithShipY();
			}

			if (this.status !== missileConst.launched || !this.checkSafeDistance()) {
				this.alignWithShipX();
			}
			if (this.status === missileConst.launched) {
				this.y += this.speed * coreCfg.screenHeight * dt / 1000 * (this.launcher.player ? -1 : 1);
			}
			//cleanup offscreen missiles
			if (this.y < -paddedPixelHeight || this.y > coreCfg.screenHeight) {
				this.destroy();
			}
		},
		checkSafeDistance: function() {
			return this.status === missileConst.launched &&
				Math.abs(this.launcher.y + (this.launcher.formation ? this.launcher.formation.y : 0) - this.y) > paddedPixelHeight;
		},
		destroy: function() {
			this.status = missileConst.destroyed;
			this.launcher.currentLevel.missiles.splice(this.launcher.currentLevel.missiles.indexOf(this), 1);
			if (this.launcher.missile === this) {
				this.launcher.missile = null;
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
	missile.sprites = [];


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
	//draw a sprite for each arm step
	for (let j = cfg.armSteps - 1; j >= 0; j -= 1) {
		sprite.clearRect(0, 0, paddedPixelWidth, paddedPixelHeight);
		for (let i = 0; i < (cfg.width + 2) * (cfg.height + 2); i += 1) {
			if (shape[i]) {
				drawPixel(sprite, i % (cfg.width + 2), Math.floor(i / (cfg.width + 2)),
					hexToRgba(options.color, shape[i] - (shape[i] / cfg.armSteps) * j))
			}
		}
		missile.sprites.push(cacheSprite(sprite, paddedPixelWidth, paddedPixelHeight));
	}

	return missile;
}