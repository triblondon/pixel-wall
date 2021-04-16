import { FrameDataType } from "./matrix-display";

export type PositionType = { x: number, y: number }

export type LayerOptionsType = {
	position: PositionType
}

export default abstract class Layer {

	protected active: boolean
	position: PositionType

	constructor(x: number, y: number) {
		this.active = true;
		this.position = { x, y }
	}

	delete() {
		this.active = false;
	}

	isActive() { return Boolean(this.active); }

	abstract frame(timeOffset?: number): FrameDataType
}
