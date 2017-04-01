/*
	Ship Generator

	* generates ship's shape, draws it and stores for late redrawing

 */

import {ship as cfg, core as coreCfg} from '../config';
import {roll, shuffle, initCanvas, drawPixel, drawBeveledPixel, drawImage, cacheSprite, pubSub} from '../util';
import {conf as confConst, event as eventConst} from '../const';

const wingLength = Math.ceil(cfg.width / 2);

const defaultOptions = {
		color: cfg.defaultColor
	},
	sprite = initCanvas(cfg.widthPx, cfg.heightPx),
	shipProto = {
		player: false,
		blueprint: null,
		color: null,
		missileType: null,
		missile: null,
		formation: null,
		sprite: null,
		x: null,
		y: null,
		show: function(ctx) {
			drawImage(ctx, this.sprite.ctx, [this.x, this.y], this.sprite.coords, [cfg.widthPx, cfg.heightPx])
		},
		behavior: function() {
			//reload
			if (this.player && this.missileType && (!this.missile || this.missile.checkSafeDistance())) {
				this.armMissile();
			}
		},
		armMissile: function() {
			if (!this.missile || this.missile.checkSafeDistance()) {
				this.missile = Object.create(this.missileType);
				this.missile.launcher = this;
				this.missile.arm();
				pubSub.pub(eventConst.missileCreated, this.missile);
			}
		},
		fire: function() {
			if (this.missile) {
				this.missile.launch();
			}
		}
	};

export function create(options = defaultOptions) {
	const ship = Object.create(shipProto),
		bitCount = roll(cfg.minBits, cfg.maxBits),
		draw = cfg.drawStyle === confConst.beveled ? drawBeveledPixel : drawPixel;
	let shape = [];
	
	for (let i = 0; i < wingLength * cfg.height; i += 1) {
		shape.push(i < bitCount);
	}
	ship.color = options.color;
	shape = shuffle(shape);
	ship.blueprint = [];

	for (let i = 0; i < cfg.height; i += 1) {
		for (let j = 0; j < wingLength; j += 1) {
			ship.blueprint[i * cfg.width + j] = shape[i * wingLength + j];
			ship.blueprint[i * cfg.width + cfg.width - j - 1] = shape[i * wingLength + j];
		}
	}

	
	sprite.clearRect(0, 0, cfg.widthPx, cfg.heightPx);
	for (let i = 0; i < cfg.height; i += 1) {
		for (let j = 0; j < cfg.width; j += 1) {
			if (ship.blueprint[i * cfg.width + j]) {
				draw(sprite, j * coreCfg.pixelSize, i * coreCfg.pixelSize, ship.color);
			}
		}
	}
	ship.sprite = cacheSprite(sprite, cfg.widthPx, cfg.heightPx);

	return ship;
}