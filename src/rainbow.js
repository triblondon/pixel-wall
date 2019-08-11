const LEDMatrix = require('./led-matrix');
const signalHandler = require('./signal-handler');

const leds = new LEDMatrix({ maxBright: 0.8, frameRate: 30 });

// Get color for a position on the pride rainbow (fraction of 1)
const rainbowColourForPos = pos => {
	const cols = [ [231,0,0], [255,140,0], [255,239,0], [0,129,31], [0,68,255], [118,0,137], [0,68,255], [0,129,31], [255,239,0], [255,140,0], [231,0,0] ];
	const from = pos ? Math.floor((cols.length-1) * (pos % 1)) : 0;
	const to = from + 1;
	const offset = ((cols.length - 1) * (pos % 1)) % 1;
  const color = [
		cols[from][0] + Math.trunc((cols[to][0] - cols[from][0]) * offset),
		cols[from][1] + Math.trunc((cols[to][1] - cols[from][1]) * offset),
		cols[from][2] + Math.trunc((cols[to][2] - cols[from][2]) * offset)
	];
	return color;
}

signalHandler.on(['int', 'term'], () => leds.setAll(0,0,0).render());

const frameCount = 300;
let curFrame = 0;
leds.play(() => {
	curFrame++;
	if (curFrame > frameCount) curFrame = 1;
	const offset = curFrame / frameCount;
	leds.setEach((x,y) => {
		//if (x !== 5 && x !== 6) return;
		return rainbowColourForPos(offset + ((y / leds.rows)/2));
	 });
});

