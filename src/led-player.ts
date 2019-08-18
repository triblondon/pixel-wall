import { init, render } from './utils/ws281x-renderer';
import signalHandler from './utils/signal-handler';

const argv = require('argv');

const args = argv.option({ name: 'scene', short: 's', type: 'string', description: 'Name of scene to render' }).run();

(async () => {
	const scene = (await import('./scenes/' + args.options.scene)).default;

	console.log(scene);

	signalHandler.on(['int', 'term'], () => scene.setAll(0,0,0).render());

	init(scene.rows, scene.cols, 0.5);

	scene.useRenderer(render)
})()
