import '../css/style.css';
import * as levelGenerator from './levelGenerator';
import * as gameLoop from './gameLoop';
import {core as cfg} from './config'


[gameScreen, interfaceScreen, backgroundScreen].forEach(canvas => {
	canvas.width = cfg.screenWidth;
	canvas.height = cfg.screenHeight;
});
main.style.width = cfg.screenWidth + 'px';
main.style.height = cfg.screenHeight + 'px';



gameLoop.start(levelGenerator.create(1));


//todo determine device type
//todo subscribe to screen orientation changes (maybe)
//todo interface and events for interface
//todo prepare localstorage to save score and game
//todo initialize sound stuff
//todo on game start determine screen orientation and choose game style
//todo show title screen (that can go to instructions screen or game start)