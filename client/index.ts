import scene from '../src/scenes/fading-blocks';
import { FrameDataType } from '../src/utils/matrix-display';

const canvas: HTMLCanvasElement = document.querySelector('canvas#output');
canvas.style.width = scene.cols + 'px';
canvas.style.height = scene.rows + 'px';

const ctx = canvas.getContext('2d');
let imageData = ctx.getImageData(0, 0, scene.cols, scene.rows);

function renderToCanvas(data: FrameDataType) {
	const cols = data[0].length;
	data.forEach((row, rowIdx) => {
		row.forEach((pixel, colIdx) => {
			let pos = ((rowIdx * cols) + colIdx) * 4;
			imageData.data[pos++] = pixel[0];
			imageData.data[pos++] = pixel[1];
			imageData.data[pos++] = pixel[2];
			imageData.data[pos++] = 255;
			ctx.putImageData(imageData, 0, 0);
		})
	})
}

scene.useRenderer(renderToCanvas);
