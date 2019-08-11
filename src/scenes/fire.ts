import Matrix from '../utils/matrix-display';
import Slideshow from '../layers/slideshow';

import * as fs from 'fs';
import * as path from 'path';

const fire = new Slideshow({ size: { w: 12, h: 12 }, position: { x: 0, y: 0} });
const matrix = new Matrix({ rows: 12, cols: 12, frameRate: 20 });

const dirName = path.join(__dirname, '../images/fire');
fs.
	readdirSync(dirName).
	filter(name => name.endsWith('.rgb'))
	.forEach(imageFileName => {
		fire.addFrameFromRGBData(fs.readFileSync(path.join(dirName, imageFileName)));
	})
;

matrix.play(fire.frame.bind(fire));

export default matrix;
