"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const shape_1 = __importDefault(require("./shape"));
class Rect extends shape_1.default {
    constructor(options) {
        super();
        options.color = options.color || [255, 255, 255, 1];
        const row = Array(options.width).fill(undefined).map(() => options.color);
        this.pixels = Array(options.height).fill(undefined).map(() => [...row]);
    }
    get pixelData() { return this.pixels; }
}
exports.default = Rect;
