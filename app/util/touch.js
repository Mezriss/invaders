import { eventConst } from '../const';

const handlers = {
	[eventConst.touchStart]: [],
	[eventConst.touchEnd]: [],
	[eventConst.touchMove]: []
};

function checkCollision(x, y, zone) {
	return x >= zone.x && y >= zone.y && x <= zone.x + zone.w && y <= zone.y + zone.h;
}

function checkTouchStart(event) {
	handlers[eventConst.touchStart].forEach(el => {
		if (event.touches.length && checkCollision(event.touches[0].pageX, event.touches[0].pageY, el.zone)) {
			el.handler();
		}
	});
}

function checkTouchEnd(event) {
	handlers[eventConst.touchEnd].forEach(el => {
		if (
			event.changedTouches.length &&
			checkCollision(event.changedTouches[0].pageX, event.changedTouches[0].pageY, el.zone)
		) {
			el.handler();
		}
	});
}

function checkTouchMove(event) {
	handlers[eventConst.touchMove].forEach(el => {
		if (event.touches.length && checkCollision(event.touches[0].pageX, event.touches[0].pageY, el.zone)) {
			el.handler();
		}
	});
}

export function init(el) {
	el.addEventListener(eventConst.touchStart, checkTouchStart);
	el.addEventListener(eventConst.touchEnd, checkTouchEnd);
	el.addEventListener(eventConst.touchMove, checkTouchMove);
}

export function on(event, zone, handler) {
	handlers[event].push({ zone, handler });
}

export function off(event, handler) {
	const index = handlers[event].findIndex(el => el.handler === handler);
	if (index >= 0) {
		handlers[event].splice(index, 1);
	}
}
