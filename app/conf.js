import { confConst } from './const';

export const coreCfg = {
	pixelSize: 3,
	screenWidth: 480,
	screenHeight: 600,
	homescreen: false,
	get fullScreenHeight() {
		return this.screenHeight + (mobileCfg.enabled ? mobileCfg.controlPanelHeightPx : 0);
	}
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
		[[0x000000, 0], [0xffffff, 15], [0xffffff, 25]],
		[[0x000000, 15], [0x000000, 0], [0xffffff, 15]],
		[[0x000000, 25], [0x000000, 15], [0x000000, 0]]
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
	itemsPerCanvas: 10,
	itemPadding: 5
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
	font: 'powerline',
	fontSize: 2,
	get paddingX() {
		return Math.round(coreCfg.screenWidth * 0.02);
	},
	get paddingY() {
		return Math.round(coreCfg.fullScreenHeight * 0.02);
	},
	scoreDigits: 4
};

export const titleScreenCfg = {
	font: 'powerline',
	titleSize: 3,
	menuItemSize: 2,
	lineHeight: 1.7,
	get cursorPadding() {
		return coreCfg.pixelSize * 2;
	},
	get cursorSpeed() {
		return coreCfg.fullScreenHeight * 0.3;
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
	font: 'powerline',
	color: 0xffffff,
	opacity: [0.75, 1, 0.75, 0.5, 0.25],
	duration: 800
};

export const pauseScreenCfg = {
	font: 'powerline',
	titleSize: 5,
	subtitleSize: 2
};

export const soundCfg = {
	on: true,
	volume: 0.5
};

export const mobileCfg = {
	enabled: !!('ontouchstart' in window || (window.DocumentTouch && document instanceof DocumentTouch)),
	controlPanelHeight: 30,
	controlPanelFont: 'powerline',
	controlPanelFontSize: 1,
	noticeClearTimeout: 3000,
	controls: confConst.buttons,
	buttonColor: 0xffffff,
	buttonWidth: 16,
	buttonHeight: 9,
	gyroSafeZone: 3,
	gyroMessageBottomMargin: 5
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
	mobileCfg.controlPanelHeightPx = mobileCfg.controlPanelHeight * coreCfg.pixelSize;
	mobileCfg.buttonWidthPx = mobileCfg.buttonWidth * coreCfg.pixelSize;
	mobileCfg.buttonHeightPx = mobileCfg.buttonHeight * coreCfg.pixelSize;
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
			mobileCfg.controlPanelFont = val;
			break;
		case confConst.screenWidth:
			coreCfg.screenWidth = val;
			break;
		case confConst.screenHeight:
			coreCfg.screenHeight = val;
			break;
		case 'mobile':
			mobileCfg.enabled = true;
			break;
		case 'desktop':
			mobileCfg.enabled = false;
			break;
		case confConst.fps:
			drawingCfg.showFPS = val || val === undefined;
			break;
		case confConst.controls:
			mobileCfg.controls = val;
			break;
		case confConst.sound:
			soundCfg.on = val || val === undefined;
			break;
		case 'homescreen':
			coreCfg.homescreen = true;
			break;
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
