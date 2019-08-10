const Layer = require('./layer');
const gm = require('gm').subClass({imageMagick: true});

const path = require('path');

const TEXT_CANVAS_WIDTH = 12;

class TextImage extends Layer {
	constructor(x, y, w, h) {
		super(x, y, w, h);
		this.active = true;
		this.text = '';
		this.imageData = null;
		this.dirty = false;
	}
	async setText(str) {
		this.text = str;
		await new Promise(resolve => {
			gm(TEXT_CANVAS_WIDTH, this.h, "#000000ff").fill("#ffffff").font('Arial.ttf', 9).drawText(0, 0, "Hi Chen!", "NorthWest").toBuffer('RGB', (err, buffer) => {
				console.log(err, buffer.toString('hex'));
				this.imageData = [...buffer].reduce((acc, colorVal, idx) => {
					if (idx % 3 === 0) acc.push([]);
					acc[acc.length - 1][idx % 3] = colorVal;
					return acc;
				}, []);
				this.dirty = true;
				resolve();
			})
		});
	}
	frame() {
		if (this.dirty) {
			return this.imageData;
		}
	}
}

module.exports = TextImage;
