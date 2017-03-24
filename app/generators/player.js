/*
	Player Generator

 */

import {player as cfg, core as coreCfg, ship as shipCfg} from '../config'
import * as ship from './ship';


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
	}
};

const playerShipCfg = {
	color: cfg.defaultColor
};


export function create() {
	const player = Object.create(playerProto);

	player.currentShip = ship.create(playerShipCfg);
	player.currentShip.x = Math.floor(coreCfg.screenWidth / 2 - shipCfg.width * 0.5 * coreCfg.pixelSize);
	player.currentShip.y = Math.floor(coreCfg.screenHeight - shipCfg.height * 1.5 * coreCfg.pixelSize);

	player.extraShips = [];
	for (let i = 0; i < cfg.extraShips; i += 1) {
		player.extraShips.push(ship.create(playerShipCfg));
	}

	return player;
}