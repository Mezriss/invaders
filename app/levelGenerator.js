/*
	Level Generator

 */

//todo choose level traits (from a list) based on challenge rate of traits and level's "challenge budget"
//todo based on chosen traits add formations and

import * as formationGenerator from './formationGenerator';
import {formation as formationConst} from './const';

export function create(levelNumber) {
	const level = {
		formations: [],
		events: []
	};

	level.formations.push(formationGenerator.create({
		levelNumber: levelNumber,
		width: 8,
		height: 4,
		shipTypes: 4,
		shipArrangement: formationConst.oneTypePerLine
	}));

	return level;
}