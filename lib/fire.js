"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const led_matrix_1 = require("./utils/led-matrix");
const signal_handler_1 = require("./utils/signal-handler");
const slideshow_1 = require("./layers/slideshow");
const fs = require("fs");
const path = require("path");
signal_handler_1.default.on(['int', 'term'], () => leds.setAll(0, 0, 0).render());
const leds = new led_matrix_1.default({ rows: 12, cols: 12, maxBright: 1, frameRate: 20 });
const fire = new slideshow_1.default({ size: { w: 12, h: 12 }, position: { x: 0, y: 0 } });
const dirName = path.join(__dirname, '../images/fire');
fs.
    readdirSync(dirName).
    filter(name => name.endsWith('.rgb'))
    .forEach(imageFileName => {
    fire.addFrameFromRGBData(fs.readFileSync(path.join(dirName, imageFileName)));
});
leds.play(() => fire.frame());
