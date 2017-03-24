/*
	Ship Generator

	* generates ship's shape, draws it and stores for late redrawing

 */

import {core as coreCfg, ship as cfg} from '../config';
import {roll, shuffle, initCanvas, drawPixel, drawImage, cacheSprite} from '../util';

const wingLength = Math.ceil(cfg.width / 2),
	pixelWidth = cfg.width * coreCfg.pixelSize,
	pixelHeight = cfg.height * coreCfg.pixelSize;

const defaultOptions = {
		color: cfg.defaultColor
	},
	sprite = initCanvas(pixelWidth, pixelHeight),
	shipProto = {
		armour: 1,
		blueprint: null,
		sprite: null,
		x: null,
		y: null,
		show: ctx => drawImage(ctx, this.sprite.ctx, [this.x, this.y], this.sprite.coords, [pixelWidth, pixelHeight])
	};

export function create(options = defaultOptions) {
	const ship = Object.create(shipProto),
		bitCount = roll(cfg.minBits, cfg.maxBits),
		shape = [];
	
	for (let i = 0; i < wingLength * cfg.height; i += 1) {
		shape.push(i < bitCount);
	}
	
	ship.blueprint = shuffle(shape);
	
	sprite.clearRect(0, 0, pixelWidth, pixelHeight);
	for (let i = 0; i < cfg.height; i += 1) {
		for (let j = 0; j < wingLength; j += 1) {
			if (ship.blueprint[i * wingLength + j]) {
				drawPixel(sprite, j, i, options.color);
				if (j < wingLength - 1) {
					drawPixel(sprite, cfg.width - j - 1, i, options.color);
				}
			}
		}
	}
	ship.sprite = cacheSprite(sprite, pixelWidth, pixelHeight);

	return ship;
}