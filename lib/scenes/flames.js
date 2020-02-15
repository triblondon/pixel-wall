"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const matrix_display_1 = __importDefault(require("../utils/matrix-display"));
const compositor_1 = __importDefault(require("../utils/compositor"));
const flame_1 = __importDefault(require("../layers/flame"));
const matrix = new matrix_display_1.default({ rows: 1, cols: 20, frameRate: 30 });
const compositor = new compositor_1.default({ bbox: { minX: 0, minY: 0, maxX: (matrix.cols - 1), maxY: (matrix.rows - 1) } });
for (var x = 0; x < matrix.cols; x = x + 2) {
    compositor.add(new flame_1.default({
        position: { x, y: 0 },
        width: 2
    }));
}
matrix.play(compositor.frame.bind(compositor));
exports.default = matrix;
