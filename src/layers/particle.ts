import Layer, { LayerOptionsType } from './layer';
import { PixelDataType, FrameDataType } from '../utils/matrix-display';
import Shape from '../shapes/shape';

import * as Bezier from 'bezier-easing';
const easing = require('bezier-easing'); // TODO: parcel vs typescript!

type EasingDefs = {
	[index: string]: Bezier.EasingFunction
}

export enum TransitionEffect {
	Fade = "fade",
	MoveY = "movey"
}

type TransitionType = {
	start: number,
	duration: number,
	effect: TransitionEffect,
	from?: number,
	target: number,
	easing?: string,
	complete?: boolean
}

type OptionsType = LayerOptionsType & {
	source: Shape,
	transitions?: TransitionType[],
	loop?: boolean
}

export const EASING_LINEAR = 'easeLinear';
export const EASING_INCUBIC = 'easeInCubic';

const EASING_FUNCTIONS: EasingDefs = {
	'easeLinear': easing(0,0,1,1),
	'easeInCubic': easing(.55,.06,.67,.19)
}

const nowMS = () => (typeof performance !== 'undefined') ? Math.trunc(performance.now()) : Number(process.hrtime.bigint()) / 1000000;

export default class Particle extends Layer {

	private transitions: TransitionType[];
	private transitionProps: { opacity: number };
	private loop: boolean;
	private totalDuration: number;
	private timeCreated: number;
	private source: Shape;
	private sourceData: FrameDataType;

	constructor(options: OptionsType) {
		super(options.position.x, options.position.y);
		this.transitions = options.transitions || [];
		this.transitionProps = { opacity: undefined };
		this.loop = 'loop' in options ? options.loop : true;
		this.totalDuration = this.transitions.reduce((acc, t) => Math.max(acc, t.start + t.duration), 0);
		this.timeCreated = nowMS();
		this.source = options.source;
		this.sourceData = this.source.pixelData;
	}

	frame(frameTime: number) {
		let timeOffset = frameTime - this.timeCreated;
		if (this.totalDuration && timeOffset > this.totalDuration) {
			if (!this.loop) {
				this.delete();
				return null;
			} else {
				timeOffset = timeOffset % this.totalDuration;
				this.transitions.forEach(t => { t.complete = false });
			}
		}
		this.transitions
			.filter(t => t.start <= timeOffset && !t.complete)
			.forEach(t => {
				if (!t.easing) t.easing = EASING_LINEAR;
				const effectOffset = Math.min((timeOffset - t.start) / t.duration, 1);
				t.complete = effectOffset >= 1;
				if (t.effect === TransitionEffect.Fade) {
					if (t.from === undefined) t.from = this.transitionProps.opacity;
					if (t.from === undefined) t.from = 1;
					this.transitionProps.opacity = t.from + ((t.target - t.from) * EASING_FUNCTIONS[t.easing](effectOffset));
				} else if (t.effect === TransitionEffect.MoveY) {
					if (!('from' in t)) {
						t.from = this.position.y;
					} else {
						this.position.y = Math.trunc(t.from + ((t.target - t.from) * EASING_FUNCTIONS[t.easing](effectOffset)));
					}
				}
			})
		;
		return this.sourceData.map(row => row.map(pxColor => {
			const newpx: PixelDataType = [ pxColor[0], pxColor[1], pxColor[2], pxColor[3] ];  // TS doesn't seem to like spread operator here :-(
			if (this.transitionProps.opacity !== undefined) newpx[3] *= this.transitionProps.opacity;
			return newpx;
		}));
	}
}
