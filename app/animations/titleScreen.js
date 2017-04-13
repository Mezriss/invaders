import {pubSub, hexToRgba} from  '../util';
import * as fontGenerator from '../generators/font';
import {eventConst, keyConst, alignmentConst, confConst} from '../const';
import {titleScreenCfg as cfg, coreCfg, shipCfg, soundCfg, drawingCfg, playerCfg, highScoresCfg, configure} from '../conf';
import str from '../str';
import * as highScores from '../highScores';
import * as ship from '../generators/ship';

let drawCtx, player, font, color, newColor,
	updateMenu, updateCursor,
	interfaceRedrawRequested,
	currentMenu,
	title = {}, menuItems = {}, cursor,
	transitionElapsed,
	scores;

const interfaceCtx = interfaceScreen.getContext('2d');

const mainMenu = [{
		label: str.play,
		action: function () {
			pubSub.off(keyDown);
			updateMenu = fadeOutMenu;
			updateCursor = repositionPlayer;
		}
	}, {
		label: str.highScores,
		action: function () {
			currentMenu = highScoresMenu;
			cursor.position = 0;
		}
	}, {
		label: str.options,
		action: function () {
			currentMenu = settingsMenu;
			cursor.position = 0;
		}
	}];

const settingsMenu = [{
		get label() {return str.sound + (soundCfg.on ? str.on : str.off)},
		action: function() {
			configure(confConst.sound, !soundCfg.on);
		}
	}, {
		get label() {return str.showFPS + (drawingCfg.showFPS ? str.on : str.off)},
		action: function() {
			configure(confConst.fps, !drawingCfg.showFPS);
		}
	}, {
		label: str.back,
		get y() { return this._y + font.meta.boundingBox.height * cfg.menuItemSize * cfg.lineHeight},
		set y(val) { this._y = val},
		action: function() {
			currentMenu = mainMenu;
			cursor.position = 2;
		}
	}];

const highScoresMenu = [{
		label: str.back,
		get y() { return this._y + font.meta.boundingBox.height * cfg.menuItemSize * cfg.lineHeight * (scores.length + 1)},
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

	title.y = Math.round((coreCfg.screenHeight - font.meta.boundingBox.height * (cfg.titleSize + cfg.menuItemSize * 3) * cfg.lineHeight) / 2);

	[mainMenu, settingsMenu, highScoresMenu].forEach(menu => {
		menu[0].y = title.y + font.meta.boundingBox.height * cfg.titleSize * cfg.lineHeight;
		for (let i = 1; i < menu.length; i += 1) {
			menu[i].y = menu[i - 1].y + font.meta.boundingBox.height * cfg.menuItemSize * cfg.lineHeight;
		}
	});

	scores = highScores.get();

	if (data.oldPlayer) {
		currentMenu = highScoresMenu;
		if (data.position === - 1) {
			scores.push(data.record);
		}

	} else {
		currentMenu = mainMenu;
	}

	for (let i = 0; i < scores.length; i += 1) {
		scores[i].label = '0'.repeat(Math.max(cfg.scoreDigits - scores[i].score.toString(10).length, 0)) + scores[i].score;
		scores[i].y = title.y + font.meta.boundingBox.height * cfg.titleSize * cfg.lineHeight
			+ (font.meta.boundingBox.height * cfg.menuItemSize * cfg.lineHeight) * i;
	}

	cursor = {
		position: 0,
		x: 0,
		y: currentMenu[0].y - shipCfg.heightPx
	};


	updateMenu = drawMenu;
	updateCursor = updateCursorPosition;
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
	title.x = font.write(interfaceCtx, [coreCfg.screenWidth / 2, title.y], str.title, {
		alignment: alignmentConst.center,
		size: cfg.titleSize,
		color: color
	}).lineStart;
	cursor.x = cursor.x || title.x;
	menuItems.x = title.x + shipCfg.widthPx + cfg.cursorPadding;

	for (let i = 0; i < currentMenu.length; i += 1) {
		font.write(interfaceCtx, [menuItems.x, currentMenu[i].y], currentMenu[i].label, {size: cfg.menuItemSize, color: color});
	}
	if (currentMenu === highScoresMenu) {
		for (let i = 0; i < scores.length; i += 1) {
			ship.drawBlueprint(interfaceCtx, menuItems.x, scores[i].y - shipCfg.heightPx, scores[i].blueprint, scores[i].color);
			font.write(interfaceCtx, [menuItems.x + shipCfg.widthPx * 2, scores[i].y], scores[i].label,
				{size: cfg.menuItemSize, color: color});
		}
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

let menuAnimationsFinished, playerAnimationsFinished; //premature optimization

export function drawFrame(dt) {
	menuAnimationsFinished = updateMenu(dt);
	playerAnimationsFinished = updateCursor(dt);

	player.show(drawCtx, cursor.x, cursor.y);

	if (menuAnimationsFinished && playerAnimationsFinished) {
		return {player};
	}
}
