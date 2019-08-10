class Layer {
	constructor(x, y, w, h) {
		this.active = true;
		this.x = Number.parseInt(x);
		this.y = Number.parseInt(y);
		this.w = Number.parseInt(w);
		this.h = Number.parseInt(h);
	}
	delete() {
		this.active = false;
	}
	isActive() { return Boolean(this.active); }
	get position() { return { x: Math.trunc(this.x), y: Math.trunc(this.y) }; }
	get size() { return { w: Math.trunc(this.w), y: Math.trunc(this.h) }; }
}

module.exports = Layer;
