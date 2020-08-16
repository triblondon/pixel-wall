"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const layer_1 = __importDefault(require("./layer"));
const MODES = [
    { name: 'normal', prob: [0, 0.7], hue: { target: 0.11, force: 0.0002, elas: 0.2, min: 0.10, max: 0.12 }, lum: { target: 0.45, max: 0.5, min: 0.4, force: 0.003, elas: 0.2 } },
    { name: 'throb', prob: [0.7, 0.95], hue: { target: 0.11, force: 0.0002, elas: 0.2, min: 0.09, max: 0.12 }, lum: { target: 0.45, max: 0.5, min: 0.4, force: 0.01, elas: 100 } },
    { name: 'flicker', prob: [0.95, 1], hue: { target: 0.10, force: 0.002, elas: 1, min: 0.09, max: 0.13 }, lum: { target: 0.35, max: 0.35, min: 0.2, force: 0.05, elas: 0.15 } }
];
const PROPS = ['hue', 'lum'];
const hslToRgb = (h, s, l) => {
    var r, g, b;
    if (s == 0) {
        r = g = b = l; // achromatic
    }
    else {
        var hue2rgb = function hue2rgb(p, q, t) {
            if (t < 0)
                t += 1;
            if (t > 1)
                t -= 1;
            if (t < 1 / 6)
                return p + (q - p) * 6 * t;
            if (t < 1 / 2)
                return q;
            if (t < 2 / 3)
                return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };
        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255), 1];
};
const randFloat = (min, max) => (Math.random() * (max - min)) + min;
class Flame extends layer_1.default {
    constructor(options) {
        super(options.position.x, options.position.y);
        this.width = options.width;
        this.mode = MODES.find(m => m.name === 'normal');
        this.lum = [this.mode.lum.target, true];
        this.hue = [this.mode.hue.target, true];
        setInterval(() => this.shiftMode(), Math.trunc(randFloat(2000, 3000)));
    }
    shiftMode() {
        if (Math.random() < 0.7)
            return;
        const n = Math.random();
        this.mode = MODES.find(m => (n >= m.prob[0] && n < m.prob[1]));
    }
    frame() {
        PROPS.forEach(prop => {
            const distToTarget = Math.abs(this[prop][0] - this.mode[prop].target);
            const homingForce = this[prop][0] > this.mode[prop].max || this[prop][0] < this.mode[prop].min ? 1 : distToTarget / this.mode[prop].elas;
            const aboveTarget = this[prop][0] > this.mode[prop].target;
            const atTarget = this[prop][0] === this.mode[prop].target;
            if ((atTarget || (aboveTarget && this[prop][1]) || (!aboveTarget && !this[prop][1])) && Math.random() < homingForce) {
                this[prop][1] = !this[prop][1];
            }
            const nudge = this.mode[prop].force;
            this[prop][0] += (this[prop][1] ? 1 : -1) * nudge;
        });
        return [Array(this.width).fill(0).map(() => hslToRgb(this.hue[0], 1, this.lum[0]))];
    }
}
exports.default = Flame;
