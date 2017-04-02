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
			pubSub.pub(eventConst.levelEntityDestroyed, eventConst.effect, this);
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

export function create(target, source) {
	const explosion = Object.create(explosionProto);
	explosion.color = target.color;

	if (source) {
		[explosion.x, explosion.y] = source.getCenter();
	} else {
		[explosion.x, explosion.y] = target.getCenter();
	}

	explosion.particles = [];

	for (let i = 0; i < shipCfg.height; i += 1) {
		for (let j = 0; j < shipCfg.width; j += 1) {
			if (target.blueprint[i * shipCfg.width + j]) {
				explosion.particles.push({
					x: target.x + (target.formation ? target.formation.x : 0) + (j + 0.5) *  coreCfg.pixelSize - explosion.x,
					y: target.y + (target.formation ? target.formation.y : 0) + (i + 0.5) *  coreCfg.pixelSize - explosion.y
				});
			}
		}
	}

	return explosion;
}