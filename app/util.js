export * from './util/drawing';
export * from './util/color';
export * from './util/collision';

import * as animation from './util/animation';
export { animation };

import * as pubSub from './util/pubSub';
export { pubSub };

import * as touch from './util/touch';
export { touch };

export { cacheSprite } from './util/spriteCache';

export function roll(from, to = from) {
	from = arguments.length === 1 ? 1 : from;
	return from + Math.floor(Math.random() * (to - from + 1));
}

export function rollh(n, amount) {
	const rolls = [];
	for (let i = 0; i < amount; i += 1) {
		rolls.push(roll(n));
	}
	return Math.max(...rolls);
}

export function shuffle(a) {
	let b = a.slice(0), i, r, tmp;
	for (i = b.length - 1; i > 0; i--) {
		r = roll(0, i);
		tmp = b[i];
		b[i] = b[r];
		b[r] = tmp;
	}
	return b;
}
