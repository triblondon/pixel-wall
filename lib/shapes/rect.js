"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const shape_1 = __importDefault(require("./shape"));
class Rect extends shape_1.default {
    constructor(options) {
        super();
        this.width = options.width || 1;
        this.height = options.height || 1;
        this.color = options.color || [255, 255, 255, 1];
    }
    set color(c) {
        const row = Array(this.width).fill(undefined).map(() => c);
        this.pixels = Array(this.height).fill(undefined).map(() => [...row]);
    }
    get pixelData() { return this.pixels; }
}
exports.default = Rect;
