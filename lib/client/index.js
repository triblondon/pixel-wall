"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fire_1 = require("../src/scenes/fire");
const canvas = document.querySelector('canvas#output');
canvas.style.width = fire_1.default.cols + 'px';
canvas.style.height = fire_1.default.rows + 'px';
const ctx = canvas.getContext('2d');
let imageData = ctx.getImageData(0, 0, fire_1.default.cols, fire_1.default.rows);
function renderToCanvas(data) {
    const cols = data[0].length;
    data.forEach((row, rowIdx) => {
        row.forEach((pixel, colIdx) => {
            let pos = ((rowIdx * cols) + colIdx) * 4;
            imageData.data[pos++] = pixel[0];
            imageData.data[pos++] = pixel[1];
            imageData.data[pos++] = pixel[2];
            imageData.data[pos++] = 255;
            ctx.putImageData(imageData, 0, 0);
        });
    });
}
fire_1.default.useRenderer(renderToCanvas);
