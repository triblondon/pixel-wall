import { FrameDataType } from '../matrix-display';
import { createConnection } from 'net';
import Renderer from '../renderer';

const OpcClientStream = require('openpixelcontrol-stream').OpcClientStream;

const OPC_CHANNEL = 0;

export default class FadeCandyRenderer extends Renderer {

	#client: any
	#pixelData: Uint8ClampedArray;

	constructor() {
		super();
		this.#pixelData = new Uint8ClampedArray(0);
	}

	async init(rows: number, cols: number): Promise<void> {
		this.#pixelData = new Uint8ClampedArray(4 + (rows * cols * 3));
		this.#client = new OpcClientStream();
		return new Promise(resolve => {
			const socket = createConnection(7890, '127.0.0.1', () => {
				this.#client.pipe(socket);
				console.log('Connected to Fadecandy server');
				resolve();
			});
		});
	}

	render(frameData: FrameDataType) {
		frameData.forEach((row, rowIdx) => {
			row.forEach((pixel, colIdx) => {
				const pixelIdx = ((rowIdx * row.length) + colIdx) * 3;
				this.#pixelData[pixelIdx] = pixel[0];
				this.#pixelData[pixelIdx+1] = pixel[1];
				this.#pixelData[pixelIdx+2] = pixel[2];
			})
		})
		if (Date.now() % 30 === 0) {
			console.log(this.#pixelData);
		}
		this.#client.setPixelColors(OPC_CHANNEL, Buffer.from(this.#pixelData));
	}
}