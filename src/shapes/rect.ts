import Shape from './shape';
import { PixelDataType, FrameDataType, RowDataType } from '../utils/matrix-display';

type OptionsType = {
	color?: PixelDataType,
	width: number,
	height: number
}

export default class Rect extends Shape {

	private pixels: FrameDataType;
	private width: number;
	private height: number;

	constructor(options: OptionsType) {
		super();
		this.width = options.width || 1;
		this.height = options.height || 1;
		this.color = options.color || [255, 255, 255, 1];
	}

	set color(c: PixelDataType) {
		const row: RowDataType = Array(this.width).fill(undefined).map(() => c);
		this.pixels = Array(this.height).fill(undefined).map(() => [...row]);
	}
	get pixelData() { return this.pixels; }

}
