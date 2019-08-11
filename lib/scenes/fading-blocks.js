"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const led_matrix_1 = require("./utils/led-matrix");
const signal_handler_1 = require("./utils/signal-handler");
const compositor_1 = require("./utils/compositor");
const particle_1 = require("./layers/particle");
const randomInt = (min, max) => min + Math.floor(Math.random() * (max - min + 1));
signal_handler_1.default.on(['int', 'term'], () => leds.setAll(0, 0, 0).render());
const leds = new led_matrix_1.default({ rows: 12, cols: 12, maxBright: 0.6, frameRate: 30 });
const compositor = new compositor_1.default({ bbox: { minX: 0, minY: 0, maxX: (leds.cols - 1), maxY: (leds.rows - 1) } });
const addParticle = () => {
    const w = randomInt(2, 3);
    const h = randomInt(2, 3);
    const p = new particle_1.default({
        position: { x: randomInt(0, 11 - w), y: randomInt(0, 11 - h) },
        size: { w, h },
        color: [randomInt(120, 170), 160, 255, 0],
        transitions: [
            { start: 0, duration: 1000, effect: 'fade', target: 1, easing: particle_1.EASING_INCUBIC },
            { start: 1500, duration: 2000, effect: 'fade', target: 0, easing: particle_1.EASING_INCUBIC },
        ],
        loop: false
    });
    compositor.add(p);
};
setInterval(addParticle, 1000);
leds.play(timeOffset => {
    return compositor.frame(timeOffset);
});
