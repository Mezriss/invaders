/*
	Somewhat abstract animation method
 */
import {drawing as drawingCfg, core as coreCfg} from  '../config';
import {initCanvas, drawImage} from './drawing';


const requestAnimationFrame = window.requestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		window.oRequestAnimationFrame,
	screenCtx = gameScreen.getContext('2d'),
	interfaceCtx = interfaceScreen.getContext('2d'),
	drawCanvas = initCanvas();

let animation, data, resolveHandle,
	paused = false,
	then, dt,
	fpsStart, fps = 0;

function draw(ts) {
	if (paused) {
		return;
	}
	requestAnimationFrame(draw);
	then = then || ts;
	dt = ts - then;
	if (dt < 1000 / drawingCfg.maxFPS) {
		return;
	}
	then = ts;

	drawCanvas.clearRect(0, 0, coreCfg.screenWidth, coreCfg.screenHeight);

	//draw next frame
	animation(drawCanvas, dt, data);

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

export function start(animationLoop, animationData) {
	animation = animationLoop;
	data = animationData;

	fpsStart = Date.now();
	requestAnimationFrame(draw);

	return new Promise(resolve => {
		resolveHandle = result => resolve(result);
	});
}

export function pause() {
	paused = true;
	then = null;
}

export function resume() {
	paused = false;
	requestAnimationFrame(draw);
}