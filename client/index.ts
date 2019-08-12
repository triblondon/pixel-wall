import scene from '../src/scenes/sparkle';
import { FrameDataType } from '../src/utils/matrix-display';

document.addEventListener('DOMContentLoaded', () => {
	const canvas: HTMLCanvasElement = document.querySelector('canvas');

	const ctx = canvas.getContext('2d');
	let imageData = ctx.createImageData(scene.cols, scene.rows);


	function renderToCanvas(data: FrameDataType) {
		data.forEach((row, rowIdx) => {
			row.forEach((pixel, colIdx) => {
				let pos = ((rowIdx * scene.cols) + colIdx) * 4;
				const [ red, green, blue, alpha ] = pixel;

				imageData.data[pos] = red;
				imageData.data[pos+1] = green;
				imageData.data[pos+2] = blue;
				imageData.data[pos+3] = 255;
			})
		})
		ctx.putImageData(imageData, 0, 0);
	}

	scene.useRenderer(renderToCanvas);
});
