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
	showFPS: true,
	systemInfoColor: 'lime',
	systemInfoText: '10px sans-serif',
	maxFPS: 60,
	paletteSize: 100,
	mask: [
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
	minTravelDistance: core.screenWidth * 0.05,
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

export const interfacePanelTop = {
	height: 10
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
	interfacePanelTop.heightPx = interfacePanelTop.height * core.pixelSize;
}

function recalculateValues() {
	player.minTravelDistance = core.screenWidth * 0.05;
}

export function configure(key, val) {
	switch (key) {
		case confConst.beveled: ship.drawStyle = confConst.beveled; break;
		case 'pixelSize': core.pixelSize = parseInt(val, 10); break;
	}
	setCalculatedValues();
	recalculateValues();
}

setCalculatedValues();