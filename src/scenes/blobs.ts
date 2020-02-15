import Matrix from '../utils/matrix-display';
import Compositor from '../utils/compositor';
import Particle, { EASING_INCUBIC, TransitionEffect } from '../layers/particle';
import Circle from '../shapes/circle';

const randomInt = (min: number, max: number) => min + Math.floor(Math.random() * (max - min + 1));

const matrix = new Matrix({ rows: 12, cols: 12, frameRate: 30 });

const compositor = new Compositor({ bbox: { minX:0, minY:0, maxX:(matrix.cols-1), maxY:(matrix.rows-1) }});

const addParticle = () => {
	const rad = randomInt(3, 7);
	const p = new Particle({
		position: { x: randomInt((-1 * rad), (matrix.cols - rad)), y: randomInt((-1 * rad), (matrix.rows - rad)) },
		source: new Circle({ radius: rad, color: [randomInt(50, 255), randomInt(50, 255), randomInt(50, 255), 1], smoothing: 3 }),
		transitions: [
			{start: 0, duration: 1000, effect: TransitionEffect.Fade, from: 0, target: 0.5, easing: EASING_INCUBIC},
			{start: 2500, duration: 6000, effect: TransitionEffect.Fade, target: 0, easing: EASING_INCUBIC},
		],
		loop: false
	});
	compositor.add(p);
}

setInterval(addParticle, 2000);

matrix.play(compositor.frame.bind(compositor));

export default matrix;
