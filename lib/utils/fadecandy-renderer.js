"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const net_1 = __importDefault(require("net"));
const OpcClientStream = require('openpixelcontrol-stream').OpcClientStream;
let client;
let pixelData;
const OPC_CHANNEL = 0;
exports.init = async (rows, cols) => {
    pixelData = new Uint8ClampedArray(4 + (rows * cols * 3));
    client = new OpcClientStream();
    return new Promise(resolve => {
        const socket = net_1.default.createConnection(7890, '127.0.0.1', () => {
            client.pipe(socket);
            resolve();
        });
    });
};
exports.render = (frameData) => {
    frameData.forEach((row, rowIdx) => {
        row.forEach((pixel, colIdx) => {
            const pixelIdx = ((rowIdx * row.length) + colIdx) * 3;
            pixelData[pixelIdx] = pixel[0];
            pixelData[pixelIdx + 1] = pixel[1];
            pixelData[pixelIdx + 2] = pixel[2];
        });
    });
    client.setPixelColors(OPC_CHANNEL, Buffer.from(pixelData));
};
