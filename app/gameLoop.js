/*
	Game Loop

 */
import {drawing as drawingCfg} from  './config';
import * as spaceGenerator from './spaceGenerator';
import {initCanvas} from './util';
import {core as coreCfg} from './config';


const requestAnimationFrame = window.requestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		window.oRequestAnimationFrame,
	cancelAnimationFrame = window.cancelAnimationFrame ||
		window.mozCancelAnimationFrame,
	screenCtx = gameScreen.getContext('2d'),
	drawCanvas = initCanvas();

let then, loop, level, space;

function draw(ts) {
	loop = requestAnimationFrame(draw);
	then = then || ts;
	let dt = ts - then;
	if (dt < 1000 / drawingCfg.maxFPS) {
		return;
	}
	then = ts;

	//updating positions
	level.formations.forEach(formation => {
		formation.position.x += formation.evadeSpeed * coreCfg.screenWidth * dt / 1000 * formation.direction;
		formation.position.y += formation.advanceSpeed * coreCfg.screenHeight * dt / 1000;
	});

	//todo calculate new positions for player, enemies, projectiles
	//todo check for collisions
	//todo update particle effects
	//todo get user input
	//todo activate AI
	//todo redraw everything

	level.formations.forEach(formation => formation.behavior());


	space.show(drawCanvas);
	level.formations.forEach(formation => formation.show(drawCanvas));

	screenCtx.drawImage(drawCanvas.canvas, 0, 0);
}

export function start(currentLevel) {
	level = currentLevel;
	space = spaceGenerator.create();

	loop = requestAnimationFrame(draw);
}

export function stop() {
	cancelAnimationFrame(loop);
}