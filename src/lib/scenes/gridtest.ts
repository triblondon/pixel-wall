import Matrix from '../matrix-display';

const matrix = new Matrix({ cols: 12, rows: 12, frameRate: 30 });

matrix.setAll(50, 50, 50).render();

var curRow = 0, curCol = 0;

matrix.play(() => {
	curCol++;
	if (curCol == matrix.cols) {
		curCol = 0;
		curRow++;
	}
	if (curRow == matrix.rows) {
		curCol = curRow = 0;
	}
  matrix.setEach((x, y) => {
		const shade = (curCol === x && curRow === y) ? 255 : (curCol === x || curRow === y) ? 120 : 0;
		return [shade, shade, shade, 1];
	});
});

export default matrix;
