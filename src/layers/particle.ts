import Layer, { LayerOptionsType } from './layer';
import { PixelDataType } from '../utils/matrix-display';

import * as Bezier from 'bezier-easing';
const easing = require('bezier-easing'); // TODO: parcel vs typescript!

type EasingDefs = {
	[index: string]: Bezier.EasingFunction
}

type TransitionType = {
	start: number,
	duration: number,
	effect: 'fade' | 'moveY',
	from?: number,
	target: number,
	easing?: string
}

type OptionsType = LayerOptionsType & {
	color?: PixelDataType,
	transitions?: TransitionType[],
	loop?: boolean
}

export const EASING_LINEAR = 'easeLinear';
export const EASING_INCUBIC = 'easeInCubic';

const EASING_FUNCTIONS: EasingDefs = {
	'easeLinear': easing(0,0,1,1),
	'easeInCubic': easing(.55,.06,.67,.19)
}

const nowMS = () => (globalThis.performance !== undefined) ? Math.trunc(performance.now()) : Number(process.hrtime.bigint()) / 1000000;

export default class Particle extends Layer {

	color: PixelDataType;
	transitions: TransitionType[];
	loop: boolean;

	private totalDuration: number;
	private timeCreated: number;

	constructor(options: OptionsType) {
		super(options.position.x, options.position.y, options.size.w, options.size.h);
		this.color = options.color || [ 255, 255, 255, 1]
		this.transitions = options.transitions || [];
		this.loop = 'loop' in options ? options.loop : true;
		this.totalDuration = this.transitions.reduce((acc, t) => Math.max(acc, t.start + t.duration), 0);
		this.timeCreated = nowMS();
	}

	frame(frameTime: number) {
		let timeOffset = frameTime - this.timeCreated;
		if (timeOffset > this.totalDuration) {
			if (!this.loop) {
				this.delete();
				return null;
			} else {
				timeOffset = timeOffset % this.totalDuration;
			}
		}
		this.transitions.forEach(t => {
			if (t.start > timeOffset || t.start + t.duration < timeOffset) return true;
			const effectOffset = (timeOffset - t.start) / t.duration;
			if (t.effect === 'fade') {
				if (!('from' in t)) {
					t.from = this.color[3];
				} else {
					this.color[3] = Math.trunc(t.from + ((t.target - t.from) * EASING_FUNCTIONS[t.easing](effectOffset)));
				}
			} else if (t.effect === 'moveY') {
				if (!('from' in t)) {
					t.from = this.position.y;
				} else {
					this.position.y = Math.trunc(t.from + ((t.target - t.from) * EASING_FUNCTIONS[t.easing](effectOffset)));
				}
			}
		});
		return Array(this.size.h).fill(undefined).map(() => {
			return Array(this.size.w).fill(undefined).map(() => {
				return this.color;
			})
		});
	}
}
