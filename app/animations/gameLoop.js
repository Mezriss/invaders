/*
	Game Loop

 */
import {playerCfg} from '../conf';
import * as c from '../const';
import {pubSub} from '../util';
import * as infoPanel from '../interface/infoPanel';

let canvas, player, level,
	leftPressed = false, rightPressed = false;

function keyDown(key) {
	switch (key) {
		case c.keyConst.arrowLeft:
			if (!player.moving) {
				player.plannedTravel = playerCfg.minTravelDistance;
			}
			player.moving = true;
			leftPressed = true;
			player.direction = c.directionConst.left;
			break;
		case c.keyConst.arrowRight:
			if (!player.moving) {
				player.plannedTravel = playerCfg.minTravelDistance;
			}
			player.moving = true;
			rightPressed = true;
			player.direction = c.directionConst.right;
			break;
		case c.keyConst.space:
			player.setBarrage(true);
			player.fire();
			break;
	}
}

function keyUp(key) {
	switch (key) {
		case c.keyConst.arrowLeft:
			leftPressed = false;
			if (player.direction === c.directionConst.left) {
				player.moving = false;
			}
			break;
		case c.keyConst.arrowRight:
			rightPressed = false;
			player.moving = leftPressed || rightPressed;
			break;
		case c.keyConst.space:
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

function enemyDestroyed(enemy) {
	player.score += enemy.scoreValue;
	pubSub.pub(c.eventConst.scoreUpdate, player.score);
}

export function init(data, drawCanvas) {
	pubSub.on(c.eventConst.keyDown, keyDown);
	pubSub.on(c.eventConst.keyUp, keyUp);

	pubSub.on(c.eventConst.levelEntityCreated, levelEntityCreated);
	pubSub.on(c.eventConst.levelEntityDestroyed, levelEntityDestroyed);

	pubSub.on(c.eventConst.enemyDestroyed, enemyDestroyed);

	player = data.player;
	level = data.level;
	player.currentShip.armMissile();

	canvas = drawCanvas;
	infoPanel.init(player);
}

export function end() {
	[keyDown, keyUp, levelEntityCreated, levelEntityDestroyed, enemyDestroyed].forEach(handler => pubSub.off(handler));
	infoPanel.destroy();
}

export function drawFrame(dt) {
	//check for collisions
	level.missiles.filter(missile => missile.status === c.missileConst.launched).forEach(missile => {
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