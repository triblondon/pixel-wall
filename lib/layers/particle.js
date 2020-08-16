"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EASING_INCUBIC = exports.EASING_LINEAR = exports.TransitionEffect = void 0;
const layer_1 = __importDefault(require("./layer"));
const easing = require('bezier-easing'); // TODO: parcel vs typescript!
var TransitionEffect;
(function (TransitionEffect) {
    TransitionEffect["Fade"] = "fade";
    TransitionEffect["MoveY"] = "movey";
})(TransitionEffect = exports.TransitionEffect || (exports.TransitionEffect = {}));
exports.EASING_LINEAR = 'easeLinear';
exports.EASING_INCUBIC = 'easeInCubic';
const EASING_FUNCTIONS = {
    'easeLinear': easing(0, 0, 1, 1),
    'easeInCubic': easing(.55, .06, .67, .19)
};
const nowMS = () => (typeof performance !== 'undefined') ? Math.trunc(performance.now()) : Number(process.hrtime.bigint()) / 1000000;
class Particle extends layer_1.default {
    constructor(options) {
        super(options.position.x, options.position.y);
        this.transitions = options.transitions || [];
        this.transitionProps = { opacity: undefined };
        this.loop = 'loop' in options ? options.loop : true;
        this.totalDuration = this.transitions.reduce((acc, t) => Math.max(acc, t.start + t.duration), 0);
        this.timeCreated = nowMS();
        this.source = options.source;
        this.sourceData = this.source.pixelData;
    }
    frame(frameTime) {
        let timeOffset = frameTime - this.timeCreated;
        if (this.totalDuration && timeOffset > this.totalDuration) {
            if (!this.loop) {
                this.delete();
                return null;
            }
            else {
                timeOffset = timeOffset % this.totalDuration;
                this.transitions.forEach(t => { t.complete = false; });
            }
        }
        this.transitions
            .filter(t => t.start <= timeOffset && !t.complete)
            .forEach(t => {
            if (!t.easing)
                t.easing = exports.EASING_LINEAR;
            const effectOffset = Math.min((timeOffset - t.start) / t.duration, 1);
            t.complete = effectOffset >= 1;
            if (t.effect === TransitionEffect.Fade) {
                if (t.from === undefined)
                    t.from = this.transitionProps.opacity;
                if (t.from === undefined)
                    t.from = 1;
                this.transitionProps.opacity = t.from + ((t.target - t.from) * EASING_FUNCTIONS[t.easing](effectOffset));
            }
            else if (t.effect === TransitionEffect.MoveY) {
                if (!('from' in t)) {
                    t.from = this.position.y;
                }
                else {
                    this.position.y = Math.trunc(t.from + ((t.target - t.from) * EASING_FUNCTIONS[t.easing](effectOffset)));
                }
            }
        });
        return this.sourceData.map(row => row.map(pxColor => {
            const newpx = [pxColor[0], pxColor[1], pxColor[2], pxColor[3]]; // TS doesn't seem to like spread operator here :-(
            if (this.transitionProps.opacity !== undefined)
                newpx[3] *= this.transitionProps.opacity;
            return newpx;
        }));
    }
}
exports.default = Particle;
