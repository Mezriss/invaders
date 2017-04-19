import * as soundUtil from './soundUtil';
import * as mathUtil from './mathUtil';
import Random from './random';

export function sine() {
	return phase => Math.sin(2 * Math.PI * phase);
}

export function triangle() {
	return phase => {
		if (phase < 0.25) return 4 * phase;
		if (phase < 0.75) return 2 - 4 * phase;
		return -4 + 4 * phase;
	};
}

export function sawtooth() {
	return phase => (phase < 0.5 ? 2 * phase : -2 + 2 * phase);
}

export function square() {
	return (phase, time, sound) => (phase < soundUtil.squareDutyAt(sound, time) ? 1 : -1);
}

export function tangent() {
	// Arbitrary cutoff value to make normalization behave.
	return phase => mathUtil.clamp(-2, 2, 0.3 * Math.tan(Math.PI * phase));
}

export function whistle() {
	return phase => 0.75 * Math.sin(2 * Math.PI * phase) + 0.25 * Math.sin(40 * Math.PI * phase);
}

export function breaker() {
	return phase => {
		// Make sure to start at a zero crossing.
		const p = mathUtil.frac(phase + Math.sqrt(0.75));
		return -1 + 2 * Math.abs(1 - p * p * 2);
	};
}

export function whitenoise() {
	let random = new Random(0x3cf78ba3), prevPhase = 0, prevRandom = 0, currRandom = 0;

	return (phase, time, sound) => {
		// Need two samples per phase in order to include the desired frequencies.
		phase = mathUtil.frac(phase * 2);
		if (phase < prevPhase) {
			prevRandom = currRandom;
			currRandom = random.uniform(-1, 1);
		}
		prevPhase = phase;

		return sound.interpolateNoise ? mathUtil.lerp(prevRandom, currRandom, phase) : currRandom;
	};
}

export function pinknoise() {
	let random = new Random(0x3cf78ba3), prevPhase = 0, b = [0, 0, 0, 0, 0, 0, 0], prevRandom = 0, currRandom = 0;

	return (phase, time, sound) => {
		// Need two samples per phase in order to include the desired frequencies.
		phase = mathUtil.frac(phase * 2);
		if (phase < prevPhase) {
			prevRandom = currRandom;
			// Method pk3 from http://www.firstpr.com.au/dsp/pink-noise/,
			// due to Paul Kellet.
			let white = random.uniform(-1, 1);
			b[0] = 0.99886 * b[0] + white * 0.0555179;
			b[1] = 0.99332 * b[1] + white * 0.0750759;
			b[2] = 0.96900 * b[2] + white * 0.1538520;
			b[3] = 0.86650 * b[3] + white * 0.3104856;
			b[4] = 0.55000 * b[4] + white * 0.5329522;
			b[5] = -0.7616 * b[5] + white * 0.0168980;
			currRandom = (b[0] + b[1] + b[2] + b[3] + b[4] + b[5] + b[6] + white * 0.5362) / 7;
			b[6] = white * 0.115926;
		}
		prevPhase = phase;

		return sound.interpolateNoise ? mathUtil.lerp(prevRandom, currRandom, phase) : currRandom;
	};
}

export function brownnoise(phase) {
	let random = new Random(0x3cf78ba3), prevPhase = 0, prevRandom = 0, currRandom = 0;

	return (phase, time, sound) => {
		// Need two samples per phase in order to include the desired frequencies.
		phase = mathUtil.frac(phase * 2);
		if (phase < prevPhase) {
			prevRandom = currRandom;
			currRandom = mathUtil.clamp(-1, 1, currRandom + 0.1 * random.uniform(-1, 1));
		}
		prevPhase = phase;

		return sound.interpolateNoise ? mathUtil.lerp(prevRandom, currRandom, phase) : currRandom;
	};
}
