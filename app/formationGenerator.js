/*
	Formation Generator

 */

import * as ship from './shipGenerator';
import {initCanvas, roll, drawImage} from './util';
import {core as coreCfg, formation as cfg, ship as shipCfg} from './config';
import {formation as formationConst} from './const';

//todo based on provided options create list of ships with positions in formation
//todo initialize canvas for those ships and draw them

//todo functionality to remove exploding ships
//todo functionality to draw formation

const formationProto = {
	advanceSpeed: 0.01,
	evadeSpeed: 0.10,
	direction: 1,
	show: function(ctx) {
		drawImage(ctx, this.ctx, [this.position.x, this.position.y]);
	},
	behavior: function() { //this is a basic default behavior
		if ((this.position.x <= 0) || (this.position.x + this.ctx.canvas.width >= coreCfg.screenWidth)) {
			this.direction *= -1;
		}
	},
	removeShip: function() {

	}
};


export function create(options) {
	const formation = Object.create(formationProto);

	formation.ctx = initCanvas((shipCfg.width + cfg.shipPadding) * options.width * coreCfg.pixelSize,
		(shipCfg.height + cfg.linePadding) * options.height * coreCfg.pixelSize);
	formation.position = {
		x: (coreCfg.screenWidth - formation.ctx.canvas.width) / 2,
		y: coreCfg.screenHeight * 0.1 * options.levelNumber
	};
	formation.direction = roll(2) - 1 ? 1 : -1;

	formation.ships = [];

	const shipTypes = [];

	for (let i = 0; i < options.shipTypes; i += 1) {
		shipTypes.push(ship.create());
	}

	switch (options.shipArrangement) {
		case formationConst.oneTypePerLine:
			for (let i = 0; i < options.height; i++) {
				for (let j = 0; j < options.width; j++) {
					formation.ships.push({
						proto: shipTypes[i],
						armour: shipTypes[i].armour,
						x: cfg.shipPadding * coreCfg.pixelSize / 2 + (shipCfg.width + cfg.shipPadding) * coreCfg.pixelSize * j,
						y: cfg.linePadding * coreCfg.pixelSize / 2 + (shipCfg.height + cfg.linePadding) * coreCfg.pixelSize * i
					})
				}
			}
			break;
	}
	formation.ships.forEach(ship => ship.proto.show(formation.ctx, ship.x, ship.y));

	return formation;
}