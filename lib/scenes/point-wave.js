"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const matrix_display_1 = __importDefault(require("../utils/matrix-display"));
const compositor_1 = __importDefault(require("../utils/compositor"));
const particle_1 = __importStar(require("../layers/particle"));
const rect_1 = __importDefault(require("../shapes/rect"));
const NUM_PARTICLES = 16;
const WAVE_DURATION = 1000;
const BETWEEN_WAVES = 5000;
const FADE_IN_DURATION = 500;
const FADE_OUT_DURATION = 1000;
const randomInt = (min, max) => min + Math.floor(Math.random() * (max - min + 1));
const matrix = new matrix_display_1.default({ rows: 12, cols: 12, frameRate: 20 });
const compositor = new compositor_1.default({ bbox: { minX: 0, minY: 0, maxX: (matrix.cols - 1), maxY: (matrix.rows - 1) } });
const doWave = () => {
    const color = [randomInt(50, 255), randomInt(50, 255), randomInt(50, 255), 1];
    for (let i = 0; i < NUM_PARTICLES; i++) {
        const x = randomInt(0, matrix.cols - 1);
        const y = randomInt(0, matrix.rows - 1);
        const fadeOffset = Math.trunc((x / matrix.cols) * WAVE_DURATION);
        const p = new particle_1.default({
            position: { x, y },
            source: new rect_1.default({ width: 1, height: 1, color }),
            loop: false,
            transitions: [
                { start: 0, duration: 0, effect: particle_1.TransitionEffect.Fade, from: 0, target: 0.01 },
                { start: fadeOffset, duration: FADE_IN_DURATION, effect: particle_1.TransitionEffect.Fade, from: 0, target: 1, easing: particle_1.EASING_INCUBIC },
                { start: fadeOffset + FADE_IN_DURATION, duration: FADE_OUT_DURATION, effect: particle_1.TransitionEffect.Fade, target: 0, easing: particle_1.EASING_INCUBIC },
            ],
        });
        compositor.add(p);
    }
    setTimeout(doWave, BETWEEN_WAVES);
};
doWave();
matrix.play(compositor.frame.bind(compositor));
exports.default = matrix;
