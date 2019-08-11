"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const layer_1 = require("./layer");
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
class Text extends layer_1.default {
    constructor(options) {
        super(options.position.x, options.position.y, 0, CHAR_HEIGHT);
        this.text = options.text || '';
        this.color = options.color || [255, 255, 255, 255];
        this.speed = options.speed || 0;
        this.loop = Boolean(options.loop);
        this.textPixels = null;
        this.dirty = false;
        this.origX = this.position.x;
    }
    setText(str) {
        this.textPixels = [...str].reduce((rows, char) => {
            if (!(char in CHARS))
                char = ' ';
            const charWidth = CHARS[char].length / CHAR_HEIGHT;
            for (let y = 0; y < rows.length; y++) {
                rows[y] += CHARS[char].substring((y * charWidth), ((y + 1) * charWidth)) + (' '.repeat(CHAR_SPACING));
            }
            return rows;
        }, Array(CHAR_HEIGHT).fill(''));
        this.size.w = this.textPixels[0].length;
        this.text = str;
        this.dirty = true;
    }
    frame(timeOffset) {
        if (this.speed) {
            this.position.x -= this.speed;
            if (this.position.x < (0 - this.size.w - 1)) {
                if (this.loop) {
                    this.position.x = this.origX;
                }
                else {
                    this.active = false;
                    return;
                }
            }
        }
        if (this.dirty || this.speed) {
            this.dirty = false;
            const pixelData = [...this.textPixels]
                .map(row => [...row]
                .map(char => (char !== ' ') ? this.color : [0, 0, 0, 0]));
            return pixelData;
        }
        else {
            return null;
        }
    }
}
module.exports = Text;
