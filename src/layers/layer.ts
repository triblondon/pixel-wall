import { FrameDataType } from "../utils/matrix-display";

export type SizeType = { w: number, h: number }
export type PositionType = { x: number, y: number }

export type LayerOptionsType = {
	size: SizeType,
	position: PositionType
}

export default abstract class Layer {

	protected active: boolean
	size: SizeType
	position: PositionType

	constructor(x: number, y: number, w: number, h: number) {
		this.active = true;
		this.position = { x, y }
		this.size = { w, h }
	}

	delete() {
		this.active = false;
	}

	isActive() { return Boolean(this.active); }

	abstract frame(timeOffset: number): FrameDataType
}
