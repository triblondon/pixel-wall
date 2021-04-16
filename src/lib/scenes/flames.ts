import Compositor from '../compositor';
import Flame from '../layers/flame';
import Scene from '../scene';

type OptionsType = {
	ledsPerFlame?: number;
	initialState?: 'off' | 'on';
}

const normalRandom = (v: number) => {
	v = Math.max(v, 1);
	let r = 0;
	for (let i = v; i > 0; i--) {
		r += Math.random();
	}
	return r / v;
}

export default class FlamesScene implements Scene {

	#ledsPerFlame: number;
	#initialState: 'off' | 'on';
	#compositor: Compositor | undefined;

	constructor(options: OptionsType = {}) {
		this.#ledsPerFlame = options.ledsPerFlame || 1;
		this.#initialState = options.initialState || 'on';
	}

	init(rows: number, cols: number): void {
		this.#compositor = new Compositor({ bbox: { minX:0, minY:0, maxX:(cols-1), maxY:(rows-1) }});

		for (var x = 0; x < cols; x = x + this.#ledsPerFlame) {
			const f = new Flame({
				position: { x, y: 0 },
				width: this.#ledsPerFlame
			});
			f.setState(this.#initialState === 'off' ? 'off' : 'on');
			this.#compositor.add(f);
		}
	}

	setState(newState: string, options: ({ duration?: number, variance?: number}) = {}) {
		if (this.#compositor) {
			this.#compositor.layers.forEach(f => {
				if (f instanceof Flame) {
					const delay = Math.round(normalRandom(options.variance || 0) * (options.duration || 5000));
					f.setState(newState, delay);
				}
			});
		}
	}

	frame(timeOffset: number) {
		if (!this.#compositor) return [];
		//console.log(this.#compositor.layers.map(f => String((f as Flame).mode).substr(0, 1).toUpperCase()).join(''));
		return (this.#compositor) ? this.#compositor.frame(timeOffset) : [];
	}
}