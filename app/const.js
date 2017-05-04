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
	deviceOrientation: 'deviceorientation',

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
	gameResumed: 'gameResumed',
	touchShootStart: 'touchShootStart',
	touchShootEnd: 'touchShootEnd',
	touchMoveEnd: 'touchMoveEnd',
	touchLeft: 'touchLeftStart',
	touchRight: 'touchRightStart',
	touchDragMove: 'touchDragMove',
	touchDragEnd: 'touchDragEnd',
	gyroData: 'gyroData'
};

export const keyConst = {
	arrowLeft: 37,
	arrowRight: 39,
	arrowUp: 38,
	arrowDown: 40,
	enter: 13,
	space: 32,
	escape: 27
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
	gyro: 'gyro',
	controlsOptions: []
};
confConst.controlsOptions.push(confConst.buttons, confConst.drag, confConst.gyro);

export const alignmentConst = {
	left: 'left',
	right: 'right',
	center: 'center'
};

export const graphics = {
	buttonLeft: [0x7ffe, 0xff3f, 0xfe3f, 0xfc3f, 0xf83f, 0xfc3f, 0xfe3f, 0xff3f, 0x7ffe],
	buttonRight: [0x7ffe, 0xfcff, 0xfc7f, 0xfc3f, 0xfc1f, 0xfc3f, 0xfc7f, 0xfcff, 0x7ffe],
	buttonShoot: [0x7ffe, 0xffff, 0xf99f, 0xfc3f, 0xfe7f, 0xfc3f, 0xf99f, 0xffff, 0x7ffe]
};
