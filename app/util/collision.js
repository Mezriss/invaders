import {missile as missileCfg, ship as shipCfg} from '../conf';

export function rectIntersect(mX, mY, sX, sY) {
	return !(
		mX > sX + shipCfg.widthPx ||
		mY > sY + shipCfg.heightPx ||
		mX < sX - missileCfg.widthPx ||
		mY < sY - missileCfg.heightPx
	);
}

export function pointIntersect(mX, mY, sX, sY, player) {
	mX += missileCfg.widthPx / 2;
	if (player) {
		mY += missileCfg.heightPx;
	}
	return (mX - sX <= shipCfg.widthPx) &&
		(mX >= sX) &&
		(mY - sY <= shipCfg.heightPx) &&
		(mY >= sY);
}