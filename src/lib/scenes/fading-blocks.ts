import Compositor from '../compositor';
import Particle, { EASING_INCUBIC, TransitionEffect } from '../layers/particle';
import Rect from '../shapes/rect';
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
		const w = randomInt(2,6);
		const h = randomInt(2,4);
		const p = new Particle({
			position: { x: randomInt(0, (this.#cols-1)-w), y: randomInt(0, (this.#rows-1)-h) },
			source: new Rect({ width: w, height: h, color: [255, randomInt(90,220), 20, 1] }),
			transitions: [
				{start: 0, duration: 1000, effect: TransitionEffect.Fade, from: 0, target: 0.7, easing: EASING_INCUBIC},
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
