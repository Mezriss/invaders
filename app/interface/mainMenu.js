import { pubSub, touch, hexToRgba } from '../util';
import * as fontGenerator from '../generators/font';
import * as ship from '../generators/ship';
import { eventConst, keyConst, alignmentConst, confConst } from '../const';
import { default as str } from '../str';
import {
	titleScreenCfg as cfg,
	coreCfg,
	shipCfg,
	soundCfg,
	drawingCfg,
	missileCfg,
	mobileCfg,
	configure
} from '../conf';

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

const interfaceCtx = document.getElementById('interfaceScreen').getContext('2d');

const mainMenu = [
	{
		label: str.play,
		action() {
			pubSub.off(keyDown);
			pubSub.pub(eventConst.menuToGameTransition);
		}
	},
	{
		label: str.highScores,
		action() {
			unsubscribeMenuFromTouchEvents(mainMenu);
			subscribeMenuToTouchEvents(highScoresMenu);
			currentMenu = highScoresMenu;
			selectedMenuItem = 0;
			pubSub.pub(eventConst.cursorRepositioned, currentMenu[selectedMenuItem].y);
		}
	},
	{
		label: str.options,
		action() {
			unsubscribeMenuFromTouchEvents(mainMenu);
			subscribeMenuToTouchEvents(settingsMenu);
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
		action() {
			configure(confConst.sound, !soundCfg.on, true);
		}
	},
	{
		get label() {
			return str.showFPS + (drawingCfg.showFPS ? str.on : str.off);
		},
		action() {
			configure(confConst.fps, !drawingCfg.showFPS, true);
		}
	},
	{
		get label() {
			return str.speed + coreCfg.speed;
		},
		action() {
			configure(confConst.speed, coreCfg.speed === coreCfg.maxSpeed ? 1 : coreCfg.speed + 1, true);
		}
	},
	{
		label: str.back,
		get y() {
			return this._y + font.meta.properties.fontAscent * cfg.menuItemSize * cfg.lineHeight;
		},
		set y(val) {
			this._y = val;
		},
		action() {
			unsubscribeMenuFromTouchEvents(settingsMenu);
			subscribeMenuToTouchEvents(mainMenu);
			currentMenu = mainMenu;
			selectedMenuItem = 2;
			pubSub.pub(eventConst.cursorRepositioned, currentMenu[selectedMenuItem].y);
		}
	}
];

if (mobileCfg.enabled) {
	settingsMenu.splice(-1, 0, {
		get label() {
			return str.controls + str[mobileCfg.controls];
		},
		action() {
			const chosen = (confConst.controlsOptions.indexOf(mobileCfg.controls) + 1) % confConst.controlsOptions.length;
			configure(confConst.controls, confConst.controlsOptions[chosen], true);
		}
	});
}

const highScoresMenu = [
	{
		label: str.back,
		get y() {
			return this._y + font.meta.properties.fontAscent * cfg.menuItemSize * cfg.lineHeight * (scores.length + 1);
		},
		set y(val) {
			this._y = val;
		},
		action() {
			unsubscribeMenuFromTouchEvents(highScoresMenu);
			subscribeMenuToTouchEvents(mainMenu);
			currentMenu = mainMenu;
			selectedMenuItem = 1;
			pubSub.pub(eventConst.cursorRepositioned, currentMenu[selectedMenuItem].y);
		}
	}
];

function subscribeMenuToTouchEvents(menu) {
	menu.forEach((el, i) => {
		el.touchAction =
			el.touchAction ||
			function() {
				selectedMenuItem = i;
				el.action();
				pubSub.pub(eventConst.cursorRepositioned, currentMenu[selectedMenuItem].y);
				drawMenu();
			};

		touch.on(
			eventConst.touchStart,
			{
				x: 0,
				y: el.y - font.meta.properties.fontAscent * cfg.menuItemSize * cfg.lineHeight,
				w: coreCfg.screenWidth,
				h: font.meta.properties.fontAscent * cfg.menuItemSize * cfg.lineHeight
			},
			el.touchAction
		);
	});
}

function unsubscribeMenuFromTouchEvents(menu) {
	menu.forEach(el => touch.off(eventConst.touchStart, el.touchAction));
}

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
	color = hexToRgba(cfg.color, 1);
	pubSub.on(eventConst.keyDown, keyDown);
	pubSub.on(eventConst.animationFrame, fadeOutMenu);

	title.y = Math.round(
		(coreCfg.fullScreenHeight -
			font.meta.properties.fontAscent * (cfg.titleSize + cfg.menuItemSize * 3) * cfg.lineHeight) /
			2
	);

	[mainMenu, settingsMenu, highScoresMenu].forEach(menu => {
		menu[0].y = title.y + font.meta.properties.fontAscent * cfg.titleSize * cfg.lineHeight;
		for (let i = 1; i < menu.length; i += 1) {
			menu[i].y = menu[i - 1].y + font.meta.properties.fontAscent * cfg.menuItemSize * cfg.lineHeight;
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
			font.meta.properties.fontAscent * cfg.titleSize * cfg.lineHeight +
			font.meta.properties.fontAscent * cfg.menuItemSize * cfg.lineHeight * i;
	}

	transitionElapsed = 0;
	selectedMenuItem = 0;

	if (mobileCfg.enabled) {
		subscribeMenuToTouchEvents(currentMenu);
	}

	return {
		x: drawMenu(),
		y: currentMenu[selectedMenuItem].y
	};
}

export function destroy() {
	pubSub.off(keyDown);
	pubSub.off(fadeOutMenu);
	unsubscribeMenuFromTouchEvents(currentMenu);
	interfaceCtx.clearRect(0, 0, coreCfg.screenWidth, coreCfg.fullScreenHeight);
}

function drawMenu() {
	interfaceCtx.clearRect(0, 0, coreCfg.screenWidth, coreCfg.fullScreenHeight);
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
		1 / cfg.fadeSteps * (cfg.fadeSteps - Math.floor(transitionElapsed / (cfg.transitionDuration / cfg.fadeSteps)))
	);
	if (newColor !== color) {
		color = newColor;
		drawMenu();
	}
}
