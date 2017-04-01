/*
	Game Loop

 */
import {core as cfg, player as playerCfg, ship as shipCfg} from './config';
import * as c from './const';
import {pubSub} from './util';

let canvas, player, level,
	leftPressed = false, rightPressed = false;

function keyDownLeft() {
	if (!player.moving) {
		player.plannedTravel = playerCfg.minTravelDistance;
	}
	player.moving = true;
	leftPressed = true;
	player.direction = c.direction.left;
}
function keyDownRight() {
	if (!player.moving) {
		player.plannedTravel = playerCfg.minTravelDistance;
	}
	player.moving = true;
	rightPressed = true;
	player.direction = c.direction.right;
}
function keyUpLeft() {
	leftPressed = false;
	if (player.direction === c.direction.left) {
		player.moving = false;
	}
}

function keyUpRight() {
	rightPressed = false;
	player.moving = leftPressed || rightPressed;
}

function keyDownSpace() {
	player.currentShip.barrage = true;
	player.currentShip.fire();

}

function keyUpSpace() {
	player.currentShip.barrage = false;
}

function missileCreated(missile) {
	level.missiles.push(missile);
}

function missileDestroyed(missile) {
	level.missiles.splice(level.missiles.indexOf(missile), 1);
}

export function init(data, drawCanvas) {
	pubSub.on(`${c.event.keyDown}#${c.key.arrowLeft}`, keyDownLeft);
	pubSub.on(`${c.event.keyDown}#${c.key.arrowRight}`, keyDownRight);
	pubSub.on(`${c.event.keyDown}#${c.key.space}`, keyDownSpace);
	pubSub.on(`${c.event.keyUp}#${c.key.arrowLeft}`, keyUpLeft);
	pubSub.on(`${c.event.keyUp}#${c.key.arrowRight}`, keyUpRight);
	pubSub.on(`${c.event.keyUp}#${c.key.space}`, keyUpSpace);

	pubSub.on(c.event.missileCreated, missileCreated);
	pubSub.on(c.event.missileDestroyed, missileDestroyed);

	player = data.player;
	level = data.level;
	player.currentShip.armMissile();

	canvas = drawCanvas;
}

export function end() {
	[keyDownLeft, keyDownRight, keyUpLeft, keyUpRight, keyDownSpace, keyUpSpace,
		missileCreated, missileDestroyed].forEach(handler => pubSub.off(handler));
}

export function drawFrame(dt) {
	//check for collisions
	level.missiles.filter(missile => missile.status === c.missile.launched).forEach(missile => {
		if (missile.launcher.player) {
			level.formations.forEach(formation => formation.checkCollisions(missile))
		} else {
			player.checkCollisions(missile);
		}
	});

	//run AI and update locations of everything
	level.formations.forEach(formation => {
		formation.behavior();
		formation.ships.forEach(ship => ship.behavior());
		formation.move(dt);
	});
	player.currentShip.behavior();

	//take user input and move ship
	if (player.moving || player.plannedTravel > 0) {
		let travelDistance = player.speed * cfg.screenWidth * dt / 1000;
		switch (player.direction) {
			case c.direction.left: player.currentShip.x -= travelDistance; break;
			case c.direction.right: player.currentShip.x += travelDistance; break;
		}
		if (player.currentShip.x < 0) {
			player.currentShip.x = 0;
		}
		if (player.currentShip.x > cfg.screenWidth - shipCfg.widthPx) {
			player.currentShip.x = cfg.screenWidth - shipCfg.widthPx;
		}
		player.plannedTravel -= travelDistance;
	} else {
		player.currentShip.x = Math.round(player.currentShip.x);
	}

	level.missiles.forEach(missile => {
		missile.behavior();
		missile.move(dt);
	});

	//draw everything
	level.missiles.forEach(missile => missile.show(canvas));
	player.show(canvas);
	level.formations.forEach(formation => formation.show(canvas));

	return null;
}