const LEDMatrix = require('./utils/led-matrix');
const signalHandler = require('./utils/signal-handler');
const Slideshow = require('./layers/slideshow');
const fs = require('fs');
const path = require('path');

const leds = new LEDMatrix({ maxBright: 1, frameRate: 20 });

signalHandler.on(['int', 'term'], () => leds.setAll(0,0,0).render());


const dirName = path.join(__dirname, 'images/fire');

console.log('Loading image frames...');
const images = fs.
	readdirSync(dirName)
	.filter(name => name.endsWith('.rgb'))
	.map(imageFileName => fs.readFileSync(path.join(dirName, imageFileName)))
;
console.log('Loaded ', images.length);

console.log('Building stack...');
const fire = new Slideshow({
	frames: images.map(frameBuf => {
		return [...frameBuf].reduce((acc, colorVal, idx) => {
			if (idx % 3 === 0) acc.push([]);
			acc[acc.length - 1][idx % 3] = colorVal;
			return acc;
		}, [])
	}),
	size: { w: 12, h: 12 }
})

// Free the memory
images = null;

leds.play(() => fire.frame());

console.log('Started effect. Press <ctrl>+C to exit.');
