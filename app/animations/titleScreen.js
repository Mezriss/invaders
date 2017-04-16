import { pubSub } from '../util';
import { eventConst } from '../const';
import { titleScreenCfg as cfg, shipCfg, playerCfg } from '../conf';
import * as mainMenu from '../interface/mainMenu';

let drawCtx, player, cursor, newCursorPosition, transitionSequence;

export function init(data, drawCanvas) {
	const positionInfo = mainMenu.init(data);
	player = data.player;
	drawCtx = drawCanvas;

	cursor = {
		x: positionInfo.x,
		y: positionInfo.y - shipCfg.heightPx
	};
	newCursorPosition = cursor.y;
	pubSub.on(eventConst.cursorRepositioned, setNewCursorPosition);
	pubSub.on(eventConst.menuToGameTransition, startMenuToGameTransition);
	transitionSequence = false;
}

export function end() {
	pubSub.off(setNewCursorPosition);
	pubSub.off(startMenuToGameTransition);
	mainMenu.destroy();
}

export function drawFrame(dt) {
	if (updateCursorPosition(dt)) {
		return { player };
	}
	if (transitionSequence) {
		pubSub.pub(eventConst.animationFrame, dt);
	}

	player.show(drawCtx, cursor.x, cursor.y);
}

function setNewCursorPosition(y) {
	newCursorPosition = y - shipCfg.heightPx;
}

function startMenuToGameTransition() {
	transitionSequence = true;
}

function updateCursorPosition(dt) {
	if (transitionSequence) {
		if (cursor.y !== player.y) {
			cursor.y = Math.min(cursor.y + playerCfg.speed * dt / 1000, player.y);
		} else if (cursor.x !== player.x) {
			cursor.x = Math.min(cursor.x + playerCfg.speed * dt / 1000, player.x);
		} else {
			return true;
		}
	} else if (cursor.y !== newCursorPosition) {
		if (cursor.y < newCursorPosition) {
			cursor.y = Math.min(cursor.y + cfg.cursorSpeed * dt / 1000, newCursorPosition);
		} else {
			cursor.y = Math.max(cursor.y - cfg.cursorSpeed * dt / 1000, newCursorPosition);
		}
	}
}
