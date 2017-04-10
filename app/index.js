import '../css/style.css';

import {core as cfg, configure} from './conf'
import {event as eventConst} from './const'
import * as spaceGenerator from './generators/space';
import * as player from './generators/player';
import * as levelGenerator from './generators/level';
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

const backgroundCtx = backgroundScreen.getContext('2d');
let space = spaceGenerator.create();
space.show(backgroundCtx);

animation.start({
	animation: titleScreen,
	data: {
		player: player.create()
	}
});