
type OptionsType = {
	cols: number;
	rows: number;
	frameRate?: number;
	renderFn?: Function;
};

export type PixelDataType = [number, number, number, number];
export type RowDataType = PixelDataType[]
export type FrameDataType = RowDataType[];
export type FrameFunctionType = (frameBudget: number) => FrameDataType | void;

// Calculate a duration in milliseconds between two BigInt timestamps
const now = () => (typeof performance !== 'undefined') ? BigInt(Math.trunc(performance.now() * 1000000)) : process.hrtime.bigint();
const durationMS = (endNS: bigint, startNS: bigint): number => Math.round(Number(endNS - startNS) / 100000) / 10;

export default class MatrixDisplay {

	options: OptionsType;
	pixelData: FrameDataType;
	frameTimer: NodeJS.Timeout;
	renderFn: Function;

	constructor(options: OptionsType) {
		this.options = {
			frameRate: 30,
			...options
		}
		this.pixelData = Array(options.rows).fill(undefined).map(row => Array(options.cols));
		this.frameTimer = null;
	}
	get cols() {
		return this.options.cols;
	}
	get rows() {
		return this.options.cols;
	}
	setPixel(x: number, y: number, r: number, g: number, b: number) {
		this.pixelData[y][x] = [r, g, b, 1];
		return this;
	}
	setAll(r: number, g: number, b: number) {
		this.pixelData = this.pixelData.map(row => row.fill([r, g, b, 1]));
		return this;
	}
	setEach(callback: (x: number, y: number, idx: number) => PixelDataType) {
		for (let y = 0; y < this.options.rows; y++) {
			for (let x = 0; x < this.options.cols; x++) {
				const idx = (y * this.options.cols) + x;
				const [r, g, b] = callback.call(null, x, y, idx) || [0, 0, 0];
				this.setPixel(x, y, r, g, b);
			}
		}
	}
	useRenderer(renderFn: Function) {
		this.options.renderFn = renderFn;
	}
	render() {
		this.options.renderFn && this.options.renderFn(this.pixelData);
	}
	play(callback: FrameFunctionType) {
		const interval = Math.floor(1000 / this.options.frameRate);
		const timeStart = now();
		this.frameTimer = setInterval(() => {
			const timeCall = now();

			// Perform layout calcs
			const data = callback(durationMS(timeCall, BigInt(0)));
			if (data) {
				this.pixelData = data;
			}
			const timeLayout = now();

			// Paint the new frame to the renderer
			this.render();
			const timePaint = now();

			if (durationMS(timeLayout, timeCall) > 15) {
				console.log('Long layout: '+durationMS(timeLayout, timeCall));
			}
			if (durationMS(timePaint,timeLayout) > 15) {
				console.log('Long paint: '+durationMS(timePaint,timeLayout));
			}
		}, interval);
	}
	stop() {
		clearTimeout(this.frameTimer);
	}
}
