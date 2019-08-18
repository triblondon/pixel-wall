"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const matrix_display_1 = require("../utils/matrix-display");
const compositor_1 = require("../utils/compositor");
const particle_1 = require("../layers/particle");
const randomInt = (min, max) => min + Math.floor(Math.random() * (max - min + 1));
const matrix = new matrix_display_1.default({ rows: 12, cols: 12, frameRate: 30 });
const compositor = new compositor_1.default({ bbox: { minX: 0, minY: 0, maxX: (matrix.cols - 1), maxY: (matrix.rows - 1) } });
const addParticle = () => {
    const w = randomInt(2, 6);
    const h = randomInt(2, 4);
    const p = new particle_1.default({
        position: { x: randomInt(0, (matrix.cols - 1) - w), y: randomInt(0, (matrix.rows - 1) - h) },
        size: { w, h },
        color: [255, randomInt(90, 220), 20, 0],
        transitions: [
            { start: 0, duration: 1000, effect: 'fade', target: 0.7, easing: particle_1.EASING_INCUBIC },
            { start: 2500, duration: 6000, effect: 'fade', target: 0, easing: particle_1.EASING_INCUBIC },
        ],
        loop: false
    });
    compositor.add(p);
};
setInterval(addParticle, 2000);
matrix.play(compositor.frame.bind(compositor));
exports.default = matrix;
