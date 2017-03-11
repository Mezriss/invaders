/*
	Game Loop

 */
import {drawing as drawingCfg} from  './config';
import * as spaceGenerator from './spaceGenerator';
import {initCanvas, drawImage} from './util';
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

let then, loop, level, space, dt, fpsStart, fps = 0, lastFps = 0;

function draw(ts) {
	loop = requestAnimationFrame(draw);
	then = then || ts;
	dt = ts - then;
	if (dt < 1000 / drawingCfg.maxFPS) {
		return;
	}
	then = ts;

	//updating positions
	level.formations.forEach(formation => {
		formation.position.x += formation.evadeSpeed * coreCfg.screenWidth * dt / 1000 * formation.direction;
		//formation.position.y += formation.advanceSpeed * coreCfg.screenHeight * dt / 1000;
	});

	level.formations.forEach(formation => formation.behavior());

	space.show(drawCanvas);
	level.formations.forEach(formation => formation.show(drawCanvas));

	drawImage(screenCtx, drawCanvas, [0, 0]);
	if (drawingCfg.showFPS) {
		if (Date.now() - fpsStart >= 1000) {
			fpsStart += 1000;
			lastFps = fps;
			fps = 1;
		} else {
			fps += 1;
		}
		screenCtx.fillStyle = drawingCfg.systemInfoColor;
		screenCtx.font = drawingCfg.systemInfoText;
		screenCtx.fillText(lastFps, 10, 10);
	}
}

export function start(currentLevel) {
	level = currentLevel;
	space = spaceGenerator.create();
	fpsStart = Date.now();
	loop = requestAnimationFrame(draw);
}

export function stop() {
	cancelAnimationFrame(loop);
}

export function pause() {

}