/*
	Player Generator

 */

import {player as cfg, core as coreCfg, ship as shipCfg, missile as missileCfg} from '../config'
import * as shipGenerator from './ship';
import * as missileGenerator from './missile';
import {rectIntersect} from '../util';


const playerProto = {
	score: 0,
	currentShip: null,
	extraShips: null,
	direction: null,
	plannedTravel: 0,
	moving: false,
	speed: 0.3,
	show: function(ctx) {
		this.currentShip.show(ctx);
	},
	checkCollisions(missile) {
		if (rectIntersect(missile.x, missile.y, this.currentShip.x, this.currentShip.y)) {
			missile.destroy();
			console.info('Dead')
		}
	}
};

const playerShipCfg = {
	color: cfg.defaultColor
};

export function create() {
	const player = Object.create(playerProto);

	player.extraShips = [];

	for (let i = 0; i < cfg.startingLives; i += 1) {
		const ship = shipGenerator.create(playerShipCfg);
		ship.player = true;

		ship.x = Math.floor(coreCfg.screenWidth / 2 - shipCfg.widthPx / 2);
		ship.y = Math.floor(coreCfg.screenHeight - shipCfg.heightPx * 1.5);

		ship.missileType = missileGenerator.create();
		ship.missileType.launcher = ship;

		player.extraShips.push(ship);
	}

	player.currentShip = player.extraShips.pop();

	return player;
}