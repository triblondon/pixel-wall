const ws281x = require('rpi-ws281x-native');
;
if (process && process.getuid() !== 0) {
    console.error('Must run as root to use the WS2812 interface');
    process.exit(1);
}
// Generate color value from RGB
const color = (r, g, b) => ((r & 0xff) << 16) + ((g & 0xff) << 8) + (b & 0xff);
// Map 2D grid position to 1D index in a snake-wired grid
const coordsToIndex = (x, y, cols) => (cols * y) + ((y % 2) ? x : (cols - 1) - x);
// Calculate a duration in milliseconds between two BigInt timestamps
const durationMS = (endNS, startNS) => Math.round(Number(endNS - startNS) / 100000) / 10;
class LEDMatrix {
    constructor(options) {
        this.options = {
            cols: 'sdfsf',
            rows: 12,
            maxBright: 0.4,
            frameRate: 30,
            ...options
        };
        this.pixelData = new Uint32Array(this.options.rows * this.options.cols);
        this.frameTimer = null;
        ws281x.init(this.options.cols * this.options.rows);
        ws281x.setBrightness(Math.round(this.options.maxBright * 255));
    }
    get cols() {
        return this.options.cols;
    }
    get rows() {
        return this.options.cols;
    }
    setPixel(x, y, r, g, b) {
        this.pixelData[coordsToIndex(x, y, this.options.cols)] = color(r, g, b);
        return this;
    }
    setAll(r, g, b) {
        this.pixelData.fill(color(r, g, b));
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
    render() {
        ws281x.render(this.pixelData);
        return this;
    }
    play(callback) {
        const interval = Math.floor(1000 / this.options.frameRate);
        let lastCall;
        let lastDur = 0;
        this.frameTimer = setInterval(() => {
            const timeCall = process.hrtime.bigint();
            const data = callback.call(this, interval - lastDur);
            if (data) {
                this.setEach((x, y, idx) => data[idx]);
            }
            const timeLayout = process.hrtime.bigint();
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
module.exports = LEDMatrix;
