/*
	Game Loop

 */
import {player as playerCfg} from './config';
import * as c from './const';
import {pubSub} from './util';

let canvas, player, level,
	leftPressed = false, rightPressed = false;

function keyDown(key) {
	switch (key) {
		case c.key.arrowLeft:
			if (!player.moving) {
				player.plannedTravel = playerCfg.minTravelDistance;
			}
			player.moving = true;
			leftPressed = true;
			player.direction = c.direction.left;
			break;
		case c.key.arrowRight:
			if (!player.moving) {
				player.plannedTravel = playerCfg.minTravelDistance;
			}
			player.moving = true;
			rightPressed = true;
			player.direction = c.direction.right;
			break;
		case c.key.space:
			player.setBarrage(true);
			player.fire();
			break;
	}
}

function keyUp(key) {
	switch (key) {
		case c.key.arrowLeft:
			leftPressed = false;
			if (player.direction === c.direction.left) {
				player.moving = false;
			}
			break;
		case c.key.arrowRight:
			rightPressed = false;
			player.moving = leftPressed || rightPressed;
			break;
		case c.key.space:
			player.setBarrage(false);
			break;
	}
}

function levelEntityCreated(type, entity) {
	level[type].push(entity);
}

function levelEntityDestroyed(type, entity) {
	level[type].splice(level[type].indexOf(entity), 1);
}

export function init(data, drawCanvas) {
	pubSub.on(c.event.keyDown, keyDown);
	pubSub.on(c.event.keyUp, keyUp);

	pubSub.on(c.event.levelEntityCreated, levelEntityCreated);
	pubSub.on(c.event.levelEntityDestroyed, levelEntityDestroyed);

	player = data.player;
	level = data.level;
	player.currentShip.armMissile();

	canvas = drawCanvas;
}

export function end() {
	[keyDown, keyUp, levelEntityCreated, levelEntityDestroyed].forEach(handler => pubSub.off(handler));
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

	player.behavior();
	player.move(dt);

	level.missiles.forEach(missile => {
		missile.behavior();
		missile.move(dt);
	});

	level.effects.forEach(effect => effect.move(dt));

	//draw everything
	level.missiles.forEach(missile => missile.show(canvas));
	player.show(canvas);
	level.formations.forEach(formation => formation.show(canvas));
	level.effects.forEach(effect => effect.show(canvas));

	return null;
}