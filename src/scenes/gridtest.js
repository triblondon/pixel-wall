const LEDMatrix = require('./led-matrix');
const signalHandler = require('./signal-handler');

const leds = new LEDMatrix({ maxBright: 0.4, frameRate: 10 });

signalHandler.on(['int', 'term'], () => leds.setAll(0,0,0).render());

leds.setAll(50, 50, 50).render();

var curRow = 0, curCol = 0;

leds.play(() => {
	curCol++;
	if (curCol == leds.cols) {
		curCol = 0;
		curRow++;
	}
	if (curRow == leds.rows) {
		curCol = curRow = 0;
	}
  leds.setEach((x, y) => {
		const bright = (curCol === x || curRow === y) ? 255 : 0;
		return [bright, bright, bright];
	});
});
