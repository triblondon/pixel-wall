import Matrix from '../utils/matrix-display';
import Compositor from '../utils/compositor';
import Particle, { EASING_LINEAR } from '../layers/particle';

const randomInt = (min: number, max: number) => min + Math.floor(Math.random() * (max - min + 1));

const matrix = new Matrix({ rows: 12, cols: 12, frameRate: 30 });
const compositor = new Compositor({ bbox: { minX:0, minY:0, maxX:(matrix.cols-1), maxY:(matrix.rows-1) }});

const addParticle = () => {
	const len = randomInt(1,20) === 1 ? randomInt(5,7) : randomInt(2,4);
	const p = new Particle({
		position: { x: randomInt(0, 11), y: 0-len },
		size: { w: 1, h: len },
		color: [255,255,255,0.4],
		loop: false,
		transitions: [
			{start: 0, duration: (len * 100), effect: 'moveY', target: 12, easing: EASING_LINEAR},
		]
	});
	compositor.add(p);
}
setInterval(addParticle, 50);


matrix.play(compositor.frame.bind(compositor));

export default matrix;
