import Matrix from '../utils/matrix-display';

const matrix = new Matrix({ cols: 12, rows: 12, frameRate: 30 });

matrix.setAll(30, 30, 30);

var curRow = 0, curCol = 0;

matrix.play(() => {
  const newRow = Math.floor(Math.random() * matrix.rows);
  const newCol = Math.floor(Math.random() * matrix.cols);
  matrix.setPixel(curCol, curRow, 30, 30, 30).setPixel(newCol,newRow, 255, 255, 255);
  curCol = newCol;
  curRow = newRow;
});

export default matrix;
