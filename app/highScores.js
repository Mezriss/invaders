import { highScoresCfg as cfg, shipCfg } from './conf';
import * as ship from './generators/ship';

function populate() {
	const scores = [];
	for (let i = 0; i < cfg.predefinedScores.length; i += 1) {
		scores.push({
			color: shipCfg.defaultColor,
			blueprint: ship.generateBlueprint(),
			score: cfg.predefinedScores[i]
		});
	}
	localStorage.setItem(cfg.key, JSON.stringify(scores));
}

export function init() {
	if (localStorage.getItem(cfg.key) === null) {
		populate();
	}
}

export function store(record) {
	const scores = JSON.parse(localStorage.getItem(cfg.key));
	scores.push(record);
	scores.sort((a, b) => b.score - a.score);
	scores.splice(cfg.amount);
	localStorage.setItem(cfg.key, JSON.stringify(scores));
	return scores.indexOf(record);
}

export function get() {
	return JSON.parse(localStorage.getItem(cfg.key));
}
