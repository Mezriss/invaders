import {interfaceInfoPanelCfg as cfg, coreCfg, playerCfg, shipCfg} from '../conf';
import {eventConst, alignmentConst} from '../const';
import {pubSub} from '../util';
import * as fontGenerator from '../generators/font';
import str from '../str';

let font, scorePositionX, textPositionY, shipListPositionX;

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
	interfaceCtx.clearRect(shipListPositionX, textPositionY - shipCfg.heightPx,
		playerCfg.maxLives * (shipCfg.width + 1) * coreCfg.pixelSize, shipCfg.heightPx);

	for (let i = 0; i < ships.length; i += 1) {
		ships[i].show(interfaceCtx, shipListPositionX + i * (shipCfg.width + 1) * coreCfg.pixelSize, textPositionY - shipCfg.heightPx);
	}
}

export function init(data) {
	font = fontGenerator.create(cfg.font);
	textPositionY = cfg.paddingY + (font.meta.boundingBox.height + font.meta.boundingBox.y) * cfg.fontSize;
	scorePositionX = font.write(interfaceCtx, [cfg.paddingX, textPositionY], str.score, {size: cfg.fontSize}).lineEnd;
	updateScore(data.score);

	shipListPositionX = coreCfg.screenWidth - cfg.paddingX - playerCfg.maxLives * (shipCfg.width + 1) * coreCfg.pixelSize;
	font.write(interfaceCtx, [shipListPositionX, textPositionY], str.ships, {size: cfg.fontSize, alignment: alignmentConst.right});
	updateShips(data.extraShips);

	pubSub.on(eventConst.scoreUpdate, updateScore);
	pubSub.on(eventConst.shipListUpdate, updateShips);
}

export function destroy() {
	pubSub.off(updateScore);
	pubSub.off(updateShips);
}