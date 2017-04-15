const path = require('path'),
	fs = require('fs'),
	BDF = require('bdf'),
	font = new BDF(),
	out = {
		meta: {},
		glyphs: {}
	};

font.loadSync(path.join(__dirname, process.argv[2]));

out.meta.name = font.meta.name;
out.meta.points = font.meta.size.points;
out.meta.properties = font.meta.properties;
out.meta.boundingBox = font.meta.boundingBox;

for (let i = 32; i <= 126; i += 1) {
	if (font.glyphs[i]) {
		let char = font.glyphs[i].char;
		out.glyphs[char] = {};
		out.glyphs[char].bytes = font.glyphs[i].bytes;
		if (out.meta.boundingBox.width !== font.glyphs[i].boundingBox.width) {
			out.glyphs[char].width = font.glyphs[i].boundingBox.width;
		}
		if (out.meta.boundingBox.height !== font.glyphs[i].boundingBox.height) {
			out.glyphs[char].height = font.glyphs[i].boundingBox.height;
		}
		if (out.meta.boundingBox.x !== font.glyphs[i].boundingBox.x) {
			out.glyphs[char].x = font.glyphs[i].boundingBox.x;
		}
		if (out.meta.boundingBox.y !== font.glyphs[i].boundingBox.y) {
			out.glyphs[char].y = font.glyphs[i].boundingBox.y;
		}
		if (out.meta.boundingBox.width !== font.glyphs[i].deviceWidthX) {
			out.glyphs[char].dWidth = font.glyphs[i].deviceWidthX;
		}
	}
}
fs.writeFileSync(process.argv[2] + '.js', 'export const font = ' + JSON.stringify(out, null, '\t') + ';');
console.info(font.glyphs[process.argv[3]]);
