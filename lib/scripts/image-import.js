"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const dirName = path.join(__dirname, '../../images/fire');
const imageData = fs.
    readdirSync(dirName).
    filter(name => name.endsWith('.rgb'))
    .map(imageFileName => fs.readFileSync(path.join(dirName, imageFileName)))
    .map(buf => buf.toString('base64'));
console.log(JSON.stringify(imageData));
