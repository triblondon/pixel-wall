const LEDMatrix = require('./led-matrix');
const signalHandler = require('./signal-handler');

const leds = new LEDMatrix({ maxBright: 1, frameRate: 30 });

signalHandler.on(['int', 'term'], () => leds.setAll(0,0,0).render());

leds.setAll(30, 30, 30).render();

var curRow = 0, curCol = 0;

leds.play(() => {
  const newRow = Math.floor(Math.random() * leds.cols);
  const newCol = Math.floor(Math.random() * leds.rows);
  leds.setPixel(curCol, curRow, 30, 30, 30).setPixel(newCol,newRow, 255, 255, 255);
  curCol = newCol;
  curRow = newRow;
});

console.log('Started effect. Press <ctrl>+C to exit.');
