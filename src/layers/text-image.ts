/*import Layer, { LayerOptionsType } from './layer.js';
import { PixelDataType, FrameDataType } from '../utils/matrix-display.js';
import * as gm from 'gm';

type OptionsType = LayerOptionsType & {
	text: string,
	color?: PixelDataType,
	speed: number,
	loop?: boolean
}

const TEXT_CANVAS_WIDTH = 300;

class TextImage extends Layer {

	private text: string;
	private imageData: FrameDataType;
	private dirty: boolean;

	constructor(options: OptionsType) {
		super(options.position.x, options.position.y);
		this.text = '';
		this.imageData = null;
		this.dirty = false;
	}
	async setText(str: string) {
		this.text = str;
		await new Promise(resolve => {
			gm(TEXT_CANVAS_WIDTH, this.size.h, "#000000ff").fill("#ffffff").font('Arial.ttf', 9).drawText(0, 0, str, "NorthWest").toBuffer('RGB', (err, buffer) => {
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
*/
