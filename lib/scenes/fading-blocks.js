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
const randomInt = (min, max) => min + Math.floor(Math.random() * (max - min + 1));
const matrix = new matrix_display_1.default({ rows: 12, cols: 12, frameRate: 30 });
const compositor = new compositor_1.default({ bbox: { minX: 0, minY: 0, maxX: (matrix.cols - 1), maxY: (matrix.rows - 1) } });
const addParticle = () => {
    const w = randomInt(2, 6);
    const h = randomInt(2, 4);
    const p = new particle_1.default({
        position: { x: randomInt(0, (matrix.cols - 1) - w), y: randomInt(0, (matrix.rows - 1) - h) },
        source: new rect_1.default({ width: w, height: h, color: [255, randomInt(90, 220), 20, 1] }),
        transitions: [
            { start: 0, duration: 1000, effect: particle_1.TransitionEffect.Fade, from: 0, target: 0.7, easing: particle_1.EASING_INCUBIC },
            { start: 2500, duration: 6000, effect: particle_1.TransitionEffect.Fade, target: 0, easing: particle_1.EASING_INCUBIC },
        ],
        loop: false
    });
    compositor.add(p);
};
setInterval(addParticle, 2000);
//addParticle();
matrix.play(compositor.frame.bind(compositor));
exports.default = matrix;
