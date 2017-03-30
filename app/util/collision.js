import {missile as missileCfg, ship as shipCfg, core as coreCfg} from '../config'

export function rectIntersect(aX, aY, aW, aH, bX, bY, bW, bH) {
	return (Math.abs(aX - bX) * 2 < (aW + bW)) && (Math.abs(aY - bY) * 2 < (aH + bH));
}

export function rectIntersectMS(mX, mY, sX, sY) {
	return rectIntersect(
		mX + (missileCfg.width + 2) / 2 * coreCfg.pixelSize, //getting the center, remembering the padding
		mY + (missileCfg.height + 2) / 2 * coreCfg.pixelSize,
		missileCfg.width * coreCfg.pixelSize,
		missileCfg.height * coreCfg.pixelSize,
		sX,
		sY,
		shipCfg.width * coreCfg.pixelSize, //don't register a hit on a border pixel
		shipCfg.height * coreCfg.pixelSize
	)
}

export function pointIntersectMS(mX, mY, sX, sY, player) {
	mX += missileCfg.width / 2 + coreCfg.pixelSize;
	if (player) {
		mY += (missileCfg.height + 1) * coreCfg.pixelSize;
	}
	return (mX - sX <= shipCfg.width * coreCfg.pixelSize) &&
		(mX >= sX) &&
		(mY - sY <= shipCfg.height * coreCfg.pixelSize) &&
		(mY >= sY)
}