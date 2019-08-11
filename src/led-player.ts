import fireScene from './scenes/fire';
import { init, render } from './utils/ws281x-renderer';
import signalHandler from './utils/signal-handler';

signalHandler.on(['int', 'term'], () => fireScene.setAll(0,0,0).render());

init(fireScene.rows, fireScene.cols, 0.5);

fireScene.useRenderer(render)
