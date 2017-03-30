/*
	Formation Generator

 */

import * as ship from './ship';
import * as missile from './missile';
import {initCanvas, roll, drawImage, rectIntersectMS, pointIntersectMS} from '../util';
import {core as coreCfg, formation as cfg, ship as shipCfg} from '../config';
import {formation as formationConst, missile as missileConst, direction} from '../const';

let mX, mY, i; //missile coords for collision calculations

const formationProto = {
	advanceSpeed: 0.05,
	evadeSpeed: 0.07,
	advanceAmount: 0.05,
	direction: null,
	x: null,
	y: null,
	ctx: null,
	ships: null,
	width: null,
	height: null,
	show: function(ctx) {
		drawImage(ctx, this.ctx, [this.x, this.y]);
	},
	behavior: function() { //this is a basic default behavior
		if (this.direction === direction.down) {
			if (this.y - this.advanceStart >= this.advanceAmount * coreCfg.screenHeight) {
				this.direction = this.x === 0 ? direction.right : direction.left;
			}
			return;
		}

		if ((this.x <= 0) || (this.x + this.ctx.canvas.width >= coreCfg.screenWidth)) {
			this.advanceStart = this.y;
			this.direction = direction.down;
			//prevent running offscreen on high speeds
			this.x = this.x <= 0 ? 0 : coreCfg.screenWidth - this.ctx.canvas.width;
		}
		if (roll(this.ships.length) === 1) {
			this.ships[roll(0, this.ships.length - 1)].armMissile();
		}
		if (roll(this.ships.length * 3) === 1) {
			let readyShips = this.ships.filter(ship => ship.missile);
			if (readyShips.length) {
				readyShips[roll(0, readyShips.length - 1)].fire();
			}
		}
	},
	move: function(dt) {
		switch (this.direction) {
			case direction.left:
				this.x -= this.evadeSpeed * coreCfg.screenWidth * dt / 1000; break;
			case direction.right:
				this.x += this.evadeSpeed * coreCfg.screenWidth * dt / 1000; break;
			case direction.up:
				this.y -= this.advanceSpeed * coreCfg.screenHeight * dt / 1000; break;
			case direction.down:
				this.y += this.advanceSpeed * coreCfg.screenHeight * dt / 1000; break;
		}
	},
	checkCollisions: function(missile) {
		mX = missile.x - this.x;;
		mY = missile.y - this.y;
		if (mX < 0 || mY < 0 || mX > this.width || mY > this.height) {
			return;
		}
		for (i = this.ships.length - 1; i >= 0; i -= 1) {//todo box collisions at -1
			if (pointIntersectMS(mX, mY, this.ships[i].x, this.ships[i].y, false)) {
				//todo check if ship geometry is hit

				this.ships[i].armour -= missile.damage;
				if (this.ships[i].armour <= 0) {
					this.destroyShip(i);
				}
				missile.destroy();
				break;
			}

		}
	},
	destroyShip: function(id) {
		if (this.ships[i].missile && this.ships[i].missile.status !== missileConst.launched) {
			this.ships[i].missile.destroy();
		}
		this.ctx.clearRect(this.ships[id].x, this.ships[id].y, shipCfg.width * coreCfg.pixelSize, shipCfg.height * coreCfg.pixelSize);
		this.ships.splice(id, 1);
		//todo add effect
	}
};


export function create(options) {
	const formation = Object.create(formationProto);

	formation.width = (shipCfg.width + cfg.shipPadding) * options.width * coreCfg.pixelSize;
	formation.height = (shipCfg.height + cfg.linePadding) * options.height * coreCfg.pixelSize;
	formation.ctx = initCanvas(formation.width, formation.height);
	formation.x = (coreCfg.screenWidth - formation.width) / 2;
	formation.y = coreCfg.screenHeight * 0.1 * options.levelNumber;

	formation.direction = roll(0, 1) ? direction.left : direction.right;

	formation.ships = [];

	const shipTypes = [];

	for (let i = 0; i < options.shipTypes; i += 1) {
		const shipType = ship.create();
		shipType.missileType = missile.create();
		shipTypes.push(shipType);
	}

	switch (options.shipArrangement) {
		case formationConst.oneTypePerLine:
			for (let i = 0; i < options.height; i++) {
				for (let j = 0; j < options.width; j++) {
					const ship = Object.create(shipTypes[i]);
					ship.formation = formation;
					ship.currentLevel = options.level;

					ship.x = Math.floor(cfg.shipPadding / 2 * coreCfg.pixelSize) + (shipCfg.width + cfg.shipPadding) * coreCfg.pixelSize * j;
					ship.y = Math.floor(cfg.linePadding / 2 * coreCfg.pixelSize) + (shipCfg.height + cfg.linePadding) * coreCfg.pixelSize * i;
					formation.ships.push(ship);
				}
			}
			break;
	}
	formation.ships.forEach(ship => ship.show(formation.ctx));

	return formation;
}