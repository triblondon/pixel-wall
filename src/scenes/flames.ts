import Matrix from '../utils/matrix-display';
import Compositor from '../utils/compositor';
import Flame from '../layers/flame';

const NUM_FLAMES = 64;
const LEDS_PER_FLAME = 1;

const matrix = new Matrix({ rows: 1, cols: NUM_FLAMES, frameRate: 30 });

const compositor = new Compositor({ bbox: { minX:0, minY:0, maxX:(matrix.cols-1), maxY:(matrix.rows-1) }});

for (var x = 0; x < matrix.cols; x = x + LEDS_PER_FLAME) {
	compositor.add(new Flame({
		position: { x, y: 0 },
		width: LEDS_PER_FLAME
	}));
}

matrix.play(compositor.frame.bind(compositor));

export default matrix;
