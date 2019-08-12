import scene from '../src/scenes/sparkle';
import { FrameDataType } from '../src/utils/matrix-display';

function canvasMode() {
	const canvas = document.createElement('canvas');
	canvas.setAttribute('width', String(scene.cols));
	canvas.setAttribute('height', String(scene.rows));
	document.getElementById('output').appendChild(canvas);

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
}

function tableMode() {
	const pixelEls: HTMLTableCellElement[] = [];
	const table = document.createElement('table');
	const tbody = document.createElement('tbody');
	for (let y = 0; y < scene.rows; y++) {
		const row = document.createElement('tr');
		for (let x = 0; x < scene.cols; x++) {
			const cell = document.createElement('td');
			pixelEls.push(cell);
			row.appendChild(cell);
		}
		tbody.appendChild(row);
	}
	table.appendChild(tbody);
	document.getElementById('output').appendChild(table);

	function renderToTable(data: FrameDataType) {
		data.forEach((row, rowIdx) => {
			row.forEach((pixel, colIdx) => {
				let pos = ((rowIdx * scene.cols) + colIdx);
				pixelEls[pos].style.backgroundColor = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;
			})
		})
	}

	scene.useRenderer(renderToTable);
}

document.addEventListener('DOMContentLoaded', tableMode);
