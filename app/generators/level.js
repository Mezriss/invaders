/*
	Level Generator

 */

import { coreCfg as cfg, shipCfg, formationCfg } from '../conf';
import * as formationGenerator from './formation';
import { formationConst } from '../const';

export function create(levelNumber) {
	const level = {
		number: levelNumber,
		formations: [],
		missiles: [],
		events: [],
		effects: []
	};

	level.formations.push(
		formationGenerator.create({
			levelNumber: levelNumber,
			width: Math.floor(cfg.screenWidth / (shipCfg.widthPx + formationCfg.shipPaddingPx) * 0.7),
			height: 6,
			shipTypes: 6,
			shipArrangement: formationConst.oneTypePerLine
		})
	);

	return level;
}
