import '../css/style.css';

import {coreCfg as cfg, configure} from './conf'
import {eventConst} from './const'
import * as highScores from './highScores';
import * as spaceGenerator from './generators/space';
import * as player from './generators/player';
import * as level from './generators/level';
import * as gameLoop from './animations/gameLoop';
import * as titleScreen from './animations/titleScreen';
import {pubSub, animation} from './util';

window.location.search.substr(1).split(/[,;&]/).forEach(keyValue => configure(...keyValue.split('=')));

[gameScreen, interfaceScreen, backgroundScreen].forEach(canvas => {
	canvas.width = cfg.screenWidth;
	canvas.height = cfg.screenHeight;
});
main.style.width = cfg.screenWidth + 'px';
main.style.height = cfg.screenHeight + 'px';

document.addEventListener(eventConst.keyDown, event => {
	pubSub.pub(eventConst.keyDown, event.key, event)
});
document.addEventListener(eventConst.keyUp, event => {
	pubSub.pub(eventConst.keyUp, event.key, event)
});

highScores.init();

spaceGenerator.create().show(backgroundScreen.getContext('2d'));

animation.start({
	animation: titleScreen,
	data: {
		player: player.create()
	}
}).then(data => playLevels(data));

function playLevels(data) {
	if (data.gameOver) {
		const record = {
				score: data.player.score,
				blueprint: data.player.lastShip.blueprint,
				color: data.player.lastShip.color
			},
			position = highScores.store(record);

		animation.start({
			animation: titleScreen,
			data: {
				player: player.create(),
				oldPlayer: data.player,
				position,
				record
			}
		}).then(data => playLevels(data));
	} else {
		data.level = level.create(data.level ? data.level.number + 1 : 1);
		animation.start({
			animation: gameLoop,
			data: data
		}).then(data => playLevels(data));
	}
}