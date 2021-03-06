import Layer, { PositionType } from '../layer';
import { PixelDataType, FrameDataType, RowDataType,  } from '../matrix-display'

type OptionsType = {
	position: PositionType,
	text: string,
	color?: PixelDataType,
	speed: number,
	loop?: boolean
}

type CharMapType = {
	[index: string]: string
}

const CHAR_HEIGHT = 5;
const CHAR_SPACING = 1;

// https://www.shutterstock.com/image-vector/pixel-font-4x5-grid-numbers-letters-472434670
const CHARS: CharMapType = {
	'A': ' ####  ##  ######  #',
	'B': '### #  #### #  #### ',
	'C': ' ## #  ##   #  # ## ',
	'D': '### #  ##  ##  #### ',
	'E': '#####   ### #   ####',
	'F': '#####   ### #   #   ',
	'G': ' ####   # ###  # ###',
	'H': '#  ##  ######  ##  #',
	'I': '### #  #  # ###',
	'J': ' ###   #   ##  # ## ',
	'K': '#  ## # ##  # # #  #',
	'L': '#   #   #   #   ####',
	'M': '#   ### ### # ##   ##   #',
	'N': '#  ### ## ###  ##  #',
	'O': ' ## #  ##  ##  # ## ',
	'P': '#####  #### #   #   ',
	'Q': ' ##  #  # #  # #  #  ####',
	'R': '### #  ##  #### #  #',
	'S': ' ####    ##    #### ',
	'T': '#####  #    #    #    #  ',
	'U': '#  ##  ##  ##  # ## ',
	'V': '#  ##  ##  # # #  # ',
	'W': '# # ## # ## # ## # # # # ',
	'X': '#  ### # ## #  ##  #',
	'Y': '#  ##  # ###   # ## ',
	'Z': '####   # ## #   ####',
	'!': '### #',
	' ': '                    ',
};


export default class Text extends Layer {

	color: PixelDataType;
	speed: number;
	loop: boolean;

	private textPixels: string[];
	private dirty: boolean;
	private origX: number;
	private virtX: number;

	constructor(options: OptionsType) {
		super(options.position.x, options.position.y);
		this.color = options.color || [255,255,255,255];
		this.speed = options.speed || 0;
		this.loop = Boolean(options.loop);
		this.textPixels = [];
		this.dirty = false;
		this.origX = this.position.x;
		this.virtX = this.position.x;
		if (options.text) this.setText(options.text);
	}

	setText(str: string) {
		this.textPixels = [...(str.toUpperCase())].reduce((rows, char) => {
			if (!(char in CHARS)) char = ' ';
			const charWidth = CHARS[char].length / CHAR_HEIGHT;
			for (let y=0; y<rows.length; y++) {
				rows[y] += CHARS[char].substring((y * charWidth), ((y+1) * charWidth)) + (' '.repeat(CHAR_SPACING));
			}
			return rows;
		}, Array(CHAR_HEIGHT).fill(''));
		this.dirty = true;
	}

	frame() {
		if (this.speed) {
			this.virtX -= this.speed;
			if (this.virtX < (0 - this.textPixels[0].length - 1)) {
				if (this.loop) {
					this.virtX = this.origX;
				} else {
					this.active = false;
					return [];
				}
			}
		}
		if (this.dirty || this.speed) {
			this.dirty = false;
			this.position.x = Math.round(this.virtX);
			const pixelData: FrameDataType = [...this.textPixels]
				.map<RowDataType>(row => [...row]
					.map<PixelDataType>(char => (char !== ' ') ? this.color : [0, 0, 0, 0])
				)
			;
			return pixelData;
		} else {
			return [];
		}
	}
}
