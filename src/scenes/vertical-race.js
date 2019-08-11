const LEDMatrix = require('./led-matrix');
const signalHandler = require('./signal-handler');
const Particle = require('./particle');
const Compositor = require('./compositor');

const leds = new LEDMatrix({ maxBright: 0.4, frameRate: 30 });

signalHandler.on(['int', 'term'], () => leds.setAll(0,0,0).render());

const randomInt = (min, max) => min + Math.floor(Math.random() * (max - min + 1));

const compositor = new Compositor();

const addParticle = () => {
	const len = randomInt(2,7);
	const p = new Particle({
		width: 1,
		height: len,
		color: [255,255,255],
		opacity: 0.2,
		speed: (8-len)/4,
		position: { x: randomInt(0, 11), y: 12 },
	}, function (state) {
		state.position.y -= state.speed;
		if (state.position.y < (0 - state.height)) this.delete();
		return state;
	});
	compositor.add(p);
}


leds.play(budget => {
	if (budget > 10) {
		addParticle();
	}
	return compositor.frame(0, 0, leds.cols-1, leds.rows-1)
});

console.log('Started effect. Press <ctrl>+C to exit.');
