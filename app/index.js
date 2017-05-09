import { coreCfg as cfg, mobileCfg, spaceCfg, configure } from './conf';
import { eventConst, confConst, version } from './const';
import * as highScores from './highScores';
import * as spaceGenerator from './generators/space';
import * as player from './generators/player';
import * as level from './generators/level';
import * as ship from './generators/ship';
import * as gameLoop from './animations/gameLoop';
import * as titleScreen from './animations/titleScreen';
import { pubSub, touch, n2c, initCanvas } from './util';
import * as animation from './util/animation';

window.location.search.substr(1).split(/[,;&]/).forEach(keyValue => configure(...keyValue.split('=')));

if (mobileCfg.enabled) {
	configure(confConst.screenWidth, Math.min(window.innerWidth, window.innerHeight));
	configure(confConst.screenHeight, Math.max(window.innerWidth, window.innerHeight) - mobileCfg.controlPanelHeightPx);
	touch.init(document.getElementById('interfaceScreen'));
}

const icon = initCanvas(32, 32);
icon.fillStyle = n2c(spaceCfg.background);
icon.fillRect(0, 0, 31, 31);
ship.create({ pixelSize: 3 }).show(icon, 5, 8);
document.getElementById('favicon').href = icon.canvas.toDataURL();

['interfaceScreen', 'backgroundScreen', 'gameScreen'].map(id => document.getElementById(id)).forEach(canvas => {
	canvas.width = cfg.screenWidth;
	canvas.height = cfg.fullScreenHeight;
});

const main = document.getElementById('main');
main.style.width = cfg.screenWidth + 'px';
main.style.height = cfg.fullScreenHeight + 'px';

document.addEventListener(eventConst.keyDown, event => {
	pubSub.pub(eventConst.keyDown, event.which, event); //unfortunately key is unusable because of Edge
});
document.addEventListener(eventConst.keyUp, event => {
	pubSub.pub(eventConst.keyUp, event.which, event);
});

highScores.init();

spaceGenerator.create().show(document.getElementById('backgroundScreen').getContext('2d'));

animation
	.start({
		animation: titleScreen,
		data: {
			player: player.create()
		}
	})
	.then(data => playLevels(data));

function playLevels(data) {
	if (data.gameOver) {
		const record = {
			score: data.player.score,
			blueprint: data.player.lastShip.blueprint,
			color: data.player.lastShip.color
		},
			position = highScores.store(record);

		animation
			.start({
				animation: titleScreen,
				data: {
					player: player.create(),
					oldPlayer: data.player,
					position,
					record
				}
			})
			.then(data => playLevels(data));
	} else {
		data.level = level.create(data.level ? data.level.number + 1 : 1);
		animation
			.start({
				animation: gameLoop,
				data: data
			})
			.then(data => playLevels(data));
	}
}

console.log('V' + version);
