import {font as cfg, core as coreCfg} from '../config';
import {fonts, alignment as alignmentConst} from '../const'
import {drawImage, cacheSprite, initCanvas, drawPixel} from '../util'


const sprite = initCanvas(coreCfg.pixelSize, coreCfg.pixelSize),
	fontProto = {
	meta: null,
	glyphs: null,
	write: function(ctx, coords, text, options = {}) {
		let color = options.color || cfg.defaultColor,
			size = options.size || coreCfg.pixelSize,
			alignment = options.alignment || cfg.alignment,
			[x, y] = coords;

		switch (alignment) {
			case alignmentConst.center:
				let lineWidth = 0;
				for (let i = 0; i < text.length; i += 1) {
					lineWidth += this.glyphs[text[i]].dWidth * size
				}
				x -= Math.floor(lineWidth / 2);
				break;
			case alignmentConst.right:
				for (let i = 0; i < text.length; i += 1) {
					x -= this.glyphs[text[i]].dWidth * size
				}
				break;
		}
		for (let i = 0; i < text.length; i += 1) {
			this.writeLetter(ctx, text[i], x, y, color, size);
			x += this.glyphs[text[i]].dWidth * size;
		}
	},
	writeLetter(ctx, letter, x, y, color, size) {
		const style = color + '-' + size;
		if (!this.glyphs[letter].sprites[style]) {
			this.drawLetter(this.glyphs[letter], color, size);
		}
		drawImage(ctx, this.glyphs[letter].sprites[style].ctx,
			[x + this.glyphs[letter].x * size, y + this.glyphs[letter].y * size],
			this.glyphs[letter].sprites[style].coords, [this.meta.boundingBox.width * size, this.meta.boundingBox.height * size]);
	},
	drawLetter(glyph, color, size) {
		if (sprite.canvas.width !== glyph.width * size) {
			sprite.canvas.width = glyph.width * size;
		}
		if (sprite.canvas.height !== glyph.height * size) {
			sprite.canvas.height = glyph.height * size;
		}
		sprite.clearRect(0, 0, glyph.width * size, glyph.height * size);
		for (let i = 0; i < glyph.bitmap.length; i += 1) {
			if (glyph.bitmap[i]) {
				drawPixel(sprite, i % glyph.width * size, Math.floor(i / glyph.width) * size, color, size)
			}
		}
		glyph.sprites[color + '-' + size] = cacheSprite(sprite);
	}
};

export function create(name) {
	const font = Object.create(fontProto);

	font.meta = fonts[name].meta;
	font.glyphs = Object.assign({}, fonts[name].glyphs);
	Object.keys(font.glyphs).forEach(key => {
		let width = font.glyphs[key].width || font.meta.boundingBox.width;
		font.glyphs[key].sprites = {};
		font.glyphs[key].bitmap = font.glyphs[key].bytes
			.map(val => val.toString(2))
			.map(val => '0'.repeat(width - val.length) + val)
			.join('').split('').map(val => parseInt(val, 10));

		font.glyphs[key].width = font.glyphs[key].width || font.meta.boundingBox.width;
		font.glyphs[key].height = font.glyphs[key].height || font.meta.boundingBox.height;
		font.glyphs[key].x = font.glyphs[key].x || font.meta.boundingBox.x;
		font.glyphs[key].y = font.glyphs[key].y || font.meta.boundingBox.y;
		font.glyphs[key].dWidth = font.glyphs[key].dWidth || font.meta.boundingBox.width;
	});

	return font;
}