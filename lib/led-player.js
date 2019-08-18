"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws281x_renderer_1 = require("./utils/ws281x-renderer");
const signal_handler_1 = require("./utils/signal-handler");
const argv = require('argv');
const args = argv.option({ name: 'scene', short: 's', type: 'string', description: 'Name of scene to render' }).run();
(async () => {
    const scene = await Promise.resolve().then(() => require('./scenes/' + args.options.scene));
    console.log(scene);
    signal_handler_1.default.on(['int', 'term'], () => scene.setAll(0, 0, 0).render());
    ws281x_renderer_1.init(scene.rows, scene.cols, 0.5);
    scene.useRenderer(ws281x_renderer_1.render);
})();
