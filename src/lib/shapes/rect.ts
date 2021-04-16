import Shape from '../shape';
import { PixelDataType, FrameDataType, RowDataType } from '../matrix-display';

type OptionsType = {
	color?: PixelDataType,
	width: number,
	height: number
}

export default class Rect extends Shape {

	#pixels: FrameDataType;
	#width: number;
	#height: number;
	#color: PixelDataType;

	constructor(options: OptionsType) {
		super();
		this.#width = options.width || 1;
		this.#height = options.height || 1;
		this.#color = options.color || [255, 255, 255, 1];
		this.#pixels = [];
		this.init();
	}
	set color(c: PixelDataType) {
		this.#color = c;
		this.init();
	}

	init() {
		const row: RowDataType = Array(this.#width).fill(undefined).map(() => this.#color);
		this.#pixels = Array(this.#height).fill(undefined).map(() => [...row]);
	}

	get pixelData() { return this.#pixels; }

}
