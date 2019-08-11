const ws281x = require('rpi-ws281x-native');

type OptionsType = {
	cols: number;
	rows: number;
	maxBright?: number;
	frameRate?: number;
};

export type PixelDataType = [number, number, number, number];
export type RowDataType = PixelDataType[]
export type FrameDataType = RowDataType[];
export type FrameFunctionType = (frameBudget: number) => FrameDataType;

if (process && process.getuid() !== 0) {
	console.error('Must run as root to use the WS2812 interface');
	process.exit(1);
}

// Generate color value from RGB
const color = (r: number, g: number, b: number): number => ((r & 0xff) << 16) + ((g & 0xff) << 8) + (b & 0xff);

// Map 2D grid position to 1D index in a snake-wired grid
const coordsToIndex = (x: number, y: number, cols: number): number => (cols * y) + ((y % 2) ? x : (cols - 1) - x);

// Calculate a duration in milliseconds between two BigInt timestamps
const durationMS = (endNS: bigint, startNS: bigint): number => Math.round(Number(endNS - startNS) / 100000) / 10;

export default class LEDMatrix {

	options: OptionsType
	pixelData: Uint32Array
	frameTimer: NodeJS.Timeout

	constructor(options: OptionsType) {
		this.options = {
			maxBright: 0.4,
			frameRate: 30,
			...options
		}
		this.pixelData = new Uint32Array(this.options.rows * this.options.cols);
		this.frameTimer = null;
		ws281x.init(this.options.cols * this.options.rows);
		ws281x.setBrightness(Math.round(this.options.maxBright * 255));
	}
	get cols() {
		return this.options.cols;
	}
	get rows() {
		return this.options.cols;
	}
	setPixel(x: number, y: number, r: number, g: number, b: number) {
		this.pixelData[coordsToIndex(x, y, this.options.cols)] = color(r, g, b);
		return this;
	}
	setAll(r: number, g: number, b: number) {
		this.pixelData.fill(color(r, g, b));
		return this;
	}
	setEach(callback: (x: number, y: number, idx: number) => PixelDataType) {
		for (let y = 0; y < this.options.rows; y++) {
			for (let x = 0; x < this.options.cols; x++) {
				const idx = (y * this.options.cols) + x;
				const [r, g, b] = callback.call(null, x, y, idx) || [0,0,0];
				this.setPixel(x, y, r, g, b);
			}
		}
	}
	render() {
		ws281x.render(this.pixelData);
		return this;
	}
	play(callback: FrameFunctionType) {
		const interval = Math.floor(1000 / this.options.frameRate);
		const timeStart = process.hrtime.bigint();
		let lastCall: bigint;
		let lastDur: number = 0;
		this.frameTimer = setInterval(() => {
			const timeCall = process.hrtime.bigint();

			const data = callback(durationMS(timeStart, timeCall));
			if (data) {
				this.setEach((x, y) => data[y][x]);
			}

			const timeLayout = process.hrtime.bigint();
			this.render();
			const timePaint = process.hrtime.bigint();
			if (durationMS(timeLayout, timeCall) > 15) {
				console.log('Long layout: '+durationMS(timeLayout, timeCall));
			}
			if (durationMS(timePaint,timeLayout) > 15) {
				console.log('Long paint: '+durationMS(timePaint,timeLayout));
			}
			lastCall = timeCall;
			lastDur = durationMS(timePaint, timeCall);
		}, interval);
	}
	stop() {
		clearTimeout(this.frameTimer);
	}
}
