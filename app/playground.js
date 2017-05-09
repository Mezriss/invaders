import { spaceCfg, drawingCfg, shipCfg } from './conf';
import * as ship from './generators/ship';
import { n2c, initCanvas } from './util/drawing';

const icon = initCanvas(32, 32);
icon.fillStyle = n2c(spaceCfg.background);
icon.fillRect(0, 0, 31, 31);
ship.create({ pixelSize: 3 }).show(icon, 5, 8);
document.getElementById('favicon').href = icon.canvas.toDataURL();

document.getElementById('playground').width = 500;
document.getElementById('playground').height = 500;

const playgroundCtx = document.getElementById('playground').getContext('2d');
console.log(n2c(spaceCfg.background));
playgroundCtx.fillStyle = n2c(spaceCfg.background);
playgroundCtx.fillRect(0, 0, 500, 500);
playgroundCtx.fillStyle = drawingCfg.systemInfoColor;
playgroundCtx.font = drawingCfg.systemInfoText;

const shipyard = [];

for (let i = 0; i < 100; i += 1) {
	shipyard.push(ship.create({ pixelSize: 3 }));
	shipyard[i].show(playgroundCtx, i % 10 * 50 + 20, Math.floor(i / 10) * 50 + 20);
	playgroundCtx.fillText(i, i % 10 * 50 + 5, Math.floor(i / 10) * 50 + 10);
}
function generate() {
	[192, 512, 57, 60, 72, 76, 114, 120, 144, 152, 180, 16, 32, 150].forEach(size => {
		const canvas = document.createElement('canvas');
		canvas.width = size;
		canvas.height = size;
		const canvasCtx = canvas.getContext('2d');
		canvasCtx.fillStyle = n2c(spaceCfg.background);
		canvasCtx.fillRect(0, 0, size, size);
		const i = parseInt(document.getElementById('shipNumber').value, 10);
		const pixelSize = Math.floor(size * 0.8 / shipCfg.width);
		ship
			.create({
				pixelSize,
				blueprint: [
					0,
					1,
					0,
					0,
					0,
					1,
					0,
					1,
					1,
					0,
					1,
					0,
					1,
					1,
					1,
					1,
					1,
					0,
					1,
					1,
					1,
					1,
					1,
					0,
					1,
					0,
					1,
					1,
					1,
					0,
					0,
					1,
					0,
					0,
					1
				]
			})
			.show(
				canvasCtx,
				Math.floor((size - shipCfg.width * pixelSize) / 2),
				Math.floor((size - shipCfg.height * pixelSize) / 2)
			);

		document.getElementById('icons').appendChild(canvas);
	});
}

document.getElementById('generate').addEventListener('click', generate);
