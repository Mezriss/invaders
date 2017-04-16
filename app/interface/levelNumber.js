import { levelNumberCfg as cfg, coreCfg } from '../conf';
import * as fontGenerator from '../generators/font';
import { eventConst, alignmentConst } from '../const';
import { pubSub, hexToRgba } from '../util';

let font, level, color, opacity, timer;

const interfaceCtx = interfaceScreen.getContext('2d');

export function init(n) {
	font = fontGenerator.create(cfg.font);
	level = n;
	pubSub.on(eventConst.animationFrame, update);
	opacity = cfg.opacity.slice();
	timer = cfg.duration / cfg.opacity.length;
	color = hexToRgba(cfg.color, opacity.shift());
	update(0);
}

export function destroy() {
	pubSub.off(update);
	clear();
}

function update(dt) {
	timer -= dt;
	if (timer <= 0) {
		if (opacity.length) {
			timer += cfg.duration / cfg.opacity.length;
			color = hexToRgba(cfg.color, opacity.shift());
			clear();
			font.write(
				interfaceCtx,
				[coreCfg.screenWidth / 2, (coreCfg.screenHeight + font.meta.points * cfg.size) / 2],
				`${level}`,
				{ alignment: alignmentConst.center, size: cfg.size, color }
			);
		} else {
			pubSub.pub(eventConst.introOver);
		}
	}
}

function clear() {
	interfaceCtx.clearRect(
		0,
		(coreCfg.screenHeight - font.meta.points * cfg.size) / 2,
		coreCfg.screenWidth,
		font.meta.points * cfg.size
	);
}
