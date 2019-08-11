import LEDMatrix from './utils/led-matrix';
import signalHandler from './utils/signal-handler';
import Slideshow from './layers/slideshow';

import * as fs from 'fs';
import * as path from 'path';

signalHandler.on(['int', 'term'], () => leds.setAll(0,0,0).render());

const leds = new LEDMatrix({ rows: 12, cols: 12, maxBright: 1, frameRate: 20 });
const fire = new Slideshow({ size: { w: 12, h: 12 }, position: { x: 0, y: 0} });

const dirName = path.join(__dirname, '../images/fire');
fs.
	readdirSync(dirName).
	filter(name => name.endsWith('.rgb'))
	.forEach(imageFileName => {
		fire.addFrameFromRGBData(fs.readFileSync(path.join(dirName, imageFileName)));
	})
;

leds.play(() => fire.frame());
