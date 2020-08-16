"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
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
