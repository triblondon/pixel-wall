import Layer, { LayerOptionsType } from './layer';
import { FrameDataType } from '../utils/led-matrix'

export default class Slideshow extends Layer {

	frames: FrameDataType[];
	curFrame: number;
	numFrames: number;

	constructor(options: LayerOptionsType) {
		super(options.position.x, options.position.y, options.size.w, options.size.h);
		this.frames = [];
		this.curFrame = 0;
		this.numFrames = this.frames.length;
	}

	addFrameFromRGBData(frameBuf: Buffer) {
		if (frameBuf.length !== (this.size.w * this.size.h * 3)) {
			throw new Error ("Frame has incorrect size");
		}
		const newFrame = [...frameBuf].reduce<FrameDataType>((acc, colorVal, idx) => {
			const row = Math.trunc(idx / this.size.w);
			const col = idx % this.size.w;
			if (idx % 3 === 0) acc[row][col] = [0, 0, 0, 1];
			acc[row][col][idx % 3] = colorVal;
			return acc;
		}, Array(this.size.h).fill(undefined).map(row => Array(this.size.w)));
		this.frames.push(newFrame);
	}

	frame() {
		this.curFrame++;
		if (this.curFrame === this.numFrames) this.curFrame = 0;
		return this.frames[this.curFrame];
	}
}