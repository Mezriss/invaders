import '../css/style.css';

import {core as cfg} from './config'
import * as spaceGenerator from './generators/space';
import * as player from './generators/player';
import * as levelGenerator from './generators/level';
import {gameLoop} from './gameLoop';
import {animation} from './util';

[gameScreen, interfaceScreen, backgroundScreen].forEach(canvas => {
	canvas.width = cfg.screenWidth;
	canvas.height = cfg.screenHeight;
});
main.style.width = cfg.screenWidth + 'px';
main.style.height = cfg.screenHeight + 'px';

const backgroundCtx = backgroundScreen.getContext('2d');
let space = spaceGenerator.create();
space.show(backgroundCtx);

animation.start(gameLoop, {
	level: levelGenerator.create(1),
	player: player.create()
});


//todo determine device type
//todo subscribe to screen orientation changes (maybe)
//todo interface and events for interface
//todo prepare localstorage to save score and game
//todo initialize sound stuff
//todo on game start determine screen orientation and choose game style
//todo show title screen (that can go to instructions screen or game start)