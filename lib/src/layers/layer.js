"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Layer {
    constructor(x, y) {
        this.active = true;
        this.position = { x, y };
    }
    delete() {
        this.active = false;
    }
    isActive() { return Boolean(this.active); }
}
exports.default = Layer;
