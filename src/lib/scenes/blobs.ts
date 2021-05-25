import Compositor from '../compositor';
import Particle, { EASING_INCUBIC, TransitionEffect } from '../layers/particle';
import Circle from '../shapes/circle';
import Scene from '../scene';

const randomInt = (min: number, max: number) => min + Math.floor(Math.random() * (max - min + 1));
export default class Blobs implements Scene {

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
		setInterval(this.addParticle, 2000);
	}

	addParticle() {
		const rad = randomInt(3, 7);
		const p = new Particle({
			position: { x: randomInt((-1 * rad), (this.#cols - rad)), y: randomInt((-1 * rad), (this.#rows - rad)) },
			source: new Circle({ radius: rad, color: [randomInt(50, 255), randomInt(50, 255), randomInt(50, 255), 1], smoothing: 3 }),
			transitions: [
				{start: 0, duration: 1000, effect: TransitionEffect.Fade, from: 0, target: 0.5, easing: EASING_INCUBIC},
				{start: 2500, duration: 6000, effect: TransitionEffect.Fade, target: 0, easing: EASING_INCUBIC},
			],
			loop: false
		});
		this.#compositor?.add(p);
	}

	frame(timeOffset: number) {
		return this.#compositor?.frame(timeOffset) || [];
	}
}
