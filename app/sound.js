import synth from './jfxr/synth';
import { soundCfg as cfg } from './conf';

const context = new (window.AudioContext || window.webkitAudioContext)(), gainNode = context.createGain(), buffers = [];

gainNode.gain.value = cfg.volume;
gainNode.connect(context.destination);

function createBuffer(sound) {
	const data = synth(sound), buffer = context.createBuffer(1, data.length, sound.sampleRate);
	buffer.getChannelData(0).set(data);
	return buffer;
}

export function generate(sound) {
	buffers.push({ sound, buffer: cfg.on ? createBuffer(sound) : null });
	return buffers.length - 1;
}

export function play(bufferId) {
	if (!cfg.on) {
		return;
	}
	if (!buffers[bufferId].buffer) {
		buffers[bufferId].buffer = createBuffer(buffers[bufferId].sound);
	}

	const source = context.createBufferSource();
	source.buffer = buffers[bufferId].buffer;
	source.connect(gainNode);

	source.start();
}
