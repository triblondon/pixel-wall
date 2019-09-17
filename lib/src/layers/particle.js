"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const layer_1 = __importDefault(require("./layer"));
const easing = require('bezier-easing'); // TODO: parcel vs typescript!
exports.EASING_LINEAR = 'easeLinear';
exports.EASING_INCUBIC = 'easeInCubic';
const EASING_FUNCTIONS = {
    'easeLinear': easing(0, 0, 1, 1),
    'easeInCubic': easing(.55, .06, .67, .19)
};
const nowMS = () => (typeof performance !== 'undefined') ? Math.trunc(performance.now()) : Number(process.hrtime.bigint()) / 1000000;
class Particle extends layer_1.default {
    constructor(options) {
        super(options.position.x, options.position.y, options.size.w, options.size.h);
        this.color = options.color || [255, 255, 255, 1];
        this.transitions = options.transitions || [];
        this.loop = 'loop' in options ? options.loop : true;
        this.totalDuration = this.transitions.reduce((acc, t) => Math.max(acc, t.start + t.duration), 0);
        this.timeCreated = nowMS();
    }
    frame(frameTime) {
        let timeOffset = frameTime - this.timeCreated;
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
                    this.color[3] = t.from + ((t.target - t.from) * EASING_FUNCTIONS[t.easing](effectOffset));
                }
            }
            else if (t.effect === 'moveY') {
                if (!('from' in t)) {
                    t.from = this.position.y;
                }
                else {
                    this.position.y = Math.trunc(t.from + ((t.target - t.from) * EASING_FUNCTIONS[t.easing](effectOffset)));
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
