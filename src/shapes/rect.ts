import Shape from './shape';
import { PixelDataType, FrameDataType, RowDataType } from '../utils/matrix-display';

type OptionsType = {
	color?: PixelDataType,
	width: number,
	height: number
}

export default class Rect extends Shape {

	private pixels: FrameDataType;

	constructor(options: OptionsType) {
		super();
		options.color = options.color || [255, 255, 255, 1];

		const row: RowDataType = Array(options.width).fill(undefined).map(() => options.color);
		this.pixels = Array(options.height).fill(undefined).map(() => [...row]);
	}

	get pixelData() { return this.pixels; }

}
