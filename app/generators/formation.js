/*
	Formation Generator

 */

import * as ship from './ship';
import {initCanvas, roll, drawImage} from '../util';
import {core as coreCfg, formation as cfg, ship as shipCfg} from '../config';
import {formation as formationConst, direction} from '../const';

//todo functionality to remove exploding ships

const formationProto = {
	advanceSpeed: 0.05,
	evadeSpeed: 0.07,
	advanceAmount: 0.05,
	direction: direction.right,
	show: function(ctx) {
		drawImage(ctx, this.ctx, [this.position.x, this.position.y]);
	},
	behavior: function() { //this is a basic default behavior
		if (this.direction === direction.down) {
			if (this.position.y - this.advanceStart >= this.advanceAmount * coreCfg.screenHeight) {
				this.direction = this.position.x === 0 ? direction.right : direction.left;
			}
			return;
		}

		if ((this.position.x <= 0) || (this.position.x + this.ctx.canvas.width >= coreCfg.screenWidth)) {
			this.advanceStart = this.position.y;
			this.direction = direction.down;
			//prevent running offscreen on high speeds
			this.position.x = this.position.x <= 0 ? 0 : coreCfg.screenWidth - this.ctx.canvas.width;
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
	formation.direction = roll(2) - 1 ? direction.left : direction.right;

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