import '../css/style.css';
import * as levelGenerator from './levelGenerator';
import * as gameLoop from './gameLoop';
import {core as cfg} from './config'

gameScreen.width = cfg.screenWidth;
gameScreen.height = cfg.screenHeight;


gameLoop.start(levelGenerator.create(1));


//todo determine device type
//todo subscribe to screen orientation changes (maybe)
//todo interface and events for interface
//todo save game on mobile devices https://medium.com/@samthor/how-to-add-a-web-app-manifest-and-mobile-proof-your-site-450e6e485638 https://www.sitepoint.com/offline-web-apps-service-workers-pouchdb/
//todo prepare localstorage to save score and game
//todo initialize sound stuff
//todo on game start determine screen orientation and choose game style
//todo show title screen (that can go to instructions screen or game start)