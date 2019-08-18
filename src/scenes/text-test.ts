import Matrix from '../utils/matrix-display';
import Compositor from '../utils/compositor';
import Text from '../layers/text';

const matrix = new Matrix({ rows: 12, cols: 12, frameRate: 20 });
const compositor = new Compositor({ bbox: { minX:0, minY:0, maxX:(matrix.cols-1), maxY:(matrix.rows-1) }});

compositor.add(new Text({
	position: { x: 12, y: 3 },
	color: [152, 210, 255, 1],
	speed: 1,
	loop: true,
	text: 'BONSOIR SARAH!'
}));

matrix.play(compositor.frame.bind(compositor));

export default matrix;
