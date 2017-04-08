import {interfaceInfoPanel as cfg, core as coreCfg, player as playerCfg, ship as shipCfg} from '../conf';
import {event as eventConst, alignment as alignmentConst} from '../const';
import {pubSub} from '../util';
import * as fontGenerator from '../generators/font';
import str from '../str';

let score, ships,
	font,
	scorePositionX, textPositionY,
	shipListPositionX;

const interfaceCtx = interfaceScreen.getContext('2d');

function updateScore(score) {
	score = score.toString();
	score = '0'.repeat(Math.max(cfg.scoreDigits - score.length, 0)) + score;

	interfaceCtx.clearRect(scorePositionX, cfg.paddingY,
		score.length * font.meta.boundingBox.width * cfg.fontSize,
		(font.meta.boundingBox.height + Math.abs(font.meta.boundingBox.y)) * cfg.fontSize);
	font.write(interfaceCtx, [scorePositionX, textPositionY], score, {size: cfg.fontSize});
}

function updateShips(ships) {
	interfaceCtx.clearRect(shipListPositionX, cfg.paddingY,
		playerCfg.maxLives * (shipCfg.width + 1) * coreCfg.pixelSize, shipCfg.heightPx);

	for (let i = 0; i < ships.length; i += 1) {
		ships[i].show(interfaceCtx, shipListPositionX + i * (shipCfg.width + 1) * coreCfg.pixelSize, cfg.paddingY);
	}
}

export function init(data) {
	font = fontGenerator.create(cfg.font);
	textPositionY = cfg.paddingY + font.meta.boundingBox.height * cfg.fontSize;
	scorePositionX = font.write(interfaceCtx, [cfg.paddingX, textPositionY], str.Score, {size: cfg.fontSize}).width;
	updateScore(data.score);

	shipListPositionX = coreCfg.screenWidth - cfg.paddingX - playerCfg.maxLives * (shipCfg.width + 1) * coreCfg.pixelSize;
	font.write(interfaceCtx, [shipListPositionX, textPositionY], str.Ships, {size: cfg.fontSize, alignment: alignmentConst.right});
	updateShips(data.extraShips);

	pubSub.on(eventConst.scoreUpdate, updateScore);
	pubSub.on(eventConst.shipListUpdate, updateShips);
}

export function destroy() {
	pubSub.off(updateScore);
	pubSub.off(updateShips);
}