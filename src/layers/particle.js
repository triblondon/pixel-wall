
class Particle {
	constructor(initialState, frameCallback) {
		this.active = true;
		this.state = {
			position: { x: 0, y: 0 },
			...initialState
		};
		this.frameCallback = frameCallback;
	}
	frame() {
		this.state = this.frameCallback.call(this, {...this.state});
		return Array(this.state.height).fill().map(() => {
			return Array(this.state.width).fill().map(() => {
				return [...this.state.color, Math.max(Math.min(this.state.opacity, 1), 0)];
			})
		});
	}
	delete() {
		this.active = false;
	}
	isActive() {
		return this.active;
	}
	get position() {
		// Round the position
		return { x: Math.trunc(this.state.position.x), y: Math.trunc(this.state.position.y) };
	}
}

module.exports = Particle;
