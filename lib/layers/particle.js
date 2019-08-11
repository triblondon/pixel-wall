"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const layer_js_1 = require("./layer.js");
const Bezier = require("bezier-easing");
exports.EASING_LINEAR = 'easeLinear';
exports.EASING_INCUBIC = 'easeInCubic';
const EASING_FUNCTIONS = {
    'easeLinear': Bezier(0, 0, 1, 1),
    'easeInCubic': Bezier(.55, .06, .67, .19)
};
class Particle extends layer_js_1.default {
    constructor(options) {
        super(options.position.x, options.position.y, options.size.w, options.size.h);
        this.color = options.color || [255, 255, 255, 1];
        this.transitions = options.transitions || [];
        this.loop = 'loop' in options ? options.loop : true;
        this.totalDuration = this.transitions.reduce((acc, t) => Math.max(acc, t.start + t.duration), 0);
    }
    frame(timeOffset) {
        if (timeOffset > this.totalDuration) {
            if (!this.loop) {
                this.delete();
                return null;
            }
            else {
                timeOffset = timeOffset % this.totalDuration;
            }
        }
        this.transitions.forEach(t => {
            if (t.start > timeOffset || t.start + t.duration < timeOffset)
                return true;
            const effectOffset = (timeOffset - t.start) / t.duration;
            if (t.effect === 'fade') {
                if (!('from' in t)) {
                    t.from = this.color[3];
                }
                else {
                    this.color[3] = t.from + ((t.target - t.from) / EASING_FUNCTIONS[t.easing](effectOffset));
                }
            }
        });
        return Array(this.size.h).fill(undefined).map(() => {
            return Array(this.size.w).fill(undefined).map(() => {
                return this.color;
            });
        });
    }
}
exports.default = Particle;
