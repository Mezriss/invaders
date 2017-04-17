export const formationConst = {
	oneTypePerLine: 'one-type-per-line'
};

export const directionConst = {
	left: 'left',
	right: 'right',
	up: 'up',
	down: 'down'
};

export const eventConst = {
	keyDown: 'keydown',
	keyUp: 'keyup',
	visibilityChange: 'visibilitychange',
	levelEntityCreated: 'levelEntityCreated',
	levelEntityDestroyed: 'levelEntityDestroyed',
	missile: 'missiles',
	effect: 'effects',
	formation: 'formations',
	enemyDestroyed: 'enemyDestroyed',
	shipListUpdate: 'shipListUpdate',
	scoreUpdate: 'scoreUpdate',
	gameOver: 'gameOver',
	cursorRepositioned: 'cursorRepositioned',
	menuToGameTransition: 'menuToGameTransition',
	animationFrame: 'menuToGameTransitionFrame',
	introOver: 'introOver',
	gamePaused: 'gamePaused',
	gameResumed: 'gameResumed'
};

export const keyConst = {
	arrowLeft: 'ArrowLeft',
	arrowRight: 'ArrowRight',
	arrowUp: 'ArrowUp',
	arrowDown: 'ArrowDown',
	enter: 'Enter',
	space: ' ',
	escape: 'Escape'
};

export const missileConst = {
	arming: 'arming',
	armed: 'armed',
	launched: 'launched',
	destroyed: 'destroyed'
};

export const confConst = {
	regular: 'regular',
	beveled: 'beveled',
	sound: 'sound',
	fps: 'fps'
};

export const alignmentConst = {
	left: 'left',
	right: 'right',
	center: 'center'
};

import { font as c64 } from './fonts/c64';
import { font as pressStart } from './fonts/press-start-2b';
import { font as gohufont } from './fonts/gohufont-11.bdf';
import { font as powerline } from './fonts/ter-powerline-x12b.bdf';
export const fonts = { pressStart, c64, gohufont, powerline };
