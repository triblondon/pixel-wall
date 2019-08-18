import Matrix, { PixelDataType } from '../utils/matrix-display';
import Compositor from '../utils/compositor';
import Particle, { EASING_LINEAR, EASING_INCUBIC } from '../layers/particle';

const NUM_PARTICLES = 7;
const WAVE_DURATION = 1000;
const BETWEEN_WAVES = 5000;
const FADE_IN_DURATION = 500;
const FADE_OUT_DURATION = 1000;

const randomInt = (min: number, max: number) => min + Math.floor(Math.random() * (max - min + 1));

const matrix = new Matrix({ rows: 12, cols: 12, frameRate: 20 });
const compositor = new Compositor({ bbox: { minX:0, minY:0, maxX:(matrix.cols-1), maxY:(matrix.rows-1) }});

const doWave = () => {
	const color: PixelDataType = [randomInt(50, 255), randomInt(50, 255), randomInt(50, 255), 0];
	const prevPoints = [];
	for (let i=0; i<NUM_PARTICLES; i++) {
		const x = randomInt(0, 11);
		const y = randomInt(0, 11);
		const fadeOffset = Math.trunc((x / 11) * WAVE_DURATION);
		const p = new Particle({
			position: { x, y },
			size: { w: 1, h: 1 },
			color: [ ...color ],
			loop: false,
			transitions: [
				{start: fadeOffset, duration: FADE_IN_DURATION, effect: 'fade', target: 0.7, easing: EASING_INCUBIC},
				{start: fadeOffset + FADE_IN_DURATION, duration: FADE_OUT_DURATION, effect: 'fade', target: 0, easing: EASING_INCUBIC},
			],
		});
		compositor.add(p);
	}
	setTimeout(doWave, BETWEEN_WAVES);
}

doWave();

matrix.play(compositor.frame.bind(compositor));

export default matrix;
