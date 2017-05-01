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
	touchStart: 'touchstart',
	touchEnd: 'touchend',
	touchCancel: 'touchcancel',
	touchMove: 'touchmove',
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
	fps: 'fps',
	screenWidth: 'screenWidth',
	screenHeight: 'screenHeight',
	controls: 'controls',
	buttons: 'buttons',
	drag: 'drag',
	accelerometer: 'accelerometer',
	controlsOptions: []
};
confConst.controlsOptions.push(confConst.buttons, confConst.drag, confConst.accelerometer);

export const alignmentConst = {
	left: 'left',
	right: 'right',
	center: 'center'
};
