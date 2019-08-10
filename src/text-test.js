const LEDMatrix = require('./utils/led-matrix');
const signalHandler = require('./utils/signal-handler');
const Compositor = require('./utils/compositor');
const Text = require('./layers/text');

const leds = new LEDMatrix({ maxBright: 0.5, frameRate: 15 });

signalHandler.on(['int', 'term'], () => leds.setAll(0,0,0).render());

(async () => {
	const textLayer = new Text({ x: 12, y: 3, color: [0, 50, 255], speed: 1, loop: true });
	await textLayer.setText('HI CHEN!');

	const compositor = new Compositor();
	compositor.add(textLayer);

	leds.play(() => compositor.frame(0,0,12,12));

	console.log('Started effect. Press <ctrl>+C to exit.');
})();
