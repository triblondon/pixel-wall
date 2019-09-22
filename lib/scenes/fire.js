"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const matrix_display_1 = __importDefault(require("../utils/matrix-display"));
const slideshow_1 = __importDefault(require("../layers/slideshow"));
const fire_json_1 = __importDefault(require("../fire.json"));
const fire = new slideshow_1.default({ size: { w: 12, h: 12 }, position: { x: 0, y: 0 } });
const matrix = new matrix_display_1.default({ rows: 12, cols: 12, frameRate: 20 });
fire_json_1.default.forEach(imageData => fire.addFrameFromRGBData(Buffer.from(imageData, 'base64')));
matrix.play(fire.frame.bind(fire));
exports.default = matrix;
