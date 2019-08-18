import scene from './scenes/sparkle';
import { init, render } from './utils/ws281x-renderer';
import signalHandler from './utils/signal-handler';

signalHandler.on(['int', 'term'], () => scene.setAll(0,0,0).render());

init(scene.rows, scene.cols, 0.5);

scene.useRenderer(render)
