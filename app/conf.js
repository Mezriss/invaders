import { confConst } from './const';

export const coreCfg = {
	pixelSize: 3,
	screenWidth: 480,
	screenHeight: 600
};

export const spaceCfg = {
	pixelSize: 2,
	background: 0x000011,
	maxStars: 80,
	maxIntensity: 0.8,
	hue: [0x9bb0ff, 0xaabfff, 0xcad7ff, 0xf8f7ff, 0xfef4ea], //0xFED2A3, 0xFFCC70  //leaving only colder colors
	beamFadeRate: 0.15,
	minBeamIntensity: 0.1,
	initialBeamIntensity: 0.6,
	maxBeamLength: 5
};

export const shipCfg = {
	width: 7,
	height: 5,
	minBits: 7,
	maxBits: 15,
	defaultColor: 0xffc905,
	drawStyle: confConst.regular
};

export const drawingCfg = {
	preventSubPixelDrawing: false,
	stickToPixelGrid: false,
	showFPS: false,
	systemInfoColor: 'lime',
	systemInfoText: '10px sans-serif',
	maxFPS: 60,
	minFPS: 15,
	paletteSize: 100,
	mask: [
		//todo generate this
		[[0x000000, 0], [0xffffff, 25], [0xffffff, 50]],
		[[0x000000, 25], [0x000000, 0], [0xffffff, 25]],
		[[0x000000, 50], [0x000000, 25], [0x000000, 0]]
	]
};

export const formationCfg = {
	shipPadding: 9,
	linePadding: 3,
	get warpSpeed() {
		return coreCfg.screenHeight;
	}
};

export const playerCfg = {
	defaultColor: 0x9305ff,
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
	defaultColor: 0xffffff,
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
	defaultColor: 0xffffff,
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
	color: 0xffffff,
	fadeSteps: 8,
	transitionDuration: 2500,
	scoreDigits: 4
};

export const highScoresCfg = {
	key: 'highScores',
	amount: 5,
	predefinedScores: [1000, 500, 250, 100, 10]
};

export const levelNumberCfg = {
	size: 20,
	font: 'pressStart',
	color: 0xffffff,
	opacity: [0.75, 1, 0.75, 0.5, 0.25],
	duration: 800
};

export const pauseScreenCfg = {
	font: 'pressStart',
	titleSize: 5,
	subtitleSize: 2
};

export const soundCfg = {
	on: false,
	volume: 0.5
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

export function configure(key, val, save) {
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
			levelNumberCfg.font = val;
			pauseScreenCfg.font = val;
			break;
		case confConst.fps:
			drawingCfg.showFPS = val || val === undefined;
			break;
		case confConst.sound:
			soundCfg.on = val || val === undefined;
	}
	if (save) {
		const savedSettings = localStorage.getItem('settings') ? JSON.parse(localStorage.getItem('settings')) : {};
		savedSettings[key] = val;
		localStorage.setItem('settings', JSON.stringify(savedSettings));
	}
}

const savedSettings = localStorage.getItem('settings') ? JSON.parse(localStorage.getItem('settings')) : {};
Object.keys(savedSettings).forEach(key => configure(key, savedSettings[key]));

setCalculatedValues();
