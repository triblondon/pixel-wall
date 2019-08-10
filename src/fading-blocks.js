const LEDMatrix = require('./utils/led-matrix');
const signalHandler = require('./utils/signal-handler');
const Compositor = require('./utilscompositor');
const Particle = require('./layers/particle');

const leds = new LEDMatrix({ maxBright: 0.6, frameRate: 30 });

signalHandler.on(['int', 'term'], () => leds.setAll(0,0,0).render());

const randomInt = (min, max) => min + Math.floor(Math.random() * (max - min + 1));

const compositor = new Compositor();

const addParticle = () => {
	const w = randomInt(2,3);
	const h = randomInt(2,3);
	const p = new Particle({
		width: w,
		height: h,
		color: [randomInt(120,170),160,255],
		opacity: 0,
		phase: 1,
		position: { x: randomInt(0, 11-w), y: randomInt(0, 11-h) },
	}, function (state) {
		if (state.phase === 1 && state.opacity < 0.6) {
			state.opacity += 0.01;
		} else if (state.phase === 1) {
			state.phase = 2;
		} else if (state.phase === 2 && state.opacity > 0) {
			state.opacity -= 0.005;
		} else {
			this.delete();
		}
		return state;
	});
	compositor.add(p);
}
//addParticle();
setInterval(addParticle, 1000);


leds.play(budget => {
	return compositor.frame(0, 0, leds.cols-1, leds.rows-1)
});

console.log('Started effect. Press <ctrl>+C to exit.');
