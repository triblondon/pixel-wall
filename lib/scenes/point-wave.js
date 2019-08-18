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
const NUM_PARTICLES = 7;
const WAVE_DURATION = 1000;
const BETWEEN_WAVES = 5000;
const FADE_IN_DURATION = 500;
const FADE_OUT_DURATION = 1000;
const randomInt = (min, max) => min + Math.floor(Math.random() * (max - min + 1));
const matrix = new matrix_display_1.default({ rows: 12, cols: 12, frameRate: 20 });
const compositor = new compositor_1.default({ bbox: { minX: 0, minY: 0, maxX: (matrix.cols - 1), maxY: (matrix.rows - 1) } });
const doWave = () => {
    const color = [randomInt(50, 255), randomInt(50, 255), randomInt(50, 255), 0];
    const prevPoints = [];
    for (let i = 0; i < NUM_PARTICLES; i++) {
        const x = randomInt(0, 11);
        const y = randomInt(0, 11);
        const fadeOffset = Math.trunc((x / 11) * WAVE_DURATION);
        const p = new particle_1.default({
            position: { x, y },
            size: { w: 1, h: 1 },
            color: [...color],
            loop: false,
            transitions: [
                { start: fadeOffset, duration: FADE_IN_DURATION, effect: 'fade', target: 0.7, easing: particle_1.EASING_INCUBIC },
                { start: fadeOffset + FADE_IN_DURATION, duration: FADE_OUT_DURATION, effect: 'fade', target: 0, easing: particle_1.EASING_INCUBIC },
            ],
        });
        compositor.add(p);
    }
    setTimeout(doWave, BETWEEN_WAVES);
};
doWave();
matrix.play(compositor.frame.bind(compositor));
exports.default = matrix;
