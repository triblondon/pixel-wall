import { PixelDataType, RowDataType } from '../matrix-display';
import Scene from '../scene';

const SEQ_LEN = 300;

// Get color for a position on the pride rainbow (fraction of 1)
const rainbowColourForPos = (pos: number): PixelDataType => {
	const cols = [ [231,0,0], [255,140,0], [255,239,0], [0,129,31], [0,68,255], [118,0,137], [118,0,137], [0,68,255], [0,129,31], [255,239,0], [255,140,0], [231,0,0] ];
	const from = pos ? Math.floor((cols.length-1) * (pos % 1)) : 0;
	const to = from + 1;
	const offset = ((cols.length - 1) * (pos % 1)) % 1;
  const color: PixelDataType = [
		cols[from][0] + Math.trunc((cols[to][0] - cols[from][0]) * offset),
		cols[from][1] + Math.trunc((cols[to][1] - cols[from][1]) * offset),
		cols[from][2] + Math.trunc((cols[to][2] - cols[from][2]) * offset),
		1
	];
	return color;
}
export default class Rainbow implements Scene {

	#cols: number;
	#rows: number;
	#curFrame: number;

	constructor() {
		this.#cols = 0;
		this.#rows = 0;
		this.#curFrame = 0;
	}

	init(rows: number, cols: number): void {
		this.#cols = cols;
		this.#rows = rows;
	}

	frame(timeOffset: number) {
		this.#curFrame++;

		if (this.#curFrame > SEQ_LEN) this.#curFrame = 1;
		const offset = this.#curFrame / SEQ_LEN;

		return Array(this.#rows).fill(0).map<RowDataType>(y => {
			return Array(this.#cols).fill(0).map<PixelDataType>(x => {
				return rainbowColourForPos(offset + ((x / this.#rows)/2));
			});
		});
	}
}
