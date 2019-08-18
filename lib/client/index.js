"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sparkle_1 = require("../src/scenes/sparkle");
function canvasMode() {
    const canvas = document.createElement('canvas');
    canvas.setAttribute('width', String(sparkle_1.default.cols));
    canvas.setAttribute('height', String(sparkle_1.default.rows));
    document.getElementById('output').appendChild(canvas);
    const ctx = canvas.getContext('2d');
    let imageData = ctx.createImageData(sparkle_1.default.cols, sparkle_1.default.rows);
    function renderToCanvas(data) {
        data.forEach((row, rowIdx) => {
            row.forEach((pixel, colIdx) => {
                let pos = ((rowIdx * sparkle_1.default.cols) + colIdx) * 4;
                const [red, green, blue, alpha] = pixel;
                imageData.data[pos] = red;
                imageData.data[pos + 1] = green;
                imageData.data[pos + 2] = blue;
                imageData.data[pos + 3] = 255;
            });
        });
        ctx.putImageData(imageData, 0, 0);
    }
    sparkle_1.default.useRenderer(renderToCanvas);
}
function tableMode() {
    const pixelEls = [];
    const table = document.createElement('table');
    const tbody = document.createElement('tbody');
    for (let y = 0; y < sparkle_1.default.rows; y++) {
        const row = document.createElement('tr');
        for (let x = 0; x < sparkle_1.default.cols; x++) {
            const cell = document.createElement('td');
            pixelEls.push(cell);
            row.appendChild(cell);
        }
        tbody.appendChild(row);
    }
    table.appendChild(tbody);
    document.getElementById('output').appendChild(table);
    function renderToTable(data) {
        data.forEach((row, rowIdx) => {
            row.forEach((pixel, colIdx) => {
                let pos = ((rowIdx * sparkle_1.default.cols) + colIdx);
                pixelEls[pos].style.backgroundColor = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;
            });
        });
    }
    sparkle_1.default.useRenderer(renderToTable);
}
document.addEventListener('DOMContentLoaded', tableMode);
