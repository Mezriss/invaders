import * as soundUtil from './soundUtil';
import * as mathUtil from './mathUtil';
import * as oscillators from './oscillators';

export function generator(sound, array) {
	let amp = 1, totalAmp = 0, oscillatorList = [], phase = 0;

	for (let harmonicIndex = 0; harmonicIndex <= sound.harmonics; harmonicIndex++) {
		totalAmp += amp;
		amp *= sound.harmonicsFalloff;
		oscillatorList.push(oscillators[sound.waveform]());
	}
	let firstHarmonicAmp = 1 / totalAmp;

	for (let i = 0; i < array.length; i++) {
		let time = i / sound.sampleRate, currentFrequency = soundUtil.frequencyAt(sound, time);

		phase = mathUtil.frac(phase + currentFrequency / sound.sampleRate);

		let sample = 0, amp = firstHarmonicAmp;
		for (let harmonicIndex = 0; harmonicIndex <= sound.harmonics; harmonicIndex++) {
			let harmonicPhase = mathUtil.frac(phase * (harmonicIndex + 1));
			sample += amp * oscillatorList[harmonicIndex](harmonicPhase, time, sound);
			amp *= sound.harmonicsFalloff;
		}
		array[i] = sample;
	}
}

export function tremolo(sound, array) {
	if (sound.tremoloDepth === 0) {
		return;
	}

	for (let i = 0; i < array.length; i++) {
		let time = i / sound.sampleRate;
		array[i] *= 1 - sound.tremoloDepth / 100 * (0.5 + 0.5 * Math.cos(2 * Math.PI * time * sound.tremoloFrequency));
	}
}

export function flanger(sound, array) {
	if (sound.flangerOffset === 0 && sound.flangerOffsetSweep === 0) {
		return;
	}

	// Maximum 100ms offset
	const buffer = new Float32Array(Math.ceil(sound.sampleRate * 0.1));
	let bufferPos = 0;

	for (let i = 0; i < array.length; i++) {
		buffer[bufferPos] = array[i];

		let offsetSamples = Math.round(
			(sound.flangerOffset + i / array.length * sound.flangerOffsetSweep) / 1000 * sound.sampleRate
		);

		offsetSamples = mathUtil.clamp(0, buffer.length - 1, offsetSamples);
		array[i] += buffer[(bufferPos - offsetSamples + buffer.length) % buffer.length];
		bufferPos = (bufferPos + 1) % buffer.length;
	}
}

export function bitCrush(sound, array) {
	if (sound.bitCrush === 0 && sound.bitCrushSweep === 0) {
		return;
	}

	for (let i = 0; i < array.length; i++) {
		let bits = sound.bitCrush + i / array.length * sound.bitCrushSweep;
		bits = mathUtil.clamp(1, 16, Math.round(bits));
		let steps = Math.pow(2, bits);
		array[i] = -1 + 2 * Math.round((0.5 + 0.5 * array[i]) * steps) / steps;
	}
}

export function lowPass(sound, array) {
	if (
		sound.lowPassCutoff >= sound.sampleRate / 2 &&
		sound.lowPassCutoff + sound.lowPassCutoffSweep >= sound.sampleRate / 2
	) {
		return;
	}

	let lowPassPrev = 0;

	for (let i = 0; i < array.length; i++) {
		let fraction = i / array.length,
			cutoff = mathUtil.clamp(0, sound.sampleRate / 2, sound.lowPassCutoff + fraction * sound.lowPassCutoffSweep),
			wc = cutoff / sound.sampleRate * Math.PI, // Don't we need a factor 2pi instead of pi?
			cosWc = Math.cos(wc),
			lowPassAlpha;
		if (cosWc <= 0) {
			lowPassAlpha = 1;
		} else {
			// From somewhere on the internet: cos wc = 2a / (1+a^2)
			lowPassAlpha = 1 / cosWc - Math.sqrt(1 / (cosWc * cosWc) - 1);
			lowPassAlpha = 1 - lowPassAlpha; // Probably the internet's definition of alpha is different.
		}
		let sample = array[i];
		sample = lowPassAlpha * sample + (1 - lowPassAlpha) * lowPassPrev;
		lowPassPrev = sample;
		array[i] = sample;
	}
}

export function highPass(sound, array) {
	if (sound.highPassCutoff <= 0 && sound.highPassCutoff + sound.highPassCutoffSweep <= 0) {
		return;
	}

	let highPassPrevIn = 0, highPassPrevOut = 0;

	for (let i = 0; i < array.length; i++) {
		let fraction = i / array.length,
			cutoff = mathUtil.clamp(0, sound.sampleRate / 2, sound.highPassCutoff + fraction * sound.highPassCutoffSweep),
			wc = cutoff / sound.sampleRate * Math.PI,
			// From somewhere on the internet: a = (1 - sin wc) / cos wc
			highPassAlpha = (1 - Math.sin(wc)) / Math.cos(wc),
			sample = array[i],
			origSample = sample;

		sample = highPassAlpha * (highPassPrevOut - highPassPrevIn + sample);
		highPassPrevIn = origSample;
		highPassPrevOut = sample;
		array[i] = sample;
	}
}

export function envelope(sound, array) {
	if (sound.attack === 0 && sound.decay === 0) {
		return;
	}

	for (let i = 0; i < array.length; i++) {
		let time = i / sound.sampleRate;
		array[i] *= soundUtil.amplitudeAt(sound, time);
	}
}

export function compress(sound, array) {
	if (sound.compression === 1) {
		return;
	}

	for (let i = 0; i < array.length; i++) {
		let sample = array[i];
		if (sample >= 0) {
			sample = Math.pow(sample, sound.compression);
		} else {
			sample = -Math.pow(-sample, sound.compression);
		}
		array[i] = sample;
	}
}

export function normalize(sound, array) {
	if (!sound.normalization) {
		return;
	}

	let maxSample = 0;
	for (let i = 0; i < array.length; i++) {
		maxSample = Math.max(maxSample, Math.abs(array[i]));
	}

	let factor = 1 / maxSample;
	for (let i = 0; i < array.length; i++) {
		array[i] *= factor;
	}
}

export function amplify(sound, array) {
	let factor = sound.amplification / 100;

	if (factor === 1) {
		return;
	}

	for (let i = 0; i < array.length; i++) {
		array[i] *= factor;
	}
}
