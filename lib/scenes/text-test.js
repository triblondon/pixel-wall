"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const matrix_display_1 = require("../utils/matrix-display");
const compositor_1 = require("../utils/compositor");
const text_1 = require("../layers/text");
const matrix = new matrix_display_1.default({ rows: 12, cols: 12, frameRate: 30 });
const compositor = new compositor_1.default({ bbox: { minX: 0, minY: 0, maxX: (matrix.cols - 1), maxY: (matrix.rows - 1) } });
compositor.add(new text_1.default({
    position: { x: 12, y: 3 },
    color: [0, 50, 255, 1],
    speed: 1,
    loop: true,
    text: 'HI DORA!'
}));
matrix.play(compositor.frame.bind(compositor));
exports.default = matrix;
