import { FrameDataType } from './matrix-display';

export default class Renderer {

	init(rows: number, cols: number): Promise<void> {
    return Promise.resolve();
  };

	render(frameData: FrameDataType): void {
  };
}