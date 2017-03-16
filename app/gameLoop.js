/*
	Game Loop

 */
import {core as coreCfg} from './config';
import {direction} from './const';

export function gameLoop(drawCanvas, dt, data) {

	//updating positions
	data.level.formations.forEach(formation => {
		switch (formation.direction) {
			case direction.left:
				formation.position.x -= formation.evadeSpeed * coreCfg.screenWidth * dt / 1000; break;
			case direction.right:
				formation.position.x += formation.evadeSpeed * coreCfg.screenWidth * dt / 1000; break;
			case direction.up:
				formation.position.y -= formation.advanceSpeed * coreCfg.screenHeight * dt / 1000; break;
			case direction.down:
				formation.position.y += formation.advanceSpeed * coreCfg.screenHeight * dt / 1000; break;
		}
	});

	//run AI and update locations of everything
	data.level.formations.forEach(formation => formation.behavior());

	//draw everything
	data.player.show(drawCanvas);
	data.level.formations.forEach(formation => formation.show(drawCanvas));
}