import Matrix from '../utils/matrix-display';
import Compositor from '../utils/compositor';
import Particle, { EASING_INCUBIC } from '../layers/particle';

const randomInt = (min: number, max: number) => min + Math.floor(Math.random() * (max - min + 1));

const matrix = new Matrix({ rows: 12, cols: 12, frameRate: 30 });



const compositor = new Compositor({ bbox: { minX:0, minY:0, maxX:(matrix.cols-1), maxY:(matrix.rows-1) }});

const addParticle = () => {
	const w = randomInt(2,3);
	const h = randomInt(2,3);
	const p = new Particle({
		position: { x: randomInt(0, (matrix.cols-1)-w), y: randomInt(0, (matrix.rows-1)-h) },
		size: { w, h },
		color: [randomInt(120,170), 160, 255, 0],
		transitions: [
			{start: 0, duration: 1000, effect: 'fade', target: 1, easing: EASING_INCUBIC},
			{start: 1500, duration: 2000, effect: 'fade', target: 0, easing: EASING_INCUBIC},
		],
		loop: false
	});
	compositor.add(p);
}

setInterval(addParticle, 3000);


matrix.play(compositor.frame.bind(compositor));

export default matrix;
