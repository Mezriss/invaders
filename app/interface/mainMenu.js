import { pubSub, hexToRgba } from '../util';
import * as fontGenerator from '../generators/font';
import * as ship from '../generators/ship';
import { eventConst, keyConst, alignmentConst, confConst } from '../const';
import { default as str } from '../str';
import { titleScreenCfg as cfg, coreCfg, shipCfg, soundCfg, drawingCfg, missileCfg, configure } from '../conf';

import * as highScores from '../highScores';

let font,
	color,
	newColor,
	currentMenu,
	selectedMenuItem,
	title = {},
	menuItems = {},
	transitionElapsed,
	scores,
	scoreIndicator;

const interfaceCtx = interfaceScreen.getContext('2d');

const mainMenu = [
	{
		label: str.play,
		action: function() {
			pubSub.off(keyDown);
			pubSub.pub(eventConst.menuToGameTransition);
		}
	},
	{
		label: str.highScores,
		action: function() {
			currentMenu = highScoresMenu;
			selectedMenuItem = 0;
			pubSub.pub(eventConst.cursorRepositioned, currentMenu[selectedMenuItem].y);
		}
	},
	{
		label: str.options,
		action: function() {
			currentMenu = settingsMenu;
			selectedMenuItem = 0;
			pubSub.pub(eventConst.cursorRepositioned, currentMenu[selectedMenuItem].y);
		}
	}
];

const settingsMenu = [
	{
		get label() {
			return str.sound + (soundCfg.on ? str.on : str.off);
		},
		action: function() {
			configure(confConst.sound, !soundCfg.on);
		}
	},
	{
		get label() {
			return str.showFPS + (drawingCfg.showFPS ? str.on : str.off);
		},
		action: function() {
			configure(confConst.fps, !drawingCfg.showFPS);
		}
	},
	{
		label: str.back,
		get y() {
			return this._y + font.meta.boundingBox.height * cfg.menuItemSize * cfg.lineHeight;
		},
		set y(val) {
			this._y = val;
		},
		action: function() {
			currentMenu = mainMenu;
			selectedMenuItem = 2;
			pubSub.pub(eventConst.cursorRepositioned, currentMenu[selectedMenuItem].y);
		}
	}
];

const highScoresMenu = [
	{
		label: str.back,
		get y() {
			return this._y + font.meta.boundingBox.height * cfg.menuItemSize * cfg.lineHeight * (scores.length + 1);
		},
		set y(val) {
			this._y = val;
		},
		action: function() {
			currentMenu = mainMenu;
			selectedMenuItem = 1;
			pubSub.pub(eventConst.cursorRepositioned, currentMenu[selectedMenuItem].y);
		}
	}
];

function keyDown(key) {
	switch (key) {
		case keyConst.arrowUp:
			selectedMenuItem = selectedMenuItem - 1 >= 0 ? selectedMenuItem - 1 : currentMenu.length - 1;
			pubSub.pub(eventConst.cursorRepositioned, currentMenu[selectedMenuItem].y);
			break;
		case keyConst.arrowDown:
			selectedMenuItem = selectedMenuItem + 1 <= currentMenu.length - 1 ? selectedMenuItem + 1 : 0;
			pubSub.pub(eventConst.cursorRepositioned, currentMenu[selectedMenuItem].y);
			break;
		case keyConst.enter: //the ominous fallthrough
		case keyConst.space:
			currentMenu[selectedMenuItem].action();
			drawMenu();
			break;
	}
}

export function init(data) {
	font = fontGenerator.create(cfg.font);
	color = hexToRgba(cfg.color, 100);
	pubSub.on(eventConst.keyDown, keyDown);
	pubSub.on(eventConst.menuToGameTransitionFrame, fadeOutMenu);

	title.y = Math.round(
		(coreCfg.screenHeight - font.meta.boundingBox.height * (cfg.titleSize + cfg.menuItemSize * 3) * cfg.lineHeight) / 2
	);

	[mainMenu, settingsMenu, highScoresMenu].forEach(menu => {
		menu[0].y = title.y + font.meta.boundingBox.height * cfg.titleSize * cfg.lineHeight;
		for (let i = 1; i < menu.length; i += 1) {
			menu[i].y = menu[i - 1].y + font.meta.boundingBox.height * cfg.menuItemSize * cfg.lineHeight;
		}
	});

	scores = highScores.get();

	if (data.oldPlayer) {
		currentMenu = highScoresMenu;
		scoreIndicator = {
			position: data.position,
			missile: Object.create(data.oldPlayer.lastShip.missileType)
		};
		scoreIndicator.missile.armProgress = missileCfg.armSteps - 1;

		if (data.position === -1) {
			scores.push(data.record);
			scoreIndicator.position = scores.length - 1;
		}
	} else {
		currentMenu = mainMenu;
		scoreIndicator = null;
	}

	for (let i = 0; i < scores.length; i += 1) {
		scores[i].label = '0'.repeat(Math.max(cfg.scoreDigits - scores[i].score.toString(10).length, 0)) + scores[i].score;
		scores[i].y =
			title.y +
			font.meta.boundingBox.height * cfg.titleSize * cfg.lineHeight +
			font.meta.boundingBox.height * cfg.menuItemSize * cfg.lineHeight * i;
	}

	transitionElapsed = 0;
	selectedMenuItem = 0;
	return {
		x: drawMenu(),
		y: currentMenu[selectedMenuItem].y
	};
}

export function destroy() {
	pubSub.off(keyDown);
	pubSub.off(fadeOutMenu);
	interfaceCtx.clearRect(0, 0, coreCfg.screenWidth, coreCfg.screenHeight);
}

function drawMenu() {
	interfaceCtx.clearRect(0, 0, coreCfg.screenWidth, coreCfg.screenHeight);
	title.x = font.write(interfaceCtx, [coreCfg.screenWidth / 2, title.y], str.title, {
		alignment: alignmentConst.center,
		size: cfg.titleSize,
		color: color
	}).lineStart;

	menuItems.x = title.x + shipCfg.widthPx + cfg.cursorPadding;

	for (let i = 0; i < currentMenu.length; i += 1) {
		font.write(interfaceCtx, [menuItems.x, currentMenu[i].y], currentMenu[i].label, {
			size: cfg.menuItemSize,
			color: color
		});
	}
	if (currentMenu === highScoresMenu) {
		for (let i = 0; i < scores.length; i += 1) {
			if (scoreIndicator && scoreIndicator.position === i) {
				scoreIndicator.missile.show(
					interfaceCtx,
					menuItems.x + (shipCfg.widthPx - missileCfg.widthPx) / 2,
					scores[i].y - shipCfg.heightPx + (shipCfg.heightPx - missileCfg.heightPx) / 2
				);
			}
			ship.drawBlueprint(
				interfaceCtx,
				menuItems.x,
				scores[i].y - shipCfg.heightPx,
				scores[i].blueprint,
				scores[i].color
			);
			font.write(interfaceCtx, [menuItems.x + shipCfg.widthPx * 2, scores[i].y], scores[i].label, {
				size: cfg.menuItemSize,
				color: color
			});
		}
	}
	return title.x;
}

function fadeOutMenu(dt) {
	transitionElapsed += dt;
	newColor = hexToRgba(
		cfg.color,
		100 / cfg.fadeSteps * (cfg.fadeSteps - Math.floor(transitionElapsed / (cfg.transitionDuration / cfg.fadeSteps)))
	);
	if (newColor !== color) {
		color = newColor;
		drawMenu();
	}
}
