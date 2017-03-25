/*
	Player Generator

 */

import {player as cfg, core as coreCfg, ship as shipCfg} from '../config'
import * as shipGenerator from './ship';
import * as missileGenerator from './missile';


const playerProto = {
	score: 0,
	currentLevel: null,
	currentShip: null,
	extraShips: null,
	direction: null,
	plannedTravel: 0,
	moving: false,
	speed: 0.3,
	show: function(ctx) {
		this.currentShip.show(ctx);
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

		ship.x = Math.floor(coreCfg.screenWidth / 2 - shipCfg.width * 0.5 * coreCfg.pixelSize);
		ship.y = Math.floor(coreCfg.screenHeight - shipCfg.height * 1.5 * coreCfg.pixelSize);

		ship.missileType = missileGenerator.create();
		ship.missileType.launcher = ship;

		player.extraShips.push(ship);
	}

	player.currentShip = player.extraShips.pop();

	return player;
}