"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const layer_1 = require("../layers/layer");
const mix = (baseColor, newColor) => {
    let [baseRed, baseGreen, baseBlue] = baseColor;
    let [newRed, newGreen, newBlue, alpha] = newColor;
    if (alpha === undefined)
        alpha = 1;
    if (alpha > 1)
        alpha /= 255;
    return [
        Math.trunc((newRed * alpha) + (baseRed * (1 - alpha))),
        Math.trunc((newGreen * alpha) + (baseGreen * (1 - alpha))),
        Math.trunc((newBlue * alpha) + (baseBlue * (1 - alpha)))
    ];
};
class Compositor {
    constructor(options) {
        this.layers = [];
        this.bgColor = (options && options.bgColor) || [0, 0, 0, 0];
        this.bbox = options.bbox;
    }
    add(layerObj) {
        if (!(layerObj instanceof layer_1.default)) {
            throw new Error(layerObj + ' is not a Layer');
        }
        this.layers.push(layerObj);
    }
    frame(timeOffset) {
        const numCols = this.bbox.maxX - this.bbox.minX + 1;
        const numRows = this.bbox.maxY - this.bbox.minY + 1;
        this.layers = this.layers.filter(l => l.isActive());
        return this.layers
            .reduce((out, layerObj, idx) => {
            const layerFrameData = layerObj.frame(timeOffset);
            if (!layerFrameData)
                return out;
            layerFrameData.forEach((row, rowOffset) => {
                row.forEach((pixel, colOffset) => {
                    const x = layerObj.position.x + colOffset - this.bbox.minX;
                    const y = layerObj.position.y + rowOffset - this.bbox.minY;
                    if (x >= this.bbox.minX && x <= this.bbox.maxX && y >= this.bbox.minY && y <= this.bbox.maxY) {
                        out[y][x] = mix(out[y][x] || this.bgColor, pixel);
                    }
                });
            });
            return out;
        }, Array(numRows).fill(undefined).map(row => Array(numCols).fill(this.bgColor)));
    }
}
exports.default = Compositor;
