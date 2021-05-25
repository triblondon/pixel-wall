import Scene from '../scene';
import Slideshow from '../layers/slideshow';

import images from '../../utils/fire.json';
export default class Fire implements Scene {

  #slideshow: Slideshow;

	constructor() {
    this.#slideshow = new Slideshow({ size: { w: 12, h: 12 }, position: { x: 0, y: 0} });
    images.forEach(imageData => this.#slideshow.addFrameFromRGBData(Buffer.from(imageData, 'base64')));
	}

	init(rows: number, cols: number): void {
    if (rows !== 12 && cols !== 12) throw new Error("Scene requires a 12x12 matrix");
	}

	frame() {
		return this.#slideshow.frame()
	}
}
