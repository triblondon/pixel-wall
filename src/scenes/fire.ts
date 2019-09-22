import Matrix from '../utils/matrix-display';
import Slideshow from '../layers/slideshow';

import images from '../fire.json';

const fire = new Slideshow({ size: { w: 12, h: 12 }, position: { x: 0, y: 0} });
const matrix = new Matrix({ rows: 12, cols: 12, frameRate: 20 });

images.forEach(imageData => fire.addFrameFromRGBData(Buffer.from(imageData, 'base64')));

matrix.play(fire.frame.bind(fire));

export default matrix;
