const Layer = require('./layer');

const CHAR_WIDTH = 4;
const CHAR_HEIGHT = 5;
const CHAR_SPACING = 1;
const CHARS = {
	'A': ' ####  ##  ######  #',
	'C': ' ## #  ##   #  # ## ',
	'D': '### #  ##  ##  #### ',
	'E': '#####   ### #   ####',
	'H': '#  ##  ######  ##  #',
	'I': '### #  #  # ###',
	'N': '#  ### ## ###  ##  #',
	'O': ' ## #  ##  ##  # ## ',
	'R': '### #  ##  #### #  #',
	'!': '### #',
	' ': '                    ',
};


class Text extends Layer {
	constructor(options) {
		super(options.x || 0, options.y || 0, 0, CHAR_HEIGHT);
		this.text = options.text || '';
		this.color = options.color || [255,255,255,255];
		this.speed = options.speed || 0;
		this.loop = Boolean(options.loop);
		this.active = true;
		this.textPixels = null;
		this.dirty = false;
		this.origX = this.x;
	}
	setText(str) {
		this.textPixels = [...str].reduce((rows, char) => {
			if (!(char in CHARS)) char = ' ';
			const charWidth = CHARS[char].length / CHAR_HEIGHT;
			for (let y=0; y<rows.length; y++) {
				rows[y] += CHARS[char].substring((y * charWidth), ((y+1) * charWidth)) + (' '.repeat(CHAR_SPACING));
			}
			return rows;
		}, Array(CHAR_HEIGHT).fill(''));
		this.w = this.textPixels[0].length;
		this.text = str;
		this.dirty = true;
	}
	frame() {
		if (this.speed) {
			this.x -= this.speed;
			if (this.x < (0 - this.w - 1)) {
				if (this.loop) {
					this.x = this.origX;
				} else {
					this.active = false;
					return;
				}
			}
		}
		if (this.dirty || this.speed) {
			this.dirty = false;
			return [...this.textPixels].map(row => [...row].map(char => (char !== ' ') ? this.color : [0,0,0,255]));
		}
	}
}

module.exports = Text;
