import { FrameDataType } from "./matrix-display";


export default abstract class Shape {

	abstract get pixelData(): FrameDataType
}
