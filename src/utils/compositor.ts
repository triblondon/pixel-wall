import Layer from '../layers/layer';
import { PixelDataType, FrameDataType } from './matrix-display'

type OptionsType = { bgColor?: PixelDataType, bbox: BoundingBoxType }
type BoundingBoxType = { minX: number, minY: number, maxX: number, maxY: number };

const mix = (baseColor: PixelDataType, newColor: PixelDataType) => {
	let [ baseRed, baseGreen, baseBlue ] = baseColor;
	let [ newRed, newGreen, newBlue, alpha ] = newColor;
	if (!alpha) alpha = 1;
	if (alpha > 1) alpha /= 255;
	return [
		Math.trunc((newRed * alpha) + (baseRed * (1 - alpha))),
		Math.trunc((newGreen * alpha) + (baseGreen * (1 - alpha))),
		Math.trunc((newBlue * alpha) + (baseBlue * (1 - alpha)))
	];
}

export default class Compositor {

	layers: Layer[]
	bgColor: PixelDataType
	bbox: BoundingBoxType

	constructor(options?: OptionsType) {
		this.layers = [];
		this.bgColor = (options && options.bgColor) || [0,0,0,0];
		this.bbox = options.bbox;
	}

	add(layerObj: Layer) {
		if (!(layerObj instanceof Layer)) {
			throw new Error(layerObj + ' is not a Layer');
		}
		this.layers.push(layerObj);
	}

	frame(timeOffset: number) {
		const numCols = this.bbox.maxX - this.bbox.minX + 1;
		const numRows = this.bbox.maxY - this.bbox.minY + 1;
		this.layers = this.layers.filter(l => l.isActive());
		return this.layers
			.reduce((out, layerObj, idx) => {
				const layerFrameData = layerObj.frame(timeOffset);
				if (!layerFrameData) return out;
				layerFrameData.forEach((row, rowOffset) => {
					row.forEach((pixel, colOffset) => {
						const x = layerObj.position.x + colOffset - this.bbox.minX;
						const y = layerObj.position.y + rowOffset - this.bbox.minY;
						if (x >= this.bbox.minX && x <= this.bbox.maxX && y >= this.bbox.minY && y <= this.bbox.maxY) {
							out[rowOffset][colOffset] = mix(out[rowOffset][colOffset] || this.bgColor, pixel);
						}
					});
				});
				return out;
			}, Array(numRows).fill(undefined).map(row => Array(numCols).fill(this.bgColor)))
		;
	}
}
