import { coreCfg, mobileCfg as cfg } from '../conf';
import { confConst, eventConst, graphics, alignmentConst } from '../const';
import { drawBitmap, drawImage, touch, pubSub } from '../util';
import * as fontGenerator from '../generators/font';
import str from '../str';

const sprites = {}, interfaceCtx = document.getElementById('interfaceScreen').getContext('2d');

let buttonHandlers, dragHandlers, gyroHandlers, noticeClearTimeout;

function initButtons() {
	sprites.buttonLeft = sprites.buttonLeft || drawBitmap(graphics.buttonLeft, cfg.buttonColor);
	sprites.buttonRight = sprites.buttonRight || drawBitmap(graphics.buttonRight, cfg.buttonColor);
	sprites.buttonShoot = sprites.buttonShoot || drawBitmap(graphics.buttonShoot, cfg.buttonColor);

	let buttonY = coreCfg.screenHeight + Math.floor((cfg.controlPanelHeightPx - cfg.buttonHeightPx) / 2);

	drawImage(
		interfaceCtx,
		sprites.buttonLeft.ctx,
		[Math.floor(coreCfg.screenWidth / 4 * 0.5 - cfg.buttonWidthPx / 2), buttonY],
		sprites.buttonLeft.coords,
		[cfg.buttonWidthPx, cfg.buttonHeightPx]
	);
	drawImage(
		interfaceCtx,
		sprites.buttonRight.ctx,
		[Math.floor(coreCfg.screenWidth / 4 * 1.5 - cfg.buttonWidthPx / 2), buttonY],
		sprites.buttonRight.coords,
		[cfg.buttonWidthPx, cfg.buttonHeightPx]
	);
	drawImage(
		interfaceCtx,
		sprites.buttonShoot.ctx,
		[Math.floor(coreCfg.screenWidth / 4 * 3 - cfg.buttonWidthPx / 2), buttonY],
		sprites.buttonShoot.coords,
		[cfg.buttonWidthPx, cfg.buttonHeightPx]
	);
	buttonHandlers = buttonHandlers || {
		left: {
			zone: { x: 0, y: 0, w: coreCfg.screenWidth / 4, h: coreCfg.fullScreenHeight },
			events: [
				{
					name: eventConst.touchStart,
					action() {
						pubSub.pub(eventConst.touchLeft);
					}
				},
				{
					name: eventConst.touchMove,
					action() {
						pubSub.pub(eventConst.touchLeft);
					}
				}
			]
		},
		right: {
			zone: { x: coreCfg.screenWidth / 4, y: 0, w: coreCfg.screenWidth / 4, h: coreCfg.fullScreenHeight },
			events: [
				{
					name: eventConst.touchStart,
					action() {
						pubSub.pub(eventConst.touchRight);
					}
				},
				{
					name: eventConst.touchMove,
					action() {
						pubSub.pub(eventConst.touchRight);
					}
				}
			]
		},
		move: {
			zone: { x: 0, y: 0, w: coreCfg.screenWidth / 4 * 2.5, h: coreCfg.fullScreenHeight },
			events: [
				{
					name: eventConst.touchEnd,
					action() {
						pubSub.pub(eventConst.touchMoveEnd);
					}
				}
			]
		},
		shoot: {
			zone: { x: coreCfg.screenWidth / 4 * 2.5, y: 0, w: coreCfg.screenWidth / 4 * 1.5, h: coreCfg.fullScreenHeight },
			events: [
				{
					name: eventConst.touchStart,
					action() {
						pubSub.pub(eventConst.touchShootStart);
					}
				},
				{
					name: eventConst.touchEnd,
					action() {
						pubSub.pub(eventConst.touchShootEnd);
					}
				}
			]
		}
	};
}

function initDrag() {
	const font = fontGenerator.create(cfg.controlPanelFont);
	font.write(
		interfaceCtx,
		[
			coreCfg.screenWidth / 2,
			coreCfg.screenHeight +
				Math.floor((cfg.controlPanelHeightPx - font.meta.properties.fontAscent * cfg.controlPanelFontSize) / 2)
		],
		str.dragToMove,
		{
			alignment: alignmentConst.center,
			size: cfg.controlPanelFontSize
		}
	);
	setTimeout(
		() => interfaceCtx.clearRect(0, coreCfg.screenHeight, coreCfg.screenWidth, cfg.controlPanelHeightPx),
		cfg.noticeClearTimeout
	);

	dragHandlers = dragHandlers || {
		dragZone: {
			zone: { x: 0, y: 0, w: coreCfg.screenWidth, h: coreCfg.fullScreenHeight },
			events: [
				{
					name: eventConst.touchStart,
					action(coords) {
						pubSub.pub(eventConst.touchDragMove, coords);
					}
				},
				{
					name: eventConst.touchMove,
					action(coords) {
						pubSub.pub(eventConst.touchDragMove, coords);
					}
				},
				{
					name: eventConst.touchEnd,
					action() {
						pubSub.pub(eventConst.touchDragEnd);
					}
				}
			]
		}
	};
}

function deviceOrientationHandler(event) {
	pubSub.pub(eventConst.gyroData, event.gamma);
}

function initGyro() {
	const font = fontGenerator.create(cfg.controlPanelFont);
	font.write(
		interfaceCtx,
		[coreCfg.screenWidth / 2, coreCfg.fullScreenHeight - cfg.gyroMessageBottomMargin],
		str.tiltToMove,
		{
			alignment: alignmentConst.center,
			size: cfg.controlPanelFontSize
		}
	);
	setTimeout(
		() =>
			interfaceCtx.clearRect(
				0,
				coreCfg.fullScreenHeight -
					font.meta.properties.fontAscent * cfg.controlPanelFontSize -
					cfg.gyroMessageBottomMargin,
				coreCfg.screenWidth,
				font.meta.properties.fontAscent * cfg.controlPanelFontSize
			),
		cfg.noticeClearTimeout
	);

	gyroHandlers = gyroHandlers || {
		shoot: {
			zone: { x: 0, y: 0, w: coreCfg.screenWidth, h: coreCfg.fullScreenHeight },
			events: [
				{
					name: eventConst.touchStart,
					action() {
						pubSub.pub(eventConst.touchShootStart);
					}
				},
				{
					name: eventConst.touchEnd,
					action() {
						pubSub.pub(eventConst.touchShootEnd);
					}
				}
			]
		}
	};
	window.addEventListener(eventConst.deviceOrientation, deviceOrientationHandler);
	sprites.buttonShoot = sprites.buttonShoot || drawBitmap(graphics.buttonShoot, cfg.buttonColor);
	drawImage(
		interfaceCtx,
		sprites.buttonShoot.ctx,
		[
			Math.floor((coreCfg.screenWidth - cfg.buttonWidthPx) / 2),
			coreCfg.screenHeight + Math.floor((cfg.controlPanelHeightPx - cfg.buttonHeightPx) / 2)
		],
		sprites.buttonShoot.coords,
		[cfg.buttonWidthPx, cfg.buttonHeightPx]
	);
}

export function init() {
	let handlers;
	switch (cfg.controls) {
		case confConst.buttons:
			initButtons();
			handlers = buttonHandlers;
			break;
		case confConst.drag:
			initDrag();
			handlers = dragHandlers;
			break;
		case confConst.gyro:
			initGyro();
			handlers = gyroHandlers;
	}
	Object.keys(handlers).forEach(handler =>
		handlers[handler].events.forEach(event => touch.on(event.name, handlers[handler].zone, event.action))
	);
}

export function destroy() {
	clearTimeout(noticeClearTimeout);
	interfaceCtx.clearRect(0, coreCfg.screenHeight, coreCfg.screenWidth, cfg.controlPanelHeightPx);
	let handlers;
	switch (cfg.controls) {
		case confConst.buttons:
			handlers = buttonHandlers;
			break;
		case confConst.drag:
			handlers = dragHandlers;
			break;
		case confConst.gyro:
			handlers = gyroHandlers;
			window.removeEventListener(eventConst.deviceOrientation, deviceOrientationHandler);
			break;
	}
	Object.keys(handlers).forEach(handler =>
		handlers[handler].events.forEach(event => touch.off(event.name, event.action))
	);
}
