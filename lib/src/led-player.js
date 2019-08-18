"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fire_1 = require("./scenes/fire");
const ws281x_renderer_1 = require("./utils/ws281x-renderer");
const signal_handler_1 = require("./utils/signal-handler");
signal_handler_1.default.on(['int', 'term'], () => fire_1.default.setAll(0, 0, 0).render());
ws281x_renderer_1.init(fire_1.default.rows, fire_1.default.cols, 0.5);
fire_1.default.useRenderer(ws281x_renderer_1.render);
