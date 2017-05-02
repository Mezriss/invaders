import { coreCfg, missileCfg as cfg, shipCfg } from '../conf';
import { missileConst, eventConst } from '../const';
import { roll, initCanvas, shuffle, drawPixel, hexToRgba, drawImage, cacheSprite, pubSub } from '../util';
import * as sound from '../sound';
import soundSamples from '../samples';

const sprite = initCanvas(cfg.widthPaddedPx, cfg.heightPaddedPx),
	partWidth = Math.ceil(cfg.width / 2),
	partHeight = Math.ceil(cfg.height / 2),
	missileProto = {
		speed: 0.2,
		color: cfg.defaultColor,
		launcher: null,
		sprites: null,
		armStart: null,
		armProgress: 0,
		armSpeed: 1000,
		scoreValue: 1,
		status: null,
		launchSound: null,
		x: null,
		y: null,
		show(ctx, x = this.x, y = this.y) {
			drawImage(
				ctx,
				this.sprites[this.armProgress].ctx,
				[x - cfg.glowLengthPx, y - cfg.glowLengthPx],
				this.sprites[this.armProgress].coords,
				[cfg.widthPaddedPx, cfg.heightPaddedPx]
			);
		},
		alignWithShipX() {
			this.x = this.launcher.x + (shipCfg.widthPx - cfg.widthPx) / 2;
			this.x += this.launcher.formation ? this.launcher.formation.x : 0;
		},
		alignWithShipY() {
			if (this.launcher.player) {
				this.y = this.launcher.y + (shipCfg.heightPx - cfg.heightPx) / 2;
			} else {
				this.y = this.launcher.formation.y + this.launcher.y - (shipCfg.heightPx - cfg.heightPx) / 2;
			}
		},
		arm() {
			this.alignWithShipX();
			this.alignWithShipY();
			this.armStart = Date.now();
			this.status = missileConst.arming;
		},
		launch() {
			if (this.status === missileConst.armed) {
				this.status = missileConst.launched;
				if (this.launchSound) {
					sound.play(this.launchSound);
				}
			}
		},
		behavior() {
			if (this.status === missileConst.arming) {
				this.armProgress = Math.min(
					Math.floor((Date.now() - this.armStart) / (this.armSpeed / cfg.armSteps)),
					cfg.armSteps - 1
				);
				if (this.armProgress === cfg.armSteps - 1) {
					this.status = missileConst.armed;
					if (this.launcher.barrage) {
						this.launch();
					}
				}
			}
		},
		move(dt) {
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
			if (this.y < -cfg.heightPaddedPx || this.y > coreCfg.fullScreenHeight) {
				this.destroy();
			}
		},
		checkSafeDistance() {
			return (
				this.status === missileConst.launched &&
				Math.abs(this.launcher.y + (this.launcher.formation ? this.launcher.formation.y : 0) - this.y) >
					cfg.heightPaddedPx
			);
		},
		destroy() {
			this.status = missileConst.destroyed;
			pubSub.pub(eventConst.levelEntityDestroyed, eventConst.missile, this);
			if (this.launcher.missile === this) {
				this.launcher.missile = null;
			}
		},
		getCenter() {
			return [this.x + cfg.widthPx / 2, this.y + cfg.heightPx / 2];
		}
	};

function padded2dTo1d(x, y) {
	return (y + cfg.glowLength) * cfg.widthPadded + x + cfg.glowLength;
}

export function create(options = {}) {
	sprite.canvas.width = cfg.widthPaddedPx;
	sprite.canvas.height = cfg.heightPaddedPx;

	const missile = Object.create(missileProto), bitCount = roll(cfg.minBits, cfg.maxBits);

	missile.color = options.color || missile.color;

	let shape = [];

	for (let i = 0; i < partWidth * partHeight; i += 1) {
		shape.push(i < bitCount);
	}
	shape = shuffle(shape);

	missile.blueprint = [];
	missile.sprites = [];

	for (let i = 0; i < partHeight; i += 1) {
		for (let j = 0; j < partWidth; j += 1) {
			if (shape[i * partWidth + j]) {
				missile.blueprint[padded2dTo1d(j, i)] = 1;
				missile.blueprint[padded2dTo1d(cfg.width - 1 - j, i)] = 1;
				missile.blueprint[padded2dTo1d(j, cfg.height - 1 - i)] = 1;
				missile.blueprint[padded2dTo1d(cfg.width - 1 - j, cfg.height - 1 - i)] = 1;
			}
		}
	}
	//let's add some glow
	for (let i = 0; i < cfg.widthPadded * cfg.heightPadded; i += 1) {
		if (missile.blueprint[i] === 1) {
			for (let j = 1; j <= cfg.glowLength; j += 1) {
				let glow = cfg.glow - cfg.glow * cfg.glowDegradation * (j - 1);
				missile.blueprint[i - j] = missile.blueprint[i - j] || glow;
				missile.blueprint[i + j] = missile.blueprint[i + j] || glow;
				missile.blueprint[i - cfg.widthPadded * j] = missile.blueprint[i - cfg.widthPadded * j] || glow;
				missile.blueprint[i + cfg.widthPadded * j] = missile.blueprint[i + cfg.widthPadded * j] || glow;
			}
		}
	}
	//draw a sprite for each arm step
	for (let j = 0; j < cfg.armSteps; j += 1) {
		sprite.clearRect(0, 0, cfg.widthPaddedPx, cfg.heightPaddedPx);
		for (let i = 0; i < cfg.widthPadded * cfg.heightPadded; i += 1) {
			if (missile.blueprint[i]) {
				drawPixel(
					sprite,
					i % cfg.widthPadded * coreCfg.pixelSize,
					Math.floor(i / cfg.widthPadded) * coreCfg.pixelSize,
					hexToRgba(missile.color, missile.blueprint[i] * (j + 1) / cfg.armSteps)
				);
			}
		}
		missile.sprites.push(cacheSprite(sprite));
	}

	if (options.launchSound) {
		missile.launchSound = sound.generate(options.launchSound);
	} else {
		const launchSound = Object.assign({}, soundSamples.laser.enemy);
		launchSound.frequency *= 0.8 + 0.4 * Math.random();
		missile.launchSound = sound.generate(launchSound);
	}

	return missile;
}
