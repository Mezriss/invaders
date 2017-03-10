/*
	Ship Generator

	* generates ship's shape, draws it and stores for late redrawing

 */
//todo generate ship as data structure with weapons and hp (and probably AI for shooting)


import {core as coreCfg, ship as cfg} from './config';
import {roll, initCanvas, drawPixel, drawImage} from './util';

const wingLength = Math.ceil(cfg.width / 2);

const shipyard = [],
	blueprints = {},
	shipProto = {
		armour: 1,
		show: function(ctx, x, y) { // x and y are in actual pixels
			const floor = Math.floor(this.id / cfg.shipyardSize),
				position = this.id % cfg.shipyardSize;
			drawImage(ctx, shipyard[floor], [x, y],
				[position * cfg.width * coreCfg.pixelSize, 0],
				[cfg.width * coreCfg.pixelSize, cfg.height * coreCfg.pixelSize]);
		}
	};

function addShipyardFloor() {
	shipyard.push(initCanvas(cfg.width * coreCfg.pixelSize * cfg.shipyardSize, cfg.height * coreCfg.pixelSize));
}

function generateShape() {
	let density = 0;
	const shape = [];
	for (let i = 0; i < cfg.height; i += 1) {
		shape[i] = [];
		for (let j = 0; j < wingLength; j += 1) {
			shape[i][j] = roll(2) - 1;
			density += shape[i][j]
		}
	}
	density = density / wingLength / cfg.height;
	if (density >= cfg.minDensity && density <= cfg.maxDensity) { //this isn't a smart way to do things
		return shape;
	} else {
		return generateShape();
	}
}

export function create(color = cfg.defaultColor) {
	const ship = Object.create(shipProto);
	ship.id = Object.keys(blueprints).length;
	blueprints[ship.id] = ship; //might need later

	ship.shape = generateShape();

	const floor = Math.floor(ship.id / cfg.shipyardSize),
		position = ship.id % cfg.shipyardSize;
	if (!shipyard[floor]) {
		addShipyardFloor();
	}

	for (let i = 0; i < cfg.height; i += 1) {
		for (let j = 0; j < wingLength; j += 1) {
			if (ship.shape[i][j]) {
				drawPixel(shipyard[floor], j + position * cfg.width, i, color);
				if (j < wingLength - 1) {
					drawPixel(shipyard[floor], cfg.width - j - 1 + position * cfg.width, i, color);
				}
			}
		}
	}

	return ship;
}