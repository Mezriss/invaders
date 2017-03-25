/*
	Formation Generator

 */

import * as ship from './ship';
import * as missile from './missile';
import {initCanvas, roll, drawImage} from '../util';
import {core as coreCfg, formation as cfg, ship as shipCfg} from '../config';
import {formation as formationConst, direction} from '../const';

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
	move: function(dt) {
		switch (this.direction) {
			case direction.left:
				this.position.x -= this.evadeSpeed * coreCfg.screenWidth * dt / 1000; break;
			case direction.right:
				this.position.x += this.evadeSpeed * coreCfg.screenWidth * dt / 1000; break;
			case direction.up:
				this.position.y -= this.advanceSpeed * coreCfg.screenHeight * dt / 1000; break;
			case direction.down:
				this.position.y += this.advanceSpeed * coreCfg.screenHeight * dt / 1000; break;
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
	formation.direction = roll(0, 1) ? direction.left : direction.right;

	formation.ships = [];

	const shipTypes = [];

	for (let i = 0; i < options.shipTypes; i += 1) {
		const shipType = ship.create();
		shipType.missile = missile.create();
		shipType.missile.launcher = shipType;
		shipTypes.push(shipType);
	}

	switch (options.shipArrangement) {
		case formationConst.oneTypePerLine:
			for (let i = 0; i < options.height; i++) {
				for (let j = 0; j < options.width; j++) {
					const ship = Object.create(shipTypes[i]);
					ship.formation = formation;
					ship.currentLevel = options.level;

					ship.x = Math.floor(cfg.shipPadding * coreCfg.pixelSize / 2) + (shipCfg.width + cfg.shipPadding) * coreCfg.pixelSize * j;
					ship.y = Math.floor(cfg.linePadding * coreCfg.pixelSize / 2) + (shipCfg.height + cfg.linePadding) * coreCfg.pixelSize * i;
					formation.ships.push(ship);
				}
			}
			break;
	}
	formation.ships.forEach(ship => ship.show(formation.ctx));

	return formation;
}