"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fadecandy_renderer_1 = require("./utils/fadecandy-renderer");
const signal_handler_1 = __importDefault(require("./utils/signal-handler"));
const argv = require('argv');
const args = argv.option({ name: 'scene', short: 's', type: 'string', description: 'Name of scene to render' }).run();
(async () => {
    const scene = (await Promise.resolve().then(() => __importStar(require('./scenes/' + args.options.scene)))).default;
    console.log(scene);
    signal_handler_1.default.on(['int', 'term'], () => scene.setAll(0, 0, 0).render());
    fadecandy_renderer_1.init(scene.rows, scene.cols);
    scene.useRenderer(fadecandy_renderer_1.render);
})();
