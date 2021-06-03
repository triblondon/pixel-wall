import express from 'express';

import LEDMatrix from './lib/matrix-display';
import FlamesScene from './lib/scenes/flames';
import FadeCandyRenderer from './lib/renderers/fadecandy';
import sunScheduler from './lib/sun-scheduler';

const PORT = process.env.PORT || 3030;
const GEO_LAT = Number.parseFloat(process.env.GEO_LAT || "38.7223");
const GEO_LNG = Number.parseFloat(process.env.GEO_LNG || "-9.1393");


const apiServer = express();
const scene: FlamesScene = new FlamesScene({ ledsPerFlame: 1, initialState: 'off' });
const matrix = new LEDMatrix({
  cols: 64,
  rows: 1,
  frameRate: 30,
  renderer: new FadeCandyRenderer(),
  scene
});

sunScheduler({
  position: { lat: GEO_LAT, lng: GEO_LNG },
  events: [
    { trigger: 'dusk', handler: () => scene.setState('on', { "duration": 30000, "variance": 1 }) },
    { trigger: (new Date(Date.now() + 10000)), handler: () => scene.setState('on', { "duration": 30000, "variance": 1 }) },
    { trigger: '01:00', handler: () => scene.setState('off', { "duration": 600000, "variance": 6 }) }
  ]
});
matrix.play();


apiServer.use(express.json());

apiServer.post('/start', (req, res) => {
  matrix.play();
  res.status(204).end();
});
apiServer.post('/stop', (req, res) => {
  matrix.stop();
  res.status(204).end();
});
apiServer.post('/setSceneState', (req, res) => {
  if (!['on', 'off'].includes(req.body.state)) throw new Error('Invalid `state` in input');
  scene.setState(req.body.state, req.body.options);
  res.status(204).end();
});


apiServer.listen(PORT, () => console.log("Server up"));