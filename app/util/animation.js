/*
	Somewhat abstract animation method
 */
import { drawingCfg, coreCfg } from '../conf';
import { initCanvas, drawImage } from './drawing';
import * as pubSub from './pubSub';
import { eventConst, keyConst } from '../const';
import * as pauseScreen from '../interface/pauseScreen';

pauseScreen.init();

const requestAnimationFrame =
	window.requestAnimationFrame ||
	window.mozRequestAnimationFrame ||
	window.webkitRequestAnimationFrame ||
	window.msRequestAnimationFrame ||
	window.oRequestAnimationFrame,
	cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame,
	screenCtx = gameScreen.getContext('2d'),
	interfaceCtx = interfaceScreen.getContext('2d'),
	drawCanvas = initCanvas();

let animation, resolveHandle, responseData, then, paused, dt, fpsStart, fps = 0;

function draw(ts) {
	if (!paused) {
		requestAnimationFrame(draw);
	}
	then = then || ts;
	dt = ts - then;
	if (dt < 1000 / drawingCfg.maxFPS) {
		return;
	}
	then = ts;
	dt = Math.min(dt, 1000 / drawingCfg.minFPS);
	dt = Math.max(dt, 1000 / drawingCfg.maxFPS);

	drawCanvas.clearRect(0, 0, coreCfg.screenWidth, coreCfg.screenHeight);

	//draw next frame
	responseData = animation.drawFrame(Math.max(dt), 1000 / drawingCfg.minFPS);

	screenCtx.clearRect(0, 0, coreCfg.screenWidth, coreCfg.screenHeight);
	drawImage(screenCtx, drawCanvas, [0, 0]);

	if (drawingCfg.showFPS) {
		if (Date.now() - fpsStart >= 1000) {
			fpsStart = Date.now();
			interfaceCtx.clearRect(0, 0, 20, 12);
			interfaceCtx.fillStyle = drawingCfg.systemInfoColor;
			interfaceCtx.font = drawingCfg.systemInfoText;
			interfaceCtx.fillText(fps, 0, 10);
			fps = 1;
		} else {
			fps += 1;
		}
	}
	if (responseData) {
		stop();
		animation.end();
		resolveHandle(responseData);
	}
}

export function start(config) {
	animation = config.animation;
	animation.init(config.data, drawCanvas);

	fpsStart = Date.now();
	requestAnimationFrame(draw);
	pubSub.on(eventConst.gamePaused, pause);

	return new Promise(resolve => {
		resolveHandle = result => resolve(result);
	});
}

export function pause() {
	if (!paused) {
		paused = true;
		cancelAnimationFrame(draw);
		then = null;
		pauseScreen.show();
		pubSub.on(eventConst.keyDown, resume);
	}
}

export function resume(key) {
	if (key === keyConst.space || !key) {
		paused = false;
		pauseScreen.hide();
		pubSub.pub(eventConst.gameResumed);
		requestAnimationFrame(draw);
		pubSub.off(resume);
	}
}

export function stop() {
	cancelAnimationFrame(draw);
	then = null;
	animation.end();
	pubSub.off(pause);
	pubSub.off(resume);

	resolveHandle(responseData);
}
