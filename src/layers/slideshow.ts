import Layer, { LayerOptionsType } from './layer';
import { FrameDataType } from '../utils/matrix-display';

type SizeType = { w: number, h: number };
type SlideshowOptionsType = LayerOptionsType & { size: SizeType };

export default class Slideshow extends Layer {

	size: SizeType;
	frames: FrameDataType[];
	curFrame: number;
	numFrames: number;

	constructor(options: SlideshowOptionsType) {
		super(options.position.x, options.position.y);
		this.size = { w: options.size.w, h: options.size.h };
		this.frames = [];
		this.curFrame = 0;
		this.numFrames = this.frames.length;
	}

	addFrameFromRGBData(frameBuf: Buffer) {
		if (frameBuf.length !== (this.size.w * this.size.h * 3)) {
			throw new Error ("Frame has incorrect size");
		}
		const newFrame = [...frameBuf].reduce<FrameDataType>((acc, colorVal, idx) => {
			const pxIdx = Math.trunc(idx / 3);
			const row = Math.trunc(pxIdx / this.size.w);
			const col = pxIdx % this.size.w;
			if (idx % 3 === 0) acc[row][col] = [0, 0, 0, 1];
			acc[row][col][idx % 3] = colorVal;
			return acc;
		}, Array(this.size.h).fill(undefined).map(row => Array(this.size.w)));
		this.frames.push(newFrame);
		this.numFrames = this.frames.length;
	}

	frame() {
		this.curFrame++;
		if (this.curFrame === this.numFrames) this.curFrame = 0;
		return this.frames[this.curFrame];
	}
}
