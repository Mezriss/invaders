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
	backgroundCtx = backgroundScreen.getContext('2d'),
	interfaceCtx = interfaceScreen.getContext('2d'),
	drawCanvas = initCanvas();

let then, loop, level, space, dt, fpsStart, fps = 0;

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

	drawCanvas.clearRect(0, 0, coreCfg.screenWidth, coreCfg.screenHeight);
	level.formations.forEach(formation => formation.show(drawCanvas));

	screenCtx.clearRect(0, 0, coreCfg.screenWidth, coreCfg.screenHeight);
	drawImage(screenCtx, drawCanvas, [0, 0]);
	if (drawingCfg.showFPS) {
		if (Date.now() - fpsStart >= 1000) {
			fpsStart += 1000;
			interfaceCtx.clearRect(10, 0, 20, 20);
			interfaceCtx.fillStyle = drawingCfg.systemInfoColor;
			interfaceCtx.font = drawingCfg.systemInfoText;
			interfaceCtx.fillText(fps, 10, 10);
			fps = 1;
		} else {
			fps += 1;
		}
	}
}

export function start(currentLevel) {
	level = currentLevel;
	space = spaceGenerator.create();
	space.show(backgroundCtx);

	fpsStart = Date.now();
	loop = requestAnimationFrame(draw);
}

export function stop() {
	cancelAnimationFrame(loop);
}

export function pause() {

}