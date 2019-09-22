import Matrix, { PixelDataType } from '../utils/matrix-display';
import Compositor from '../utils/compositor';
import Particle, { EASING_LINEAR, EASING_INCUBIC, TransitionEffect } from '../layers/particle';
import Rect from '../shapes/rect';

const NUM_PARTICLES = 16;
const WAVE_DURATION = 1000;
const BETWEEN_WAVES = 5000;
const FADE_IN_DURATION = 500;
const FADE_OUT_DURATION = 1000;

const randomInt = (min: number, max: number) => min + Math.floor(Math.random() * (max - min + 1));

const matrix = new Matrix({ rows: 12, cols: 12, frameRate: 20 });
const compositor = new Compositor({ bbox: { minX:0, minY:0, maxX:(matrix.cols-1), maxY:(matrix.rows-1) }});

const doWave = () => {
	const color: PixelDataType = [randomInt(50, 255), randomInt(50, 255), randomInt(50, 255), 1];
	for (let i=0; i<NUM_PARTICLES; i++) {
		const x = randomInt(0, matrix.cols-1);
		const y = randomInt(0, matrix.rows-1);
		const fadeOffset = Math.trunc((x / matrix.cols) * WAVE_DURATION);
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
		compositor.add(p);
	}
	setTimeout(doWave, BETWEEN_WAVES);
}

doWave();

matrix.play(compositor.frame.bind(compositor));

export default matrix;
