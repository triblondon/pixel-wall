import Compositor from '../compositor';
import Particle, { EASING_INCUBIC, TransitionEffect } from '../layers/particle';
import Rect from '../shapes/rect';
import Scene from '../scene';
import { PixelDataType } from '../matrix-display';

const NUM_PARTICLES = 16;
const WAVE_DURATION = 1000;
const BETWEEN_WAVES = 5000;
const FADE_IN_DURATION = 500;
const FADE_OUT_DURATION = 1000;

const randomInt = (min: number, max: number) => min + Math.floor(Math.random() * (max - min + 1));
export default class PointWave implements Scene {

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
		setInterval(this.doWave, BETWEEN_WAVES);
	}

	doWave() {
		const color: PixelDataType = [randomInt(50, 255), randomInt(50, 255), randomInt(50, 255), 1];
		for (let i=0; i<NUM_PARTICLES; i++) {
			const x = randomInt(0, this.#cols-1);
			const y = randomInt(0, this.#rows-1);
			const fadeOffset = Math.trunc((x / this.#cols) * WAVE_DURATION);
			const p = new Particle({
				position: { x, y },
				source: new Rect({ width: 1, height: 1, color }),
				loop: false,
				transitions: [
					{ start: 0, duration: 0, effect: TransitionEffect.Fade, from: 0, target: 0.01 },
					{ start: fadeOffset, duration: FADE_IN_DURATION, effect: TransitionEffect.Fade, from: 0, target: 1, easing: EASING_INCUBIC},
					{ start: fadeOffset + FADE_IN_DURATION, duration: FADE_OUT_DURATION, effect: TransitionEffect.Fade, target: 0, easing: EASING_INCUBIC},
				],
			});
			this.#compositor?.add(p);
		}
	}

	frame(timeOffset: number) {
		return this.#compositor?.frame(timeOffset) || [];
	}
}
