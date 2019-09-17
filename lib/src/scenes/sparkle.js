"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const matrix_display_1 = __importDefault(require("../utils/matrix-display"));
const matrix = new matrix_display_1.default({ cols: 12, rows: 12, frameRate: 30 });
matrix.setAll(30, 30, 30);
var curRow = 0, curCol = 0;
matrix.play(() => {
    const newRow = Math.floor(Math.random() * matrix.cols);
    const newCol = Math.floor(Math.random() * matrix.rows);
    matrix.setPixel(curCol, curRow, 30, 30, 30).setPixel(newCol, newRow, 255, 255, 255);
    curCol = newCol;
    curRow = newRow;
});
exports.default = matrix;
