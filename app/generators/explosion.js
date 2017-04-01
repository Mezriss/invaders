import {missile as missileConst, event as eventConst, conf as confConst} from '../const';
import {explosion as cfg, ship as shipCfg, missile as missileCfg, core as coreCfg} from '../config'
import {drawPixel, drawBeveledPixel, pubSub, hexToRgba} from '../util';

const explosionProto = {
	particles: null,
	color: null,
	opacity: 100,
	elapsedTime: 0,
	spread: 1,
	x: null,
	y: null,
	move: function(dt) {
		this.elapsedTime += dt;
		this.spread = 1 + (cfg.spread - 1) * this.elapsedTime / cfg.duration;
		this.alpha = 100 - (100 - cfg.minOpacity) * this.elapsedTime / cfg.duration;
		if (this.elapsedTime > cfg.duration) {
			pubSub.pub(eventConst.explosionDestroyed, this);
		}
	},
	show: function(ctx) {
		this.particles.forEach(particle => {
			(shipCfg.drawStyle === confConst.beveled ? drawBeveledPixel : drawPixel)(ctx,
				particle.x * this.spread - coreCfg.pixelSize / 2 + this.x,
				particle.y * this.spread - coreCfg.pixelSize / 2 + this.y,
				hexToRgba(this.color, this.alpha));
		})
	}
};

export function create(ship, missile) {
	const explosion = Object.create(explosionProto);
	explosion.color = ship.color;

	if (ship.missile && ship.missile.status !== missileConst.launched) {
		explosion.x = ship.x + shipCfg.widthPx / 2;
		explosion.y = ship.y + shipCfg.heightPx / 2;
		if (ship.formation) {
			explosion.x += ship.formation.x;
			explosion.y += ship.formation.y;
		}
	} else {
		explosion.x = missile.x + missileCfg.widthPx / 2;
		explosion.y = missile.y + missileCfg.heightPx / 2 + (ship.player ? missileCfg.heightPx : 0);
	}

	explosion.particles = [];

	for (let i = 0; i < shipCfg.height; i += 1) {
		for (let j = 0; j < shipCfg.width; j += 1) {
			if (ship.blueprint[i * shipCfg.width + j]) {
				explosion.particles.push({
					x: ship.x + (ship.formation ? ship.formation.x : 0) + (j + 0.5) *  coreCfg.pixelSize - explosion.x,
					y: ship.y + (ship.formation ? ship.formation.y : 0) + (i + 0.5) *  coreCfg.pixelSize - explosion.y
				});
			}
		}
	}

	return explosion;
}