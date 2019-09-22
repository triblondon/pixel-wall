import Matrix from '../utils/matrix-display';
import Compositor from '../utils/compositor';
import Text from '../layers/text';

const matrix = new Matrix({ rows: 12, cols: 12, frameRate: 30 });
const compositor = new Compositor({ bbox: { minX:0, minY:0, maxX:(matrix.cols-1), maxY:(matrix.rows-1) }});

compositor.add(new Text({
	position: { x: matrix.cols, y: 2 },
	color: [152, 210, 255, 1],
	speed: 1,
	loop: true,
	text: 'Hello world!'
}));
/*
compositor.add(new Text({
	position: { x: matrix.cols, y: 10 },
	color: [152, 255, 100, 1],
	speed: 0.5,
	loop: true,
	text: 'THIS IS THE PROPOSED SIZE OF THE PRODUCTION MATRIX'
}));
compositor.add(new Text({
	position: { x: matrix.cols, y: 18 },
	color: [255, 100, 100, 1],
	speed: 1,
	loop: true,
	text: 'WE CAN FIT THREE LINES OF TEXT'
}));
*/

matrix.play(compositor.frame.bind(compositor));

export default matrix;
