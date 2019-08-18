"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const matrix_display_1 = require("../utils/matrix-display");
const slideshow_1 = require("../layers/slideshow");
const fs = require("fs");
const path = require("path");
const fire = new slideshow_1.default({ size: { w: 12, h: 12 }, position: { x: 0, y: 0 } });
const matrix = new matrix_display_1.default({ rows: 12, cols: 12, frameRate: 20 });
const dirName = path.join(__dirname, '../../images/fire');
fs.
    readdirSync(dirName).
    filter(name => name.endsWith('.rgb'))
    .forEach(imageFileName => {
    fire.addFrameFromRGBData(fs.readFileSync(path.join(dirName, imageFileName)));
});
matrix.play(fire.frame.bind(fire));
exports.default = matrix;
