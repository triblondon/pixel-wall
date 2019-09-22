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
const circle_1 = __importDefault(require("../shapes/circle"));
const randomInt = (min, max) => min + Math.floor(Math.random() * (max - min + 1));
const matrix = new matrix_display_1.default({ rows: 12, cols: 12, frameRate: 30 });
const compositor = new compositor_1.default({ bbox: { minX: 0, minY: 0, maxX: (matrix.cols - 1), maxY: (matrix.rows - 1) } });
const addParticle = () => {
    const p = new particle_1.default({
        position: { x: randomInt(0, matrix.cols), y: randomInt(0, matrix.rows) },
        source: new circle_1.default({ radius: randomInt(5, 10), color: [randomInt(50, 255), randomInt(50, 255), randomInt(50, 255), 1], smoothing: 3 }),
        transitions: [
            { start: 0, duration: 1000, effect: particle_1.TransitionEffect.Fade, from: 0, target: 0.7, easing: particle_1.EASING_INCUBIC },
            { start: 2500, duration: 6000, effect: particle_1.TransitionEffect.Fade, target: 0, easing: particle_1.EASING_INCUBIC },
        ],
        loop: false
    });
    compositor.add(p);
};
setInterval(addParticle, 500);
//addParticle();
matrix.play(compositor.frame.bind(compositor));
exports.default = matrix;
