import Matrix from '../utils/matrix-display';
import Compositor from '../utils/compositor';
import Particle, { EASING_INCUBIC, TransitionEffect } from '../layers/particle';
import Circle from '../shapes/circle';

const randomInt = (min: number, max: number) => min + Math.floor(Math.random() * (max - min + 1));

const matrix = new Matrix({ rows: 25, cols: 60, frameRate: 30 });

const compositor = new Compositor({ bbox: { minX:0, minY:0, maxX:(matrix.cols-1), maxY:(matrix.rows-1) }});

const addParticle = () => {
	const p = new Particle({
		position: { x: randomInt(0, matrix.cols), y: randomInt(0,matrix.rows) },
		source: new Circle({ radius: randomInt(5,10), color: [randomInt(50, 255), randomInt(50, 255), randomInt(50, 255), 1], smoothing: 3 }),
		transitions: [
			{start: 0, duration: 1000, effect: TransitionEffect.Fade, from: 0, target: 0.7, easing: EASING_INCUBIC},
			{start: 2500, duration: 6000, effect: TransitionEffect.Fade, target: 0, easing: EASING_INCUBIC},
		],
		loop: false
	});
	compositor.add(p);
}

setInterval(addParticle, 500);
//addParticle();

matrix.play(compositor.frame.bind(compositor));

export default matrix;
