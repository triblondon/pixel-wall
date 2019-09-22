"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const dirName = path.join(__dirname, '../../images/fire');
const imageData = fs.
    readdirSync(dirName).
    filter(name => name.endsWith('.rgb'))
    .map(imageFileName => fs.readFileSync(path.join(dirName, imageFileName)))
    .map(buf => buf.toString('base64'));
console.log(JSON.stringify(imageData));
