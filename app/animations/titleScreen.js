import {pubSub, hexToRgba} from  '../util';
import * as fontGenerator from '../generators/font';
import {event as eventConst, key as keyConst, alignment as alignmentConst, conf as confConst} from '../const';
import {titleScreen as cfg, core as coreCfg, ship as shipCfg, sound as soundConf, drawing as drawingConf, player as playerCfg,
	configure} from '../conf';
import str from '../str';

let drawCtx, player, font, color, newColor,
	updateMenu, updatePlayerPosition,
	interfaceRedrawRequested,
	currentMenu,
	titleY, titleX, menuItemsPositionX,
	cursor = { position: 0, x: 0, y: 0 },
	i,
	menuAnimationsFinished, playerAnimationsFinished,
	transitionElapsed;

const interfaceCtx = interfaceScreen.getContext('2d'),
	mainMenu = [{
		label: str.play,
		action: function () {
			pubSub.off(keyDown);
			updateMenu = fadeOutMenu;
			updatePlayerPosition = repositionPlayer;
		}
	}, {
		label: str.highScores,
		action: function () {
			currentMenu = highScores;
			cursor.position = 0;
		}
	}, {
		label: str.options,
		action: function () {
			currentMenu = settingsMenu;
			cursor.position = 0;
		}
	}],
	settingsMenu = [{
		get label() {return str.sound + (soundConf.on ? str.on : str.off)},
		action: function() {
			configure(confConst.sound, !soundConf.on);
		}
	}, {
		get label() {return str.showFPS + (drawingConf.showFPS ? str.on : str.off)},
		action: function() {
			configure(confConst.fps, !drawingConf.showFPS);
		}
	}, {
		label: str.back,
		get y() { return this._y + font.meta.boundingBox.height * cfg.menuItemSize * cfg.lineHeight},
		set y(val) { this._y = val},
		action: function() {
			currentMenu = mainMenu;
			cursor.position = 2;
		}
	}],
	highScores = [{
		label: str.back, //todo get actual length of high scores list
		get y() { return this._y + font.meta.boundingBox.height * cfg.menuItemSize * cfg.lineHeight * (1 + 1)},
		set y(val) { this._y = val },
		action: function () {
			currentMenu = mainMenu;
			cursor.position = 1;
		}
	}];

function keyDown(key) {
	switch (key) {
		case keyConst.arrowUp:
			cursor.position = cursor.position - 1 >= 0 ? cursor.position - 1 : currentMenu.length - 1;
			break;
		case keyConst.arrowDown:
			cursor.position = cursor.position + 1 <= currentMenu.length - 1 ? cursor.position + 1 : 0;
			break;
		case keyConst.enter: //the ominous fallthrough
		case keyConst.space:
			currentMenu[cursor.position].action();
			interfaceRedrawRequested = true;
			break;
	}
}

export function init(data, drawCanvas) {
	player = data.player;
	drawCtx = drawCanvas;

	font = fontGenerator.create(cfg.font);
	color = hexToRgba(cfg.color, 100);
	pubSub.on(eventConst.keyDown, keyDown);

	titleY = Math.round((coreCfg.screenHeight - font.meta.boundingBox.height * (cfg.titleSize + cfg.menuItemSize * 3) * cfg.lineHeight) / 2);

	[mainMenu, settingsMenu, highScores].forEach(menu => {
		menu[0].y = titleY + font.meta.boundingBox.height * cfg.titleSize * cfg.lineHeight;
		for (i = 1; i < menu.length; i += 1) {
			menu[i].y = menu[i - 1].y + font.meta.boundingBox.height * cfg.menuItemSize * cfg.lineHeight;
		}
	});

	//todo HS initial positioning

	currentMenu = mainMenu;

	cursor.position = 0;
	cursor.y = currentMenu[cursor.position].y - shipCfg.heightPx;

	updateMenu = drawMenu;
	updatePlayerPosition = updateCursorPosition;
	interfaceRedrawRequested = true;
	transitionElapsed = 0;
}

export function end() {
	[keyDown].forEach(handler => pubSub.off(handler));
}

function drawMenu() {
	if (!interfaceRedrawRequested) {
		return;
	}
	interfaceCtx.clearRect(0, 0, coreCfg.screenWidth, coreCfg.screenHeight);
	titleX = font.write(interfaceCtx, [coreCfg.screenWidth / 2, titleY], str.title, {
		alignment: alignmentConst.center,
		size: cfg.titleSize,
		color: color
	});
	cursor.x = cursor.x || titleX.lineStart;
	menuItemsPositionX = titleX.lineStart + shipCfg.widthPx + cfg.cursorPadding;

	for (i = 0; i < currentMenu.length; i += 1) {
		font.write(interfaceCtx, [menuItemsPositionX, currentMenu[i].y], currentMenu[i].label, {size: cfg.menuItemSize, color: color});
	}
	if (currentMenu === highScores) {
		//todo draw high scores list
	}

	interfaceRedrawRequested = false;
}

function updateCursorPosition(dt) {
	if (cursor.y !== currentMenu[cursor.position].y - shipCfg.heightPx) {
		if (cursor.y < currentMenu[cursor.position].y - shipCfg.heightPx) {
			cursor.y = Math.min(cursor.y + cfg.cursorSpeed * dt / 1000, currentMenu[cursor.position].y - shipCfg.heightPx)
		} else {
			cursor.y = Math.max(cursor.y - cfg.cursorSpeed * dt / 1000, currentMenu[cursor.position].y - shipCfg.heightPx)
		}
	}
}

function fadeOutMenu(dt) {
	transitionElapsed += dt;
	newColor = hexToRgba(cfg.color,
		(100 / cfg.fadeSteps) * (cfg.fadeSteps - Math.floor(transitionElapsed / (cfg.transitionDuration / cfg.fadeSteps)))
	);
	if (newColor !== color) {
		color = newColor;
		interfaceRedrawRequested = true;
		drawMenu();
	}
	if (transitionElapsed >= cfg.transitionDuration) {
		return true;
	}
}

function repositionPlayer(dt) {
	if (cursor.y !== player.y) {
		cursor.y = Math.min(cursor.y + playerCfg.speed * dt / 1000, player.y);
	} else if (cursor.x !== player.x) {
		cursor.x = Math.min(cursor.x + playerCfg.speed * dt / 1000, player.x);
	} else {
		return true;
	}
}

export function drawFrame(dt) {
	drawMenu();

	menuAnimationsFinished = updateMenu(dt);
	playerAnimationsFinished = updatePlayerPosition(dt);

	player.show(drawCtx, cursor.x, cursor.y);

	if (menuAnimationsFinished && playerAnimationsFinished) {
		return {player};
	}
}
