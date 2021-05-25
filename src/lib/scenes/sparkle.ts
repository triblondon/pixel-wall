import { PixelDataType, RowDataType } from '../matrix-display';
import Scene from '../scene';
export default class Sparkle implements Scene {

	#cols: number;
	#rows: number;

	constructor() {
		this.#cols = 0;
		this.#rows = 0;
	}

	init(rows: number, cols: number): void {
		this.#cols = cols;
		this.#rows = rows;
	}

	frame(timeOffset: number) {
    const newRow = Math.floor(Math.random() * this.#rows);
    const newCol = Math.floor(Math.random() * this.#cols);

		return Array(this.#rows).fill(0).map<RowDataType>(y => {
			return Array(this.#cols).fill(0).map<PixelDataType>(x => {
				return (newRow === y && newCol === x) ? [255, 255, 255, 1] : [30, 30, 30, 1];
			});
		});
	}
}
