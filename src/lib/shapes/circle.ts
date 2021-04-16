// http://groups.csail.mit.edu/graphics/classes/6.837/F98/Lecture6/circle.html
// https://stackoverflow.com/questions/10878209/midpoint-circle-algorithm-for-filled-circles

import Shape from '../shape';
import { PixelDataType, FrameDataType, RowDataType } from '../matrix-display';

type OptionsType = {
	color?: PixelDataType,
	radius: number,
	smoothing?: number
}

export default class Circle extends Shape {

	#pixels: FrameDataType;

	constructor(options: OptionsType) {
		super();
		const color = options.color || [ 255, 255, 255, 1];
		const radius = options.radius || 3;
		const smoothing = options.smoothing || 1;

		const plotRadius = radius * smoothing
		const row: RowDataType = Array((plotRadius * 2) + smoothing).fill(undefined).map(() => [255,0,0,0]);
		const pixels = Array((plotRadius * 2) + smoothing).fill(undefined).map(() => [...row]);

		const xCenter = plotRadius;
		const yCenter = plotRadius;
		const rSq = plotRadius * plotRadius;

		for (let x2 = (xCenter - plotRadius); x2 <= (xCenter + plotRadius); x2++) {
			pixels[yCenter][x2] = color;
		}
		pixels[yCenter + plotRadius][xCenter] = color;
		pixels[yCenter - plotRadius][xCenter] = color;

		let x = 1;
		let y = Math.floor(Math.sqrt(rSq - 1) + 0.5);
		while (x < y) {
			for (let x2 = (xCenter - x); x2 <= (xCenter + x); x2++) {
				pixels[yCenter + y][x2] = color;
				pixels[yCenter - y][x2] = color;
			}
			for (let x2 = (xCenter - y); x2 <= (xCenter + y); x2++) {
				pixels[yCenter + x][x2] = color;
				pixels[yCenter - x][x2] = color;
			}
			x++;
			y = Math.floor(Math.sqrt(rSq - (x * x)) + 0.5);
		}
		if (x == y) {
			for (let x2 = (xCenter - x); x2 <= (xCenter + x); x2++) {
				pixels[yCenter + y][x2] = color;
				pixels[yCenter - y][x2] = color;
			}
		}

		// Downsample
		if (smoothing === 1) {
			this.#pixels = pixels;
		} else {
			this.#pixels = Array((radius * 2) + 1).fill(undefined).map((_, y) =>
				Array((radius * 2) + 1).fill(undefined).map((_, x) => {
					let groupSum: PixelDataType = [0,0,0,0];
					for (let s = 0; s < (smoothing * smoothing); s++) {
						const mappedY = (y * smoothing) + Math.floor(s / smoothing);
						const mappedX = (x * smoothing) + (s % smoothing);
						groupSum[0] += pixels[mappedY][mappedX][0] * pixels[mappedY][mappedX][3];
						groupSum[1] += pixels[mappedY][mappedX][1] * pixels[mappedY][mappedX][3];
						groupSum[2] += pixels[mappedY][mappedX][2] * pixels[mappedY][mappedX][3];
						groupSum[3] += pixels[mappedY][mappedX][3];
					}
					groupSum[0] /= (smoothing * smoothing);
					groupSum[1] /= (smoothing * smoothing);
					groupSum[2] /= (smoothing * smoothing);
					groupSum[3] /= (smoothing * smoothing);
					return groupSum;
				})
			);
		}
	}

	get pixelData() { return this.#pixels; }
}
