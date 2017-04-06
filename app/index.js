import '../css/style.css';

import {core as cfg, configure} from './config'
import {event as eventConst} from './const'
import * as spaceGenerator from './generators/space';
import * as player from './generators/player';
import * as levelGenerator from './generators/level';
import * as gameLoop from './gameLoop';
import {pubSub, animation} from './util';
import * as font from './generators/font';

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

const backgroundCtx = backgroundScreen.getContext('2d');
let space = spaceGenerator.create();
space.show(backgroundCtx);

animation.start({
	animation: gameLoop,
	data: {
		level: levelGenerator.create(1),
		player: player.create()
	}
});

const c64 = font.create('c64');
c64.write(interfaceScreen.getContext('2d'), [480 / 2,10], 'Invaders', {size: 2, alignment: 'center'});


//todo determine device type
//todo subscribe to screen orientation changes (maybe)
//todo interface and events for interface
//todo prepare localstorage to save score and game
//todo initialize sound stuff
//todo on game start determine screen orientation and choose game style
//todo show title screen (that can go to instructions screen or game start)