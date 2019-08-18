"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const matrix_display_1 = require("../utils/matrix-display");
const compositor_1 = require("../utils/compositor");
const particle_1 = require("../layers/particle");
const randomInt = (min, max) => min + Math.floor(Math.random() * (max - min + 1));
const matrix = new matrix_display_1.default({ rows: 12, cols: 12, frameRate: 30 });
const compositor = new compositor_1.default({ bbox: { minX: 0, minY: 0, maxX: (matrix.cols - 1), maxY: (matrix.rows - 1) } });
const addParticle = () => {
    const len = randomInt(1, 20) === 1 ? randomInt(5, 7) : randomInt(2, 4);
    const p = new particle_1.default({
        position: { x: randomInt(0, 11), y: 0 - len },
        size: { w: 1, h: len },
        color: [255, 255, 255, 0.4],
        loop: false,
        transitions: [
            { start: 0, duration: (len * 100), effect: 'moveY', target: 12, easing: particle_1.EASING_LINEAR },
        ]
    });
    compositor.add(p);
};
setInterval(addParticle, 50);
matrix.play(compositor.frame.bind(compositor));
exports.default = matrix;
