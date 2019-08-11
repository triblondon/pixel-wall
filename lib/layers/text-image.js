"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const layer_js_1 = require("./layer.js");
const gm = require("gm");
const TEXT_CANVAS_WIDTH = 300;
class TextImage extends layer_js_1.default {
    constructor(options) {
        super(options.position.x, options.position.y, options.size.w, options.size.h);
        this.text = '';
        this.imageData = null;
        this.dirty = false;
    }
    async setText(str) {
        this.text = str;
        await new Promise(resolve => {
            gm(TEXT_CANVAS_WIDTH, this.size.h, "#000000ff").fill("#ffffff").font('Arial.ttf', 9).drawText(0, 0, str, "NorthWest").toBuffer('RGB', (err, buffer) => {
                this.imageData = [...buffer].reduce((acc, colorVal, idx) => {
                    if (idx % 3 === 0)
                        acc.push([]);
                    acc[acc.length - 1][idx % 3] = colorVal;
                    return acc;
                }, []);
                this.dirty = true;
                resolve();
            });
        });
    }
    frame() {
        if (this.dirty) {
            return this.imageData;
        }
    }
}
module.exports = TextImage;
