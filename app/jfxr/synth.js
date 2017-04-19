import * as soundUtil from './soundUtil';
import * as transformers from './transformers';

//Synthesizer ripped from Jfxr (https://github.com/ttencate/jfxr)
//todo release this as a separate package

const transformationList = [
	transformers.generator,
	transformers.envelope,
	transformers.tremolo,
	transformers.flanger,
	transformers.bitCrush,
	transformers.lowPass,
	transformers.highPass,
	transformers.compress,
	transformers.normalize,
	transformers.amplify
];

export default function synth(sound) {
	const numSamples = Math.max(1, Math.ceil(sound.sampleRate * soundUtil.duration(sound))),
		data = new Float32Array(numSamples);

	for (let i = 0; i < transformationList.length; i += 1) {
		transformationList[i](sound, data);
	}
	return { data, sampleRate: sound.sampleRate };
}
