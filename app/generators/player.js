/*
	Player Generator

 */

import { playerCfg as cfg, coreCfg, shipCfg } from '../conf';
import { eventConst, missileConst, directionConst } from '../const';
import * as shipGenerator from './ship';
import * as missileGenerator from './missile';
import * as explosion from './explosion';
import { rectIntersect, pubSub } from '../util';

const playerProto = {
	score: 0,
	currentShip: null,
	extraShips: null,
	direction: null,
	plannedTravel: 0,
	moving: false,
	speed: cfg.speed,
	get x() {
		return this.currentShip && this.currentShip.x;
	},
	get y() {
		return this.currentShip && this.currentShip.y;
	},
	show: function(ctx, x, y) {
		if (this.currentShip) {
			this.currentShip.show(ctx, x, y);
		}
	},
	behavior: function() {
		if (this.currentShip) {
			this.currentShip.behavior();
		}
	},
	move: function(dt) {
		if (this.currentShip) {
			if (this.moving || this.plannedTravel > 0) {
				let travelDistance = this.speed * dt / 1000;
				switch (this.direction) {
					case directionConst.left:
						this.currentShip.x -= travelDistance;
						break;
					case directionConst.right:
						this.currentShip.x += travelDistance;
						break;
				}
				if (this.currentShip.x < 0) {
					this.currentShip.x = 0;
				}
				if (this.currentShip.x > coreCfg.screenWidth - shipCfg.widthPx) {
					this.currentShip.x = coreCfg.screenWidth - shipCfg.widthPx;
				}
				this.plannedTravel -= travelDistance;
			} else {
				this.currentShip.x = Math.round(this.currentShip.x);
			}
		}
	},
	fire() {
		if (this.currentShip) {
			this.currentShip.fire();
		}
	},
	setBarrage(val) {
		if (this.currentShip) {
			this.currentShip.barrage = val;
		}
	},
	checkCollisions(missile) {
		if (this.currentShip && rectIntersect(missile.x, missile.y, this.currentShip.x, this.currentShip.y)) {
			missile.destroy();
			if (this.currentShip.missile && this.currentShip.missile.status !== missileConst.launched) {
				pubSub.pub(eventConst.levelEntityCreated, eventConst.effect, explosion.create(this.currentShip));
				pubSub.pub(eventConst.levelEntityCreated, eventConst.effect, explosion.create(this.currentShip.missile));
				this.currentShip.missile.destroy();
			} else {
				pubSub.pub(eventConst.levelEntityCreated, eventConst.effect, explosion.create(this.currentShip, missile));
			}
			if (!this.extraShips.length) {
				this.lastShip = this.currentShip;
				pubSub.pub(eventConst.gameOver);
				this.currentShip = null;
			} else {
				this.currentShip = null;
				setTimeout(() => {
					this.currentShip = this.extraShips.pop();
					pubSub.pub(eventConst.shipListUpdate, this.extraShips);
				}, cfg.respawnDelay);
				pubSub.pub(eventConst.shipListUpdate, this.extraShips);
			}
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
