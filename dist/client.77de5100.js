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
},{}],"../src/utils/compositor.ts":[function(require,module,exports) {
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

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

var layer_1 = __importDefault(require("../layers/layer"));

var mix = function mix(baseColor, newColor) {
  var _baseColor = _slicedToArray(baseColor, 3),
      baseRed = _baseColor[0],
      baseGreen = _baseColor[1],
      baseBlue = _baseColor[2];

  var _newColor = _slicedToArray(newColor, 4),
      newRed = _newColor[0],
      newGreen = _newColor[1],
      newBlue = _newColor[2],
      alpha = _newColor[3];

  if (alpha === undefined) alpha = 1;
  if (alpha > 1) alpha /= 255;
  return [Math.trunc(newRed * alpha + baseRed * (1 - alpha)), Math.trunc(newGreen * alpha + baseGreen * (1 - alpha)), Math.trunc(newBlue * alpha + baseBlue * (1 - alpha))];
};

var Compositor =
/*#__PURE__*/
function () {
  function Compositor(options) {
    _classCallCheck(this, Compositor);

    this.layers = [];
    this.bgColor = options && options.bgColor || [0, 0, 0, 0];
    this.bbox = options.bbox;
  }

  _createClass(Compositor, [{
    key: "add",
    value: function add(layerObj) {
      if (!(layerObj instanceof layer_1.default)) {
        throw new Error(layerObj + ' is not a Layer');
      }

      this.layers.push(layerObj);
    }
  }, {
    key: "frame",
    value: function frame(timeOffset) {
      var _this = this;

      var numCols = this.bbox.maxX - this.bbox.minX + 1;
      var numRows = this.bbox.maxY - this.bbox.minY + 1;
      this.layers = this.layers.filter(function (l) {
        return l.isActive();
      });
      return this.layers.reduce(function (out, layerObj, idx) {
        var layerFrameData = layerObj.frame(timeOffset);
        if (!layerFrameData) return out;
        layerFrameData.forEach(function (row, rowOffset) {
          row.forEach(function (pixel, colOffset) {
            var x = layerObj.position.x + colOffset - _this.bbox.minX;
            var y = layerObj.position.y + rowOffset - _this.bbox.minY;

            if (x >= _this.bbox.minX && x <= _this.bbox.maxX && y >= _this.bbox.minY && y <= _this.bbox.maxY) {
              out[y][x] = mix(out[y][x] || _this.bgColor, pixel);
            }
          });
        });
        return out;
      }, Array(numRows).fill(undefined).map(function (row) {
        return Array(numCols).fill(_this.bgColor);
      }));
    }
  }]);

  return Compositor;
}();

exports.default = Compositor;
},{"../layers/layer":"../src/layers/layer.ts"}],"../node_modules/bezier-easing/src/index.js":[function(require,module,exports) {
/**
 * https://github.com/gre/bezier-easing
 * BezierEasing - use bezier curve for transition easing function
 * by Gaëtan Renaudeau 2014 - 2015 – MIT License
 */

// These values are established by empiricism with tests (tradeoff: performance VS precision)
var NEWTON_ITERATIONS = 4;
var NEWTON_MIN_SLOPE = 0.001;
var SUBDIVISION_PRECISION = 0.0000001;
var SUBDIVISION_MAX_ITERATIONS = 10;

var kSplineTableSize = 11;
var kSampleStepSize = 1.0 / (kSplineTableSize - 1.0);

var float32ArraySupported = typeof Float32Array === 'function';

function A (aA1, aA2) { return 1.0 - 3.0 * aA2 + 3.0 * aA1; }
function B (aA1, aA2) { return 3.0 * aA2 - 6.0 * aA1; }
function C (aA1)      { return 3.0 * aA1; }

// Returns x(t) given t, x1, and x2, or y(t) given t, y1, and y2.
function calcBezier (aT, aA1, aA2) { return ((A(aA1, aA2) * aT + B(aA1, aA2)) * aT + C(aA1)) * aT; }

// Returns dx/dt given t, x1, and x2, or dy/dt given t, y1, and y2.
function getSlope (aT, aA1, aA2) { return 3.0 * A(aA1, aA2) * aT * aT + 2.0 * B(aA1, aA2) * aT + C(aA1); }

function binarySubdivide (aX, aA, aB, mX1, mX2) {
  var currentX, currentT, i = 0;
  do {
    currentT = aA + (aB - aA) / 2.0;
    currentX = calcBezier(currentT, mX1, mX2) - aX;
    if (currentX > 0.0) {
      aB = currentT;
    } else {
      aA = currentT;
    }
  } while (Math.abs(currentX) > SUBDIVISION_PRECISION && ++i < SUBDIVISION_MAX_ITERATIONS);
  return currentT;
}

function newtonRaphsonIterate (aX, aGuessT, mX1, mX2) {
 for (var i = 0; i < NEWTON_ITERATIONS; ++i) {
   var currentSlope = getSlope(aGuessT, mX1, mX2);
   if (currentSlope === 0.0) {
     return aGuessT;
   }
   var currentX = calcBezier(aGuessT, mX1, mX2) - aX;
   aGuessT -= currentX / currentSlope;
 }
 return aGuessT;
}

function LinearEasing (x) {
  return x;
}

module.exports = function bezier (mX1, mY1, mX2, mY2) {
  if (!(0 <= mX1 && mX1 <= 1 && 0 <= mX2 && mX2 <= 1)) {
    throw new Error('bezier x values must be in [0, 1] range');
  }

  if (mX1 === mY1 && mX2 === mY2) {
    return LinearEasing;
  }

  // Precompute samples table
  var sampleValues = float32ArraySupported ? new Float32Array(kSplineTableSize) : new Array(kSplineTableSize);
  for (var i = 0; i < kSplineTableSize; ++i) {
    sampleValues[i] = calcBezier(i * kSampleStepSize, mX1, mX2);
  }

  function getTForX (aX) {
    var intervalStart = 0.0;
    var currentSample = 1;
    var lastSample = kSplineTableSize - 1;

    for (; currentSample !== lastSample && sampleValues[currentSample] <= aX; ++currentSample) {
      intervalStart += kSampleStepSize;
    }
    --currentSample;

    // Interpolate to provide an initial guess for t
    var dist = (aX - sampleValues[currentSample]) / (sampleValues[currentSample + 1] - sampleValues[currentSample]);
    var guessForT = intervalStart + dist * kSampleStepSize;

    var initialSlope = getSlope(guessForT, mX1, mX2);
    if (initialSlope >= NEWTON_MIN_SLOPE) {
      return newtonRaphsonIterate(aX, guessForT, mX1, mX2);
    } else if (initialSlope === 0.0) {
      return guessForT;
    } else {
      return binarySubdivide(aX, intervalStart, intervalStart + kSampleStepSize, mX1, mX2);
    }
  }

  return function BezierEasing (x) {
    // Because JavaScript number are imprecise, we should guarantee the extremes are right.
    if (x === 0) {
      return 0;
    }
    if (x === 1) {
      return 1;
    }
    return calcBezier(getTForX(x), mY1, mY2);
  };
};

},{}],"../src/layers/particle.ts":[function(require,module,exports) {
var process = require("process");
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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

var easing = require('bezier-easing'); // TODO: parcel vs typescript!


var TransitionEffect;

(function (TransitionEffect) {
  TransitionEffect["Fade"] = "fade";
  TransitionEffect["MoveY"] = "movey";
})(TransitionEffect = exports.TransitionEffect || (exports.TransitionEffect = {}));

exports.EASING_LINEAR = 'easeLinear';
exports.EASING_INCUBIC = 'easeInCubic';
var EASING_FUNCTIONS = {
  'easeLinear': easing(0, 0, 1, 1),
  'easeInCubic': easing(.55, .06, .67, .19)
};

var nowMS = function nowMS() {
  return typeof performance !== 'undefined' ? Math.trunc(performance.now()) : Number(process.hrtime.bigint()) / 1000000;
};

var Particle =
/*#__PURE__*/
function (_layer_1$default) {
  _inherits(Particle, _layer_1$default);

  function Particle(options) {
    var _this;

    _classCallCheck(this, Particle);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Particle).call(this, options.position.x, options.position.y));
    _this.transitions = options.transitions || [];
    _this.transitionProps = {
      opacity: undefined
    };
    _this.loop = 'loop' in options ? options.loop : true;
    _this.totalDuration = _this.transitions.reduce(function (acc, t) {
      return Math.max(acc, t.start + t.duration);
    }, 0);
    _this.timeCreated = nowMS();
    _this.source = options.source;
    _this.sourceData = _this.source.pixelData;
    return _this;
  }

  _createClass(Particle, [{
    key: "frame",
    value: function frame(frameTime) {
      var _this2 = this;

      var timeOffset = frameTime - this.timeCreated;

      if (this.totalDuration && timeOffset > this.totalDuration) {
        if (!this.loop) {
          this.delete();
          return null;
        } else {
          timeOffset = timeOffset % this.totalDuration;
          this.transitions.forEach(function (t) {
            t.complete = false;
          });
        }
      }

      this.transitions.filter(function (t) {
        return t.start <= timeOffset && !t.complete;
      }).forEach(function (t) {
        if (!t.easing) t.easing = exports.EASING_LINEAR;
        var effectOffset = Math.min((timeOffset - t.start) / t.duration, 1);
        t.complete = effectOffset >= 1;

        if (t.effect === TransitionEffect.Fade) {
          if (t.from === undefined) t.from = _this2.transitionProps.opacity;
          if (t.from === undefined) t.from = 1;
          _this2.transitionProps.opacity = t.from + (t.target - t.from) * EASING_FUNCTIONS[t.easing](effectOffset);
        } else if (t.effect === TransitionEffect.MoveY) {
          if (!('from' in t)) {
            t.from = _this2.position.y;
          } else {
            _this2.position.y = Math.trunc(t.from + (t.target - t.from) * EASING_FUNCTIONS[t.easing](effectOffset));
          }
        }
      });
      return this.sourceData.map(function (row) {
        return row.map(function (pxColor) {
          var newpx = [pxColor[0], pxColor[1], pxColor[2], pxColor[3]]; // TS doesn't seem to like spread operator here :-(

          if (_this2.transitionProps.opacity !== undefined) newpx[3] *= _this2.transitionProps.opacity;
          return newpx;
        });
      });
    }
  }]);

  return Particle;
}(layer_1.default);

exports.default = Particle;
},{"./layer":"../src/layers/layer.ts","bezier-easing":"../node_modules/bezier-easing/src/index.js","process":"../node_modules/process/browser.js"}],"../src/shapes/shape.ts":[function(require,module,exports) {
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Shape = function Shape() {
  _classCallCheck(this, Shape);
};

exports.default = Shape;
},{}],"../src/shapes/circle.ts":[function(require,module,exports) {
"use strict"; // http://groups.csail.mit.edu/graphics/classes/6.837/F98/Lecture6/circle.html
// https://stackoverflow.com/questions/10878209/midpoint-circle-algorithm-for-filled-circles

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

var shape_1 = __importDefault(require("./shape"));

var Circle =
/*#__PURE__*/
function (_shape_1$default) {
  _inherits(Circle, _shape_1$default);

  function Circle(options) {
    var _this;

    _classCallCheck(this, Circle);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Circle).call(this));
    var color = options.color || [255, 255, 255, 1];
    var radius = options.radius || 3;
    var smoothing = options.smoothing || 1;
    var plotRadius = radius * smoothing;
    var row = Array(plotRadius * 2 + smoothing).fill(undefined).map(function () {
      return [255, 0, 0, 0];
    });
    var pixels = Array(plotRadius * 2 + smoothing).fill(undefined).map(function () {
      return _toConsumableArray(row);
    });
    var xCenter = plotRadius;
    var yCenter = plotRadius;
    var rSq = plotRadius * plotRadius;

    for (var x2 = xCenter - plotRadius; x2 <= xCenter + plotRadius; x2++) {
      pixels[yCenter][x2] = color;
    }

    pixels[yCenter + plotRadius][xCenter] = color;
    pixels[yCenter - plotRadius][xCenter] = color;
    var x = 1;
    var y = Math.floor(Math.sqrt(rSq - 1) + 0.5);

    while (x < y) {
      for (var _x = xCenter - x; _x <= xCenter + x; _x++) {
        pixels[yCenter + y][_x] = color;
        pixels[yCenter - y][_x] = color;
      }

      for (var _x2 = xCenter - y; _x2 <= xCenter + y; _x2++) {
        pixels[yCenter + x][_x2] = color;
        pixels[yCenter - x][_x2] = color;
      }

      x++;
      y = Math.floor(Math.sqrt(rSq - x * x) + 0.5);
    }

    if (x == y) {
      for (var _x3 = xCenter - x; _x3 <= xCenter + x; _x3++) {
        pixels[yCenter + y][_x3] = color;
        pixels[yCenter - y][_x3] = color;
      }
    } // Downsample


    if (smoothing === 1) {
      _this.pixels = pixels;
    } else {
      _this.pixels = Array(radius * 2 + 1).fill(undefined).map(function (_, y) {
        return Array(radius * 2 + 1).fill(undefined).map(function (_, x) {
          var groupSum = [0, 0, 0, 0];

          for (var s = 0; s < smoothing * smoothing; s++) {
            var mappedY = y * smoothing + Math.floor(s / smoothing);
            var mappedX = x * smoothing + s % smoothing;
            groupSum[0] += pixels[mappedY][mappedX][0] * pixels[mappedY][mappedX][3];
            groupSum[1] += pixels[mappedY][mappedX][1] * pixels[mappedY][mappedX][3];
            groupSum[2] += pixels[mappedY][mappedX][2] * pixels[mappedY][mappedX][3];
            groupSum[3] += pixels[mappedY][mappedX][3];
          }

          groupSum[0] /= smoothing * smoothing;
          groupSum[1] /= smoothing * smoothing;
          groupSum[2] /= smoothing * smoothing;
          groupSum[3] /= smoothing * smoothing;
          return groupSum;
        });
      });
    }

    return _this;
  }

  _createClass(Circle, [{
    key: "pixelData",
    get: function get() {
      return this.pixels;
    }
  }]);

  return Circle;
}(shape_1.default);

exports.default = Circle;
},{"./shape":"../src/shapes/shape.ts"}],"../src/scenes/blobs.ts":[function(require,module,exports) {
"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

var __importStar = this && this.__importStar || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) {
    if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
  }
  result["default"] = mod;
  return result;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var matrix_display_1 = __importDefault(require("../utils/matrix-display"));

var compositor_1 = __importDefault(require("../utils/compositor"));

var particle_1 = __importStar(require("../layers/particle"));

var circle_1 = __importDefault(require("../shapes/circle"));

var randomInt = function randomInt(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1));
};

var matrix = new matrix_display_1.default({
  rows: 12,
  cols: 12,
  frameRate: 30
});
var compositor = new compositor_1.default({
  bbox: {
    minX: 0,
    minY: 0,
    maxX: matrix.cols - 1,
    maxY: matrix.rows - 1
  }
});

var addParticle = function addParticle() {
  var rad = randomInt(3, 7);
  var p = new particle_1.default({
    position: {
      x: randomInt(-1 * rad, matrix.cols - rad),
      y: randomInt(-1 * rad, matrix.rows - rad)
    },
    source: new circle_1.default({
      radius: rad,
      color: [randomInt(50, 255), randomInt(50, 255), randomInt(50, 255), 1],
      smoothing: 3
    }),
    transitions: [{
      start: 0,
      duration: 1000,
      effect: particle_1.TransitionEffect.Fade,
      from: 0,
      target: 0.5,
      easing: particle_1.EASING_INCUBIC
    }, {
      start: 2500,
      duration: 6000,
      effect: particle_1.TransitionEffect.Fade,
      target: 0,
      easing: particle_1.EASING_INCUBIC
    }],
    loop: false
  });
  compositor.add(p);
};

setInterval(addParticle, 2000); //addParticle();

matrix.play(compositor.frame.bind(compositor));
exports.default = matrix;
},{"../utils/matrix-display":"../src/utils/matrix-display.ts","../utils/compositor":"../src/utils/compositor.ts","../layers/particle":"../src/layers/particle.ts","../shapes/circle":"../src/shapes/circle.ts"}],"index.ts":[function(require,module,exports) {
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

var blobs_1 = __importDefault(require("../src/scenes/blobs"));

function canvasMode() {
  var canvas = document.createElement('canvas');
  canvas.setAttribute('width', String(blobs_1.default.cols));
  canvas.setAttribute('height', String(blobs_1.default.rows));
  document.getElementById('output').appendChild(canvas);
  var ctx = canvas.getContext('2d');
  var imageData = ctx.createImageData(blobs_1.default.cols, blobs_1.default.rows);

  function renderToCanvas(data) {
    data.forEach(function (row, rowIdx) {
      row.forEach(function (pixel, colIdx) {
        var pos = (rowIdx * blobs_1.default.cols + colIdx) * 4;

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

  blobs_1.default.useRenderer(renderToCanvas);
}

function tableMode() {
  var pixelEls = [];
  var table = document.createElement('table');
  var tbody = document.createElement('tbody');

  for (var y = 0; y < blobs_1.default.rows; y++) {
    var row = document.createElement('tr');

    for (var x = 0; x < blobs_1.default.cols; x++) {
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
        var pos = rowIdx * blobs_1.default.cols + colIdx;
        pixelEls[pos].style.backgroundColor = "rgb(".concat(pixel[0], ", ").concat(pixel[1], ", ").concat(pixel[2], ")");
      });
    });
  }

  blobs_1.default.useRenderer(renderToTable);
}

document.addEventListener('DOMContentLoaded', tableMode);
},{"../src/scenes/blobs":"../src/scenes/blobs.ts"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "58985" + '/');

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