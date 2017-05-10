/*
	Formation Generator

 */

import * as ship from './ship';
import * as missile from './missile';
import * as explosion from './explosion';
import { initCanvas, roll, drawImage, rectIntersect, pubSub } from '../util';
import { coreCfg, formationCfg as cfg, shipCfg } from '../conf';
import { formationConst, missileConst, eventConst, directionConst } from '../const';
import * as sound from '../sound';
import soundSamples from '../samples';

let mX, mY, i; //missile coords for collision calculations

const explosionSound = sound.generate(soundSamples.explosion.enemy),
	formationProto = {
		get advanceSpeed() {
			return 0.05 * coreCfg.screenHeight * coreCfg.speed;
		},
		get evadeSpeed() {
			return 0.07 * coreCfg.screenWidth * coreCfg.speed;
		},
		advanceAmount: 0.05,
		advanceStart: null,
		direction: null,
		startingPosition: null,
		x: null,
		y: null,
		ctx: null,
		ships: null,
		width: null,
		height: null,
		show(ctx) {
			drawImage(ctx, this.ctx, [this.x, this.y]);
		},
		behavior() {
			if (this.y + this.ships[this.ships.length - 1].y + shipCfg.heightPx >= coreCfg.screenHeight) {
				pubSub.pub(eventConst.gameOver);
			}

			//sliding movement
			if (this.direction === directionConst.down) {
				if (this.y - this.advanceStart >= this.advanceAmount * coreCfg.screenHeight) {
					this.direction = this.x === 0 ? directionConst.right : directionConst.left;
				}
			} else if (this.x <= 0 || this.x + this.ctx.canvas.width >= coreCfg.screenWidth) {
				this.advanceStart = this.y;
				this.direction = directionConst.down;
				//prevent running offscreen on high speeds
				this.x = this.x <= 0 ? 0 : coreCfg.screenWidth - this.ctx.canvas.width;
			}

			//basic random shooting
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
		move(dt) {
			if (this.y < this.startingPosition) {
				this.y += cfg.warpSpeed * dt / 1000;
			} else {
				switch (this.direction) {
					case directionConst.left:
						this.x -= this.evadeSpeed * dt / 1000;
						break;
					case directionConst.right:
						this.x += this.evadeSpeed * dt / 1000;
						break;
					case directionConst.up:
						this.y -= this.advanceSpeed * dt / 1000;
						break;
					case directionConst.down:
						this.y += this.advanceSpeed * dt / 1000;
						break;
				}
			}
		},
		checkCollisions(missile) {
			mX = missile.x - this.x;
			mY = missile.y - this.y;
			if (mX < 0 || mY < 0 || mX > this.width || mY > this.height) {
				return;
			}
			for (i = this.ships.length - 1; i >= 0; i -= 1) {
				if (rectIntersect(mX, mY, this.ships[i].x, this.ships[i].y)) {
					if (this.ships[i].missile && this.ships[i].missile.status !== missileConst.launched) {
						pubSub.pub(eventConst.levelEntityCreated, eventConst.effect, explosion.create(this.ships[i]));
						pubSub.pub(eventConst.levelEntityCreated, eventConst.effect, explosion.create(this.ships[i].missile));
					} else {
						pubSub.pub(eventConst.levelEntityCreated, eventConst.effect, explosion.create(this.ships[i], missile));
					}
					this.destroyShip(i);
					missile.destroy();
					break;
				}
			}
		},
		destroyShip(id) {
			pubSub.pub(eventConst.enemyDestroyed, this.ships[i]);
			sound.play(explosionSound);
			if (this.ships[i].missile && this.ships[i].missile.status !== missileConst.launched) {
				pubSub.pub(eventConst.enemyDestroyed, this.ships[i].missile);
				this.ships[i].missile.destroy();
			}
			this.ctx.clearRect(this.ships[id].x, this.ships[id].y, shipCfg.widthPx, shipCfg.heightPx);
			this.ships.splice(id, 1);

			if (!this.ships.length) {
				pubSub.pub(eventConst.levelEntityDestroyed, eventConst.formation, this);
			}
		}
	};

export function create(options) {
	const formation = Object.create(formationProto);

	formation.width = (shipCfg.widthPx + cfg.shipPaddingPx) * options.width;
	formation.height = (shipCfg.heightPx + cfg.linePaddingPx) * options.height;
	formation.ctx = initCanvas(formation.width, formation.height);
	formation.x = (coreCfg.screenWidth - formation.width) / 2;
	formation.startingPosition = coreCfg.screenHeight * 0.1 * options.levelNumber;
	formation.y = formation.startingPosition - coreCfg.screenHeight;

	formation.direction = roll(0, 1) ? directionConst.left : directionConst.right;

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

					ship.x = Math.floor(cfg.shipPaddingPx / 2) + (shipCfg.widthPx + cfg.shipPaddingPx) * j;
					ship.y = Math.floor(cfg.linePaddingPx / 2) + (shipCfg.heightPx + cfg.linePaddingPx) * i;
					formation.ships.push(ship);
				}
			}
			break;
	}
	formation.ships.forEach(ship => ship.show(formation.ctx));

	return formation;
}
