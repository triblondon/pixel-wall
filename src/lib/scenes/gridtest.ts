import { PixelDataType, RowDataType } from '../matrix-display';
import Scene from '../scene';
export default class GridTest implements Scene {

	#cols: number;
	#rows: number;
	#curCol: number;
	#curRow: number;

	constructor() {
		this.#cols = 0;
		this.#rows = 0;
		this.#curCol = 0;
		this.#curRow = 0;
	}

	init(rows: number, cols: number): void {
		this.#cols = cols;
		this.#rows = rows;
	}

	frame(timeOffset: number) {
		this.#curCol++;
		if (this.#curCol == this.#cols) {
			this.#curCol = 0;
			this.#curRow++;
		}
		if (this.#curRow == this.#rows) {
			this.#curCol = this.#curRow = 0;
		}
		return Array(this.#rows).fill(0).map<RowDataType>(y => {
			return Array(this.#cols).fill(0).map<PixelDataType>(x => {
				const shade = (this.#curCol === x && this.#curRow === y) ? 255 : (this.#curCol === x || this.#curRow === y) ? 120 : 0;
				return [shade, shade, shade, 1];
			});
		});
	}
}
