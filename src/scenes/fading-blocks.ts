import Matrix from '../utils/matrix-display';
import Compositor from '../utils/compositor';
import Particle, { EASING_INCUBIC } from '../layers/particle';

const randomInt = (min: number, max: number) => min + Math.floor(Math.random() * (max - min + 1));

const matrix = new Matrix({ rows: 12, cols: 12, frameRate: 30 });

const compositor = new Compositor({ bbox: { minX:0, minY:0, maxX:(matrix.cols-1), maxY:(matrix.rows-1) }});

const addParticle = () => {
	const w = randomInt(2,6);
	const h = randomInt(2,4);
	const p = new Particle({
		position: { x: randomInt(0, (matrix.cols-1)-w), y: randomInt(0, (matrix.rows-1)-h) },
		size: { w, h },
		color: [255, randomInt(90,220), 20, 0],
		transitions: [
			{start: 0, duration: 1000, effect: 'fade', target: 0.7, easing: EASING_INCUBIC},
			{start: 2500, duration: 6000, effect: 'fade', target: 0, easing: EASING_INCUBIC},
		],
		loop: false
	});
	compositor.add(p);
}

setInterval(addParticle, 2000);
//addParticle();

matrix.play(compositor.frame.bind(compositor));

export default matrix;
