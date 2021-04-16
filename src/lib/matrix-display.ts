import Renderer from "./renderer";
import Scene from "./scene";

type OptionsType = {
	cols?: number;
	rows?: number;
	frameRate?: number;
	renderer?: Renderer;
	scene?: Scene;
};

export type PixelDataType = [number, number, number, number];
export type RowDataType = PixelDataType[]
export type FrameDataType = RowDataType[];
export type FrameFunctionType = (frameBudget: number) => FrameDataType | void;

// Calculate a duration in milliseconds between two BigInt timestamps
const now = () => process.hrtime.bigint();
const durationMS = (endNS: bigint, startNS: bigint): number => Math.round(Number(endNS - startNS) / 100000) / 10;

export default class MatrixDisplay {

	#cols: number;
	#rows: number;
	#frameRate: number;
	#renderer: Renderer;
	#scene: Scene;
	#pixelData: FrameDataType;
	#frameTimer: NodeJS.Timeout | null;

	constructor(options: OptionsType = {}) {
		this.#cols = options.cols || 1;
		this.#rows = options.rows || 1;
		this.#frameRate = options.frameRate || 30;
		this.#renderer = options.renderer || new Renderer();
		this.#scene = options.scene || new Scene();
		this.#frameTimer = null;
		this.#pixelData = [];
		this.init();
	}

	set cols(newVal) {
		this.#cols = newVal;
		this.init();
	}
	get cols() { return this.#cols; }

	set rows(newVal) {
		this.#rows = newVal;
		this.init();
	}
	get rows() { return this.#rows; }

	useRenderer(renderer: Renderer) {
		this.#renderer = renderer;
		this.init();
	}

	init() {
		this.#pixelData = Array(this.rows).fill(undefined).map(() => Array(this.cols));
		this.#renderer.init(this.#rows, this.#cols);
		this.#scene.init(this.#rows, this.#cols);
	}

	setPixel(x: number, y: number, r: number, g: number, b: number) {
		this.#pixelData[y][x] = [r, g, b, 1];
		return this;
	}
	setAll(r: number, g: number, b: number) {
		this.#pixelData = this.#pixelData.map(row => row.fill([r, g, b, 1]));
		return this;
	}
	setEach(callback: (x: number, y: number, idx: number) => PixelDataType) {
		for (let y = 0; y < this.#rows; y++) {
			for (let x = 0; x < this.#cols; x++) {
				const idx = (y * this.#cols) + x;
				const [r, g, b] = callback.call(null, x, y, idx) || [0, 0, 0];
				this.setPixel(x, y, r, g, b);
			}
		}
	}

	play() {
		const interval = Math.floor(1000 / this.#frameRate);
		this.#frameTimer = setInterval(() => {
			const timeCall = now();

			// Perform layout calcs
			const data = this.#scene.frame(durationMS(timeCall, BigInt(0)));
			if (data) {
				this.#pixelData = data;
			}
			const timeLayout = now();

			// Paint the new frame to the renderer
			this.#renderer.render(this.#pixelData);
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
		if (this.#frameTimer) {
			clearTimeout(this.#frameTimer);
		}
	}
}
