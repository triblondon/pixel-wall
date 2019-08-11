const ws281x = require('rpi-ws281x-native');
import { FrameDataType } from './matrix-display';

if (process && process.getuid() !== 0) {
	console.error('Must run as root to use the WS2812 interface');
	process.exit(1);
}

// Generate color value from RGB
const color = (r: number, g: number, b: number): number => ((r & 0xff) << 16) + ((g & 0xff) << 8) + (b & 0xff);

// Map 2D grid position to 1D index in a snake-wired grid
const coordsToIndex = (x: number, y: number, cols: number): number => (cols * y) + ((y % 2) ? x : (cols - 1) - x);

let pixelData: Uint32Array;

export const init = (rows:number, cols:number, brightness: number): void => {
	ws281x.init(rows * cols);
	ws281x.setBrightness(Math.round(brightness * 255));
}

export const render = (frameData: FrameDataType) => {
	const cols = frameData[0].length;
	frameData.forEach((row, rowIdx) => {
		row.forEach((pixel, colIdx) => {
			pixelData[coordsToIndex(colIdx, rowIdx, cols)] = color(pixel[0], pixel[1], pixel[2]);
		})
	})
	ws281x.render(pixelData);
}
