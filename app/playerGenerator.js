/*
	Player Generator

 */

import {player as cfg, core as coreCfg, ship as shipCfg} from './config'
import * as ship from './shipGenerator';


const playerProto = {
	score: 0,
	currentShip: null,
	extraShips: null,
	x: Math.floor(coreCfg.screenWidth / 2 - shipCfg.width * 0.5 * coreCfg.pixelSize),
	y: Math.floor(coreCfg.screenHeight - shipCfg.height * 1.5 * coreCfg.pixelSize),
	show: function(ctx) {
		this.currentShip.show(ctx, this.x, this.y);
	}
};

const playerShipCfg = {
	color: cfg.defaultColor
};


export function create() {
	const player = Object.create(playerProto);
	player.currentShip = ship.create(playerShipCfg);
	player.extraShips = [];
	for (let i = 0; i < cfg.extraShips; i += 1) {
		player.extraShips.push(ship.create(playerShipCfg));
	}

	return player;
}