
import Compositor from '../compositor';
import Text from '../layers/text';
import Scene from '../scene';

const randomInt = (min: number, max: number) => min + Math.floor(Math.random() * (max - min + 1));
export default class TextTest implements Scene {

	#compositor: Compositor | undefined;
	#cols: number;
	#rows: number;

	constructor() {
		this.#cols = 0;
		this.#rows = 0;
	}

	init(rows: number, cols: number): void {
		this.#cols = cols;
		this.#rows = rows;
		this.#compositor = new Compositor({ bbox: { minX:0, minY:0, maxX:(cols-1), maxY:(rows-1) }});
		this.#compositor.add(new Text({
			position: { x: this.#cols, y: 2 },
			color: [152, 210, 255, 1],
			speed: 1,
			loop: true,
			text: 'A celebration of Europe'
		}));
	}

	frame(timeOffset: number) {
		return this.#compositor?.frame(timeOffset) || [];
	}
}
