import synth from './jfxr/synth';

const context = new (window.AudioContext || window.webkitAudioContext)();

const buffers = [];

export function generate(data) {
	const sound = synth(data);
	const buffer = context.createBuffer(1, sound.data.length, sound.sampleRate);
	buffer.getChannelData(0).set(sound.data);

	buffers.push(buffer);
	return buffers.length - 1;
}

export function play(bufferId) {
	const source = context.createBufferSource();
	source.buffer = buffers[bufferId];
	source.connect(context.destination);
	source.onended = function() {
		console.log('Ended', Date.now());
	}.bind(this);
	console.log('Started', Date.now());
	source.start();
}
