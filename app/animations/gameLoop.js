/*
	Game Loop

 */
import { playerCfg } from '../conf';
import { keyConst, directionConst, eventConst, missileConst } from '../const';
import { pubSub } from '../util';
import * as infoPanel from '../interface/infoPanel';
import * as levelNumber from '../interface/levelNumber';

let canvas, player, level, gameOver, leftPressed, rightPressed, introAnimationRunning;

function keyDown(key) {
	switch (key) {
		case keyConst.arrowLeft:
			if (!player.moving) {
				player.plannedTravel = playerCfg.minTravelDistance;
			}
			player.moving = true;
			leftPressed = true;
			player.direction = directionConst.left;
			break;
		case keyConst.arrowRight:
			if (!player.moving) {
				player.plannedTravel = playerCfg.minTravelDistance;
			}
			player.moving = true;
			rightPressed = true;
			player.direction = directionConst.right;
			break;
		case keyConst.space:
			player.setBarrage(true);
			player.fire();
			break;
	}
}

function keyUp(key) {
	switch (key) {
		case keyConst.arrowLeft:
			leftPressed = false;
			if (player.direction === directionConst.left) {
				player.moving = false;
			}
			break;
		case keyConst.arrowRight:
			rightPressed = false;
			player.moving = leftPressed || rightPressed;
			break;
		case keyConst.space:
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
	pubSub.pub(eventConst.scoreUpdate, player.score);
}

function onGameOver() {
	gameOver = true;
}

function introOver() {
	introAnimationRunning = false;
	levelNumber.destroy();
}

export function init(data, drawCanvas) {
	leftPressed = false;
	rightPressed = false;
	gameOver = false;

	pubSub.on(eventConst.keyDown, keyDown);
	pubSub.on(eventConst.keyUp, keyUp);

	pubSub.on(eventConst.levelEntityCreated, levelEntityCreated);
	pubSub.on(eventConst.levelEntityDestroyed, levelEntityDestroyed);
	pubSub.on(eventConst.enemyDestroyed, enemyDestroyed);

	pubSub.on(eventConst.gameOver, onGameOver);

	pubSub.on(eventConst.introOver, introOver);

	player = data.player;
	level = data.level;
	player.currentShip.armMissile();

	canvas = drawCanvas;
	infoPanel.init(player);
	levelNumber.init(level.number);
	introAnimationRunning = true;
}

export function end() {
	[keyDown, keyUp, levelEntityCreated, levelEntityDestroyed, enemyDestroyed, onGameOver, introOver].forEach(handler =>
		pubSub.off(handler)
	);
	infoPanel.destroy();
	levelNumber.destroy();
	level.missiles.forEach(missile => missile.destroy());
}

export function drawFrame(dt) {
	if (introAnimationRunning) {
		pubSub.pub(eventConst.animationFrame, dt);
	} else {
		//check for collisions
		level.missiles.filter(missile => missile.status === missileConst.launched).forEach(missile => {
			if (missile.launcher.player) {
				level.formations.forEach(formation => formation.checkCollisions(missile));
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

		level.formations.forEach(formation => formation.show(canvas));
		level.effects.forEach(effect => effect.show(canvas));
	}
	player.show(canvas);

	if ((gameOver || (!level.formations.length && !level.events.length)) && !level.effects.length) {
		return { player, level, gameOver };
	}

	return null;
}
