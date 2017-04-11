/*
	Somewhat abstract animation method
 */
import {drawing as drawingCfg, core as coreCfg} from  '../conf';
import {initCanvas, drawImage} from './drawing';


const requestAnimationFrame = window.requestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		window.oRequestAnimationFrame,
	cancelAnimationFrame = window.cancelAnimationFrame ||
		window.mozCancelAnimationFrame,
	screenCtx = gameScreen.getContext('2d'),
	interfaceCtx = interfaceScreen.getContext('2d'),
	drawCanvas = initCanvas();

let animation, resolveHandle,
	responseData,
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
	responseData = animation.drawFrame(dt);

	screenCtx.clearRect(0, 0, coreCfg.screenWidth, coreCfg.screenHeight);
	drawImage(screenCtx, drawCanvas, [0, 0]);

	if (drawingCfg.showFPS) {
		if (Date.now() - fpsStart >= 1000) {
			fpsStart += 1000;
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

	return new Promise(resolve => {
		resolveHandle = result => resolve(result);
	});
}

export function stop() {
	cancelAnimationFrame(draw);
	then = null;
	animation.end();
	resolveHandle(responseData);
}