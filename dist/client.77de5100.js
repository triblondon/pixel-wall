// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../node_modules/process/browser.js":[function(require,module,exports) {

// shim for using process in browser
var process = module.exports = {}; // cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
  throw new Error('setTimeout has not been defined');
}

function defaultClearTimeout() {
  throw new Error('clearTimeout has not been defined');
}

(function () {
  try {
    if (typeof setTimeout === 'function') {
      cachedSetTimeout = setTimeout;
    } else {
      cachedSetTimeout = defaultSetTimout;
    }
  } catch (e) {
    cachedSetTimeout = defaultSetTimout;
  }

  try {
    if (typeof clearTimeout === 'function') {
      cachedClearTimeout = clearTimeout;
    } else {
      cachedClearTimeout = defaultClearTimeout;
    }
  } catch (e) {
    cachedClearTimeout = defaultClearTimeout;
  }
})();

function runTimeout(fun) {
  if (cachedSetTimeout === setTimeout) {
    //normal enviroments in sane situations
    return setTimeout(fun, 0);
  } // if setTimeout wasn't available but was latter defined


  if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
    cachedSetTimeout = setTimeout;
    return setTimeout(fun, 0);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedSetTimeout(fun, 0);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
      return cachedSetTimeout.call(null, fun, 0);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
      return cachedSetTimeout.call(this, fun, 0);
    }
  }
}

function runClearTimeout(marker) {
  if (cachedClearTimeout === clearTimeout) {
    //normal enviroments in sane situations
    return clearTimeout(marker);
  } // if clearTimeout wasn't available but was latter defined


  if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
    cachedClearTimeout = clearTimeout;
    return clearTimeout(marker);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedClearTimeout(marker);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
      return cachedClearTimeout.call(null, marker);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
      // Some versions of I.E. have different rules for clearTimeout vs setTimeout
      return cachedClearTimeout.call(this, marker);
    }
  }
}

var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
  if (!draining || !currentQueue) {
    return;
  }

  draining = false;

  if (currentQueue.length) {
    queue = currentQueue.concat(queue);
  } else {
    queueIndex = -1;
  }

  if (queue.length) {
    drainQueue();
  }
}

function drainQueue() {
  if (draining) {
    return;
  }

  var timeout = runTimeout(cleanUpNextTick);
  draining = true;
  var len = queue.length;

  while (len) {
    currentQueue = queue;
    queue = [];

    while (++queueIndex < len) {
      if (currentQueue) {
        currentQueue[queueIndex].run();
      }
    }

    queueIndex = -1;
    len = queue.length;
  }

  currentQueue = null;
  draining = false;
  runClearTimeout(timeout);
}

process.nextTick = function (fun) {
  var args = new Array(arguments.length - 1);

  if (arguments.length > 1) {
    for (var i = 1; i < arguments.length; i++) {
      args[i - 1] = arguments[i];
    }
  }

  queue.push(new Item(fun, args));

  if (queue.length === 1 && !draining) {
    runTimeout(drainQueue);
  }
}; // v8 likes predictible objects


function Item(fun, array) {
  this.fun = fun;
  this.array = array;
}

Item.prototype.run = function () {
  this.fun.apply(null, this.array);
};

process.title = 'browser';
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues

process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) {
  return [];
};

process.binding = function (name) {
  throw new Error('process.binding is not supported');
};

process.cwd = function () {
  return '/';
};

process.chdir = function (dir) {
  throw new Error('process.chdir is not supported');
};

process.umask = function () {
  return 0;
};
},{}],"../src/utils/matrix-display.ts":[function(require,module,exports) {
var process = require("process");
"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Object.defineProperty(exports, "__esModule", {
  value: true
}); // Calculate a duration in milliseconds between two BigInt timestamps

var now = function now() {
  return typeof performance !== 'undefined' ? BigInt(Math.trunc(performance.now() * 1000000)) : process.hrtime.bigint();
};

var durationMS = function durationMS(endNS, startNS) {
  return Math.round(Number(endNS - startNS) / 100000) / 10;
};

var MatrixDisplay =
/*#__PURE__*/
function () {
  function MatrixDisplay(options) {
    _classCallCheck(this, MatrixDisplay);

    this.options = _objectSpread({
      frameRate: 30
    }, options);
    this.pixelData = Array(options.rows).fill(undefined).map(function (row) {
      return Array(options.cols);
    });
    this.frameTimer = null;
  }

  _createClass(MatrixDisplay, [{
    key: "setPixel",
    value: function setPixel(x, y, r, g, b) {
      this.pixelData[y][x] = [r, g, b, 1];
      return this;
    }
  }, {
    key: "setAll",
    value: function setAll(r, g, b) {
      this.pixelData = this.pixelData.map(function (row) {
        return row.fill([r, g, b, 1]);
      });
      return this;
    }
  }, {
    key: "setEach",
    value: function setEach(callback) {
      for (var y = 0; y < this.options.rows; y++) {
        for (var x = 0; x < this.options.cols; x++) {
          var idx = y * this.options.cols + x;

          var _ref = callback.call(null, x, y, idx) || [0, 0, 0],
              _ref2 = _slicedToArray(_ref, 3),
              r = _ref2[0],
              g = _ref2[1],
              b = _ref2[2];

          this.setPixel(x, y, r, g, b);
        }
      }
    }
  }, {
    key: "useRenderer",
    value: function useRenderer(renderFn) {
      this.options.renderFn = renderFn;
      this.render();
    }
  }, {
    key: "render",
    value: function render() {
      this.options.renderFn && this.options.renderFn(this.pixelData);
    }
  }, {
    key: "play",
    value: function play(callback) {
      var _this = this;

      var interval = Math.floor(1000 / this.options.frameRate);
      var timeStart = now();
      this.frameTimer = setInterval(function () {
        var timeCall = now(); // Perform layout calcs

        var data = callback(durationMS(timeCall, BigInt(0)));

        if (data) {
          _this.pixelData = data;
        }

        var timeLayout = now(); // Paint the new frame to the renderer

        _this.render();

        var timePaint = now();

        if (durationMS(timeLayout, timeCall) > 15) {
          console.log('Long layout: ' + durationMS(timeLayout, timeCall));
        }

        if (durationMS(timePaint, timeLayout) > 15) {
          console.log('Long paint: ' + durationMS(timePaint, timeLayout));
        }
      }, interval);
    }
  }, {
    key: "stop",
    value: function stop() {
      clearTimeout(this.frameTimer);
    }
  }, {
    key: "cols",
    get: function get() {
      return this.options.cols;
    }
  }, {
    key: "rows",
    get: function get() {
      return this.options.rows;
    }
  }]);

  return MatrixDisplay;
}();

exports.default = MatrixDisplay;
},{"process":"../node_modules/process/browser.js"}],"../src/layers/layer.ts":[function(require,module,exports) {
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Layer =
/*#__PURE__*/
function () {
  function Layer(x, y) {
    _classCallCheck(this, Layer);

    this.active = true;
    this.position = {
      x: x,
      y: y
    };
  }

  _createClass(Layer, [{
    key: "delete",
    value: function _delete() {
      this.active = false;
    }
  }, {
    key: "isActive",
    value: function isActive() {
      return Boolean(this.active);
    }
  }]);

  return Layer;
}();

exports.default = Layer;
},{}],"../src/layers/slideshow.ts":[function(require,module,exports) {
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var layer_1 = __importDefault(require("./layer"));

var Slideshow =
/*#__PURE__*/
function (_layer_1$default) {
  _inherits(Slideshow, _layer_1$default);

  function Slideshow(options) {
    var _this;

    _classCallCheck(this, Slideshow);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Slideshow).call(this, options.position.x, options.position.y));
    _this.size = {
      w: options.size.w,
      h: options.size.h
    };
    _this.frames = [];
    _this.curFrame = 0;
    _this.numFrames = _this.frames.length;
    return _this;
  }

  _createClass(Slideshow, [{
    key: "addFrameFromRGBData",
    value: function addFrameFromRGBData(frameBuf) {
      var _this2 = this;

      if (frameBuf.length !== this.size.w * this.size.h * 3) {
        throw new Error("Frame has incorrect size");
      }

      var newFrame = _toConsumableArray(frameBuf).reduce(function (acc, colorVal, idx) {
        var pxIdx = Math.trunc(idx / 3);
        var row = Math.trunc(pxIdx / _this2.size.w);
        var col = pxIdx % _this2.size.w;
        if (idx % 3 === 0) acc[row][col] = [0, 0, 0, 1];
        acc[row][col][idx % 3] = colorVal;
        return acc;
      }, Array(this.size.h).fill(undefined).map(function (row) {
        return Array(_this2.size.w);
      }));

      this.frames.push(newFrame);
      this.numFrames = this.frames.length;
    }
  }, {
    key: "frame",
    value: function frame() {
      this.curFrame++;
      if (this.curFrame === this.numFrames) this.curFrame = 0;
      return this.frames[this.curFrame];
    }
  }]);

  return Slideshow;
}(layer_1.default);

exports.default = Slideshow;
},{"./layer":"../src/layers/layer.ts"}],"../src/fire.json":[function(require,module,exports) {
module.exports = ["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"];
},{}],"../node_modules/base64-js/index.js":[function(require,module,exports) {
'use strict'

exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function getLens (b64) {
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42
  var validLen = b64.indexOf('=')
  if (validLen === -1) validLen = len

  var placeHoldersLen = validLen === len
    ? 0
    : 4 - (validLen % 4)

  return [validLen, placeHoldersLen]
}

// base64 is 4/3 + up to two characters of the original data
function byteLength (b64) {
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function _byteLength (b64, validLen, placeHoldersLen) {
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function toByteArray (b64) {
  var tmp
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]

  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))

  var curByte = 0

  // if there are placeholders, only get up to the last complete 4 chars
  var len = placeHoldersLen > 0
    ? validLen - 4
    : validLen

  var i
  for (i = 0; i < len; i += 4) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 18) |
      (revLookup[b64.charCodeAt(i + 1)] << 12) |
      (revLookup[b64.charCodeAt(i + 2)] << 6) |
      revLookup[b64.charCodeAt(i + 3)]
    arr[curByte++] = (tmp >> 16) & 0xFF
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 2) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 2) |
      (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 1) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 10) |
      (revLookup[b64.charCodeAt(i + 1)] << 4) |
      (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] +
    lookup[num >> 12 & 0x3F] +
    lookup[num >> 6 & 0x3F] +
    lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp =
      ((uint8[i] << 16) & 0xFF0000) +
      ((uint8[i + 1] << 8) & 0xFF00) +
      (uint8[i + 2] & 0xFF)
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(
      uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)
    ))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    parts.push(
      lookup[tmp >> 2] +
      lookup[(tmp << 4) & 0x3F] +
      '=='
    )
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1]
    parts.push(
      lookup[tmp >> 10] +
      lookup[(tmp >> 4) & 0x3F] +
      lookup[(tmp << 2) & 0x3F] +
      '='
    )
  }

  return parts.join('')
}

},{}],"../node_modules/ieee754/index.js":[function(require,module,exports) {
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = ((value * c) - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

},{}],"../node_modules/isarray/index.js":[function(require,module,exports) {
var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};

},{}],"../node_modules/buffer/index.js":[function(require,module,exports) {

var global = arguments[3];
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

'use strict'

var base64 = require('base64-js')
var ieee754 = require('ieee754')
var isArray = require('isarray')

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
  ? global.TYPED_ARRAY_SUPPORT
  : typedArraySupport()

/*
 * Export kMaxLength after typed array support is determined.
 */
exports.kMaxLength = kMaxLength()

function typedArraySupport () {
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
    return arr.foo() === 42 && // typed array instances can be augmented
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
}

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length)
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length)
    }
    that.length = length
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype
  return arr
}

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length)
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
  if (typeof Symbol !== 'undefined' && Symbol.species &&
      Buffer[Symbol.species] === Buffer) {
    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
    Object.defineProperty(Buffer, Symbol.species, {
      value: null,
      configurable: true
    })
  }
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
}

function allocUnsafe (that, size) {
  assertSize(size)
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0
  that = createBuffer(that, length)

  var actual = that.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual)
  }

  return that
}

function fromArrayLike (that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  that = createBuffer(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array)
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset)
  } else {
    array = new Uint8Array(array, byteOffset, length)
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array)
  }
  return that
}

function fromObject (that, obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    that = createBuffer(that, len)

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len)
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset  // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (Buffer.TYPED_ARRAY_SUPPORT &&
        typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end)
    newBuf.__proto__ = Buffer.prototype
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start]
    }
  }

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = (value & 0xff)
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if (code < 256) {
        val = code
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString())
    var len = bytes.length
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}

},{"base64-js":"../node_modules/base64-js/index.js","ieee754":"../node_modules/ieee754/index.js","isarray":"../node_modules/isarray/index.js","buffer":"../node_modules/buffer/index.js"}],"../src/scenes/fire.ts":[function(require,module,exports) {
var Buffer = require("buffer").Buffer;
"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var matrix_display_1 = __importDefault(require("../utils/matrix-display"));

var slideshow_1 = __importDefault(require("../layers/slideshow"));

var fire_json_1 = __importDefault(require("../fire.json"));

var fire = new slideshow_1.default({
  size: {
    w: 12,
    h: 12
  },
  position: {
    x: 0,
    y: 0
  }
});
var matrix = new matrix_display_1.default({
  rows: 12,
  cols: 12,
  frameRate: 20
});
fire_json_1.default.forEach(function (imageData) {
  return fire.addFrameFromRGBData(Buffer.from(imageData, 'base64'));
});
matrix.play(fire.frame.bind(fire));
exports.default = matrix;
},{"../utils/matrix-display":"../src/utils/matrix-display.ts","../layers/slideshow":"../src/layers/slideshow.ts","../fire.json":"../src/fire.json","buffer":"../node_modules/buffer/index.js"}],"index.ts":[function(require,module,exports) {
"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var fire_1 = __importDefault(require("../src/scenes/fire"));

function canvasMode() {
  var canvas = document.createElement('canvas');
  canvas.setAttribute('width', String(fire_1.default.cols));
  canvas.setAttribute('height', String(fire_1.default.rows));
  document.getElementById('output').appendChild(canvas);
  var ctx = canvas.getContext('2d');
  var imageData = ctx.createImageData(fire_1.default.cols, fire_1.default.rows);

  function renderToCanvas(data) {
    data.forEach(function (row, rowIdx) {
      row.forEach(function (pixel, colIdx) {
        var pos = (rowIdx * fire_1.default.cols + colIdx) * 4;

        var _pixel = _slicedToArray(pixel, 4),
            red = _pixel[0],
            green = _pixel[1],
            blue = _pixel[2],
            alpha = _pixel[3];

        imageData.data[pos] = red;
        imageData.data[pos + 1] = green;
        imageData.data[pos + 2] = blue;
        imageData.data[pos + 3] = 255;
      });
    });
    ctx.putImageData(imageData, 0, 0);
  }

  fire_1.default.useRenderer(renderToCanvas);
}

function tableMode() {
  var pixelEls = [];
  var table = document.createElement('table');
  var tbody = document.createElement('tbody');

  for (var y = 0; y < fire_1.default.rows; y++) {
    var row = document.createElement('tr');

    for (var x = 0; x < fire_1.default.cols; x++) {
      var cell = document.createElement('td');
      pixelEls.push(cell);
      row.appendChild(cell);
    }

    tbody.appendChild(row);
  }

  table.appendChild(tbody);
  document.getElementById('output').appendChild(table);

  function renderToTable(data) {
    data.forEach(function (row, rowIdx) {
      row.forEach(function (pixel, colIdx) {
        var pos = rowIdx * fire_1.default.cols + colIdx;
        pixelEls[pos].style.backgroundColor = "rgb(".concat(pixel[0], ", ").concat(pixel[1], ", ").concat(pixel[2], ")");
      });
    });
  }

  fire_1.default.useRenderer(renderToTable);
}

document.addEventListener('DOMContentLoaded', tableMode);
},{"../src/scenes/fire":"../src/scenes/fire.ts"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "58129" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else {
        window.location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.ts"], null)
//# sourceMappingURL=/client.77de5100.js.map