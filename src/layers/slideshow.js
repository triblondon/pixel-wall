
class Slideshow {
	constructor(options) {
		this.active = true;
		this.frames = options.frames || [];
		this.position = options.position || { x: 0, y: 0 };
		this.size = options.size || { w: 0, h: 0 };

		this.curFrame = 0;
		this.numFrames = this.frames.length;
	}
	frame() {
		this.curFrame++;
		if (this.curFrame === this.numFrames) this.curFrame = 0;
		return this.frames[this.curFrame];
	}
	delete() {
		this.active = false;
	}
	isActive() {
		return this.active;
	}
}

module.exports = Slideshow;
