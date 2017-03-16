export * from './util/drawing';
export * from './util/color';

import * as animation from './util/animation';
export {animation};

export function roll(n) {
	return Math.ceil(Math.random() * n);
}

export function roll0(n) {
	return Math.floor(Math.random() * n);
}

export function rollh(n, amount) {
	const rolls = [];
	for (let i = 0; i < amount; i += 1) {
		rolls.push(roll(n))
	}
	return Math.max(...rolls);
}
