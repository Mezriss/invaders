import {conf as confConst} from './const';

export const core = {
	pixelSize: 3,
	screenWidth: 480,
	screenHeight: 600
};

export const space = {
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

export const ship = {
	width: 7,
	height: 5,
	minBits: 7,
	maxBits: 15,
	defaultColor: '#FFC905',
	drawStyle: confConst.regular
};

export const drawing = {
	preventSubPixelDrawing: false,
	stickToPixelGrid: false,
	showFPS: false,
	systemInfoColor: 'lime',
	systemInfoText: '10px sans-serif',
	maxFPS: 60,
	paletteSize: 100,
	mask: [//todo generate this
		[['#000000', 0], ['#ffffff', 25], ['#ffffff', 50]],
		[['#000000', 25], ['#000000', 0], ['#ffffff', 25]],
		[['#000000', 50], ['#000000', 25], ['#000000', 0]]
	]
};

export const formation = {
	shipPadding: 4,
	linePadding: 3
};

export const player = {
	defaultColor: '#9305ff',
	startingLives: 3,
	maxLives: 4,
	get minTravelDistance() { return core.screenWidth * 0.05},
	respawnDelay: 1000
};
export const cache = {
	itemsPerCanvas: 10
};

export const missile = {
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

export const explosion = {
	duration: 300,
	minOpacity: 20,
	spread: 4,
};

export const font = {
	defaultColor: '#ffffff',
	alignment: 'left',
};

export const interfaceInfoPanel = {
	font: 'pressStart',
	fontSize: 2,
	get paddingX() { return Math.round(core.screenWidth * 0.02) },
	get paddingY() { return Math.round(core.screenHeight * 0.02) },
	scoreDigits: 4
};

export const titleScreen = {
	font: 'pressStart',
	titleSize: 3,
	menuItemSize: 2,
	lineHeight: 2,
	get cursorPadding() { return core.pixelSize * 2},
	get cursorSpeed() { return core.screenHeight * 0.3 },
	color: '#ffffff'
};

export const sound = {
	on: false
};

function setCalculatedValues() {
	ship.widthPx = ship.width * core.pixelSize;
	ship.heightPx = ship.height * core.pixelSize;
	missile.widthPx = missile.width * core.pixelSize;
	missile.heightPx = missile.height * core.pixelSize;
	missile.glowLengthPx = missile.glowLength * core.pixelSize;
	missile.widthPadded = missile.width + missile.glowLength * 2;
	missile.heightPadded = missile.height + missile.glowLength * 2;
	missile.widthPaddedPx = missile.widthPx + missile.glowLengthPx * 2;
	missile.heightPaddedPx = missile.heightPx + missile.glowLengthPx * 2;
	formation.shipPaddingPx = formation.shipPadding * core.pixelSize;
	formation.linePaddingPx = formation.linePadding * core.pixelSize;
}

export function configure(key, val) {
	switch (key) {
		case confConst.beveled: ship.drawStyle = confConst.beveled; break;
		case 'pixelSize':
			core.pixelSize = parseInt(val, 10);
			setCalculatedValues();
		break;
		case 'font':
			interfaceInfoPanel.font = val;
			titleScreen.font = val;
			break;
		case confConst.fps:
			drawing.showFPS = val || (val === undefined);
			break;
		case confConst.sound:
			sound.on = val || (val === undefined)
	}
}

setCalculatedValues();