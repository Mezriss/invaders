/*
	Ship Generator

	* generates ship's shape, draws it and stores for late redrawing

 */

import { shipCfg as cfg, coreCfg } from '../conf';
import { roll, shuffle, initCanvas, drawPixel, drawBeveledPixel, drawImage, cacheSprite, pubSub } from '../util';
import { confConst, eventConst } from '../const';

const wingLength = Math.ceil(cfg.width / 2);

const sprite = initCanvas(cfg.widthPx, cfg.heightPx),
	shipProto = {
		player: false,
		blueprint: null,
		color: cfg.defaultColor,
		missileType: null,
		missile: null,
		formation: null,
		sprite: null,
		scoreValue: 1,
		x: null,
		y: null,
		show(ctx, x = this.x, y = this.y) {
			drawImage(ctx, this.sprite.ctx, [x, y], this.sprite.coords, [cfg.widthPx, cfg.heightPx]);
		},
		behavior() {
			//reload
			if (this.player && this.missileType && (!this.missile || this.missile.checkSafeDistance())) {
				this.armMissile();
			}
		},
		armMissile() {
			if (!this.missile || this.missile.checkSafeDistance()) {
				this.missile = Object.create(this.missileType);
				this.missile.launcher = this;
				this.missile.arm();
				pubSub.pub(eventConst.levelEntityCreated, eventConst.missile, this.missile);
			}
		},
		fire() {
			if (this.missile) {
				this.missile.launch();
			}
		},
		getCenter() {
			return [
				this.x + (this.formation ? this.formation.x : 0) + cfg.widthPx / 2,
				this.y + (this.formation ? this.formation.y : 0) + cfg.heightPx / 2
			];
		}
	};

export function generateBlueprint() {
	let shape = [];
	const bitCount = roll(cfg.minBits, cfg.maxBits), blueprint = [];

	for (let i = 0; i < wingLength * cfg.height; i += 1) {
		shape.push(i < bitCount);
	}

	shape = shuffle(shape);

	for (let i = 0; i < cfg.height; i += 1) {
		for (let j = 0; j < wingLength; j += 1) {
			blueprint[i * cfg.width + j] = shape[i * wingLength + j];
			blueprint[i * cfg.width + cfg.width - j - 1] = shape[i * wingLength + j];
		}
	}

	return blueprint;
}
export function drawBlueprint(ctx, x, y, blueprint, color) {
	const draw = cfg.drawStyle === confConst.beveled ? drawBeveledPixel : drawPixel;

	for (let i = 0; i < cfg.height; i += 1) {
		for (let j = 0; j < cfg.width; j += 1) {
			if (blueprint[i * cfg.width + j]) {
				draw(ctx, x + j * coreCfg.pixelSize, y + i * coreCfg.pixelSize, color);
			}
		}
	}
}

export function create(options = {}) {
	const ship = Object.create(shipProto);

	ship.color = options.color || ship.color;
	ship.blueprint = generateBlueprint();

	sprite.canvas.width = cfg.widthPx;
	sprite.canvas.height = cfg.heightPx;
	sprite.clearRect(0, 0, cfg.widthPx, cfg.heightPx);
	drawBlueprint(sprite, 0, 0, ship.blueprint, ship.color);

	ship.sprite = cacheSprite(sprite);

	return ship;
}
