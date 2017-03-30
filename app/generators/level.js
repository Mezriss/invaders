/*
	Level Generator

 */

//todo choose level traits (from a list) based on challenge rate of traits and level's "challenge budget"

import {core as cfg, ship as shipCfg, formation as formationCfg} from '../config';
import * as formationGenerator from './formation';
import {formation as formationConst} from '../const';

export function create(levelNumber) {
	const level = {
		number: levelNumber,
		formations: [],
		missiles: [],
		events: [],
		effects: []
	};

	level.formations.push(formationGenerator.create({
		level: level,
		levelNumber: levelNumber,
		width: Math.floor(cfg.screenWidth / ((shipCfg.width + formationCfg.shipPadding) * cfg.pixelSize) * 0.7),
		height: 6,
		shipTypes: 6,
		shipArrangement: formationConst.oneTypePerLine
	}));

	return level;
}