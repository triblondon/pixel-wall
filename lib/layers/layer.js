"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Layer {
    constructor(x, y, w, h) {
        this.active = true;
        this.position = { x, y };
        this.size = { w, h };
    }
    delete() {
        this.active = false;
    }
    isActive() { return Boolean(this.active); }
}
exports.default = Layer;
