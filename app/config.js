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
	minDensity: 0.3,
	maxDensity: 0.8,
	defaultColor: '#FFC905',
	shipyardSize: 10
};

export const drawing = {
	preventSubPixelDrawing: false,
	stickToPixelGrid: false,
	showFPS: true,
	systemInfoColor: 'lime',
	systemInfoText: '10px sans-serif',
	maxFPS: 30,
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