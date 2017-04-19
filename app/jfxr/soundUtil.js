import * as mathUtil from './mathUtil';

export function duration(sound) {
	return sound.attack + sound.sustain + sound.decay;
}

export function effectiveRepeatFrequency(sound) {
	return Math.max(sound.repeatFrequency, 1 / duration(sound));
}

export function frequencyAt(sound, time) {
	const fractionInRepetition = mathUtil.frac(time * effectiveRepeatFrequency(sound));
	let freq =
		sound.frequency +
		fractionInRepetition * sound.frequencySweep +
		fractionInRepetition * fractionInRepetition * sound.frequencyDeltaSweep;
	if (fractionInRepetition > sound.frequencyJump1Onset / 100) {
		freq *= 1 + sound.frequencyJump1Amount / 100;
	}
	if (fractionInRepetition > sound.frequencyJump2Onset / 100) {
		freq *= 1 + sound.frequencyJump2Amount / 100;
	}
	if (sound.vibratoDepth !== 0) {
		freq += 1 - sound.vibratoDepth * (0.5 - 0.5 * Math.sin(2 * Math.PI * time * sound.vibratoFrequency));
	}
	return Math.max(0, freq);
}

export function squareDutyAt(sound, time) {
	const fractionInRepetition = mathUtil.frac(time * effectiveRepeatFrequency(sound));
	return (sound.squareDuty + fractionInRepetition * sound.squareDutySweep) / 100;
}

export function amplitudeAt(sound, time) {
	let amp;
	if (time < sound.attack) {
		amp = time / sound.attack;
	} else if (time < sound.attack + sound.sustain) {
		amp = 1 + sound.sustainPunch / 100 * (1 - (time - sound.attack) / sound.sustain);
	} else {
		amp = 1 - (time - sound.attack - sound.sustain) / sound.decay;
	}
	if (sound.tremoloDepth !== 0) {
		amp *= 1 - sound.tremoloDepth / 100 * (0.5 + 0.5 * Math.cos(2 * Math.PI * time * sound.tremoloFrequency));
	}
	return amp;
}
