import { FrameDataType } from './matrix-display';
import net from 'net';

const OpcClientStream = require('openpixelcontrol-stream').OpcClientStream;

let client: any;
let pixelData: Uint8ClampedArray;
const OPC_CHANNEL = 0;

export const init = async (rows:number, cols:number): Promise<undefined> => {
	pixelData = new Uint8ClampedArray(4 + (rows * cols * 3));
	client = new OpcClientStream();
	return new Promise(resolve => {
		const socket = net.createConnection(7890, '127.0.0.1', () => {
			client.pipe(socket);
			resolve();
		});
	});
};

export const render = (frameData: FrameDataType) => {
	frameData.forEach((row, rowIdx) => {
		row.forEach((pixel, colIdx) => {
			const pixelIdx = ((rowIdx * row.length) + colIdx) * 3;
			pixelData[pixelIdx] = pixel[0];
			pixelData[pixelIdx+1] = pixel[1];
			pixelData[pixelIdx+2] = pixel[2];
		})
	})
	client.setPixelColors(OPC_CHANNEL, Buffer.from(pixelData));
}
