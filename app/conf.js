import { confConst } from './const';

export const coreCfg = {
	pixelSize: 3,
	screenWidth: 480,
	screenHeight: 600
};

export const spaceCfg = {
	pixelSize: 2,
	background: '#000011',
	maxStars: 80,
	maxIntensity: 80,
	hue: ['#9BB0FF', '#AABFFF', '#CAD7FF', '#F8F7FF', '#FEF4EA'], //'#FED2A3', '#FFCC70'  //leaving only colder colors
	beamFadeRate: 15,
	minBeamIntensity: 0.1,
	initialBeamIntensity: 0.60,
	maxBeamLength: 5
};

export const shipCfg = {
	width: 7,
	height: 5,
	minBits: 7,
	maxBits: 15,
	defaultColor: '#FFC905',
	drawStyle: confConst.regular
};

export const drawingCfg = {
	preventSubPixelDrawing: false,
	stickToPixelGrid: false,
	showFPS: false,
	systemInfoColor: 'lime',
	systemInfoText: '10px sans-serif',
	maxFPS: 60,
	paletteSize: 100,
	mask: [
		//todo generate this
		[['#000000', 0], ['#ffffff', 25], ['#ffffff', 50]],
		[['#000000', 25], ['#000000', 0], ['#ffffff', 25]],
		[['#000000', 50], ['#000000', 25], ['#000000', 0]]
	]
};

export const formationCfg = {
	shipPadding: 9,
	linePadding: 3
};

export const playerCfg = {
	defaultColor: '#9305ff',
	startingLives: 3,
	maxLives: 4,
	get speed() {
		return 0.3 * coreCfg.screenWidth;
	},
	get minTravelDistance() {
		return shipCfg.widthPx;
	},
	respawnDelay: 1000
};
export const cacheCfg = {
	itemsPerCanvas: 10
};

export const missileCfg = {
	defaultColor: '#ffffff',
	glow: 0.2,
	glowDegradation: 0,
	width: 3,
	height: 5,
	minBits: 3,
	maxBits: 4,
	armSteps: 4,
	glowLength: 1
};

export const explosionCfg = {
	duration: 300,
	minOpacity: 20,
	spread: 4
};

export const fontCfg = {
	defaultColor: '#ffffff',
	alignment: 'left'
};

export const interfaceInfoPanelCfg = {
	font: 'pressStart',
	fontSize: 2,
	get paddingX() {
		return Math.round(coreCfg.screenWidth * 0.02);
	},
	get paddingY() {
		return Math.round(coreCfg.screenHeight * 0.02);
	},
	scoreDigits: 4
};

export const titleScreenCfg = {
	font: 'pressStart',
	titleSize: 3,
	menuItemSize: 2,
	lineHeight: 2,
	get cursorPadding() {
		return coreCfg.pixelSize * 2;
	},
	get cursorSpeed() {
		return coreCfg.screenHeight * 0.3;
	},
	color: '#ffffff',
	fadeSteps: 8,
	transitionDuration: 2500,
	scoreDigits: 4
};

export const highScoresCfg = {
	key: 'highScores',
	amount: 5,
	predefinedScores: [1000, 500, 250, 100, 10]
};

export const soundCfg = {
	on: false
};

function setCalculatedValues() {
	shipCfg.widthPx = shipCfg.width * coreCfg.pixelSize;
	shipCfg.heightPx = shipCfg.height * coreCfg.pixelSize;
	missileCfg.widthPx = missileCfg.width * coreCfg.pixelSize;
	missileCfg.heightPx = missileCfg.height * coreCfg.pixelSize;
	missileCfg.glowLengthPx = missileCfg.glowLength * coreCfg.pixelSize;
	missileCfg.widthPadded = missileCfg.width + missileCfg.glowLength * 2;
	missileCfg.heightPadded = missileCfg.height + missileCfg.glowLength * 2;
	missileCfg.widthPaddedPx = missileCfg.widthPx + missileCfg.glowLengthPx * 2;
	missileCfg.heightPaddedPx = missileCfg.heightPx + missileCfg.glowLengthPx * 2;
	formationCfg.shipPaddingPx = formationCfg.shipPadding * coreCfg.pixelSize;
	formationCfg.linePaddingPx = formationCfg.linePadding * coreCfg.pixelSize;
}

export function configure(key, val) {
	switch (key) {
		case confConst.beveled:
			shipCfg.drawStyle = confConst.beveled;
			break;
		case 'pixelSize':
			coreCfg.pixelSize = parseInt(val, 10);
			setCalculatedValues();
			break;
		case 'font':
			interfaceInfoPanelCfg.font = val;
			titleScreenCfg.font = val;
			break;
		case confConst.fps:
			drawingCfg.showFPS = val || val === undefined;
			break;
		case confConst.sound:
			soundCfg.on = val || val === undefined;
	}
}

setCalculatedValues();
