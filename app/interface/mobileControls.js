import { coreCfg, mobileCfg } from '../conf';
import { confConst, eventConst, graphics } from '../const';
import { drawSprite, drawImage, touch, pubSub } from '../util';

const sprites = {}, interfaceCtx = interfaceScreen.getContext('2d');

let buttonHandlers, dragHandlers, accelerometerHandlers;

function initButtons() {
	sprites.buttonLeft = sprites.buttonLeft || drawSprite(graphics.buttonLeft, mobileCfg.buttonColor);
	sprites.buttonRight = sprites.buttonRight || drawSprite(graphics.buttonRight, mobileCfg.buttonColor);
	sprites.buttonShoot = sprites.buttonShoot || drawSprite(graphics.buttonShoot, mobileCfg.buttonColor);

	let buttonY = coreCfg.screenHeight + Math.floor((mobileCfg.controlPanelHeightPx - mobileCfg.buttonHeightPx) / 2);

	drawImage(
		interfaceCtx,
		sprites.buttonLeft.ctx,
		[Math.floor(coreCfg.screenWidth / 4 * 0.5 - mobileCfg.buttonWidthPx / 2), buttonY],
		sprites.buttonLeft.coords,
		[mobileCfg.buttonWidthPx, mobileCfg.buttonHeightPx]
	);
	drawImage(
		interfaceCtx,
		sprites.buttonRight.ctx,
		[Math.floor(coreCfg.screenWidth / 4 * 1.5 - mobileCfg.buttonWidthPx / 2), buttonY],
		sprites.buttonRight.coords,
		[mobileCfg.buttonWidthPx, mobileCfg.buttonHeightPx]
	);
	drawImage(
		interfaceCtx,
		sprites.buttonShoot.ctx,
		[Math.floor(coreCfg.screenWidth / 4 * 3 - mobileCfg.buttonWidthPx / 2), buttonY],
		sprites.buttonShoot.coords,
		[mobileCfg.buttonWidthPx, mobileCfg.buttonHeightPx]
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

	Object.keys(buttonHandlers).forEach(handler =>
		buttonHandlers[handler].events.forEach(event => touch.on(event.name, buttonHandlers[handler].zone, event.action))
	);
}

function initDrag() {
	console.info('Not implemented yet');
	dragHandlers = dragHandlers || {};
}

function initAccelerometer() {
	console.info('Not implemented yet');
	accelerometerHandlers = accelerometerHandlers || {};
}

export function init() {
	switch (mobileCfg.controls) {
		case confConst.buttons:
			initButtons();
			break;
		case confConst.drag:
			initDrag();
			break;
		case confConst.accelerometer:
			initAccelerometer();
	}
}

export function destroy() {
	interfaceCtx.clearRect(0, coreCfg.screenHeight, coreCfg.screenWidth, mobileCfg.controlPanelHeightPx);
	let handlers;
	switch (mobileCfg.controls) {
		case confConst.buttons:
			handlers = buttonHandlers;
			break;
	}
	Object.keys(buttonHandlers).forEach(handler =>
		buttonHandlers[handler].events.forEach(event => touch.off(event.name, event.action))
	);
}
