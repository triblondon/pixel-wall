"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SIGNALS = ['SIGINT', 'SIGTERM'];
const TERM_SIGNALS = ['SIGINT', 'SIGTERM'];
const normaliseName = (str) => str.toLowerCase().replace(/^sig/, '');
let handlers = [];
SIGNALS.forEach(signal => {
    process.on(signal, () => {
        handlers
            .filter(h => normaliseName(h.sigName) === normaliseName(signal))
            .forEach(h => {
            h.fn.call(null);
        });
        if (TERM_SIGNALS.includes(signal)) {
            process.nextTick(() => process.exit(0));
        }
    });
});
exports.default = {
    on: (sigNames, fn) => {
        sigNames.forEach(sigName => handlers.push({ sigName, fn }));
    }
};