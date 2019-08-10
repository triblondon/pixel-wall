const Layer = require('../layers/layer');

const mix = (baseColor, newColor) => {
	let [ baseRed, baseGreen, baseBlue ] = baseColor;
	let [ newRed, newGreen, newBlue, alpha ] = newColor;
	if (!alpha) alpha = 1;
	if (alpha > 1) alpha /= 255;
	return [
		Math.trunc((newRed * alpha) + (baseRed * (1 - alpha))),
		Math.trunc((newGreen * alpha) + (baseGreen * (1 - alpha))),
		Math.trunc((newBlue * alpha) + (baseBlue * (1 - alpha)))
	];
}

class Compositor {
	constructor(options = {}) {
		this.layers = [];
		this.bgColor = options.bgColor || [0,0,0];
	}
	add(layerObj) {
		if (!(layerObj instanceof Layer)) {
			throw new Error(layerObj + ' is not a Layer');
		}
		this.layers.push(layerObj);
	}
	frame(minX, minY, maxX, maxY) {
		const numCols = maxX - minX;
		return this.layers
			.reduce((acc, layerObj, idx) => {
				if (layerObj.isActive()) {
					const layerFrameData = layerObj.frame();
					if (!layerFrameData) return acc;
					layerFrameData.forEach((row, rowOffset) => {
						row.forEach((pixelColor, colOffset) => {
							const x = layerObj.position.x + colOffset - minX;
							const y = layerObj.position.y + rowOffset - minY;
							if (x >= minX && x <= maxX && y >= minY && y <= maxY) {
								const addr = (numCols * y) + x;
								acc[addr] = mix(acc[addr] || this.bgColor, pixelColor);
							}
						});
					});
				} else {
					this.layers = this.layers.filter(l => l.isActive());
				}
				return acc;
			}, [])
			/*.map((color, addr) => ({
				x: addr % numCols,
				y: Math.floor(addr / numCols),
				color
			}))*/
		;
	}
}

module.exports = Compositor;
