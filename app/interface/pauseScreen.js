import { pauseScreenCfg as cfg, coreCfg, mobileCfg } from '../conf';
import { alignmentConst } from '../const';
import * as fontGenerator from '../generators/font';
import str from '../str';

const interfaceCtx = interfaceScreen.getContext('2d');

let font;

export function init() {
	font = fontGenerator.create(cfg.font);
}
export function show() {
	font.write(
		interfaceCtx,
		[coreCfg.screenWidth / 2, (coreCfg.fullScreenHeight + font.meta.points * cfg.titleSize) / 2],
		str.paused,
		{
			size: cfg.titleSize,
			alignment: alignmentConst.center
		}
	);
	font.write(
		interfaceCtx,
		[coreCfg.screenWidth / 2, (coreCfg.fullScreenHeight + font.meta.points * (cfg.titleSize * 2)) / 2],
		mobileCfg.enabled ? str.tapToContinue : str.pressToContinue,
		{
			size: cfg.subtitleSize,
			alignment: alignmentConst.center
		}
	);
}

export function hide() {
	interfaceCtx.clearRect(
		0,
		(coreCfg.fullScreenHeight - font.meta.points * cfg.titleSize) / 2,
		coreCfg.screenWidth,
		font.meta.points * cfg.titleSize * 3
	);
}

export function destroy() {
	hide();
}
