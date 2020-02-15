import Matrix from '../utils/matrix-display';
import Compositor from '../utils/compositor';
import Flame from '../layers/flame';

const matrix = new Matrix({ rows: 1, cols: 20, frameRate: 30 });

const compositor = new Compositor({ bbox: { minX:0, minY:0, maxX:(matrix.cols-1), maxY:(matrix.rows-1) }});

for (var x = 0; x < matrix.cols; x = x + 2) {
	compositor.add(new Flame({
		position: { x, y: 0 },
		width: 2
	}));
}

matrix.play(compositor.frame.bind(compositor));

export default matrix;
