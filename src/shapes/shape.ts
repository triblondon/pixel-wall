import { FrameDataType } from "../utils/matrix-display";


export default abstract class Shape {

	abstract get pixelData(): FrameDataType
}
