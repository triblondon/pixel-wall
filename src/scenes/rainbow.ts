import Matrix, { PixelDataType } from '../utils/matrix-display';

const matrix = new Matrix({ cols: 12, rows: 12, frameRate: 30 });

// Get color for a position on the pride rainbow (fraction of 1)
const rainbowColourForPos = (pos: number): PixelDataType => {
	const cols = [ [231,0,0], [255,140,0], [255,239,0], [0,129,31], [0,68,255], [118,0,137], [0,68,255], [0,129,31], [255,239,0], [255,140,0], [231,0,0] ];
	const from = pos ? Math.floor((cols.length-1) * (pos % 1)) : 0;
	const to = from + 1;
	const offset = ((cols.length - 1) * (pos % 1)) % 1;
  const color: PixelDataType = [
		cols[from][0] + Math.trunc((cols[to][0] - cols[from][0]) * offset),
		cols[from][1] + Math.trunc((cols[to][1] - cols[from][1]) * offset),
		cols[from][2] + Math.trunc((cols[to][2] - cols[from][2]) * offset),
		1
	];
	return color;
}

const frameCount = 300;
let curFrame = 0;
matrix.play(() => {
	curFrame++;
	if (curFrame > frameCount) curFrame = 1;
	const offset = curFrame / frameCount;
	matrix.setEach((x,y) => rainbowColourForPos(offset + ((y / matrix.rows)/2)));
});

export default matrix;
