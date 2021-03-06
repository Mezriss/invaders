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
		scoreValue: null,
		x: null,
		y: null,
		show(ctx, x = this.x, y = this.y) {
			drawImage(ctx, this.sprite.ctx, [x, y], this.sprite.coords, [this.sprite.widthPx, this.sprite.heightPx]);
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
export function drawBlueprint(ctx, x, y, blueprint, color, pixelSize = coreCfg.pixelSize) {
	const draw = cfg.drawStyle === confConst.beveled ? drawBeveledPixel : drawPixel;

	for (let i = 0; i < cfg.height; i += 1) {
		for (let j = 0; j < cfg.width; j += 1) {
			if (blueprint[i * cfg.width + j]) {
				draw(ctx, x + j * pixelSize, y + i * pixelSize, color, pixelSize);
			}
		}
	}
}

export function create(options = {}) {
	const ship = Object.create(shipProto),
		widthPx = cfg.width * (options.pixelSize || coreCfg.pixelSize),
		heightPx = cfg.height * (options.pixelSize || coreCfg.pixelSize);
	ship.color = options.color || ship.color;
	ship.blueprint = options.blueprint || generateBlueprint();
	ship.scoreValue = coreCfg.speed;

	sprite.canvas.width = widthPx;
	sprite.canvas.height = heightPx;
	sprite.clearRect(0, 0, widthPx, heightPx);
	drawBlueprint(sprite, 0, 0, ship.blueprint, ship.color, options.pixelSize);

	ship.sprite = cacheSprite(sprite);

	return ship;
}
