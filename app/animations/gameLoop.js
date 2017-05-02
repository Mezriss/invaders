/*
	Game Loop

 */
import { playerCfg, shipCfg, mobileCfg } from '../conf';
import { keyConst, directionConst, eventConst, missileConst } from '../const';
import { pubSub } from '../util';
import * as infoPanel from '../interface/infoPanel';
import * as mobileControls from '../interface/mobileControls';
import * as levelNumber from '../interface/levelNumber';

let canvas, player, level, gameOver, gamePaused, leftPressed, rightPressed, introAnimationRunning;

function keyDown(key) {
	if (gamePaused) {
		return;
	}
	switch (key) {
		case keyConst.arrowLeft:
			if (!player.moving) {
				player.plannedTravel = playerCfg.minTravelDistance;
				player.moving = true;
			}
			leftPressed = true;
			player.direction = directionConst.left;
			break;
		case keyConst.arrowRight:
			if (!player.moving) {
				player.plannedTravel = playerCfg.minTravelDistance;
				player.moving = true;
			}
			rightPressed = true;
			player.direction = directionConst.right;
			break;
		case keyConst.space:
			player.setBarrage(true);
			player.fire();
			break;
		case keyConst.escape:
			pubSub.pub(eventConst.gamePaused);
			break;
	}
}

function keyUp(key) {
	switch (key) {
		case keyConst.arrowLeft:
			leftPressed = false;
			if (rightPressed) {
				player.direction = directionConst.right;
			}
			player.moving = leftPressed || rightPressed;
			break;
		case keyConst.arrowRight:
			rightPressed = false;
			if (leftPressed) {
				player.direction = directionConst.left;
			}
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
	if (player.currentShip && !player.lastShip) {
		player.lastShip = player.currentShip;
	}
	gameOver = true;
}

function introOver() {
	introAnimationRunning = false;
	levelNumber.destroy();
}

function pauseGame() {
	gamePaused = true;
}

function resumeGame() {
	gamePaused = false;
}

function checkScreenBlur() {
	if (document.hidden) {
		pubSub.pub(eventConst.gamePaused);
	}
}

function touchShootStart() {
	player.setBarrage(true);
	player.fire();
}

function touchShootEnd() {
	player.setBarrage(false);
}

function touchMoveEnd() {
	player.moving = false;
}

function touchLeft() {
	if (!player.moving) {
		player.plannedTravel = playerCfg.minTravelDistance;
		player.moving = true;
	}
	player.direction = directionConst.left;
}

function touchRight() {
	if (!player.moving) {
		player.plannedTravel = playerCfg.minTravelDistance;
		player.moving = true;
	}
	player.direction = directionConst.right;
}

function touchDragMove(coords) {
	player.setBarrage(true);
	player.fire();
	if (coords[0] < player.x) {
		player.direction = directionConst.left;
		player.moveTarget = coords[0];
		player.moving = true;
	}
	if (coords[0] > player.x + shipCfg.widthPx) {
		player.direction = directionConst.right;
		player.moveTarget = coords[0];
		player.moving = true;
	}
}

function touchDragEnd() {
	player.moving = false;
	player.setBarrage(false);
}

function onGyroData(angle) {
	player.moving = Math.abs(angle) > mobileCfg.gyroSafeZone;
	player.direction = angle < 0 ? directionConst.left : directionConst.right;
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
	pubSub.on(eventConst.gamePaused, pauseGame);
	pubSub.on(eventConst.gameResumed, resumeGame);
	pubSub.on(eventConst.introOver, introOver);

	player = data.player;
	level = data.level;
	player.currentShip.armMissile();

	canvas = drawCanvas;
	infoPanel.init(player);
	levelNumber.init(level.number);
	if (mobileCfg.enabled) {
		mobileControls.init();
		pubSub.on(eventConst.touchShootStart, touchShootStart);
		pubSub.on(eventConst.touchShootEnd, touchShootEnd);
		pubSub.on(eventConst.touchMoveEnd, touchMoveEnd);
		pubSub.on(eventConst.touchLeft, touchLeft);
		pubSub.on(eventConst.touchRight, touchRight);

		pubSub.on(eventConst.touchDragMove, touchDragMove);
		pubSub.on(eventConst.touchDragEnd, touchDragEnd);

		pubSub.on(eventConst.gyroData, onGyroData);
	}
	introAnimationRunning = true;

	document.addEventListener(eventConst.visibilityChange, checkScreenBlur);
}

export function end() {
	[
		keyDown,
		keyUp,
		levelEntityCreated,
		levelEntityDestroyed,
		enemyDestroyed,
		onGameOver,
		introOver,
		pauseGame,
		resumeGame
	].forEach(handler => pubSub.off(handler));
	infoPanel.destroy();
	if (mobileCfg.enabled) {
		mobileControls.destroy();
		[
			touchShootStart,
			touchShootEnd,
			touchMoveEnd,
			touchLeft,
			touchRight,
			touchDragMove,
			touchDragEnd,
			onGyroData
		].forEach(handler => pubSub.off(handler));
	}
	levelNumber.destroy();
	level.missiles.forEach(missile => missile.destroy());
	document.removeEventListener(eventConst.visibilityChange, checkScreenBlur);
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
