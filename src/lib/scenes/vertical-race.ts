import Compositor from '../compositor';
import Particle, { EASING_LINEAR, TransitionEffect } from '../layers/particle';
import Rect from '../shapes/rect';
import Scene from '../scene';

const randomInt = (min: number, max: number) => min + Math.floor(Math.random() * (max - min + 1));
export default class VerticalRace implements Scene {

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
		setInterval(this.addParticle, 40);
	}

	addParticle() {
		const len = randomInt(2,20) === 1 ? randomInt(3,6) : randomInt(1,2);
		const p = new Particle({
			position: { x: randomInt(0, this.#cols), y: 0-len },
			source: new Rect({ width: 1, height: len, color: [255,255,255,0.2] }),
			loop: false,
			transitions: [
				{start: 0, duration: ((len * 300) - 200), effect: TransitionEffect.MoveY, target: this.#rows, easing: EASING_LINEAR },
			]
		});
		this.#compositor?.add(p);
	}

	frame(timeOffset: number) {
		return this.#compositor?.frame(timeOffset) || [];
	}
}
