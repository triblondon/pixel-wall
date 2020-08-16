/**
 * Hacky experiment to get the scenes to play on an espurino.
 */

const neopixel = require('neopixel');
const scene = require('../lib/scenes/flames');

let pixelData = new Uint8ClampedArray((scene.rows * scene.cols * 3));

export const render = (frameData) => {
	frameData.forEach((row, rowIdx) => {
		row.forEach((pixel, colIdx) => {
			const pixelIdx = ((rowIdx * row.length) + colIdx) * 3;
			pixelData[pixelIdx] = pixel[0];
			pixelData[pixelIdx+1] = pixel[1];
			pixelData[pixelIdx+2] = pixel[2];
		})
	})
	neopixel.write(B5, pixelData);
}
