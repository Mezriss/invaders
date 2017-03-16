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

export function init(data, drawCanvas) {
	pubSub.on(`${c.event.keyDown}#${c.key.arrowLeft}`, keyDownLeft);
	pubSub.on(`${c.event.keyDown}#${c.key.arrowRight}`, keyDownRight);
	pubSub.on(`${c.event.keyUp}#${c.key.arrowLeft}`, keyUpLeft);
	pubSub.on(`${c.event.keyUp}#${c.key.arrowRight}`, keyUpRight);

	player = data.player;
	level = data.level;
	canvas = drawCanvas;
}

export function end() {
	[keyDownLeft, keyDownRight, keyUpLeft, keyUpRight].forEach(handler => pubSub.off(handler));
}

export function drawFrame(dt) {
	//updating positions
	level.formations.forEach(formation => {
		switch (formation.direction) {
			case c.direction.left:
				formation.position.x -= formation.evadeSpeed * cfg.screenWidth * dt / 1000; break;
			case c.direction.right:
				formation.position.x += formation.evadeSpeed * cfg.screenWidth * dt / 1000; break;
			case c.direction.up:
				formation.position.y -= formation.advanceSpeed * cfg.screenHeight * dt / 1000; break;
			case c.direction.down:
				formation.position.y += formation.advanceSpeed * cfg.screenHeight * dt / 1000; break;
		}
	});

	if (player.moving || player.plannedTravel > 0) {
		let travelDistance = player.speed * cfg.screenWidth * dt / 1000;
		switch (player.direction) {
			case c.direction.left: player.x -= travelDistance; break;
			case c.direction.right: player.x += travelDistance; break;
		}
		if (player.x < 0) {
			player.x = 0;
		}
		if (player.x > cfg.screenWidth - shipCfg.width * cfg.pixelSize) {
			player.x = cfg.screenWidth - shipCfg.width * cfg.pixelSize;
		}
		player.plannedTravel -= travelDistance;
	} else {
		player.x = Math.round(player.x);
	}

	//run AI and update locations of everything
	level.formations.forEach(formation => formation.behavior());

	//draw everything
	player.show(canvas);
	level.formations.forEach(formation => formation.show(canvas));

	return null;
}