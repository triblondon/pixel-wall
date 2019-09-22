"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const layer_1 = __importDefault(require("./layer"));
class Slideshow extends layer_1.default {
    constructor(options) {
        super(options.position.x, options.position.y, options.size.w, options.size.h);
        this.frames = [];
        this.curFrame = 0;
        this.numFrames = this.frames.length;
    }
    addFrameFromRGBData(frameBuf) {
        if (frameBuf.length !== (this.size.w * this.size.h * 3)) {
            throw new Error("Frame has incorrect size");
        }
        const newFrame = [...frameBuf].reduce((acc, colorVal, idx) => {
            const pxIdx = Math.trunc(idx / 3);
            const row = Math.trunc(pxIdx / this.size.w);
            const col = pxIdx % this.size.w;
            if (idx % 3 === 0)
                acc[row][col] = [0, 0, 0, 1];
            acc[row][col][idx % 3] = colorVal;
            return acc;
        }, Array(this.size.h).fill(undefined).map(row => Array(this.size.w)));
        this.frames.push(newFrame);
        this.numFrames = this.frames.length;
    }
    frame() {
        this.curFrame++;
        if (this.curFrame === this.numFrames)
            this.curFrame = 0;
        return this.frames[this.curFrame];
    }
}
exports.default = Slideshow;
