"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
if (process && process.getuid() !== 0) {
    console.error('Must run as root to use the WS2812 interface');
    process.exit(1);
}
// Calculate a duration in milliseconds between two BigInt timestamps
const durationMS = (endNS, startNS) => Math.round(Number(endNS - startNS) / 100000) / 10;
class MatrixDisplay {
    constructor(options) {
        this.options = {
            frameRate: 30,
            ...options
        };
        this.pixelData = Array(options.rows).fill(undefined).map(row => Array(options.cols));
        this.frameTimer = null;
    }
    get cols() {
        return this.options.cols;
    }
    get rows() {
        return this.options.cols;
    }
    setPixel(x, y, r, g, b) {
        this.pixelData[y][x] = [r, g, b, 1];
        return this;
    }
    setAll(r, g, b) {
        this.pixelData = this.pixelData.map(row => row.fill([r, g, b, 1]));
        return this;
    }
    setEach(callback) {
        for (let y = 0; y < this.options.rows; y++) {
            for (let x = 0; x < this.options.cols; x++) {
                const idx = (y * this.options.cols) + x;
                const [r, g, b] = callback.call(null, x, y, idx) || [0, 0, 0];
                this.setPixel(x, y, r, g, b);
            }
        }
    }
    useRenderer(renderFn) {
        this.options.renderFn = renderFn;
    }
    render() {
        this.options.renderFn && this.options.renderFn(this.pixelData);
    }
    play(callback) {
        const interval = Math.floor(1000 / this.options.frameRate);
        const timeStart = process.hrtime.bigint();
        let lastCall;
        let lastDur = 0;
        this.frameTimer = setInterval(() => {
            const timeCall = process.hrtime.bigint();
            // Perform layout calcs
            const data = callback(durationMS(timeStart, timeCall));
            if (data) {
                this.pixelData = data;
            }
            const timeLayout = process.hrtime.bigint();
            // Paint the new frame to the renderer
            this.render();
            const timePaint = process.hrtime.bigint();
            if (durationMS(timeLayout, timeCall) > 15) {
                console.log('Long layout: ' + durationMS(timeLayout, timeCall));
            }
            if (durationMS(timePaint, timeLayout) > 15) {
                console.log('Long paint: ' + durationMS(timePaint, timeLayout));
            }
            lastCall = timeCall;
            lastDur = durationMS(timePaint, timeCall);
        }, interval);
    }
    stop() {
        clearTimeout(this.frameTimer);
    }
}
exports.default = MatrixDisplay;
