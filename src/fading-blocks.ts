import LEDMatrix from './utils/led-matrix';
import signalHandler from './utils/signal-handler';
import Compositor from './utils/compositor';
import Particle, { EASING_INCUBIC } from './layers/particle';

const randomInt = (min: number, max: number) => min + Math.floor(Math.random() * (max - min + 1));

signalHandler.on(['int', 'term'], () => leds.setAll(0,0,0).render());

const leds = new LEDMatrix({ rows: 12, cols: 12, maxBright: 0.6, frameRate: 30 });



const compositor = new Compositor({ bbox: { minX:0, minY:0, maxX:(leds.cols-1), maxY:(leds.rows-1) }});

const addParticle = () => {
	const w = randomInt(2,3);
	const h = randomInt(2,3);
	const p = new Particle({
		position: { x: randomInt(0, 11-w), y: randomInt(0, 11-h) },
		size: { w, h },
		color: [randomInt(120,170), 160, 255, 0],
		transitions: [
			{start: 0, duration: 1000, effect: 'fade', target: 1, easing: EASING_INCUBIC},
			{start: 1500, duration: 2000, effect: 'fade', target: 0, easing: EASING_INCUBIC},
		],
		loop: false
	});
	compositor.add(p);
}

setInterval(addParticle, 1000);


leds.play(timeOffset => {
	return compositor.frame(timeOffset, )
});
