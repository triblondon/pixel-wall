"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const matrix_display_1 = __importDefault(require("../utils/matrix-display"));
const compositor_1 = __importDefault(require("../utils/compositor"));
const text_1 = __importDefault(require("../layers/text"));
const matrix = new matrix_display_1.default({ rows: 12, cols: 12, frameRate: 20 });
const compositor = new compositor_1.default({ bbox: { minX: 0, minY: 0, maxX: (matrix.cols - 1), maxY: (matrix.rows - 1) } });
compositor.add(new text_1.default({
    position: { x: matrix.cols, y: 2 },
    color: [152, 210, 255, 1],
    speed: 1,
    loop: true,
    text: 'hello chimp!'
}));
/*
compositor.add(new Text({
    position: { x: matrix.cols, y: 10 },
    color: [152, 255, 100, 1],
    speed: 0.5,
    loop: true,
    text: 'THIS IS THE PROPOSED SIZE OF THE PRODUCTION MATRIX'
}));
compositor.add(new Text({
    position: { x: matrix.cols, y: 18 },
    color: [255, 100, 100, 1],
    speed: 1,
    loop: true,
    text: 'WE CAN FIT THREE LINES OF TEXT'
}));
*/
matrix.play(compositor.frame.bind(compositor));
exports.default = matrix;
