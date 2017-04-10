import {pubSub} from  '../util';
import * as fontGenerator from '../generators/font';
import {event as eventConst, key as keyConst, alignment as alignmentConst, conf as confConst} from '../const';
import {titleScreen as cfg, core as coreCfg, ship as shipCfg, sound as soundConf, drawing as drawingConf,
	configure} from '../conf';
import str from '../str';

let drawCtx, player, font,
	interfaceRedrawRequested = true,
	currentMenu,
	titleY, titlePosition, menuItemPositionX,
	cursorPosition = 0, cursorX, cursorY,
	i;

const interfaceCtx = interfaceScreen.getContext('2d'),
	mainMenu = [{
		label: str.play,
		action: function () {

		}
	}, {
		label: str.highScores,
		action: function () {
			currentMenu = highScores;
			cursorPosition = 0;
			interfaceRedrawRequested = true;
		}
	}, {
		label: str.options,
		action: function () {
			currentMenu = settingsMenu;
			cursorPosition = 0;
			interfaceRedrawRequested = true;
		}
	}],
	settingsMenu = [{
		get label() {return str.sound + (soundConf.on ? str.on : str.off)},
		action: function() {
			configure(confConst.sound, !soundConf.on);
			interfaceRedrawRequested = true;
		}
	}, {
		get label() {return str.showFPS + (drawingConf.showFPS ? str.on : str.off)},
		action: function() {
			configure(confConst.fps, !drawingConf.showFPS);
			interfaceRedrawRequested = true;
		}
	}, {
		label: str.back,
		get y() { return this._y + font.meta.boundingBox.height * cfg.menuItemSize * cfg.lineHeight},
		set y(val) { this._y = val},
		action: function() {
			currentMenu = mainMenu;
			cursorPosition = 2;
			interfaceRedrawRequested = true;
		}
	}],
	highScores = [{
		label: str.back, //todo get actual length of high scores list
		get y() { return this._y + font.meta.boundingBox.height * cfg.menuItemSize * cfg.lineHeight * (1 + 1)},
		set y(val) { this._y = val },
		action: function () {
			currentMenu = mainMenu;
			cursorPosition = 1;
			interfaceRedrawRequested = true;
		}
	}];

function keyDown(key) {
	switch (key) {
		case keyConst.arrowUp:
			cursorPosition = cursorPosition - 1 >= 0 ? cursorPosition - 1 : currentMenu.length - 1;
			break;
		case keyConst.arrowDown:
			cursorPosition = cursorPosition + 1 <= currentMenu.length - 1 ? cursorPosition + 1 : 0;
			break;
		case keyConst.enter: //the ominous fallthrough
		case keyConst.space:
			currentMenu[cursorPosition].action();
			break;
	}
}

export function init(data, drawCanvas) {
	player = data.player;
	drawCtx = drawCanvas;

	font = fontGenerator.create(cfg.font);
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

	cursorPosition = 0;
	cursorY = currentMenu[cursorPosition].y - shipCfg.heightPx;
}

export function end() {
	[keyDown].forEach(handler => pubSub.off(handler));
}

export function drawFrame(dt) {
	if (interfaceRedrawRequested) {
		interfaceCtx.clearRect(0, 0, coreCfg.screenWidth, coreCfg.screenHeight);
		drawMenu();
	}

	if (cursorY !== currentMenu[cursorPosition].y - shipCfg.heightPx) {
		if (cursorY < currentMenu[cursorPosition].y - shipCfg.heightPx) {
			cursorY = Math.min(cursorY + cfg.cursorSpeed * dt / 1000, currentMenu[cursorPosition].y - shipCfg.heightPx)
		} else {
			cursorY = Math.max(cursorY - cfg.cursorSpeed * dt / 1000, currentMenu[cursorPosition].y - shipCfg.heightPx)
		}
	}
	player.show(drawCtx, cursorX, cursorY)
}

function drawMenu() {
	titlePosition = font.write(interfaceCtx, [coreCfg.screenWidth / 2, titleY], str.title, {
		alignment: alignmentConst.center,
		size: cfg.titleSize,
		color: cfg.color
	});
	cursorX = titlePosition.lineStart;
	menuItemPositionX = titlePosition.lineStart + shipCfg.widthPx + cfg.cursorPadding;

	for (i = 0; i < currentMenu.length; i += 1) {
		font.write(interfaceCtx, [menuItemPositionX, currentMenu[i].y], currentMenu[i].label, {size: cfg.menuItemSize, color: cfg.color});
	}
	if (currentMenu === highScores) {
		//todo draw high scores list
	}

	interfaceRedrawRequested = false;
}