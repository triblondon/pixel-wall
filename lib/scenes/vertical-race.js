"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const matrix_display_1 = __importDefault(require("../utils/matrix-display"));
const compositor_1 = __importDefault(require("../utils/compositor"));
const particle_1 = __importStar(require("../layers/particle"));
const rect_1 = __importDefault(require("../shapes/rect"));
const randomInt = (min, max) => min + Math.floor(Math.random() * (max - min + 1));
const matrix = new matrix_display_1.default({ rows: 12, cols: 12, frameRate: 30 });
const compositor = new compositor_1.default({ bbox: { minX: 0, minY: 0, maxX: (matrix.cols - 1), maxY: (matrix.rows - 1) } });
const addParticle = () => {
    const len = randomInt(1, 20) === 1 ? randomInt(5, 7) : randomInt(2, 4);
    const p = new particle_1.default({
        position: { x: randomInt(0, matrix.cols), y: 0 - len },
        source: new rect_1.default({ width: 1, height: len, color: [255, 255, 255, 0.2] }),
        loop: false,
        transitions: [
            { start: 0, duration: ((len * 150) - 200), effect: particle_1.TransitionEffect.MoveY, target: matrix.rows, easing: particle_1.EASING_LINEAR },
        ]
    });
    compositor.add(p);
};
setInterval(addParticle, 20);
matrix.play(compositor.frame.bind(compositor));
exports.default = matrix;
