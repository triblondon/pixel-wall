import { timeStamp } from 'console';
import Layer, { LayerOptionsType } from '../layer';
import { PixelDataType, FrameDataType } from '../matrix-display';

type OptionsType = LayerOptionsType & {
	width: number
}
type PropType = 'hue' | 'lum';
type ModeType = {
	name: string,
	prob: number,
	hue: { target: number, force: number, elas: number, min: number, max: number },
	lum: { target: number, force: number, elas: number, min: number, max: number }
};
type ModeListType = Record<string, ModeType>;

const MODES: ModeListType = {
	normal: { name: 'normal', prob: 70, hue: { target: 0.11, force: 0.0002, elas: 0.2, min: 0.10, max: 0.12 }, lum: { target: 0.45, max: 0.5, min: 0.4, force: 0.008, elas: 1 }},
	throb: { name: 'throb', prob: 25, hue: { target: 0.11, force: 0.0002, elas: 0.2, min: 0.09, max: 0.12 }, lum: { target: 0.45, max: 0.5, min: 0.4, force: 0.01, elas: 100 }},
	flicker: { name: 'flicker', prob: 5, hue: { target: 0.10, force: 0.001, elas: 5, min: 0.09, max: 0.13 }, lum: { target: 0.35, max: 0.35, min: 0.2, force: 0.05, elas: 0.15 }},
	dying: { name: 'dying', prob: 0, hue: { target: 0.08, force: 0.0002, elas: 5, min: 0.075, max: 0.10 }, lum: { target: 0.1, max: 0.15, min: 0.05, force: 0.05, elas: 0.25 }},
	off: { name: 'off', prob: 0, hue: { target: 0.08, force: 0.001, elas: 1, min: 0.08, max: 0.08 }, lum: { target: 0, max: 0, min: 0, force: 0.001, elas: 0.1}}
}
const PROPS: PropType[] = ['hue', 'lum'];

const hslToRgb = (h: number, s: number, l: number): PixelDataType => {
	var r, g, b;

	if (s == 0) {
			r = g = b = l; // achromatic
	} else {
			var hue2rgb = function hue2rgb(p: number, q: number, t: number){
				if(t < 0) t += 1;
				if(t > 1) t -= 1;
				if(t < 1/6) return p + (q - p) * 6 * t;
				if(t < 1/2) return q;
				if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
				return p;
			}

			var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
			var p = 2 * l - q;
			r = hue2rgb(p, q, h + 1/3);
			g = hue2rgb(p, q, h);
			b = hue2rgb(p, q, h - 1/3);
	}

	return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255), 1];
}

const randFloat = (min: number, max:number): number => (Math.random() * (max-min)) + min;

export default class Flame extends Layer {

	#mode: ModeType;
	#width: number;
	#lum: [number, boolean];
	#hue: [number, boolean];
	#modeTimer: NodeJS.Timeout | undefined;

	constructor(options: OptionsType) {
		super(options.position.x, options.position.y);
		this.#width = options.width;
		this.#mode = MODES.off;
		this.#lum = [this.#mode.lum.target, true];
		this.#hue = [this.#mode.hue.target, true];
	}

	get mode() {
		return this.#mode.name;
	}

	autoModeShift() {
		this.#modeTimer = setInterval(() => this.shiftMode(), Math.trunc(randFloat(3000, 10000)));
	}

	shiftMode(newMode?: string) {
		if (newMode && newMode in MODES) {
			if (this.#modeTimer) clearInterval(this.#modeTimer);
			this.#mode = MODES[newMode];
		} else {
			if (Math.random() > 0.7) {
				let n = Math.random() * 100;
				let cumProb = 0;
				this.#mode = Object.values(MODES).find(m => (n <= (cumProb += m.prob))) || MODES.normal;
			}
		}
	}

	setState(newState: string, delay: number = 0) {
		if (this.#modeTimer) {
			clearTimeout(this.#modeTimer);
			clearInterval(this.#modeTimer);
		}
		if (delay) {
			this.#modeTimer = setTimeout(() => this.setState(newState), delay);
		} else if (newState === 'on') {
			this.shiftMode('normal');
			this.autoModeShift();
		} else if (newState === 'off' && this.#mode.name !== 'off') {
			this.shiftMode('dying');
			this.#modeTimer = setTimeout(() => this.shiftMode('off'), Math.trunc(randFloat(10000, 30000)));
		}
	}

	frame(): FrameDataType {
		PROPS.forEach(prop => {
			const current = prop === 'hue' ? this.#hue : this.#lum;
			const distToTarget = Math.abs(current[0] - this.#mode[prop].target);
			const aboveTarget = current[0] > this.#mode[prop].target;
			const isGoingUp = current[1] === true;

			// Don't change direction if heading for target value
			if ((aboveTarget && isGoingUp) || (!aboveTarget && !isGoingUp)) {

				// Heading away from target, prob. of changing direction is distance from target over elasticity,
				// eg 50 points from target and elasticity is 100 = 50% chance of changing dir
				const homingForce = current[0] > this.#mode[prop].max || current[0] < this.#mode[prop].min ? 1 : distToTarget / this.#mode[prop].elas;
				if (Math.random() < homingForce) {
					current[1] = !current[1]; // Change direction
				}
			}
			const nudge = this.#mode[prop].force;
			current[0] += (current[1] ? 1 : -1) * nudge;
		});
		return [Array(this.#width).fill(0).map(() => hslToRgb(this.#hue[0], 1, this.#lum[0]))];
	}
}
