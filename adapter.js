/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1013);
/******/ })
/************************************************************************/
/******/ ({

/***/ 1:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

exports.default = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

/***/ }),

/***/ 10:
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var stylesInDom = {},
	memoize = function(fn) {
		var memo;
		return function () {
			if (typeof memo === "undefined") memo = fn.apply(this, arguments);
			return memo;
		};
	},
	isOldIE = memoize(function() {
		// Test for IE <= 9 as proposed by Browserhacks
		// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
		// Tests for existence of standard globals is to allow style-loader 
		// to operate correctly into non-standard environments
		// @see https://github.com/webpack-contrib/style-loader/issues/177
		return window && document && document.all && !window.atob;
	}),
	getElement = (function(fn) {
		var memo = {};
		return function(selector) {
			if (typeof memo[selector] === "undefined") {
				memo[selector] = fn.call(this, selector);
			}
			return memo[selector]
		};
	})(function (styleTarget) {
		return document.querySelector(styleTarget)
	}),
	singletonElement = null,
	singletonCounter = 0,
	styleElementsInsertedAtTop = [],
	fixUrls = __webpack_require__(435);

module.exports = function(list, options) {
	if(typeof DEBUG !== "undefined" && DEBUG) {
		if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};
	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (typeof options.singleton === "undefined") options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (typeof options.insertInto === "undefined") options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

	var styles = listToStyles(list, options);
	addStylesToDom(styles, options);

	return function update(newList) {
		var mayRemove = [];
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			domStyle.refs--;
			mayRemove.push(domStyle);
		}
		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}
		for(var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];
			if(domStyle.refs === 0) {
				for(var j = 0; j < domStyle.parts.length; j++)
					domStyle.parts[j]();
				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom(styles, options) {
	for(var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];
		if(domStyle) {
			domStyle.refs++;
			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}
			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];
			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}
			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles(list, options) {
	var styles = [];
	var newStyles = {};
	for(var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};
		if(!newStyles[id])
			styles.push(newStyles[id] = {id: id, parts: [part]});
		else
			newStyles[id].parts.push(part);
	}
	return styles;
}

function insertStyleElement(options, styleElement) {
	var styleTarget = getElement(options.insertInto)
	if (!styleTarget) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}
	var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
	if (options.insertAt === "top") {
		if(!lastStyleElementInsertedAtTop) {
			styleTarget.insertBefore(styleElement, styleTarget.firstChild);
		} else if(lastStyleElementInsertedAtTop.nextSibling) {
			styleTarget.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			styleTarget.appendChild(styleElement);
		}
		styleElementsInsertedAtTop.push(styleElement);
	} else if (options.insertAt === "bottom") {
		styleTarget.appendChild(styleElement);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement(styleElement) {
	styleElement.parentNode.removeChild(styleElement);
	var idx = styleElementsInsertedAtTop.indexOf(styleElement);
	if(idx >= 0) {
		styleElementsInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement(options) {
	var styleElement = document.createElement("style");
	options.attrs.type = "text/css";

	attachTagAttrs(styleElement, options.attrs);
	insertStyleElement(options, styleElement);
	return styleElement;
}

function createLinkElement(options) {
	var linkElement = document.createElement("link");
	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	attachTagAttrs(linkElement, options.attrs);
	insertStyleElement(options, linkElement);
	return linkElement;
}

function attachTagAttrs(element, attrs) {
	Object.keys(attrs).forEach(function (key) {
		element.setAttribute(key, attrs[key]);
	});
}

function addStyle(obj, options) {
	var styleElement, update, remove, transformResult;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    transformResult = options.transform(obj.css);
	    
	    if (transformResult) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = transformResult;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css. 
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;
		styleElement = singletonElement || (singletonElement = createStyleElement(options));
		update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
		remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
	} else if(obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function") {
		styleElement = createLinkElement(options);
		update = updateLink.bind(null, styleElement, options);
		remove = function() {
			removeStyleElement(styleElement);
			if(styleElement.href)
				URL.revokeObjectURL(styleElement.href);
		};
	} else {
		styleElement = createStyleElement(options);
		update = applyToTag.bind(null, styleElement);
		remove = function() {
			removeStyleElement(styleElement);
		};
	}

	update(obj);

	return function updateStyle(newObj) {
		if(newObj) {
			if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
				return;
			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;
		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag(styleElement, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (styleElement.styleSheet) {
		styleElement.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = styleElement.childNodes;
		if (childNodes[index]) styleElement.removeChild(childNodes[index]);
		if (childNodes.length) {
			styleElement.insertBefore(cssNode, childNodes[index]);
		} else {
			styleElement.appendChild(cssNode);
		}
	}
}

function applyToTag(styleElement, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		styleElement.setAttribute("media", media)
	}

	if(styleElement.styleSheet) {
		styleElement.styleSheet.cssText = css;
	} else {
		while(styleElement.firstChild) {
			styleElement.removeChild(styleElement.firstChild);
		}
		styleElement.appendChild(document.createTextNode(css));
	}
}

function updateLink(linkElement, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/* If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
	and there is no publicPath defined then lets turn convertToAbsoluteUrls
	on by default.  Otherwise default to the convertToAbsoluteUrls option
	directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls){
		css = fixUrls(css);
	}

	if(sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = linkElement.href;

	linkElement.href = URL.createObjectURL(blob);

	if(oldSrc)
		URL.revokeObjectURL(oldSrc);
}


/***/ }),

/***/ 1013:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _keys = __webpack_require__(22);

var _keys2 = _interopRequireDefault(_keys);

var _parseUri2 = __webpack_require__(163);

var _parseUri3 = _interopRequireDefault(_parseUri2);

var _VIE_Logo_RC = __webpack_require__(692);

var _VIE_Logo_RC2 = _interopRequireDefault(_VIE_Logo_RC);

var _Adapter = __webpack_require__(690);

var _Adapter2 = _interopRequireDefault(_Adapter);

var _brand = __webpack_require__(211);

var _brand2 = _interopRequireDefault(_brand);

var _prefix = __webpack_require__(60);

var _prefix2 = _interopRequireDefault(_prefix);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var version = "0.0.1";
var appUrl = "https://ringcentral.github.io/ringcentral-web-widget" + '/app.html';

var currentScipt = document.currentScript;
if (!currentScipt) {
  currentScipt = document.querySelector('script[src*="adapter.js"]');
}

var _parseUri = (0, _parseUri3.default)(currentScipt && currentScipt.src || ''),
    appKey = _parseUri.appKey,
    appSecret = _parseUri.appSecret,
    appServer = _parseUri.appServer,
    redirectUri = _parseUri.redirectUri;

function obj2uri(obj) {
  if (!obj) {
    return '';
  }
  var urlParams = [];
  (0, _keys2.default)(obj).forEach(function (key) {
    if (obj[key]) {
      urlParams.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]));
    }
  });
  return urlParams.join('&');
}
var appUri = appUrl + '?' + obj2uri({
  appKey: appKey,
  appSecret: appSecret,
  appServer: appServer,
  redirectUri: redirectUri,
  _t: Date.now()
});

function init() {
  if (window.RCAdapter) {
    return;
  }
  window.RCAdapter = new _Adapter2.default({
    logoUrl: _VIE_Logo_RC2.default,
    appUrl: appUri,
    brand: _brand2.default,
    version: version,
    prefix: _prefix2.default
  });
  setTimeout(function () {
    window.RCAdapter.init({
      size: { width: 300, height: 500 },
      minimized: true,
      closed: false,
      position: { translateX: 700, translateY: 20, minTranslateX: 0 }
    });
  }, 2000);
}

if (document.readyState === 'complete') {
  init();
} else {
  window.addEventListener('load', init);
}

/***/ }),

/***/ 12:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
  Copyright (c) 2016 Jed Watson.
  Licensed under the MIT License (MIT), see
  http://jedwatson.github.io/classnames
*/
/* global define */

(function () {
	'use strict';

	var hasOwn = {}.hasOwnProperty;

	function classNames () {
		var classes = [];

		for (var i = 0; i < arguments.length; i++) {
			var arg = arguments[i];
			if (!arg) continue;

			var argType = typeof arg;

			if (argType === 'string' || argType === 'number') {
				classes.push(arg);
			} else if (Array.isArray(arg)) {
				classes.push(classNames.apply(null, arg));
			} else if (argType === 'object') {
				for (var key in arg) {
					if (hasOwn.call(arg, key) && arg[key]) {
						classes.push(key);
					}
				}
			}
		}

		return classes.join(' ');
	}

	if (typeof module !== 'undefined' && module.exports) {
		module.exports = classNames;
	} else if (true) {
		// register as 'classnames', consistent with npm package name
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function () {
			return classNames;
		}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else {
		window.classNames = classNames;
	}
}());


/***/ }),

/***/ 124:
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(286), __esModule: true };

/***/ }),

/***/ 125:
/***/ (function(module, exports) {

// 7.2.1 RequireObjectCoercible(argument)
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};


/***/ }),

/***/ 126:
/***/ (function(module, exports, __webpack_require__) {

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = __webpack_require__(97);
// eslint-disable-next-line no-prototype-builtins
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return cof(it) == 'String' ? it.split('') : Object(it);
};


/***/ }),

/***/ 128:
/***/ (function(module, exports, __webpack_require__) {

// most Object methods by ES6 should accept primitives
var $export = __webpack_require__(33);
var core = __webpack_require__(28);
var fails = __webpack_require__(52);
module.exports = function (KEY, exec) {
  var fn = (core.Object || {})[KEY] || Object[KEY];
  var exp = {};
  exp[KEY] = exec(fn);
  $export($export.S + $export.F * fails(function () { fn(1); }), 'Object', exp);
};


/***/ }),

/***/ 129:
/***/ (function(module, exports) {

// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
module.exports = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};


/***/ }),

/***/ 130:
/***/ (function(module, exports, __webpack_require__) {

// 7.1.15 ToLength
var toInteger = __webpack_require__(129);
var min = Math.min;
module.exports = function (it) {
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};


/***/ }),

/***/ 131:
/***/ (function(module, exports) {

var id = 0;
var px = Math.random();
module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};


/***/ }),

/***/ 163:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = __webpack_require__(7);

var _extends3 = _interopRequireDefault(_extends2);

exports.default = parseCallbackUri;

var _url = __webpack_require__(209);

var _url2 = _interopRequireDefault(_url);

var _qs = __webpack_require__(177);

var _qs2 = _interopRequireDefault(_qs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function parseCallbackUri(callbackUri) {
  var _url$parse = _url2.default.parse(callbackUri, true),
      query = _url$parse.query,
      hash = _url$parse.hash;

  var hashObject = hash ? _qs2.default.parse(hash.replace(/^#/, '')) : {};
  if (query.error) {
    var error = new Error(query.error);
    for (var key in query) {
      if (Object.prototype.hasOwnProperty.call(query, key)) {
        error[key] = query[key];
      }
    }
    throw error;
  }

  return (0, _extends3.default)({}, query, hashObject);
}

/***/ }),

/***/ 165:
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(41);
var document = __webpack_require__(36).document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};


/***/ }),

/***/ 166:
/***/ (function(module, exports) {

// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');


/***/ }),

/***/ 168:
/***/ (function(module, exports) {

exports.f = Object.getOwnPropertySymbols;


/***/ }),

/***/ 170:
/***/ (function(module, exports, __webpack_require__) {

var shared = __webpack_require__(171)('keys');
var uid = __webpack_require__(131);
module.exports = function (key) {
  return shared[key] || (shared[key] = uid(key));
};


/***/ }),

/***/ 171:
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(36);
var SHARED = '__core-js_shared__';
var store = global[SHARED] || (global[SHARED] = {});
module.exports = function (key) {
  return store[key] || (store[key] = {});
};


/***/ }),

/***/ 172:
/***/ (function(module, exports, __webpack_require__) {

// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = __webpack_require__(41);
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (it, S) {
  if (!isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};


/***/ }),

/***/ 176:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var replace = String.prototype.replace;
var percentTwenties = /%20/g;

module.exports = {
    'default': 'RFC3986',
    formatters: {
        RFC1738: function (value) {
            return replace.call(value, percentTwenties, '+');
        },
        RFC3986: function (value) {
            return value;
        }
    },
    RFC1738: 'RFC1738',
    RFC3986: 'RFC3986'
};


/***/ }),

/***/ 177:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var stringify = __webpack_require__(332);
var parse = __webpack_require__(331);
var formats = __webpack_require__(176);

module.exports = {
    formats: formats,
    parse: parse,
    stringify: stringify
};


/***/ }),

/***/ 178:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var has = Object.prototype.hasOwnProperty;

var hexTable = (function () {
    var array = [];
    for (var i = 0; i < 256; ++i) {
        array.push('%' + ((i < 16 ? '0' : '') + i.toString(16)).toUpperCase());
    }

    return array;
}());

var compactQueue = function compactQueue(queue) {
    var obj;

    while (queue.length) {
        var item = queue.pop();
        obj = item.obj[item.prop];

        if (Array.isArray(obj)) {
            var compacted = [];

            for (var j = 0; j < obj.length; ++j) {
                if (typeof obj[j] !== 'undefined') {
                    compacted.push(obj[j]);
                }
            }

            item.obj[item.prop] = compacted;
        }
    }

    return obj;
};

exports.arrayToObject = function arrayToObject(source, options) {
    var obj = options && options.plainObjects ? Object.create(null) : {};
    for (var i = 0; i < source.length; ++i) {
        if (typeof source[i] !== 'undefined') {
            obj[i] = source[i];
        }
    }

    return obj;
};

exports.merge = function merge(target, source, options) {
    if (!source) {
        return target;
    }

    if (typeof source !== 'object') {
        if (Array.isArray(target)) {
            target.push(source);
        } else if (typeof target === 'object') {
            if (options.plainObjects || options.allowPrototypes || !has.call(Object.prototype, source)) {
                target[source] = true;
            }
        } else {
            return [target, source];
        }

        return target;
    }

    if (typeof target !== 'object') {
        return [target].concat(source);
    }

    var mergeTarget = target;
    if (Array.isArray(target) && !Array.isArray(source)) {
        mergeTarget = exports.arrayToObject(target, options);
    }

    if (Array.isArray(target) && Array.isArray(source)) {
        source.forEach(function (item, i) {
            if (has.call(target, i)) {
                if (target[i] && typeof target[i] === 'object') {
                    target[i] = exports.merge(target[i], item, options);
                } else {
                    target.push(item);
                }
            } else {
                target[i] = item;
            }
        });
        return target;
    }

    return Object.keys(source).reduce(function (acc, key) {
        var value = source[key];

        if (has.call(acc, key)) {
            acc[key] = exports.merge(acc[key], value, options);
        } else {
            acc[key] = value;
        }
        return acc;
    }, mergeTarget);
};

exports.assign = function assignSingleSource(target, source) {
    return Object.keys(source).reduce(function (acc, key) {
        acc[key] = source[key];
        return acc;
    }, target);
};

exports.decode = function (str) {
    try {
        return decodeURIComponent(str.replace(/\+/g, ' '));
    } catch (e) {
        return str;
    }
};

exports.encode = function encode(str) {
    // This code was originally written by Brian White (mscdex) for the io.js core querystring library.
    // It has been adapted here for stricter adherence to RFC 3986
    if (str.length === 0) {
        return str;
    }

    var string = typeof str === 'string' ? str : String(str);

    var out = '';
    for (var i = 0; i < string.length; ++i) {
        var c = string.charCodeAt(i);

        if (
            c === 0x2D // -
            || c === 0x2E // .
            || c === 0x5F // _
            || c === 0x7E // ~
            || (c >= 0x30 && c <= 0x39) // 0-9
            || (c >= 0x41 && c <= 0x5A) // a-z
            || (c >= 0x61 && c <= 0x7A) // A-Z
        ) {
            out += string.charAt(i);
            continue;
        }

        if (c < 0x80) {
            out = out + hexTable[c];
            continue;
        }

        if (c < 0x800) {
            out = out + (hexTable[0xC0 | (c >> 6)] + hexTable[0x80 | (c & 0x3F)]);
            continue;
        }

        if (c < 0xD800 || c >= 0xE000) {
            out = out + (hexTable[0xE0 | (c >> 12)] + hexTable[0x80 | ((c >> 6) & 0x3F)] + hexTable[0x80 | (c & 0x3F)]);
            continue;
        }

        i += 1;
        c = 0x10000 + (((c & 0x3FF) << 10) | (string.charCodeAt(i) & 0x3FF));
        out += hexTable[0xF0 | (c >> 18)]
            + hexTable[0x80 | ((c >> 12) & 0x3F)]
            + hexTable[0x80 | ((c >> 6) & 0x3F)]
            + hexTable[0x80 | (c & 0x3F)];
    }

    return out;
};

exports.compact = function compact(value) {
    var queue = [{ obj: { o: value }, prop: 'o' }];
    var refs = [];

    for (var i = 0; i < queue.length; ++i) {
        var item = queue[i];
        var obj = item.obj[item.prop];

        var keys = Object.keys(obj);
        for (var j = 0; j < keys.length; ++j) {
            var key = keys[j];
            var val = obj[key];
            if (typeof val === 'object' && val !== null && refs.indexOf(val) === -1) {
                queue.push({ obj: obj, prop: key });
                refs.push(val);
            }
        }
    }

    return compactQueue(queue);
};

exports.isRegExp = function isRegExp(obj) {
    return Object.prototype.toString.call(obj) === '[object RegExp]';
};

exports.isBuffer = function isBuffer(obj) {
    if (obj === null || typeof obj === 'undefined') {
        return false;
    }

    return !!(obj.constructor && obj.constructor.isBuffer && obj.constructor.isBuffer(obj));
};


/***/ }),

/***/ 179:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.decode = exports.parse = __webpack_require__(333);
exports.encode = exports.stringify = __webpack_require__(334);


/***/ }),

/***/ 2:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _defineProperty = __webpack_require__(80);

var _defineProperty2 = _interopRequireDefault(_defineProperty);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      (0, _defineProperty2.default)(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

/***/ }),

/***/ 209:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



var punycode = __webpack_require__(330);
var util = __webpack_require__(436);

exports.parse = urlParse;
exports.resolve = urlResolve;
exports.resolveObject = urlResolveObject;
exports.format = urlFormat;

exports.Url = Url;

function Url() {
  this.protocol = null;
  this.slashes = null;
  this.auth = null;
  this.host = null;
  this.port = null;
  this.hostname = null;
  this.hash = null;
  this.search = null;
  this.query = null;
  this.pathname = null;
  this.path = null;
  this.href = null;
}

// Reference: RFC 3986, RFC 1808, RFC 2396

// define these here so at least they only have to be
// compiled once on the first module load.
var protocolPattern = /^([a-z0-9.+-]+:)/i,
    portPattern = /:[0-9]*$/,

    // Special case for a simple path URL
    simplePathPattern = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/,

    // RFC 2396: characters reserved for delimiting URLs.
    // We actually just auto-escape these.
    delims = ['<', '>', '"', '`', ' ', '\r', '\n', '\t'],

    // RFC 2396: characters not allowed for various reasons.
    unwise = ['{', '}', '|', '\\', '^', '`'].concat(delims),

    // Allowed by RFCs, but cause of XSS attacks.  Always escape these.
    autoEscape = ['\''].concat(unwise),
    // Characters that are never ever allowed in a hostname.
    // Note that any invalid chars are also handled, but these
    // are the ones that are *expected* to be seen, so we fast-path
    // them.
    nonHostChars = ['%', '/', '?', ';', '#'].concat(autoEscape),
    hostEndingChars = ['/', '?', '#'],
    hostnameMaxLen = 255,
    hostnamePartPattern = /^[+a-z0-9A-Z_-]{0,63}$/,
    hostnamePartStart = /^([+a-z0-9A-Z_-]{0,63})(.*)$/,
    // protocols that can allow "unsafe" and "unwise" chars.
    unsafeProtocol = {
      'javascript': true,
      'javascript:': true
    },
    // protocols that never have a hostname.
    hostlessProtocol = {
      'javascript': true,
      'javascript:': true
    },
    // protocols that always contain a // bit.
    slashedProtocol = {
      'http': true,
      'https': true,
      'ftp': true,
      'gopher': true,
      'file': true,
      'http:': true,
      'https:': true,
      'ftp:': true,
      'gopher:': true,
      'file:': true
    },
    querystring = __webpack_require__(179);

function urlParse(url, parseQueryString, slashesDenoteHost) {
  if (url && util.isObject(url) && url instanceof Url) return url;

  var u = new Url;
  u.parse(url, parseQueryString, slashesDenoteHost);
  return u;
}

Url.prototype.parse = function(url, parseQueryString, slashesDenoteHost) {
  if (!util.isString(url)) {
    throw new TypeError("Parameter 'url' must be a string, not " + typeof url);
  }

  // Copy chrome, IE, opera backslash-handling behavior.
  // Back slashes before the query string get converted to forward slashes
  // See: https://code.google.com/p/chromium/issues/detail?id=25916
  var queryIndex = url.indexOf('?'),
      splitter =
          (queryIndex !== -1 && queryIndex < url.indexOf('#')) ? '?' : '#',
      uSplit = url.split(splitter),
      slashRegex = /\\/g;
  uSplit[0] = uSplit[0].replace(slashRegex, '/');
  url = uSplit.join(splitter);

  var rest = url;

  // trim before proceeding.
  // This is to support parse stuff like "  http://foo.com  \n"
  rest = rest.trim();

  if (!slashesDenoteHost && url.split('#').length === 1) {
    // Try fast path regexp
    var simplePath = simplePathPattern.exec(rest);
    if (simplePath) {
      this.path = rest;
      this.href = rest;
      this.pathname = simplePath[1];
      if (simplePath[2]) {
        this.search = simplePath[2];
        if (parseQueryString) {
          this.query = querystring.parse(this.search.substr(1));
        } else {
          this.query = this.search.substr(1);
        }
      } else if (parseQueryString) {
        this.search = '';
        this.query = {};
      }
      return this;
    }
  }

  var proto = protocolPattern.exec(rest);
  if (proto) {
    proto = proto[0];
    var lowerProto = proto.toLowerCase();
    this.protocol = lowerProto;
    rest = rest.substr(proto.length);
  }

  // figure out if it's got a host
  // user@server is *always* interpreted as a hostname, and url
  // resolution will treat //foo/bar as host=foo,path=bar because that's
  // how the browser resolves relative URLs.
  if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
    var slashes = rest.substr(0, 2) === '//';
    if (slashes && !(proto && hostlessProtocol[proto])) {
      rest = rest.substr(2);
      this.slashes = true;
    }
  }

  if (!hostlessProtocol[proto] &&
      (slashes || (proto && !slashedProtocol[proto]))) {

    // there's a hostname.
    // the first instance of /, ?, ;, or # ends the host.
    //
    // If there is an @ in the hostname, then non-host chars *are* allowed
    // to the left of the last @ sign, unless some host-ending character
    // comes *before* the @-sign.
    // URLs are obnoxious.
    //
    // ex:
    // http://a@b@c/ => user:a@b host:c
    // http://a@b?@c => user:a host:c path:/?@c

    // v0.12 TODO(isaacs): This is not quite how Chrome does things.
    // Review our test case against browsers more comprehensively.

    // find the first instance of any hostEndingChars
    var hostEnd = -1;
    for (var i = 0; i < hostEndingChars.length; i++) {
      var hec = rest.indexOf(hostEndingChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
        hostEnd = hec;
    }

    // at this point, either we have an explicit point where the
    // auth portion cannot go past, or the last @ char is the decider.
    var auth, atSign;
    if (hostEnd === -1) {
      // atSign can be anywhere.
      atSign = rest.lastIndexOf('@');
    } else {
      // atSign must be in auth portion.
      // http://a@b/c@d => host:b auth:a path:/c@d
      atSign = rest.lastIndexOf('@', hostEnd);
    }

    // Now we have a portion which is definitely the auth.
    // Pull that off.
    if (atSign !== -1) {
      auth = rest.slice(0, atSign);
      rest = rest.slice(atSign + 1);
      this.auth = decodeURIComponent(auth);
    }

    // the host is the remaining to the left of the first non-host char
    hostEnd = -1;
    for (var i = 0; i < nonHostChars.length; i++) {
      var hec = rest.indexOf(nonHostChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
        hostEnd = hec;
    }
    // if we still have not hit it, then the entire thing is a host.
    if (hostEnd === -1)
      hostEnd = rest.length;

    this.host = rest.slice(0, hostEnd);
    rest = rest.slice(hostEnd);

    // pull out port.
    this.parseHost();

    // we've indicated that there is a hostname,
    // so even if it's empty, it has to be present.
    this.hostname = this.hostname || '';

    // if hostname begins with [ and ends with ]
    // assume that it's an IPv6 address.
    var ipv6Hostname = this.hostname[0] === '[' &&
        this.hostname[this.hostname.length - 1] === ']';

    // validate a little.
    if (!ipv6Hostname) {
      var hostparts = this.hostname.split(/\./);
      for (var i = 0, l = hostparts.length; i < l; i++) {
        var part = hostparts[i];
        if (!part) continue;
        if (!part.match(hostnamePartPattern)) {
          var newpart = '';
          for (var j = 0, k = part.length; j < k; j++) {
            if (part.charCodeAt(j) > 127) {
              // we replace non-ASCII char with a temporary placeholder
              // we need this to make sure size of hostname is not
              // broken by replacing non-ASCII by nothing
              newpart += 'x';
            } else {
              newpart += part[j];
            }
          }
          // we test again with ASCII char only
          if (!newpart.match(hostnamePartPattern)) {
            var validParts = hostparts.slice(0, i);
            var notHost = hostparts.slice(i + 1);
            var bit = part.match(hostnamePartStart);
            if (bit) {
              validParts.push(bit[1]);
              notHost.unshift(bit[2]);
            }
            if (notHost.length) {
              rest = '/' + notHost.join('.') + rest;
            }
            this.hostname = validParts.join('.');
            break;
          }
        }
      }
    }

    if (this.hostname.length > hostnameMaxLen) {
      this.hostname = '';
    } else {
      // hostnames are always lower case.
      this.hostname = this.hostname.toLowerCase();
    }

    if (!ipv6Hostname) {
      // IDNA Support: Returns a punycoded representation of "domain".
      // It only converts parts of the domain name that
      // have non-ASCII characters, i.e. it doesn't matter if
      // you call it with a domain that already is ASCII-only.
      this.hostname = punycode.toASCII(this.hostname);
    }

    var p = this.port ? ':' + this.port : '';
    var h = this.hostname || '';
    this.host = h + p;
    this.href += this.host;

    // strip [ and ] from the hostname
    // the host field still retains them, though
    if (ipv6Hostname) {
      this.hostname = this.hostname.substr(1, this.hostname.length - 2);
      if (rest[0] !== '/') {
        rest = '/' + rest;
      }
    }
  }

  // now rest is set to the post-host stuff.
  // chop off any delim chars.
  if (!unsafeProtocol[lowerProto]) {

    // First, make 100% sure that any "autoEscape" chars get
    // escaped, even if encodeURIComponent doesn't think they
    // need to be.
    for (var i = 0, l = autoEscape.length; i < l; i++) {
      var ae = autoEscape[i];
      if (rest.indexOf(ae) === -1)
        continue;
      var esc = encodeURIComponent(ae);
      if (esc === ae) {
        esc = escape(ae);
      }
      rest = rest.split(ae).join(esc);
    }
  }


  // chop off from the tail first.
  var hash = rest.indexOf('#');
  if (hash !== -1) {
    // got a fragment string.
    this.hash = rest.substr(hash);
    rest = rest.slice(0, hash);
  }
  var qm = rest.indexOf('?');
  if (qm !== -1) {
    this.search = rest.substr(qm);
    this.query = rest.substr(qm + 1);
    if (parseQueryString) {
      this.query = querystring.parse(this.query);
    }
    rest = rest.slice(0, qm);
  } else if (parseQueryString) {
    // no query string, but parseQueryString still requested
    this.search = '';
    this.query = {};
  }
  if (rest) this.pathname = rest;
  if (slashedProtocol[lowerProto] &&
      this.hostname && !this.pathname) {
    this.pathname = '/';
  }

  //to support http.request
  if (this.pathname || this.search) {
    var p = this.pathname || '';
    var s = this.search || '';
    this.path = p + s;
  }

  // finally, reconstruct the href based on what has been validated.
  this.href = this.format();
  return this;
};

// format a parsed object into a url string
function urlFormat(obj) {
  // ensure it's an object, and not a string url.
  // If it's an obj, this is a no-op.
  // this way, you can call url_format() on strings
  // to clean up potentially wonky urls.
  if (util.isString(obj)) obj = urlParse(obj);
  if (!(obj instanceof Url)) return Url.prototype.format.call(obj);
  return obj.format();
}

Url.prototype.format = function() {
  var auth = this.auth || '';
  if (auth) {
    auth = encodeURIComponent(auth);
    auth = auth.replace(/%3A/i, ':');
    auth += '@';
  }

  var protocol = this.protocol || '',
      pathname = this.pathname || '',
      hash = this.hash || '',
      host = false,
      query = '';

  if (this.host) {
    host = auth + this.host;
  } else if (this.hostname) {
    host = auth + (this.hostname.indexOf(':') === -1 ?
        this.hostname :
        '[' + this.hostname + ']');
    if (this.port) {
      host += ':' + this.port;
    }
  }

  if (this.query &&
      util.isObject(this.query) &&
      Object.keys(this.query).length) {
    query = querystring.stringify(this.query);
  }

  var search = this.search || (query && ('?' + query)) || '';

  if (protocol && protocol.substr(-1) !== ':') protocol += ':';

  // only the slashedProtocols get the //.  Not mailto:, xmpp:, etc.
  // unless they had them to begin with.
  if (this.slashes ||
      (!protocol || slashedProtocol[protocol]) && host !== false) {
    host = '//' + (host || '');
    if (pathname && pathname.charAt(0) !== '/') pathname = '/' + pathname;
  } else if (!host) {
    host = '';
  }

  if (hash && hash.charAt(0) !== '#') hash = '#' + hash;
  if (search && search.charAt(0) !== '?') search = '?' + search;

  pathname = pathname.replace(/[?#]/g, function(match) {
    return encodeURIComponent(match);
  });
  search = search.replace('#', '%23');

  return protocol + host + pathname + search + hash;
};

function urlResolve(source, relative) {
  return urlParse(source, false, true).resolve(relative);
}

Url.prototype.resolve = function(relative) {
  return this.resolveObject(urlParse(relative, false, true)).format();
};

function urlResolveObject(source, relative) {
  if (!source) return relative;
  return urlParse(source, false, true).resolveObject(relative);
}

Url.prototype.resolveObject = function(relative) {
  if (util.isString(relative)) {
    var rel = new Url();
    rel.parse(relative, false, true);
    relative = rel;
  }

  var result = new Url();
  var tkeys = Object.keys(this);
  for (var tk = 0; tk < tkeys.length; tk++) {
    var tkey = tkeys[tk];
    result[tkey] = this[tkey];
  }

  // hash is always overridden, no matter what.
  // even href="" will remove it.
  result.hash = relative.hash;

  // if the relative url is empty, then there's nothing left to do here.
  if (relative.href === '') {
    result.href = result.format();
    return result;
  }

  // hrefs like //foo/bar always cut to the protocol.
  if (relative.slashes && !relative.protocol) {
    // take everything except the protocol from relative
    var rkeys = Object.keys(relative);
    for (var rk = 0; rk < rkeys.length; rk++) {
      var rkey = rkeys[rk];
      if (rkey !== 'protocol')
        result[rkey] = relative[rkey];
    }

    //urlParse appends trailing / to urls like http://www.example.com
    if (slashedProtocol[result.protocol] &&
        result.hostname && !result.pathname) {
      result.path = result.pathname = '/';
    }

    result.href = result.format();
    return result;
  }

  if (relative.protocol && relative.protocol !== result.protocol) {
    // if it's a known url protocol, then changing
    // the protocol does weird things
    // first, if it's not file:, then we MUST have a host,
    // and if there was a path
    // to begin with, then we MUST have a path.
    // if it is file:, then the host is dropped,
    // because that's known to be hostless.
    // anything else is assumed to be absolute.
    if (!slashedProtocol[relative.protocol]) {
      var keys = Object.keys(relative);
      for (var v = 0; v < keys.length; v++) {
        var k = keys[v];
        result[k] = relative[k];
      }
      result.href = result.format();
      return result;
    }

    result.protocol = relative.protocol;
    if (!relative.host && !hostlessProtocol[relative.protocol]) {
      var relPath = (relative.pathname || '').split('/');
      while (relPath.length && !(relative.host = relPath.shift()));
      if (!relative.host) relative.host = '';
      if (!relative.hostname) relative.hostname = '';
      if (relPath[0] !== '') relPath.unshift('');
      if (relPath.length < 2) relPath.unshift('');
      result.pathname = relPath.join('/');
    } else {
      result.pathname = relative.pathname;
    }
    result.search = relative.search;
    result.query = relative.query;
    result.host = relative.host || '';
    result.auth = relative.auth;
    result.hostname = relative.hostname || relative.host;
    result.port = relative.port;
    // to support http.request
    if (result.pathname || result.search) {
      var p = result.pathname || '';
      var s = result.search || '';
      result.path = p + s;
    }
    result.slashes = result.slashes || relative.slashes;
    result.href = result.format();
    return result;
  }

  var isSourceAbs = (result.pathname && result.pathname.charAt(0) === '/'),
      isRelAbs = (
          relative.host ||
          relative.pathname && relative.pathname.charAt(0) === '/'
      ),
      mustEndAbs = (isRelAbs || isSourceAbs ||
                    (result.host && relative.pathname)),
      removeAllDots = mustEndAbs,
      srcPath = result.pathname && result.pathname.split('/') || [],
      relPath = relative.pathname && relative.pathname.split('/') || [],
      psychotic = result.protocol && !slashedProtocol[result.protocol];

  // if the url is a non-slashed url, then relative
  // links like ../.. should be able
  // to crawl up to the hostname, as well.  This is strange.
  // result.protocol has already been set by now.
  // Later on, put the first path part into the host field.
  if (psychotic) {
    result.hostname = '';
    result.port = null;
    if (result.host) {
      if (srcPath[0] === '') srcPath[0] = result.host;
      else srcPath.unshift(result.host);
    }
    result.host = '';
    if (relative.protocol) {
      relative.hostname = null;
      relative.port = null;
      if (relative.host) {
        if (relPath[0] === '') relPath[0] = relative.host;
        else relPath.unshift(relative.host);
      }
      relative.host = null;
    }
    mustEndAbs = mustEndAbs && (relPath[0] === '' || srcPath[0] === '');
  }

  if (isRelAbs) {
    // it's absolute.
    result.host = (relative.host || relative.host === '') ?
                  relative.host : result.host;
    result.hostname = (relative.hostname || relative.hostname === '') ?
                      relative.hostname : result.hostname;
    result.search = relative.search;
    result.query = relative.query;
    srcPath = relPath;
    // fall through to the dot-handling below.
  } else if (relPath.length) {
    // it's relative
    // throw away the existing file, and take the new path instead.
    if (!srcPath) srcPath = [];
    srcPath.pop();
    srcPath = srcPath.concat(relPath);
    result.search = relative.search;
    result.query = relative.query;
  } else if (!util.isNullOrUndefined(relative.search)) {
    // just pull out the search.
    // like href='?foo'.
    // Put this after the other two cases because it simplifies the booleans
    if (psychotic) {
      result.hostname = result.host = srcPath.shift();
      //occationaly the auth can get stuck only in host
      //this especially happens in cases like
      //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
      var authInHost = result.host && result.host.indexOf('@') > 0 ?
                       result.host.split('@') : false;
      if (authInHost) {
        result.auth = authInHost.shift();
        result.host = result.hostname = authInHost.shift();
      }
    }
    result.search = relative.search;
    result.query = relative.query;
    //to support http.request
    if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
      result.path = (result.pathname ? result.pathname : '') +
                    (result.search ? result.search : '');
    }
    result.href = result.format();
    return result;
  }

  if (!srcPath.length) {
    // no path at all.  easy.
    // we've already handled the other stuff above.
    result.pathname = null;
    //to support http.request
    if (result.search) {
      result.path = '/' + result.search;
    } else {
      result.path = null;
    }
    result.href = result.format();
    return result;
  }

  // if a url ENDs in . or .., then it must get a trailing slash.
  // however, if it ends in anything else non-slashy,
  // then it must NOT get a trailing slash.
  var last = srcPath.slice(-1)[0];
  var hasTrailingSlash = (
      (result.host || relative.host || srcPath.length > 1) &&
      (last === '.' || last === '..') || last === '');

  // strip single dots, resolve double dots to parent dir
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = srcPath.length; i >= 0; i--) {
    last = srcPath[i];
    if (last === '.') {
      srcPath.splice(i, 1);
    } else if (last === '..') {
      srcPath.splice(i, 1);
      up++;
    } else if (up) {
      srcPath.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (!mustEndAbs && !removeAllDots) {
    for (; up--; up) {
      srcPath.unshift('..');
    }
  }

  if (mustEndAbs && srcPath[0] !== '' &&
      (!srcPath[0] || srcPath[0].charAt(0) !== '/')) {
    srcPath.unshift('');
  }

  if (hasTrailingSlash && (srcPath.join('/').substr(-1) !== '/')) {
    srcPath.push('');
  }

  var isAbsolute = srcPath[0] === '' ||
      (srcPath[0] && srcPath[0].charAt(0) === '/');

  // put the host back
  if (psychotic) {
    result.hostname = result.host = isAbsolute ? '' :
                                    srcPath.length ? srcPath.shift() : '';
    //occationaly the auth can get stuck only in host
    //this especially happens in cases like
    //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
    var authInHost = result.host && result.host.indexOf('@') > 0 ?
                     result.host.split('@') : false;
    if (authInHost) {
      result.auth = authInHost.shift();
      result.host = result.hostname = authInHost.shift();
    }
  }

  mustEndAbs = mustEndAbs || (result.host && srcPath.length);

  if (mustEndAbs && !isAbsolute) {
    srcPath.unshift('');
  }

  if (!srcPath.length) {
    result.pathname = null;
    result.path = null;
  } else {
    result.pathname = srcPath.join('/');
  }

  //to support request.http
  if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
    result.path = (result.pathname ? result.pathname : '') +
                  (result.search ? result.search : '');
  }
  result.auth = relative.auth || result.auth;
  result.slashes = result.slashes || relative.slashes;
  result.href = result.format();
  return result;
};

Url.prototype.parseHost = function() {
  var host = this.host;
  var port = portPattern.exec(host);
  if (port) {
    port = port[0];
    if (port !== ':') {
      this.port = port.substr(1);
    }
    host = host.substr(0, host.length - port.length);
  }
  if (host) this.hostname = host;
};


/***/ }),

/***/ 211:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  id: '1210',
  brandCode: 'rc',
  name: 'RingCentral',
  appName: 'RingCentral Web Widget',
  fullName: 'RingCentral'
};

/***/ }),

/***/ 2171:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(484);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(10)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js??ref--7-1!../../../node_modules/postcss-loader/index.js??ref--7-2!../../../node_modules/sass-loader/lib/loader.js??ref--7-3!./styles.scss", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js??ref--7-1!../../../node_modules/postcss-loader/index.js??ref--7-2!../../../node_modules/sass-loader/lib/loader.js??ref--7-3!./styles.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 218:
/***/ (function(module, exports, __webpack_require__) {

module.exports = !__webpack_require__(40) && !__webpack_require__(52)(function () {
  return Object.defineProperty(__webpack_require__(165)('div'), 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),

/***/ 22:
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(288), __esModule: true };

/***/ }),

/***/ 222:
/***/ (function(module, exports, __webpack_require__) {

var has = __webpack_require__(67);
var toIObject = __webpack_require__(57);
var arrayIndexOf = __webpack_require__(290)(false);
var IE_PROTO = __webpack_require__(170)('IE_PROTO');

module.exports = function (object, names) {
  var O = toIObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) if (key != IE_PROTO) has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};


/***/ }),

/***/ 28:
/***/ (function(module, exports) {

var core = module.exports = { version: '2.5.1' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef


/***/ }),

/***/ 280:
/***/ (function(module, exports) {

module.exports = function(module) {
	if(!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if(!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),

/***/ 286:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(301);
module.exports = __webpack_require__(28).Object.assign;


/***/ }),

/***/ 287:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(302);
var $Object = __webpack_require__(28).Object;
module.exports = function defineProperty(it, key, desc) {
  return $Object.defineProperty(it, key, desc);
};


/***/ }),

/***/ 288:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(303);
module.exports = __webpack_require__(28).Object.keys;


/***/ }),

/***/ 290:
/***/ (function(module, exports, __webpack_require__) {

// false -> Array#indexOf
// true  -> Array#includes
var toIObject = __webpack_require__(57);
var toLength = __webpack_require__(130);
var toAbsoluteIndex = __webpack_require__(296);
module.exports = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
      if (O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};


/***/ }),

/***/ 293:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 19.1.2.1 Object.assign(target, source, ...)
var getKeys = __webpack_require__(68);
var gOPS = __webpack_require__(168);
var pIE = __webpack_require__(98);
var toObject = __webpack_require__(69);
var IObject = __webpack_require__(126);
var $assign = Object.assign;

// should work with symbols and should have deterministic property order (V8 bug)
module.exports = !$assign || __webpack_require__(52)(function () {
  var A = {};
  var B = {};
  // eslint-disable-next-line no-undef
  var S = Symbol();
  var K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function (k) { B[k] = k; });
  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
}) ? function assign(target, source) { // eslint-disable-line no-unused-vars
  var T = toObject(target);
  var aLen = arguments.length;
  var index = 1;
  var getSymbols = gOPS.f;
  var isEnum = pIE.f;
  while (aLen > index) {
    var S = IObject(arguments[index++]);
    var keys = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S);
    var length = keys.length;
    var j = 0;
    var key;
    while (length > j) if (isEnum.call(S, key = keys[j++])) T[key] = S[key];
  } return T;
} : $assign;


/***/ }),

/***/ 296:
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(129);
var max = Math.max;
var min = Math.min;
module.exports = function (index, length) {
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};


/***/ }),

/***/ 301:
/***/ (function(module, exports, __webpack_require__) {

// 19.1.3.1 Object.assign(target, source)
var $export = __webpack_require__(33);

$export($export.S + $export.F, 'Object', { assign: __webpack_require__(293) });


/***/ }),

/***/ 302:
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(33);
// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
$export($export.S + $export.F * !__webpack_require__(40), 'Object', { defineProperty: __webpack_require__(45).f });


/***/ }),

/***/ 303:
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 Object.keys(O)
var toObject = __webpack_require__(69);
var $keys = __webpack_require__(68);

__webpack_require__(128)('keys', function () {
  return function keys(it) {
    return $keys(toObject(it));
  };
});


/***/ }),

/***/ 323:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(9)(undefined);
// imports


// module
exports.push([module.i, "/*! normalize.css v2.1.3 | MIT License | git.io/normalize */\n\n/* ==========================================================================\n   HTML5 display definitions\n   ========================================================================== */\n\n/**\n * Correct `block` display not defined in IE 8/9.\n */\n\narticle,\naside,\ndetails,\nfigcaption,\nfigure,\nfooter,\nheader,\nhgroup,\nmain,\nnav,\nsection,\nsummary {\n    display: block;\n}\n\n/**\n * Correct `inline-block` display not defined in IE 8/9.\n */\n\naudio,\ncanvas,\nvideo {\n    display: inline-block;\n}\n\n/**\n * Prevent modern browsers from displaying `audio` without controls.\n * Remove excess height in iOS 5 devices.\n */\n\naudio:not([controls]) {\n    display: none;\n    height: 0;\n}\n\n/**\n * Address `[hidden]` styling not present in IE 8/9.\n * Hide the `template` element in IE, Safari, and Firefox < 22.\n */\n\n[hidden],\ntemplate {\n    display: none;\n}\n\n/* ==========================================================================\n   Base\n   ========================================================================== */\n\n/**\n * 1. Set default font family to sans-serif.\n * 2. Prevent iOS text size adjust after orientation change, without disabling\n *    user zoom.\n */\n\nhtml {\n    font-family: sans-serif; /* 1 */\n    -ms-text-size-adjust: 100%; /* 2 */\n    -webkit-text-size-adjust: 100%; /* 2 */\n}\n\n/**\n * Remove default margin.\n */\n\nbody {\n    margin: 0;\n}\n\n/* ==========================================================================\n   Links\n   ========================================================================== */\n\n/**\n * Remove the gray background color from active links in IE 10.\n */\n\na {\n    background: transparent;\n}\n\n/**\n * Address `outline` inconsistency between Chrome and other browsers.\n */\n\na:focus {\n    outline: thin dotted;\n}\n\n/**\n * Improve readability when focused and also mouse hovered in all browsers.\n */\n\na:active,\na:hover {\n    outline: 0;\n}\n\n/* ==========================================================================\n   Typography\n   ========================================================================== */\n\n/**\n * Address variable `h1` font-size and margin within `section` and `article`\n * contexts in Firefox 4+, Safari 5, and Chrome.\n */\n\nh1 {\n    font-size: 2em;\n    margin: 0.67em 0;\n}\n\n/**\n * Address styling not present in IE 8/9, Safari 5, and Chrome.\n */\n\nabbr[title] {\n    border-bottom: 1px dotted;\n}\n\n/**\n * Address style set to `bolder` in Firefox 4+, Safari 5, and Chrome.\n */\n\nb,\nstrong {\n    font-weight: bold;\n}\n\n/**\n * Address styling not present in Safari 5 and Chrome.\n */\n\ndfn {\n    font-style: italic;\n}\n\n/**\n * Address differences between Firefox and other browsers.\n */\n\nhr {\n    -moz-box-sizing: content-box;\n    box-sizing: content-box;\n    height: 0;\n}\n\n/**\n * Address styling not present in IE 8/9.\n */\n\nmark {\n    background: #ff0;\n    color: #000;\n}\n\n/**\n * Correct font family set oddly in Safari 5 and Chrome.\n */\n\ncode,\nkbd,\npre,\nsamp {\n    font-family: monospace, serif;\n    font-size: 1em;\n}\n\n/**\n * Improve readability of pre-formatted text in all browsers.\n */\n\npre {\n    white-space: pre-wrap;\n}\n\n/**\n * Set consistent quote types.\n */\n\nq {\n    quotes: \"\\201C\" \"\\201D\" \"\\2018\" \"\\2019\";\n}\n\n/**\n * Address inconsistent and variable font size in all browsers.\n */\n\nsmall {\n    font-size: 80%;\n}\n\n/**\n * Prevent `sub` and `sup` affecting `line-height` in all browsers.\n */\n\nsub,\nsup {\n    font-size: 75%;\n    line-height: 0;\n    position: relative;\n    vertical-align: baseline;\n}\n\nsup {\n    top: -0.5em;\n}\n\nsub {\n    bottom: -0.25em;\n}\n\n/* ==========================================================================\n   Embedded content\n   ========================================================================== */\n\n/**\n * Remove border when inside `a` element in IE 8/9.\n */\n\nimg {\n    border: 0;\n}\n\n/**\n * Correct overflow displayed oddly in IE 9.\n */\n\nsvg:not(:root) {\n    overflow: hidden;\n}\n\n/* ==========================================================================\n   Figures\n   ========================================================================== */\n\n/**\n * Address margin not present in IE 8/9 and Safari 5.\n */\n\nfigure {\n    margin: 0;\n}\n\n/* ==========================================================================\n   Forms\n   ========================================================================== */\n\n/**\n * Define consistent border, margin, and padding.\n */\n\nfieldset {\n    border: 1px solid #c0c0c0;\n    margin: 0 2px;\n    padding: 0.35em 0.625em 0.75em;\n}\n\n/**\n * 1. Correct `color` not being inherited in IE 8/9.\n * 2. Remove padding so people aren't caught out if they zero out fieldsets.\n */\n\nlegend {\n    border: 0; /* 1 */\n    padding: 0; /* 2 */\n}\n\n/**\n * 1. Correct font family not being inherited in all browsers.\n * 2. Correct font size not being inherited in all browsers.\n * 3. Address margins set differently in Firefox 4+, Safari 5, and Chrome.\n */\n\nbutton,\ninput,\nselect,\ntextarea {\n    font-family: inherit; /* 1 */\n    font-size: 100%; /* 2 */\n    margin: 0; /* 3 */\n}\n\n/**\n * Address Firefox 4+ setting `line-height` on `input` using `!important` in\n * the UA stylesheet.\n */\n\nbutton,\ninput {\n    line-height: normal;\n}\n\n/**\n * Address inconsistent `text-transform` inheritance for `button` and `select`.\n * All other form control elements do not inherit `text-transform` values.\n * Correct `button` style inheritance in Chrome, Safari 5+, and IE 8+.\n * Correct `select` style inheritance in Firefox 4+ and Opera.\n */\n\nbutton,\nselect {\n    text-transform: none;\n}\n\n/**\n * 1. Avoid the WebKit bug in Android 4.0.* where (2) destroys native `audio`\n *    and `video` controls.\n * 2. Correct inability to style clickable `input` types in iOS.\n * 3. Improve usability and consistency of cursor style between image-type\n *    `input` and others.\n */\n\nbutton,\nhtml input[type=\"button\"], /* 1 */\ninput[type=\"reset\"],\ninput[type=\"submit\"] {\n    -webkit-appearance: button; /* 2 */\n    cursor: pointer; /* 3 */\n}\n\n/**\n * Re-set default cursor for disabled elements.\n */\n\nbutton[disabled],\nhtml input[disabled] {\n    cursor: default;\n}\n\n/**\n * 1. Address box sizing set to `content-box` in IE 8/9/10.\n * 2. Remove excess padding in IE 8/9/10.\n */\n\ninput[type=\"checkbox\"],\ninput[type=\"radio\"] {\n    box-sizing: border-box; /* 1 */\n    padding: 0; /* 2 */\n}\n\n/**\n * 1. Address `appearance` set to `searchfield` in Safari 5 and Chrome.\n * 2. Address `box-sizing` set to `border-box` in Safari 5 and Chrome\n *    (include `-moz` to future-proof).\n */\n\ninput[type=\"search\"] {\n    -webkit-appearance: textfield; /* 1 */\n    -moz-box-sizing: content-box;\n    -webkit-box-sizing: content-box; /* 2 */\n    box-sizing: content-box;\n}\n\n/**\n * Remove inner padding and search cancel button in Safari 5 and Chrome\n * on OS X.\n */\n\ninput[type=\"search\"]::-webkit-search-cancel-button,\ninput[type=\"search\"]::-webkit-search-decoration {\n    -webkit-appearance: none;\n}\n\n/**\n * Remove inner padding and border in Firefox 4+.\n */\n\nbutton::-moz-focus-inner,\ninput::-moz-focus-inner {\n    border: 0;\n    padding: 0;\n}\n\n/**\n * 1. Remove default vertical scrollbar in IE 8/9.\n * 2. Improve readability and alignment in all browsers.\n */\n\ntextarea {\n    overflow: auto; /* 1 */\n    vertical-align: top; /* 2 */\n}\n\n/* ==========================================================================\n   Tables\n   ========================================================================== */\n\n/**\n * Remove most spacing between table cells.\n */\n\ntable {\n    border-collapse: collapse;\n    border-spacing: 0;\n}\n", ""]);

// exports


/***/ }),

/***/ 33:
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(36);
var core = __webpack_require__(28);
var ctx = __webpack_require__(56);
var hide = __webpack_require__(61);
var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var IS_WRAP = type & $export.W;
  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
  var expProto = exports[PROTOTYPE];
  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE];
  var key, own, out;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    if (own && key in exports) continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? ctx(out, global)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function (C) {
      var F = function (a, b, c) {
        if (this instanceof C) {
          switch (arguments.length) {
            case 0: return new C();
            case 1: return new C(a);
            case 2: return new C(a, b);
          } return new C(a, b, c);
        } return C.apply(this, arguments);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
    if (IS_PROTO) {
      (exports.virtual || (exports.virtual = {}))[key] = out;
      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
      if (type & $export.R && expProto && !expProto[key]) hide(expProto, key, out);
    }
  }
};
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library`
module.exports = $export;


/***/ }),

/***/ 330:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module, global) {var __WEBPACK_AMD_DEFINE_RESULT__;/*! https://mths.be/punycode v1.4.1 by @mathias */
;(function(root) {

	/** Detect free variables */
	var freeExports = typeof exports == 'object' && exports &&
		!exports.nodeType && exports;
	var freeModule = typeof module == 'object' && module &&
		!module.nodeType && module;
	var freeGlobal = typeof global == 'object' && global;
	if (
		freeGlobal.global === freeGlobal ||
		freeGlobal.window === freeGlobal ||
		freeGlobal.self === freeGlobal
	) {
		root = freeGlobal;
	}

	/**
	 * The `punycode` object.
	 * @name punycode
	 * @type Object
	 */
	var punycode,

	/** Highest positive signed 32-bit float value */
	maxInt = 2147483647, // aka. 0x7FFFFFFF or 2^31-1

	/** Bootstring parameters */
	base = 36,
	tMin = 1,
	tMax = 26,
	skew = 38,
	damp = 700,
	initialBias = 72,
	initialN = 128, // 0x80
	delimiter = '-', // '\x2D'

	/** Regular expressions */
	regexPunycode = /^xn--/,
	regexNonASCII = /[^\x20-\x7E]/, // unprintable ASCII chars + non-ASCII chars
	regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g, // RFC 3490 separators

	/** Error messages */
	errors = {
		'overflow': 'Overflow: input needs wider integers to process',
		'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
		'invalid-input': 'Invalid input'
	},

	/** Convenience shortcuts */
	baseMinusTMin = base - tMin,
	floor = Math.floor,
	stringFromCharCode = String.fromCharCode,

	/** Temporary variable */
	key;

	/*--------------------------------------------------------------------------*/

	/**
	 * A generic error utility function.
	 * @private
	 * @param {String} type The error type.
	 * @returns {Error} Throws a `RangeError` with the applicable error message.
	 */
	function error(type) {
		throw new RangeError(errors[type]);
	}

	/**
	 * A generic `Array#map` utility function.
	 * @private
	 * @param {Array} array The array to iterate over.
	 * @param {Function} callback The function that gets called for every array
	 * item.
	 * @returns {Array} A new array of values returned by the callback function.
	 */
	function map(array, fn) {
		var length = array.length;
		var result = [];
		while (length--) {
			result[length] = fn(array[length]);
		}
		return result;
	}

	/**
	 * A simple `Array#map`-like wrapper to work with domain name strings or email
	 * addresses.
	 * @private
	 * @param {String} domain The domain name or email address.
	 * @param {Function} callback The function that gets called for every
	 * character.
	 * @returns {Array} A new string of characters returned by the callback
	 * function.
	 */
	function mapDomain(string, fn) {
		var parts = string.split('@');
		var result = '';
		if (parts.length > 1) {
			// In email addresses, only the domain name should be punycoded. Leave
			// the local part (i.e. everything up to `@`) intact.
			result = parts[0] + '@';
			string = parts[1];
		}
		// Avoid `split(regex)` for IE8 compatibility. See #17.
		string = string.replace(regexSeparators, '\x2E');
		var labels = string.split('.');
		var encoded = map(labels, fn).join('.');
		return result + encoded;
	}

	/**
	 * Creates an array containing the numeric code points of each Unicode
	 * character in the string. While JavaScript uses UCS-2 internally,
	 * this function will convert a pair of surrogate halves (each of which
	 * UCS-2 exposes as separate characters) into a single code point,
	 * matching UTF-16.
	 * @see `punycode.ucs2.encode`
	 * @see <https://mathiasbynens.be/notes/javascript-encoding>
	 * @memberOf punycode.ucs2
	 * @name decode
	 * @param {String} string The Unicode input string (UCS-2).
	 * @returns {Array} The new array of code points.
	 */
	function ucs2decode(string) {
		var output = [],
		    counter = 0,
		    length = string.length,
		    value,
		    extra;
		while (counter < length) {
			value = string.charCodeAt(counter++);
			if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
				// high surrogate, and there is a next character
				extra = string.charCodeAt(counter++);
				if ((extra & 0xFC00) == 0xDC00) { // low surrogate
					output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
				} else {
					// unmatched surrogate; only append this code unit, in case the next
					// code unit is the high surrogate of a surrogate pair
					output.push(value);
					counter--;
				}
			} else {
				output.push(value);
			}
		}
		return output;
	}

	/**
	 * Creates a string based on an array of numeric code points.
	 * @see `punycode.ucs2.decode`
	 * @memberOf punycode.ucs2
	 * @name encode
	 * @param {Array} codePoints The array of numeric code points.
	 * @returns {String} The new Unicode string (UCS-2).
	 */
	function ucs2encode(array) {
		return map(array, function(value) {
			var output = '';
			if (value > 0xFFFF) {
				value -= 0x10000;
				output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
				value = 0xDC00 | value & 0x3FF;
			}
			output += stringFromCharCode(value);
			return output;
		}).join('');
	}

	/**
	 * Converts a basic code point into a digit/integer.
	 * @see `digitToBasic()`
	 * @private
	 * @param {Number} codePoint The basic numeric code point value.
	 * @returns {Number} The numeric value of a basic code point (for use in
	 * representing integers) in the range `0` to `base - 1`, or `base` if
	 * the code point does not represent a value.
	 */
	function basicToDigit(codePoint) {
		if (codePoint - 48 < 10) {
			return codePoint - 22;
		}
		if (codePoint - 65 < 26) {
			return codePoint - 65;
		}
		if (codePoint - 97 < 26) {
			return codePoint - 97;
		}
		return base;
	}

	/**
	 * Converts a digit/integer into a basic code point.
	 * @see `basicToDigit()`
	 * @private
	 * @param {Number} digit The numeric value of a basic code point.
	 * @returns {Number} The basic code point whose value (when used for
	 * representing integers) is `digit`, which needs to be in the range
	 * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
	 * used; else, the lowercase form is used. The behavior is undefined
	 * if `flag` is non-zero and `digit` has no uppercase form.
	 */
	function digitToBasic(digit, flag) {
		//  0..25 map to ASCII a..z or A..Z
		// 26..35 map to ASCII 0..9
		return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
	}

	/**
	 * Bias adaptation function as per section 3.4 of RFC 3492.
	 * https://tools.ietf.org/html/rfc3492#section-3.4
	 * @private
	 */
	function adapt(delta, numPoints, firstTime) {
		var k = 0;
		delta = firstTime ? floor(delta / damp) : delta >> 1;
		delta += floor(delta / numPoints);
		for (/* no initialization */; delta > baseMinusTMin * tMax >> 1; k += base) {
			delta = floor(delta / baseMinusTMin);
		}
		return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
	}

	/**
	 * Converts a Punycode string of ASCII-only symbols to a string of Unicode
	 * symbols.
	 * @memberOf punycode
	 * @param {String} input The Punycode string of ASCII-only symbols.
	 * @returns {String} The resulting string of Unicode symbols.
	 */
	function decode(input) {
		// Don't use UCS-2
		var output = [],
		    inputLength = input.length,
		    out,
		    i = 0,
		    n = initialN,
		    bias = initialBias,
		    basic,
		    j,
		    index,
		    oldi,
		    w,
		    k,
		    digit,
		    t,
		    /** Cached calculation results */
		    baseMinusT;

		// Handle the basic code points: let `basic` be the number of input code
		// points before the last delimiter, or `0` if there is none, then copy
		// the first basic code points to the output.

		basic = input.lastIndexOf(delimiter);
		if (basic < 0) {
			basic = 0;
		}

		for (j = 0; j < basic; ++j) {
			// if it's not a basic code point
			if (input.charCodeAt(j) >= 0x80) {
				error('not-basic');
			}
			output.push(input.charCodeAt(j));
		}

		// Main decoding loop: start just after the last delimiter if any basic code
		// points were copied; start at the beginning otherwise.

		for (index = basic > 0 ? basic + 1 : 0; index < inputLength; /* no final expression */) {

			// `index` is the index of the next character to be consumed.
			// Decode a generalized variable-length integer into `delta`,
			// which gets added to `i`. The overflow checking is easier
			// if we increase `i` as we go, then subtract off its starting
			// value at the end to obtain `delta`.
			for (oldi = i, w = 1, k = base; /* no condition */; k += base) {

				if (index >= inputLength) {
					error('invalid-input');
				}

				digit = basicToDigit(input.charCodeAt(index++));

				if (digit >= base || digit > floor((maxInt - i) / w)) {
					error('overflow');
				}

				i += digit * w;
				t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);

				if (digit < t) {
					break;
				}

				baseMinusT = base - t;
				if (w > floor(maxInt / baseMinusT)) {
					error('overflow');
				}

				w *= baseMinusT;

			}

			out = output.length + 1;
			bias = adapt(i - oldi, out, oldi == 0);

			// `i` was supposed to wrap around from `out` to `0`,
			// incrementing `n` each time, so we'll fix that now:
			if (floor(i / out) > maxInt - n) {
				error('overflow');
			}

			n += floor(i / out);
			i %= out;

			// Insert `n` at position `i` of the output
			output.splice(i++, 0, n);

		}

		return ucs2encode(output);
	}

	/**
	 * Converts a string of Unicode symbols (e.g. a domain name label) to a
	 * Punycode string of ASCII-only symbols.
	 * @memberOf punycode
	 * @param {String} input The string of Unicode symbols.
	 * @returns {String} The resulting Punycode string of ASCII-only symbols.
	 */
	function encode(input) {
		var n,
		    delta,
		    handledCPCount,
		    basicLength,
		    bias,
		    j,
		    m,
		    q,
		    k,
		    t,
		    currentValue,
		    output = [],
		    /** `inputLength` will hold the number of code points in `input`. */
		    inputLength,
		    /** Cached calculation results */
		    handledCPCountPlusOne,
		    baseMinusT,
		    qMinusT;

		// Convert the input in UCS-2 to Unicode
		input = ucs2decode(input);

		// Cache the length
		inputLength = input.length;

		// Initialize the state
		n = initialN;
		delta = 0;
		bias = initialBias;

		// Handle the basic code points
		for (j = 0; j < inputLength; ++j) {
			currentValue = input[j];
			if (currentValue < 0x80) {
				output.push(stringFromCharCode(currentValue));
			}
		}

		handledCPCount = basicLength = output.length;

		// `handledCPCount` is the number of code points that have been handled;
		// `basicLength` is the number of basic code points.

		// Finish the basic string - if it is not empty - with a delimiter
		if (basicLength) {
			output.push(delimiter);
		}

		// Main encoding loop:
		while (handledCPCount < inputLength) {

			// All non-basic code points < n have been handled already. Find the next
			// larger one:
			for (m = maxInt, j = 0; j < inputLength; ++j) {
				currentValue = input[j];
				if (currentValue >= n && currentValue < m) {
					m = currentValue;
				}
			}

			// Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
			// but guard against overflow
			handledCPCountPlusOne = handledCPCount + 1;
			if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
				error('overflow');
			}

			delta += (m - n) * handledCPCountPlusOne;
			n = m;

			for (j = 0; j < inputLength; ++j) {
				currentValue = input[j];

				if (currentValue < n && ++delta > maxInt) {
					error('overflow');
				}

				if (currentValue == n) {
					// Represent delta as a generalized variable-length integer
					for (q = delta, k = base; /* no condition */; k += base) {
						t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
						if (q < t) {
							break;
						}
						qMinusT = q - t;
						baseMinusT = base - t;
						output.push(
							stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))
						);
						q = floor(qMinusT / baseMinusT);
					}

					output.push(stringFromCharCode(digitToBasic(q, 0)));
					bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
					delta = 0;
					++handledCPCount;
				}
			}

			++delta;
			++n;

		}
		return output.join('');
	}

	/**
	 * Converts a Punycode string representing a domain name or an email address
	 * to Unicode. Only the Punycoded parts of the input will be converted, i.e.
	 * it doesn't matter if you call it on a string that has already been
	 * converted to Unicode.
	 * @memberOf punycode
	 * @param {String} input The Punycoded domain name or email address to
	 * convert to Unicode.
	 * @returns {String} The Unicode representation of the given Punycode
	 * string.
	 */
	function toUnicode(input) {
		return mapDomain(input, function(string) {
			return regexPunycode.test(string)
				? decode(string.slice(4).toLowerCase())
				: string;
		});
	}

	/**
	 * Converts a Unicode string representing a domain name or an email address to
	 * Punycode. Only the non-ASCII parts of the domain name will be converted,
	 * i.e. it doesn't matter if you call it with a domain that's already in
	 * ASCII.
	 * @memberOf punycode
	 * @param {String} input The domain name or email address to convert, as a
	 * Unicode string.
	 * @returns {String} The Punycode representation of the given domain name or
	 * email address.
	 */
	function toASCII(input) {
		return mapDomain(input, function(string) {
			return regexNonASCII.test(string)
				? 'xn--' + encode(string)
				: string;
		});
	}

	/*--------------------------------------------------------------------------*/

	/** Define the public API */
	punycode = {
		/**
		 * A string representing the current Punycode.js version number.
		 * @memberOf punycode
		 * @type String
		 */
		'version': '1.4.1',
		/**
		 * An object of methods to convert from JavaScript's internal character
		 * representation (UCS-2) to Unicode code points, and back.
		 * @see <https://mathiasbynens.be/notes/javascript-encoding>
		 * @memberOf punycode
		 * @type Object
		 */
		'ucs2': {
			'decode': ucs2decode,
			'encode': ucs2encode
		},
		'decode': decode,
		'encode': encode,
		'toASCII': toASCII,
		'toUnicode': toUnicode
	};

	/** Expose `punycode` */
	// Some AMD build optimizers, like r.js, check for specific condition patterns
	// like the following:
	if (
		true
	) {
		!(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
			return punycode;
		}.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else if (freeExports && freeModule) {
		if (module.exports == freeExports) {
			// in Node.js, io.js, or RingoJS v0.8.0+
			freeModule.exports = punycode;
		} else {
			// in Narwhal or RingoJS v0.7.0-
			for (key in punycode) {
				punycode.hasOwnProperty(key) && (freeExports[key] = punycode[key]);
			}
		}
	} else {
		// in Rhino or a web browser
		root.punycode = punycode;
	}

}(this));

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(280)(module), __webpack_require__(39)))

/***/ }),

/***/ 331:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(178);

var has = Object.prototype.hasOwnProperty;

var defaults = {
    allowDots: false,
    allowPrototypes: false,
    arrayLimit: 20,
    decoder: utils.decode,
    delimiter: '&',
    depth: 5,
    parameterLimit: 1000,
    plainObjects: false,
    strictNullHandling: false
};

var parseValues = function parseQueryStringValues(str, options) {
    var obj = {};
    var cleanStr = options.ignoreQueryPrefix ? str.replace(/^\?/, '') : str;
    var limit = options.parameterLimit === Infinity ? undefined : options.parameterLimit;
    var parts = cleanStr.split(options.delimiter, limit);

    for (var i = 0; i < parts.length; ++i) {
        var part = parts[i];

        var bracketEqualsPos = part.indexOf(']=');
        var pos = bracketEqualsPos === -1 ? part.indexOf('=') : bracketEqualsPos + 1;

        var key, val;
        if (pos === -1) {
            key = options.decoder(part, defaults.decoder);
            val = options.strictNullHandling ? null : '';
        } else {
            key = options.decoder(part.slice(0, pos), defaults.decoder);
            val = options.decoder(part.slice(pos + 1), defaults.decoder);
        }
        if (has.call(obj, key)) {
            obj[key] = [].concat(obj[key]).concat(val);
        } else {
            obj[key] = val;
        }
    }

    return obj;
};

var parseObject = function (chain, val, options) {
    var leaf = val;

    for (var i = chain.length - 1; i >= 0; --i) {
        var obj;
        var root = chain[i];

        if (root === '[]') {
            obj = [];
            obj = obj.concat(leaf);
        } else {
            obj = options.plainObjects ? Object.create(null) : {};
            var cleanRoot = root.charAt(0) === '[' && root.charAt(root.length - 1) === ']' ? root.slice(1, -1) : root;
            var index = parseInt(cleanRoot, 10);
            if (
                !isNaN(index)
                && root !== cleanRoot
                && String(index) === cleanRoot
                && index >= 0
                && (options.parseArrays && index <= options.arrayLimit)
            ) {
                obj = [];
                obj[index] = leaf;
            } else {
                obj[cleanRoot] = leaf;
            }
        }

        leaf = obj;
    }

    return leaf;
};

var parseKeys = function parseQueryStringKeys(givenKey, val, options) {
    if (!givenKey) {
        return;
    }

    // Transform dot notation to bracket notation
    var key = options.allowDots ? givenKey.replace(/\.([^.[]+)/g, '[$1]') : givenKey;

    // The regex chunks

    var brackets = /(\[[^[\]]*])/;
    var child = /(\[[^[\]]*])/g;

    // Get the parent

    var segment = brackets.exec(key);
    var parent = segment ? key.slice(0, segment.index) : key;

    // Stash the parent if it exists

    var keys = [];
    if (parent) {
        // If we aren't using plain objects, optionally prefix keys
        // that would overwrite object prototype properties
        if (!options.plainObjects && has.call(Object.prototype, parent)) {
            if (!options.allowPrototypes) {
                return;
            }
        }

        keys.push(parent);
    }

    // Loop through children appending to the array until we hit depth

    var i = 0;
    while ((segment = child.exec(key)) !== null && i < options.depth) {
        i += 1;
        if (!options.plainObjects && has.call(Object.prototype, segment[1].slice(1, -1))) {
            if (!options.allowPrototypes) {
                return;
            }
        }
        keys.push(segment[1]);
    }

    // If there's a remainder, just add whatever is left

    if (segment) {
        keys.push('[' + key.slice(segment.index) + ']');
    }

    return parseObject(keys, val, options);
};

module.exports = function (str, opts) {
    var options = opts ? utils.assign({}, opts) : {};

    if (options.decoder !== null && options.decoder !== undefined && typeof options.decoder !== 'function') {
        throw new TypeError('Decoder has to be a function.');
    }

    options.ignoreQueryPrefix = options.ignoreQueryPrefix === true;
    options.delimiter = typeof options.delimiter === 'string' || utils.isRegExp(options.delimiter) ? options.delimiter : defaults.delimiter;
    options.depth = typeof options.depth === 'number' ? options.depth : defaults.depth;
    options.arrayLimit = typeof options.arrayLimit === 'number' ? options.arrayLimit : defaults.arrayLimit;
    options.parseArrays = options.parseArrays !== false;
    options.decoder = typeof options.decoder === 'function' ? options.decoder : defaults.decoder;
    options.allowDots = typeof options.allowDots === 'boolean' ? options.allowDots : defaults.allowDots;
    options.plainObjects = typeof options.plainObjects === 'boolean' ? options.plainObjects : defaults.plainObjects;
    options.allowPrototypes = typeof options.allowPrototypes === 'boolean' ? options.allowPrototypes : defaults.allowPrototypes;
    options.parameterLimit = typeof options.parameterLimit === 'number' ? options.parameterLimit : defaults.parameterLimit;
    options.strictNullHandling = typeof options.strictNullHandling === 'boolean' ? options.strictNullHandling : defaults.strictNullHandling;

    if (str === '' || str === null || typeof str === 'undefined') {
        return options.plainObjects ? Object.create(null) : {};
    }

    var tempObj = typeof str === 'string' ? parseValues(str, options) : str;
    var obj = options.plainObjects ? Object.create(null) : {};

    // Iterate over the keys and setup the new object

    var keys = Object.keys(tempObj);
    for (var i = 0; i < keys.length; ++i) {
        var key = keys[i];
        var newObj = parseKeys(key, tempObj[key], options);
        obj = utils.merge(obj, newObj, options);
    }

    return utils.compact(obj);
};


/***/ }),

/***/ 332:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(178);
var formats = __webpack_require__(176);

var arrayPrefixGenerators = {
    brackets: function brackets(prefix) { // eslint-disable-line func-name-matching
        return prefix + '[]';
    },
    indices: function indices(prefix, key) { // eslint-disable-line func-name-matching
        return prefix + '[' + key + ']';
    },
    repeat: function repeat(prefix) { // eslint-disable-line func-name-matching
        return prefix;
    }
};

var toISO = Date.prototype.toISOString;

var defaults = {
    delimiter: '&',
    encode: true,
    encoder: utils.encode,
    encodeValuesOnly: false,
    serializeDate: function serializeDate(date) { // eslint-disable-line func-name-matching
        return toISO.call(date);
    },
    skipNulls: false,
    strictNullHandling: false
};

var stringify = function stringify( // eslint-disable-line func-name-matching
    object,
    prefix,
    generateArrayPrefix,
    strictNullHandling,
    skipNulls,
    encoder,
    filter,
    sort,
    allowDots,
    serializeDate,
    formatter,
    encodeValuesOnly
) {
    var obj = object;
    if (typeof filter === 'function') {
        obj = filter(prefix, obj);
    } else if (obj instanceof Date) {
        obj = serializeDate(obj);
    } else if (obj === null) {
        if (strictNullHandling) {
            return encoder && !encodeValuesOnly ? encoder(prefix, defaults.encoder) : prefix;
        }

        obj = '';
    }

    if (typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean' || utils.isBuffer(obj)) {
        if (encoder) {
            var keyValue = encodeValuesOnly ? prefix : encoder(prefix, defaults.encoder);
            return [formatter(keyValue) + '=' + formatter(encoder(obj, defaults.encoder))];
        }
        return [formatter(prefix) + '=' + formatter(String(obj))];
    }

    var values = [];

    if (typeof obj === 'undefined') {
        return values;
    }

    var objKeys;
    if (Array.isArray(filter)) {
        objKeys = filter;
    } else {
        var keys = Object.keys(obj);
        objKeys = sort ? keys.sort(sort) : keys;
    }

    for (var i = 0; i < objKeys.length; ++i) {
        var key = objKeys[i];

        if (skipNulls && obj[key] === null) {
            continue;
        }

        if (Array.isArray(obj)) {
            values = values.concat(stringify(
                obj[key],
                generateArrayPrefix(prefix, key),
                generateArrayPrefix,
                strictNullHandling,
                skipNulls,
                encoder,
                filter,
                sort,
                allowDots,
                serializeDate,
                formatter,
                encodeValuesOnly
            ));
        } else {
            values = values.concat(stringify(
                obj[key],
                prefix + (allowDots ? '.' + key : '[' + key + ']'),
                generateArrayPrefix,
                strictNullHandling,
                skipNulls,
                encoder,
                filter,
                sort,
                allowDots,
                serializeDate,
                formatter,
                encodeValuesOnly
            ));
        }
    }

    return values;
};

module.exports = function (object, opts) {
    var obj = object;
    var options = opts ? utils.assign({}, opts) : {};

    if (options.encoder !== null && options.encoder !== undefined && typeof options.encoder !== 'function') {
        throw new TypeError('Encoder has to be a function.');
    }

    var delimiter = typeof options.delimiter === 'undefined' ? defaults.delimiter : options.delimiter;
    var strictNullHandling = typeof options.strictNullHandling === 'boolean' ? options.strictNullHandling : defaults.strictNullHandling;
    var skipNulls = typeof options.skipNulls === 'boolean' ? options.skipNulls : defaults.skipNulls;
    var encode = typeof options.encode === 'boolean' ? options.encode : defaults.encode;
    var encoder = typeof options.encoder === 'function' ? options.encoder : defaults.encoder;
    var sort = typeof options.sort === 'function' ? options.sort : null;
    var allowDots = typeof options.allowDots === 'undefined' ? false : options.allowDots;
    var serializeDate = typeof options.serializeDate === 'function' ? options.serializeDate : defaults.serializeDate;
    var encodeValuesOnly = typeof options.encodeValuesOnly === 'boolean' ? options.encodeValuesOnly : defaults.encodeValuesOnly;
    if (typeof options.format === 'undefined') {
        options.format = formats['default'];
    } else if (!Object.prototype.hasOwnProperty.call(formats.formatters, options.format)) {
        throw new TypeError('Unknown format option provided.');
    }
    var formatter = formats.formatters[options.format];
    var objKeys;
    var filter;

    if (typeof options.filter === 'function') {
        filter = options.filter;
        obj = filter('', obj);
    } else if (Array.isArray(options.filter)) {
        filter = options.filter;
        objKeys = filter;
    }

    var keys = [];

    if (typeof obj !== 'object' || obj === null) {
        return '';
    }

    var arrayFormat;
    if (options.arrayFormat in arrayPrefixGenerators) {
        arrayFormat = options.arrayFormat;
    } else if ('indices' in options) {
        arrayFormat = options.indices ? 'indices' : 'repeat';
    } else {
        arrayFormat = 'indices';
    }

    var generateArrayPrefix = arrayPrefixGenerators[arrayFormat];

    if (!objKeys) {
        objKeys = Object.keys(obj);
    }

    if (sort) {
        objKeys.sort(sort);
    }

    for (var i = 0; i < objKeys.length; ++i) {
        var key = objKeys[i];

        if (skipNulls && obj[key] === null) {
            continue;
        }

        keys = keys.concat(stringify(
            obj[key],
            key,
            generateArrayPrefix,
            strictNullHandling,
            skipNulls,
            encode ? encoder : null,
            filter,
            sort,
            allowDots,
            serializeDate,
            formatter,
            encodeValuesOnly
        ));
    }

    var joined = keys.join(delimiter);
    var prefix = options.addQueryPrefix === true ? '?' : '';

    return joined.length > 0 ? prefix + joined : '';
};


/***/ }),

/***/ 333:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = function(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};


/***/ }),

/***/ 334:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



var stringifyPrimitive = function(v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

module.exports = function(obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return map(objectKeys(obj), function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray(obj[k])) {
        return map(obj[k], function(v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);

  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq +
         encodeURIComponent(stringifyPrimitive(obj));
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

function map (xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};


/***/ }),

/***/ 36:
/***/ (function(module, exports) {

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef


/***/ }),

/***/ 39:
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),

/***/ 40:
/***/ (function(module, exports, __webpack_require__) {

// Thank's IE8 for his funny defineProperty
module.exports = !__webpack_require__(52)(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),

/***/ 41:
/***/ (function(module, exports) {

module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};


/***/ }),

/***/ 435:
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),

/***/ 436:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
  isString: function(arg) {
    return typeof(arg) === 'string';
  },
  isObject: function(arg) {
    return typeof(arg) === 'object' && arg !== null;
  },
  isNull: function(arg) {
    return arg === null;
  },
  isNullOrUndefined: function(arg) {
    return arg == null;
  }
};


/***/ }),

/***/ 45:
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(51);
var IE8_DOM_DEFINE = __webpack_require__(218);
var toPrimitive = __webpack_require__(172);
var dP = Object.defineProperty;

exports.f = __webpack_require__(40) ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};


/***/ }),

/***/ 484:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(9)(undefined);
// imports
exports.i(__webpack_require__(323), "");

// module
exports.push([module.i, ".src-modules-Adapter-_styles_centerStyle_sgBYm, .src-modules-Adapter-_styles_logo_1hTLP, .src-modules-Adapter-_styles_presence_2ZaL0, .src-modules-Adapter-_styles_button_2cUDM {\n  top: 50%;\n  position: absolute;\n}\n\n.src-modules-Adapter-_styles_root_319lO {\n  -webkit-user-select: none;\n     -moz-user-select: none;\n      -ms-user-select: none;\n          user-select: none;\n  user-drag: none;\n  box-sizing: border-box;\n  padding: 0;\n  border-radius: 3px;\n  position: fixed;\n  display: block;\n  visibility: visible;\n  bottom: 0;\n  left: 0;\n  background-color: #f3f3f3;\n  transition: visibility 0.2 0s, opacity 0.2s 0s linear, -webkit-transform 0.1s 0s ease-in-out;\n  transition: visibility 0.2 0s, opacity 0.2s 0s linear, transform 0.1s 0s ease-in-out;\n  transition: visibility 0.2 0s, opacity 0.2s 0s linear, transform 0.1s 0s ease-in-out, -webkit-transform 0.1s 0s ease-in-out;\n  z-index: 9999;\n  box-shadow: 0px 0px 5px 1px #bec5d0;\n}\n\n.src-modules-Adapter-_styles_root_319lO.src-modules-Adapter-_styles_dragging_1VCye {\n  transition: opacity 0.1s 0s linear;\n}\n\n.src-modules-Adapter-_styles_root_319lO.src-modules-Adapter-_styles_loading_hdZTQ {\n  visibility: hidden;\n  opacity: 0;\n}\n\n.src-modules-Adapter-_styles_root_319lO .src-modules-Adapter-_styles_header_1a8xP {\n  -webkit-user-select: none;\n     -moz-user-select: none;\n      -ms-user-select: none;\n          user-select: none;\n  user-drag: none;\n  position: relative;\n  height: 44px !important;\n  line-height: 44px !important;\n  min-width: 165px;\n  text-align: center;\n  cursor: move;\n  z-index: 11;\n}\n\n.src-modules-Adapter-_styles_minimized_2g4Fc .src-modules-Adapter-_styles_header_1a8xP {\n  cursor: ew-resize;\n}\n\n@-webkit-keyframes src-modules-Adapter-_styles_sparkle_1cBlF {\n  from {\n    background-color: inherit;\n  }\n  to {\n    background-color: #add2e3;\n  }\n}\n\n@keyframes src-modules-Adapter-_styles_sparkle_1cBlF {\n  from {\n    background-color: inherit;\n  }\n  to {\n    background-color: #add2e3;\n  }\n}\n\n.src-modules-Adapter-_styles_minimized_2g4Fc.src-modules-Adapter-_styles_ringing_3BzK_ .src-modules-Adapter-_styles_header_1a8xP {\n  -webkit-animation-name: src-modules-Adapter-_styles_sparkle_1cBlF;\n          animation-name: src-modules-Adapter-_styles_sparkle_1cBlF;\n  -webkit-animation-duration: 0.45s;\n          animation-duration: 0.45s;\n  -webkit-animation-iteration-count: infinite;\n          animation-iteration-count: infinite;\n  -webkit-animation-direction: alternate;\n          animation-direction: alternate;\n  -webkit-animation-timing-function: ease-in-out;\n          animation-timing-function: ease-in-out;\n}\n\n.src-modules-Adapter-_styles_logo_1hTLP {\n  -webkit-user-select: none;\n     -moz-user-select: none;\n      -ms-user-select: none;\n          user-select: none;\n  user-drag: none;\n  left: 50%;\n  height: 16px;\n  width: 100px;\n  margin-top: -8px;\n  margin-left: -50px;\n}\n\n.src-modules-Adapter-_styles_presence_2ZaL0 {\n  left: 20px;\n  height: 14px;\n  width: 14px;\n  border-radius: 8px;\n  margin-top: -7px;\n  display: none;\n  cursor: pointer;\n}\n\n.src-modules-Adapter-_styles_minimized_2g4Fc .src-modules-Adapter-_styles_presence_2ZaL0 {\n  left: 10px;\n}\n\n.src-modules-Adapter-_styles_Offline_1zOmS {\n  display: block;\n  background: #cdcdcd;\n}\n\n.src-modules-Adapter-_styles_Busy_3jl4p {\n  display: block;\n  background: #f95b5c;\n}\n\n.src-modules-Adapter-_styles_Available_zQ2Rl {\n  display: block;\n  background-color: #32ae31;\n}\n\n.src-modules-Adapter-_styles_presenceBar_Vbygh {\n  display: none;\n  position: absolute;\n  width: 8px;\n  height: 2px;\n  border-radius: 1.5px;\n  background-color: #ffffff;\n  -webkit-transform-origin: 50% 50%;\n          transform-origin: 50% 50%;\n  -webkit-transform: translate(3px, 6px);\n          transform: translate(3px, 6px);\n}\n\n.src-modules-Adapter-_styles_DoNotAcceptAnyCalls_3OsQi .src-modules-Adapter-_styles_presenceBar_Vbygh {\n  display: block;\n}\n\n.src-modules-Adapter-_styles_button_2cUDM {\n  box-sizing: border-box;\n  height: 20px;\n  width: 20px;\n  margin-top: -12px;\n  border-radius: 3px;\n  cursor: pointer;\n  border-style: solid;\n  border-width: 1px;\n  border-color: transparent;\n}\n\n.src-modules-Adapter-_styles_button_2cUDM:hover {\n  border-color: #cccccc;\n}\n\n.src-modules-Adapter-_styles_toggle_3YPho {\n  right: 15px;\n}\n\n.src-modules-Adapter-_styles_minimized_2g4Fc .src-modules-Adapter-_styles_toggle_3YPho {\n  right: 3px;\n}\n\n.src-modules-Adapter-_styles_minimizeIcon_38kxv {\n  position: absolute;\n  box-sizing: border-box;\n  left: 3px;\n  bottom: 7px;\n  width: 12px;\n  height: 2px;\n  border: 1px solid #888888;\n}\n\n.src-modules-Adapter-_styles_minimized_2g4Fc .src-modules-Adapter-_styles_minimizeIcon_38kxv {\n  height: 12px;\n  bottom: 3px;\n}\n\n.src-modules-Adapter-_styles_minimizeIconBar_AVpYA {\n  width: 100%;\n  height: 1px;\n  background-color: #888888;\n}\n\n.src-modules-Adapter-_styles_close_16Lea {\n  right: 16px;\n}\n\n.src-modules-Adapter-_styles_minimized_2g4Fc .src-modules-Adapter-_styles_close_16Lea {\n  display: none;\n}\n\n.src-modules-Adapter-_styles_closeIcon_1hANM {\n  position: relative;\n  overflow: hidden;\n  margin: 2px;\n  width: 14px;\n  height: 14px;\n}\n\n.src-modules-Adapter-_styles_closeIcon_1hANM :first-child, .src-modules-Adapter-_styles_closeIcon_1hANM :last-child {\n  position: absolute;\n  height: 2px;\n  width: 100%;\n  top: 6px;\n  left: 0;\n  background: #888888;\n  border-radius: 1px;\n}\n\n.src-modules-Adapter-_styles_closeIcon_1hANM :first-child {\n  -webkit-transform: rotate(45deg);\n          transform: rotate(45deg);\n}\n\n.src-modules-Adapter-_styles_closeIcon_1hANM :last-child {\n  -webkit-transform: rotate(-45deg);\n          transform: rotate(-45deg);\n}\n\n.src-modules-Adapter-_styles_contentFrame_3UUGL {\n  display: block;\n  border: none;\n  width: 0;\n  height: 0;\n}\n\n.src-modules-Adapter-_styles_frameContainer_2BV3m {\n  transition: width 0.1s 0s ease-in-out, height 0.1s 0s ease-in-out;\n}\n\n.src-modules-Adapter-_styles_dragOverlay_1DMXF {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 0;\n  height: 0;\n  z-index: 10;\n}\n\n.src-modules-Adapter-_styles_root_319lO.src-modules-Adapter-_styles_dragging_1VCye .src-modules-Adapter-_styles_dragOverlay_1DMXF {\n  width: 500%;\n  height: 500%;\n  left: -200%;\n  top: -200%;\n}\n", ""]);

// exports
exports.locals = {
	"centerStyle": "src-modules-Adapter-_styles_centerStyle_sgBYm",
	"logo": "src-modules-Adapter-_styles_logo_1hTLP",
	"presence": "src-modules-Adapter-_styles_presence_2ZaL0",
	"button": "src-modules-Adapter-_styles_button_2cUDM",
	"root": "src-modules-Adapter-_styles_root_319lO",
	"dragging": "src-modules-Adapter-_styles_dragging_1VCye",
	"loading": "src-modules-Adapter-_styles_loading_hdZTQ",
	"header": "src-modules-Adapter-_styles_header_1a8xP",
	"minimized": "src-modules-Adapter-_styles_minimized_2g4Fc",
	"ringing": "src-modules-Adapter-_styles_ringing_3BzK_",
	"sparkle": "src-modules-Adapter-_styles_sparkle_1cBlF",
	"Offline": "src-modules-Adapter-_styles_Offline_1zOmS",
	"Busy": "src-modules-Adapter-_styles_Busy_3jl4p",
	"Available": "src-modules-Adapter-_styles_Available_zQ2Rl",
	"presenceBar": "src-modules-Adapter-_styles_presenceBar_Vbygh",
	"DoNotAcceptAnyCalls": "src-modules-Adapter-_styles_DoNotAcceptAnyCalls_3OsQi",
	"toggle": "src-modules-Adapter-_styles_toggle_3YPho",
	"minimizeIcon": "src-modules-Adapter-_styles_minimizeIcon_38kxv",
	"minimizeIconBar": "src-modules-Adapter-_styles_minimizeIconBar_AVpYA",
	"close": "src-modules-Adapter-_styles_close_16Lea",
	"closeIcon": "src-modules-Adapter-_styles_closeIcon_1hANM",
	"contentFrame": "src-modules-Adapter-_styles_contentFrame_3UUGL",
	"frameContainer": "src-modules-Adapter-_styles_frameContainer_2BV3m",
	"dragOverlay": "src-modules-Adapter-_styles_dragOverlay_1DMXF"
};

/***/ }),

/***/ 51:
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(41);
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};


/***/ }),

/***/ 52:
/***/ (function(module, exports) {

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};


/***/ }),

/***/ 56:
/***/ (function(module, exports, __webpack_require__) {

// optional / simple context binding
var aFunction = __webpack_require__(96);
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};


/***/ }),

/***/ 57:
/***/ (function(module, exports, __webpack_require__) {

// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = __webpack_require__(126);
var defined = __webpack_require__(125);
module.exports = function (it) {
  return IObject(defined(it));
};


/***/ }),

/***/ 60:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = 'rc-widget';

/***/ }),

/***/ 61:
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__(45);
var createDesc = __webpack_require__(99);
module.exports = __webpack_require__(40) ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};


/***/ }),

/***/ 67:
/***/ (function(module, exports) {

var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};


/***/ }),

/***/ 68:
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys = __webpack_require__(222);
var enumBugKeys = __webpack_require__(166);

module.exports = Object.keys || function keys(O) {
  return $keys(O, enumBugKeys);
};


/***/ }),

/***/ 69:
/***/ (function(module, exports, __webpack_require__) {

// 7.1.13 ToObject(argument)
var defined = __webpack_require__(125);
module.exports = function (it) {
  return Object(defined(it));
};


/***/ }),

/***/ 690:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = __webpack_require__(1);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(2);

var _createClass3 = _interopRequireDefault(_createClass2);

var _classnames = __webpack_require__(12);

var _classnames2 = _interopRequireDefault(_classnames);

var _styles = __webpack_require__(2171);

var _styles2 = _interopRequireDefault(_styles);

var _styles3 = __webpack_require__(484);

var _styles4 = _interopRequireDefault(_styles3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Adapter = function () {
  function Adapter() {
    var _this = this;

    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        logoUrl = _ref.logoUrl,
        appUrl = _ref.appUrl,
        _ref$prefix = _ref.prefix,
        prefix = _ref$prefix === undefined ? 'rc-widget' : _ref$prefix,
        brand = _ref.brand,
        className = _ref.className,
        _ref$testMode = _ref.testMode,
        testMode = _ref$testMode === undefined ? false : _ref$testMode,
        version = _ref.version;

    (0, _classCallCheck3.default)(this, Adapter);

    this._prefix = prefix;
    this._brand = brand;
    this._appUrl = appUrl;
    this._root = this._initContentDOM(prefix, appUrl);
    this._headerEl = this._root.querySelector('.' + _styles2.default.header);
    this._logoEl = this._root.querySelector('.' + _styles2.default.logo);
    this._contentFrameEl = this._root.querySelector('.' + _styles2.default.contentFrame);
    this._contentFrameContainerEl = this._root.querySelector('.' + _styles2.default.frameContainer);
    this._toggleEl = this._root.querySelector('.' + _styles2.default.toggle);
    this._presenceEl = this._root.querySelector('.' + _styles2.default.presence);

    this._minTranslateX = 0;
    this._translateX = 0;
    this._translateY = 0;
    this._appWidth = 0;
    this._appHeight = 0;
    this._dragStartPosition = null;

    this._minimized = false;
    this._appFocus = false;
    this._dragging = false;
    this._hover = false;
    this._testMode = testMode;

    this._version = version;
    this._loading = true;

    // logo_
    this._logoUrl = logoUrl;
    if (logoUrl) {
      this._logoEl.src = logoUrl;
    }
    this._logoEl.addEventListener('dragstart', function () {
      return false;
    });

    // content
    this._contentFrameEl.setAttribute('class', '' + [_styles2.default.contentFrame, className].join(' '));

    // toggle button
    this._toggleEl.addEventListener('click', function () {
      _this.toggleMinimized();
    });

    this._presenceEl.addEventListener('click', function () {
      _this.gotoPresence();
    });

    this.syncClass();
    this.setPresence({});
    this.setSize({ width: this._appWidth, height: this._appHeight });
    this.renderRestrictedPosition();

    this._headerEl.addEventListener('mousedown', function (e) {
      _this._dragging = true;
      _this._dragStartPosition = {
        x: e.clientX,
        y: e.clientY,
        translateX: _this._translateX,
        translateY: _this._translateY,
        minTranslateX: _this._minTranslateX
      };
      _this.syncClass();
    });
    this._headerEl.addEventListener('mouseup', function () {
      _this._dragging = false;
      _this.syncClass();
    });
    window.parent.addEventListener('mousemove', function (e) {
      if (_this._dragging) {
        if (e.buttons === 0) {
          _this._dragging = false;
          _this.syncClass();
          return;
        }
        var delta = {
          x: e.clientX - _this._dragStartPosition.x,
          y: e.clientY - _this._dragStartPosition.y
        };
        if (_this._minimized) {
          _this._minTranslateX = _this._dragStartPosition.minTranslateX + delta.x;
        } else {
          _this._translateX = _this._dragStartPosition.translateX + delta.x;
          _this._translateY = _this._dragStartPosition.translateY + delta.y;
        }
        _this.renderRestrictedPosition();
      }
    });

    this._resizeTimeout = null;
    this._resizeTick = null;
    window.parent.addEventListener('resize', function () {
      if (_this._dragging) {
        return;
      }
      if (_this._resizeTimeout) {
        clearTimeout(_this._resizeTimeout);
      }
      _this._resizeTimeout = setTimeout(function () {
        return _this.renderRestrictedPosition();
      }, 100);
      if (!_this._resizeTick || Date.now() - _this._resizeTick > 50) {
        _this._resizeTick = Date.now();
        _this.renderRestrictedPosition();
      }
    });

    window.addEventListener('message', function (e) {
      var data = e.data;
      if (data) {
        switch (data.type) {
          case 'rc-set-minimized':
            _this.setMinimized(data.minimized);
            break;
          case 'rc-set-ringing':
            _this.setRinging(data.ringing);
            break;
          case 'rc-set-size':
            _this.setSize(data.size);
            break;
          case 'rc-set-focus':
            _this.setFocus(data.focus);
            break;
          case 'rc-set-presence':
            _this.setPresence(data.presence);
            break;
          case 'rc-call-ring-notify':
            console.log('new ring call:');
            console.log(data.call);
            _this.setMinimized(false);
            break;
          case 'rc-call-end-notify':
            console.log('new end call:');
            console.log(data.call);
            break;
          case 'rc-version':
            _this.reportVersion();
            break;
          case 'rc-adapter-init':
            _this.init(data);
            break;
          case 'rc-ribbon-default':
            _this.setMinimized(false);
            break;
          default:
            break;
        }
      }
    });

    this._root.addEventListener('mouseenter', function () {
      _this._hover = true;
      _this.syncClass();
    });
    this._root.addEventListener('mouseleave', function () {
      _this._hover = false;
      _this.syncClass();
    });

    var phoneCallTags = window.document.querySelectorAll('a[href^="tel:"]');

    var _loop = function _loop(i) {
      var phoneTag = phoneCallTags[i];
      phoneTag.addEventListener('click', function () {
        var hrefStr = phoneTag.getAttribute('href');
        var phoneNumber = hrefStr.replace(/[^\d+*-]/g, '');
        _this.clickToCall(phoneNumber, true);
      });
    };

    for (var i = 0; i < phoneCallTags.length; ++i) {
      _loop(i);
    }
    var phoneSMSTags = window.document.querySelectorAll('a[href^="sms:"]');

    var _loop2 = function _loop2(i) {
      var phoneTag = phoneSMSTags[i];
      phoneTag.addEventListener('click', function () {
        var hrefStr = phoneTag.getAttribute('href');
        var phoneNumber = hrefStr.replace(/[^\d+*-]/g, '');
        _this.clickToSMS(phoneNumber);
      });
    };

    for (var i = 0; i < phoneSMSTags.length; ++i) {
      _loop2(i);
    }
  }

  (0, _createClass3.default)(Adapter, [{
    key: '_initContentDOM',
    value: function _initContentDOM(prefix, appUrl) {
      var topDocument = window.document;
      var divEl = topDocument.querySelector('#' + prefix);
      if (divEl) return divEl;
      divEl = this._generateContentDOM(topDocument, prefix, appUrl);
      topDocument.body.appendChild(divEl);
      return divEl;
    }

    // eslint-disable-next-line

  }, {
    key: '_generateContentDOM',
    value: function _generateContentDOM(topDocument, prefix, iframeSrc) {
      var divEl = topDocument.createElement('div');
      divEl.id = prefix;
      divEl.setAttribute('class', (0, _classnames2.default)(_styles2.default.root, _styles2.default.loading));
      divEl.draggable = false;

      divEl.innerHTML = '\n      <style>' + _styles4.default.toString() + '</style>\n      <header class="' + _styles2.default.header + '" draggable="false">\n        <div class="' + _styles2.default.presence + '">\n          <div class="' + _styles2.default.presenceBar + '">\n          </div>\n        </div>\n        <div class="' + _styles2.default.button + ' ' + _styles2.default.toggle + '">\n          <div class="' + _styles2.default.minimizeIcon + '">\n            <div class="' + _styles2.default.minimizeIconBar + '"></div>\n          </div>\n        </div>\n        <img class="' + _styles2.default.logo + '" draggable="false"></img>\n      </header>\n      <div class="' + _styles2.default.frameContainer + '">\n        <iframe id="' + prefix + '-adapter-frame" class="' + _styles2.default.contentFrame + '" src="' + iframeSrc + '" allow="microphone">\n        </iframe>\n      </div>\n    ';
      return divEl;
    }
  }, {
    key: '_postMessage',
    value: function _postMessage(data) {
      if (this._contentFrameEl.contentWindow) {
        this._contentFrameEl.contentWindow.postMessage(data, '*');
      }
    }
  }, {
    key: 'renderPosition',
    value: function renderPosition() {
      this._postMessage({
        type: 'rc-adapter-sync-position',
        translateX: this._translateX,
        translateY: this._translateY,
        minTranslateX: this._minTranslateX
      });
      if (this._minimized) {
        this._root.setAttribute('style', 'transform: translate( ' + this._minTranslateX + 'px, 0)!important;');
      } else {
        this._root.setAttribute('style', 'transform: translate(' + this._translateX + 'px, ' + this._translateY + 'px)!important;');
      }
    }
  }, {
    key: 'renderRestrictedPosition',
    value: function renderRestrictedPosition() {
      var style = document.defaultView.getComputedStyle(this._root, null);
      var paddingX = (parseFloat(style.paddingLeft, 10) || 0) + (parseFloat(style.paddingRight, 10) || 0);
      var paddingY = (parseFloat(style.paddingTop, 10) || 0) + (parseFloat(style.paddingBottom, 10) || 0);
      var borderX = (parseFloat(style.borderLeftWidth, 10) || 0) + (parseFloat(style.borderRightWidth, 10) || 0);
      var borderY = (parseFloat(style.borderTopWidth, 10) || 0) + (parseFloat(style.borderBottomWidth, 10) || 0);
      var maximumX = window.parent.innerWidth - (this._minimized ? this._headerEl.clientWidth : this._appWidth) - paddingX - borderX;
      var maximumY = window.parent.innerHeight - (this._minimized ? this._headerEl.clientHeight : this._headerEl.clientHeight + this._appHeight) - paddingY - borderY;

      if (this._minimized) {
        var x = this._minTranslateX;
        x = Math.min(x, maximumX);
        this._minTranslateX = Math.max(x, 0);
      } else {
        var _x2 = this._translateX;
        var y = this._translateY;
        _x2 = Math.min(_x2, maximumX);
        _x2 = Math.max(_x2, 0);
        y = Math.min(y, 0);
        y = Math.max(y, -maximumY);
        this._translateX = _x2;
        this._translateY = y;
      }
      //
      this.renderPosition();
    }
  }, {
    key: 'renderAdapterSize',
    value: function renderAdapterSize() {
      if (this._minimized) {
        this._contentFrameEl.style.width = 0;
        this._contentFrameEl.style.height = 0;
        this._contentFrameContainerEl.style.width = 0;
        this._contentFrameContainerEl.style.height = 0;
      } else {
        this._contentFrameEl.style.width = this._appWidth + 'px';
        this._contentFrameEl.style.height = this._appHeight + 'px';
        this._contentFrameContainerEl.style.width = this._appWidth + 'px';
        this._contentFrameContainerEl.style.height = this._appHeight + 'px';
      }
    }
  }, {
    key: 'syncClass',
    value: function syncClass() {
      //  console.debug('this.sparkled>>>', this.sparkled);
      this._root.setAttribute('class', (0, _classnames2.default)(_styles2.default.root, this._minimized && _styles2.default.minimized, this._appFocus && _styles2.default.focus, this._dragging && _styles2.default.dragging, this._hover && _styles2.default.hover, this._loading && _styles2.default.loading, this._ringing && _styles2.default.ringing));
    }
  }, {
    key: 'setMinimized',
    value: function setMinimized(minimized) {
      this._minimized = !!minimized;
      this.syncClass();
      this.renderAdapterSize();
      this.renderRestrictedPosition();
      this._postMessage({
        type: 'rc-adapter-minimized',
        minimized: this._minimized
      });
    }
  }, {
    key: 'toggleMinimized',
    value: function toggleMinimized() {
      this.setMinimized(!this._minimized);
    }
  }, {
    key: 'setRinging',
    value: function setRinging(ringing) {
      this._ringing = !!ringing;
      this.syncClass();
    }
  }, {
    key: 'setFocus',
    value: function setFocus(focus) {
      this._appFocus = !!focus;
      this.syncClass();
      this._postMessage({
        type: 'rc-adapter-focus',
        focus: this._appFocus
      });
    }
  }, {
    key: 'setSize',
    value: function setSize(_ref2) {
      var width = _ref2.width,
          height = _ref2.height;

      this._appWidth = width;
      this._appHeight = height;
      this._contentFrameEl.style.width = width + 'px';
      this._contentFrameEl.style.height = height + 'px';
      this.renderAdapterSize();
      this._postMessage({
        type: 'rc-adapter-size',
        size: {
          width: this._appWidth,
          height: this._appHeight
        }
      });
    }
  }, {
    key: 'setPresence',
    value: function setPresence(presence) {
      if (presence !== this.presence) {
        this.presence = presence;
        this._presenceEl.setAttribute('class', (0, _classnames2.default)(this._minimized && _styles2.default.minimized, _styles2.default.presence, _styles2.default[presence.userStatus], _styles2.default[presence.dndStatus]));
      }
    }
  }, {
    key: 'gotoPresence',
    value: function gotoPresence() {
      this._postMessage({
        type: 'rc-adapter-goto-presence',
        version: this._version
      });
    }
  }, {
    key: 'reportVersion',
    value: function reportVersion() {
      this._postMessage({
        type: 'rc-version-response',
        version: this._version
      });
    }
  }, {
    key: 'setEnvironment',
    value: function setEnvironment() {
      this._postMessage({
        type: 'rc-adapter-set-environment'
      });
    }
  }, {
    key: 'clickToSMS',
    value: function clickToSMS(phoneNumber) {
      this.setMinimized(false);
      this._postMessage({
        type: 'rc-adapter-new-sms',
        phoneNumber: phoneNumber
      });
    }
  }, {
    key: 'clickToCall',
    value: function clickToCall(phoneNumber) {
      var toCall = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      this.setMinimized(false);
      this._postMessage({
        type: 'rc-adapter-new-call',
        phoneNumber: phoneNumber,
        toCall: toCall
      });
    }
  }, {
    key: 'init',
    value: function init(_ref3) {
      var size = _ref3.size,
          minimized = _ref3.minimized,
          _ref3$position = _ref3.position,
          translateX = _ref3$position.translateX,
          translateY = _ref3$position.translateY,
          minTranslateX = _ref3$position.minTranslateX;

      this._postMessage({
        type: 'rc-adapter-mode',
        testMode: this._testMode
      });
      this._minimized = minimized;
      this._translateX = translateX;
      this._translateY = translateY;
      this._minTranslateX = minTranslateX;
      this._loading = false;
      this.syncClass();
      this.setSize(size);
      this.renderRestrictedPosition();
    }
  }]);
  return Adapter;
}();
// eslint-disable-next-line


exports.default = Adapter;

/***/ }),

/***/ 692:
/***/ (function(module, exports) {

module.exports = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE2LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHdpZHRoPSI3NHB4IiBoZWlnaHQ9IjEycHgiIHZpZXdCb3g9IjAgMCA3NCAxMiIgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAwIDAgNzQgMTIiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8Zz4KCTxnPgoJCTxkZWZzPgoJCQk8cmVjdCBpZD0iU1ZHSURfMV8iIHk9IjAuNTM5IiB3aWR0aD0iNzQiIGhlaWdodD0iMTAuOTIyIi8+CgkJPC9kZWZzPgoJCTxjbGlwUGF0aCBpZD0iU1ZHSURfMl8iPgoJCQk8dXNlIHhsaW5rOmhyZWY9IiNTVkdJRF8xXyIgIG92ZXJmbG93PSJ2aXNpYmxlIi8+CgkJPC9jbGlwUGF0aD4KCQk8cGF0aCBjbGlwLXBhdGg9InVybCgjU1ZHSURfMl8pIiBmaWxsPSIjMDA2MDlDIiBkPSJNMy4zOTEsNi40MDhMMi44Nyw5LjQ1M0gwbDEuNTIzLTguNzQ0aDQuMTI5YzAuNjM1LDAsMS4xNzcsMC4wNDIsMS42MjEsMC4xMTQKCQkJQzcuNzEyLDAuOSw4LjA3MywxLjAyLDguMzUyLDEuMTc4YzAuMjc4LDAuMTU1LDAuNDgsMC4zNTIsMC42MDksMC41OUM5LjA4NSwyLDkuMTQ3LDIuMjc3LDkuMTQ3LDIuNjA0CgkJCWMwLDAuMTcyLTAuMDIxLDAuMzczLTAuMDYyLDAuNkM4Ljk5NywzLjcwNCw4LjgwMSw0LjE0OCw4LjQ5Nyw0LjU0NmMtMC4zLDAuMzkyLTAuNzIzLDAuNjU1LTEuMjU0LDAuNzg5CgkJCWMwLjE3NSwwLjA2NywwLjM0LDAuMTM2LDAuNDgsMC4yMDJDNy44NjIsNS42MDksNy45ODYsNS42OTUsOC4wODksNS44YzAuMDk4LDAuMTA0LDAuMTc2LDAuMjM3LDAuMjMyLDAuMzg4CgkJCWMwLjA1NywwLjE1NCwwLjA4OCwwLjM1NSwwLjA4OCwwLjZjMCwwLjI0Ny0wLjAzMSwwLjU0MS0wLjA4OCwwLjg3MmMtMC4wNTcsMC4zMS0wLjA5OCwwLjU2Mi0wLjEzNCwwLjc2NAoJCQlDOC4xNTYsOC42MjksOC4xNDEsOC43ODQsOC4xNDEsOC44OThjMCwwLjE5NSwwLjA3MiwwLjI5NSwwLjIxNywwLjI5NUw4LjMyMiw5LjQ1Nkg1LjQyQzUuNDA0LDkuMzc5LDUuMzk0LDkuMjc5LDUuMzk0LDkuMTc4CgkJCWMwLTAuMTQsMC4wMS0wLjMxNCwwLjAzMS0wLjUyNUM1LjQ0Niw4LjQzNiw1LjQ4Miw4LjE5Nyw1LjUyOCw3LjkzQzUuNTc0LDcuNjYsNS42LDcuNDM0LDUuNiw3LjI0NwoJCQljMC0wLjMxLTAuMDkzLTAuNTI2LTAuMjg0LTAuNjQ5QzUuMTI1LDYuNDczLDQuNzc0LDYuNDExLDQuMjYzLDYuNDExSDMuMzkxVjYuNDA4eiBNMy43MzIsNC40ODhoMS4xMwoJCQljMC40NDQsMCwwLjc5LTAuMDYyLDEuMDQzLTAuMTgyYzAuMjUzLTAuMTIzLDAuNDAyLTAuMzQxLDAuNDQ5LTAuNjQ2QzYuMzY1LDMuNjIsNi4zNjUsMy41NTcsNi4zNjUsMy40OAoJCQljMC0wLjI1NC0wLjA5My0wLjQzNS0wLjI3OS0wLjU1OUM1LjksMi44MDksNS42NTcsMi43NDYsNS4zNTgsMi43NDZINC4wMjFMMy43MzIsNC40ODh6Ii8+Cgk8L2c+Cgk8Zz4KCQk8ZGVmcz4KCQkJPHJlY3QgaWQ9IlNWR0lEXzNfIiB5PSIwLjUzOSIgd2lkdGg9Ijc0IiBoZWlnaHQ9IjEwLjkyMiIvPgoJCTwvZGVmcz4KCQk8Y2xpcFBhdGggaWQ9IlNWR0lEXzRfIj4KCQkJPHVzZSB4bGluazpocmVmPSIjU1ZHSURfM18iICBvdmVyZmxvdz0idmlzaWJsZSIvPgoJCTwvY2xpcFBhdGg+CgkJPHBhdGggY2xpcC1wYXRoPSJ1cmwoI1NWR0lEXzRfKSIgZmlsbD0iIzAwNjA5QyIgZD0iTTEzLjE3MywzLjA4OWgyLjMwMkwxNS4zMSw0LjA4NWMwLjM1MS0wLjM4NywwLjcxMi0wLjY4MSwxLjA4NC0wLjg3NwoJCQljMC4zNjEtMC4yMDEsMC43ODUtMC4zLDEuMjctMC4zYzAuNzEyLDAsMS4yMzksMC4xNjUsMS41NjksMC40OTZjMC4zMzEsMC4zMzUsMC40OTYsMC44MTQsMC40OTYsMS40NDkKCQkJYzAsMC4yNDgtMC4wMjEsMC41MTItMC4wNzIsMC43ODVsLTAuNjUsMy44MTNoLTIuNTI5bDAuNTc4LTMuMzY1YzAuMDMxLTAuMTQ2LDAuMDQyLTAuMjg0LDAuMDQyLTAuNDIzCgkJCWMwLTAuMjE3LTAuMDUyLTAuNDAzLTAuMTU1LTAuNTQ4Yy0wLjEwMy0wLjE0Ni0wLjI4OS0wLjIxOC0wLjU2Ny0wLjIxOGMtMC4zODIsMC0wLjY3MSwwLjExNS0wLjg0NywwLjM0OAoJCQljLTAuMTc2LDAuMjMtMC4yOTksMC41NTItMC4zNjEsMC45NjVMMTQuNjEsOS40NTJoLTIuNTI5TDEzLjE3MywzLjA4OXoiLz4KCTwvZz4KCTxnPgoJCTxkZWZzPgoJCQk8cmVjdCBpZD0iU1ZHSURfNV8iIHk9IjAuNTM5IiB3aWR0aD0iNzQiIGhlaWdodD0iMTAuOTIyIi8+CgkJPC9kZWZzPgoJCTxjbGlwUGF0aCBpZD0iU1ZHSURfNl8iPgoJCQk8dXNlIHhsaW5rOmhyZWY9IiNTVkdJRF81XyIgIG92ZXJmbG93PSJ2aXNpYmxlIi8+CgkJPC9jbGlwUGF0aD4KCQk8cGF0aCBjbGlwLXBhdGg9InVybCgjU1ZHSURfNl8pIiBmaWxsPSIjMDA2MDlDIiBkPSJNMjIuMDkzLDkuNjI5djAuMDM2YzAsMC4wODgsMC4wNDEsMC4xNywwLjExMywwLjI0MgoJCQljMC4wODMsMC4xMDQsMC4yNTgsMC4xNTUsMC41MTYsMC4xNTVjMC4zNzIsMCwwLjY0LTAuMDk0LDAuODI2LTAuMjc5czAuMzItMC41MDYsMC40MDItMC45NmwwLjEwNC0wLjUyMQoJCQljLTAuMjE3LDAuMTg4LTAuNDc1LDAuMzUzLTAuNzg1LDAuNDg1Yy0wLjMyLDAuMTQtMC43MDIsMC4yMDctMS4xNjcsMC4yMDdjLTAuMzgyLDAtMC43MTItMC4wNjItMS4wMDEtMC4xODIKCQkJcy0wLjUyNi0wLjI4OS0wLjcyMy0wLjQ5NmMtMC4xOTYtMC4yMTEtMC4zNDEtMC40NjMtMC40MzQtMC43NTJjLTAuMTAzLTAuMjk1LTAuMTQ1LTAuNjA0LTAuMTQ1LTAuOTM5CgkJCWMwLTAuMTA0LDAtMC4yMDcsMC4wMjEtMC4zMTFjMC4wMS0wLjEwNywwLjAyMS0wLjIxNywwLjA0Mi0wLjMzYzAuMDYyLTAuMzg3LDAuMTc1LTAuNzc5LDAuMzQxLTEuMTY2CgkJCWMwLjE2NS0wLjM4OSwwLjM5Mi0wLjczMywwLjY3MS0xLjAzOWMwLjI3OS0wLjMwMywwLjYwOS0wLjU1MSwxLjAxMi0wLjc0MmMwLjM5Mi0wLjE4NiwwLjg0Ny0wLjI4MywxLjM3My0wLjI4MwoJCQljMC4zOTIsMCwwLjczMywwLjA5NCwxLjA0MiwwLjI3OGMwLjI5OSwwLjE4MSwwLjUzNywwLjQyOSwwLjcyMywwLjczM2wwLjEzNC0wLjgzMmgyLjIyTDI2LjQ5LDguMDU5CgkJCWMtMC4wODMsMC40NzYtMC4xODYsMC45MjQtMC4zMTEsMS4zMzhjLTAuMTIzLDAuNDEyLTAuMzMsMC43NzMtMC41OTksMS4wNzhjLTAuMjc5LDAuMzExLTAuNjUsMC41NTMtMS4xMzYsMC43MjQKCQkJYy0wLjQ3NSwwLjE3NS0xLjEwNCwwLjI2My0xLjg4OSwwLjI2M2MtMC41NTgsMC0xLjAyMi0wLjA0Ni0xLjM5NC0wLjE0NWMtMC4zODItMC4wOTktMC42OTItMC4yMjgtMC45MjktMC4zODcKCQkJYy0wLjIzNy0wLjE2Ni0wLjQwMy0wLjM1My0wLjUxNi0wLjU2MmMtMC4xMDQtMC4yMDctMC4xNjUtMC40My0wLjE2NS0wLjY1NlY5LjYyOUgyMi4wOTN6IE0yMy42LDQuNTUKCQkJYy0wLjE4NiwwLTAuMzUxLDAuMDM2LTAuNDg1LDAuMTEzYy0wLjEzNCwwLjA3MS0wLjI1OCwwLjE3MS0wLjM1MSwwLjMwNWMtMC4xMDMsMC4xMy0wLjE3NSwwLjI4NC0wLjIzNywwLjQ2CgkJCUMyMi40NjUsNS42MDksMjIuNDEzLDUuNzk5LDIyLjM4Miw2Yy0wLjAxLDAuMDYyLTAuMDEsMC4xMTQtMC4wMSwwLjE2Yy0wLjAxMSwwLjA1Mi0wLjAxMSwwLjA5OS0wLjAxMSwwLjE0NQoJCQljMCwwLjI1NCwwLjA2MiwwLjQ3NSwwLjE4NiwwLjY1NWMwLjEyNCwwLjE4NywwLjMzMSwwLjI3OSwwLjYyLDAuMjg5aDAuMDUxYzAuMTg2LDAsMC4zNDEtMC4wNDEsMC40ODUtMC4xMTMKCQkJYzAuMTQ0LTAuMDcxLDAuMjU4LTAuMTcxLDAuMzYxLTAuMjg4YzAuMTAzLTAuMTI1LDAuMTg2LTAuMjY0LDAuMjQ4LTAuNDI0YzAuMDcyLTAuMTYsMC4xMTQtMC4zMiwwLjE1NS0wLjQ5NgoJCQljMC4wMjEtMC4xMjksMC4wMzEtMC4yNjMsMC4wMzEtMC40MDJjMC0wLjI2OS0wLjA2Mi0wLjQ5NC0wLjE5Ni0wLjY4N2MtMC4xMjQtMC4xOS0wLjM1MS0wLjI4OS0wLjY4MS0wLjI4OUgyMy42eiIvPgoJPC9nPgoJPGc+CgkJPGRlZnM+CgkJCTxyZWN0IGlkPSJTVkdJRF83XyIgeT0iMC41MzkiIHdpZHRoPSI3NCIgaGVpZ2h0PSIxMC45MjIiLz4KCQk8L2RlZnM+CgkJPGNsaXBQYXRoIGlkPSJTVkdJRF84XyI+CgkJCTx1c2UgeGxpbms6aHJlZj0iI1NWR0lEXzdfIiAgb3ZlcmZsb3c9InZpc2libGUiLz4KCQk8L2NsaXBQYXRoPgoJCTxwYXRoIGNsaXAtcGF0aD0idXJsKCNTVkdJRF84XykiIGZpbGw9IiNGMzhCMDAiIGQ9Ik0zMy4yOTQsNC4xMjdjMC0wLjAzMSwwLjAxMS0wLjA1OSwwLjAxMS0wLjA4M2MwLTAuMDIxLDAuMDEtMC4wNDcsMC4wMS0wLjA3NwoJCQljMC0wLjM4OC0wLjExNC0wLjY4Mi0wLjMzMi0wLjg4M2MtMC4yMTctMC4yMDctMC41MjUtMC4zMTEtMC45MjgtMC4zMTFjLTAuNDc2LDAtMC44ODksMC4xOTctMS4yMjksMC42CgkJCWMtMC4zMzEsMC40MDItMC41NjgsMS4wMDctMC43MTIsMS44MTJjLTAuMDMxLDAuMTQ4LTAuMDUzLDAuMjk5LTAuMDYyLDAuNDM4Yy0wLjAyMSwwLjE0NS0wLjAyMSwwLjI3OS0wLjAyMSwwLjQwOAoJCQljMCwwLjIwMSwwLjAxMSwwLjM4NywwLjA2MiwwLjU1M2MwLjA0MiwwLjE3LDAuMTE0LDAuMzE0LDAuMjE3LDAuNDQzYzAuMTA0LDAuMTIzLDAuMjM4LDAuMjIyLDAuNDAzLDAuMjk5CgkJCWMwLjE3NSwwLjA3MiwwLjM4MiwwLjEwNywwLjY0LDAuMTA3YzAuNDQ0LDAsMC43OTUtMC4xMzQsMS4wNTMtMC40MDFjMC4yNy0wLjI2OSwwLjQ2Ni0wLjU5OSwwLjU3OC0xLjAwMWgyLjYxMwoJCQljLTAuMTU0LDAuNTM3LTAuMzcxLDEuMDE3LTAuNjYsMS40MzVjLTAuMjg5LDAuNDI1LTAuNjMxLDAuNzg1LTEuMDIyLDEuMDc5cy0wLjgzNiwwLjUxNi0xLjMyMSwwLjY3NgoJCQljLTAuNDg0LDAuMTU1LTEuMDAxLDAuMjMyLTEuNTQ4LDAuMjMyYy0wLjU4OSwwLTEuMTI1LTAuMDcyLTEuNTgtMC4yMjdjLTAuNDY1LTAuMTU2LTAuODQ3LTAuMzc3LTEuMTY3LTAuNjY2CgkJCWMtMC4zMi0wLjI5NS0wLjU1OS0wLjY0Ni0wLjcyMy0xLjA2M2MtMC4xNjYtMC40MTgtMC4yNDgtMC44ODgtMC4yNDgtMS40MTljMC0wLjE1LDAuMDEtMC4zMTEsMC4wMjEtMC40NzcKCQkJYzAuMDIxLTAuMTY0LDAuMDQxLTAuMzM0LDAuMDcxLTAuNTExYzAuMTE0LTAuNjY2LDAuMzE5LTEuMjY1LDAuNjMtMS44MDdjMC4zMTEtMC41MzEsMC42ODItMC45OTEsMS4xMTUtMS4zNjIKCQkJYzAuNDM0LTAuMzc3LDAuOTI5LTAuNjY2LDEuNDY2LTAuODY3czEuMDk1LTAuMzA1LDEuNjcyLTAuMzA1YzEuMTk4LDAsMi4wOTcsMC4yNjQsMi42OTQsMC43OTUKCQkJYzAuNTg5LDAuNTI1LDAuODg4LDEuMjcsMC44ODgsMi4yMzR2MC4xNzZjMCwwLjA1Mi0wLjAxLDAuMTA3LTAuMDEsMC4xNzFMMzMuMjk0LDQuMTI3TDMzLjI5NCw0LjEyN3oiLz4KCTwvZz4KCTxnPgoJCTxkZWZzPgoJCQk8cmVjdCBpZD0iU1ZHSURfOV8iIHk9IjAuNTM5IiB3aWR0aD0iNzQiIGhlaWdodD0iMTAuOTIyIi8+CgkJPC9kZWZzPgoJCTxjbGlwUGF0aCBpZD0iU1ZHSURfMTBfIj4KCQkJPHVzZSB4bGluazpocmVmPSIjU1ZHSURfOV8iICBvdmVyZmxvdz0idmlzaWJsZSIvPgoJCTwvY2xpcFBhdGg+CgkJPHBhdGggY2xpcC1wYXRoPSJ1cmwoI1NWR0lEXzEwXykiIGZpbGw9IiNGMzhCMDAiIGQ9Ik0zOC41MTgsNi42NjFjLTAuMDExLDAuMDQxLTAuMDIxLDAuMDgyLTAuMDIxLDAuMTE4CgkJCWMtMC4wMTEsMC4wNDEtMC4wMTEsMC4wODItMC4wMTEsMC4xMjNjMCwwLjMxMSwwLjEwNCwwLjU1NCwwLjMxLDAuNzM4YzAuMTk2LDAuMTgyLDAuNDU1LDAuMjcsMC43NTQsMC4yNwoJCQljMC4xOTYsMCwwLjM5NC0wLjA0NywwLjU3OC0wLjE0MWMwLjE4NS0wLjA5MywwLjM0MS0wLjIzMSwwLjQ2NS0wLjQxOGgyLjQxNmMtMC4xNzYsMC4zOTctMC40MTMsMC43MjktMC43MDIsMC45OTYKCQkJYy0wLjI4OSwwLjI2OS0wLjU5OSwwLjQ4NS0wLjk0OSwwLjY1Yy0wLjM1MiwwLjE2NS0wLjcxMywwLjI4NC0xLjEwNCwwLjM1MmMtMC4zODIsMC4wNzEtMC43NTQsMC4xMDQtMS4xMjUsMC4xMDQKCQkJYy0wLjQ1NCwwLTAuODc4LTAuMDU3LTEuMjYtMC4xN2MtMC4zODItMC4xMTQtMC43MDItMC4yODQtMC45NzktMC41MTJjLTAuMjc5LTAuMjIzLTAuNDg2LTAuNS0wLjY0Mi0wLjgzMgoJCQljLTAuMTU0LTAuMzI0LTAuMjM3LTAuNy0wLjIzNy0xLjEzNWMwLTAuMTA0LDAuMDEyLTAuMjEyLDAuMDIxLTAuMzJjMC4wMTEtMC4xMDcsMC4wMzEtMC4yMjEsMC4wNDItMC4zMzQKCQkJYzAuMDkzLTAuNTE4LDAuMjY4LTAuOTkxLDAuNTI2LTEuNDE2YzAuMjU4LTAuNDIyLDAuNTc3LTAuNzgzLDAuOTQ4LTEuMDc3YzAuMzgyLTAuMywwLjc5NS0wLjUyNywxLjI2MS0wLjY4NwoJCQljMC40NzUtMC4xNjYsMC45NTktMC4yNDQsMS40NjUtMC4yNDRjMC41MTgsMCwwLjk2MSwwLjA3MiwxLjM1NCwwLjIxN2MwLjM5MywwLjE0NiwwLjczMiwwLjM0NywwLjk5MSwwLjYwOQoJCQljMC4yNjksMC4yNTgsMC40NzUsMC41NzMsMC42MDgsMC45NDRjMC4xMzUsMC4zNzIsMC4yMDcsMC43ODUsMC4yMDcsMS4yMjljMCwwLjI3Mi0wLjAzMSwwLjU4OC0wLjA5NCwwLjkzNUgzOC41MTh6CgkJCSBNNDEuMDI1LDUuMzc2YzAuMDExLTAuMDQyLDAuMDExLTAuMTA0LDAuMDExLTAuMTg3YzAtMC4yNTgtMC4wODItMC40NzYtMC4yNjktMC42NTVjLTAuMTc2LTAuMTc3LTAuMzkzLTAuMjYzLTAuNjYtMC4yNjMKCQkJYy0wLjM4MywwLTAuNjkxLDAuMDk4LTAuOTMsMC4yOTNjLTAuMjI4LDAuMjAxLTAuMzgzLDAuNDcxLTAuNDQzLDAuODEySDQxLjAyNXoiLz4KCTwvZz4KCTxnPgoJCTxkZWZzPgoJCQk8cmVjdCBpZD0iU1ZHSURfMTFfIiB5PSIwLjUzOSIgd2lkdGg9Ijc0IiBoZWlnaHQ9IjEwLjkyMiIvPgoJCTwvZGVmcz4KCQk8Y2xpcFBhdGggaWQ9IlNWR0lEXzEyXyI+CgkJCTx1c2UgeGxpbms6aHJlZj0iI1NWR0lEXzExXyIgIG92ZXJmbG93PSJ2aXNpYmxlIi8+CgkJPC9jbGlwUGF0aD4KCQk8cGF0aCBjbGlwLXBhdGg9InVybCgjU1ZHSURfMTJfKSIgZmlsbD0iI0YzOEIwMCIgZD0iTTQ0LjI1OCwzLjA4OWgyLjMwM2wtMC4xNzcsMC45OTZjMC4zNjEtMC4zODcsMC43MjQtMC42ODEsMS4wODQtMC44NzcKCQkJYzAuMzcyLTAuMjAxLDAuNzk2LTAuMywxLjI4LTAuM2MwLjcxMywwLDEuMjI5LDAuMTY1LDEuNTY4LDAuNDk2YzAuMzMsMC4zMzUsMC40OTYsMC44MTQsMC40OTYsMS40NDkKCQkJYzAsMC4yNDgtMC4wMywwLjUxMi0wLjA3MSwwLjc4NUw1MC4wOCw5LjQ1MmgtMi41MjlsMC41OS0zLjM2NWMwLjAyMS0wLjE0NiwwLjAyOS0wLjI4NCwwLjAyOS0wLjQyMwoJCQljMC0wLjIxNy0wLjA0MS0wLjQwMy0wLjE0NS0wLjU0OGMtMC4xMDQtMC4xNDYtMC4yODktMC4yMTgtMC41NjctMC4yMThjLTAuMzgyLDAtMC42NzEsMC4xMTUtMC44NDcsMC4zNDgKCQkJYy0wLjE4NywwLjIzLTAuMzAxLDAuNTUyLTAuMzczLDAuOTY1bC0wLjU1NywzLjI0MWgtMi41Mkw0NC4yNTgsMy4wODl6Ii8+Cgk8L2c+Cgk8Zz4KCQk8ZGVmcz4KCQkJPHJlY3QgaWQ9IlNWR0lEXzEzXyIgeT0iMC41MzkiIHdpZHRoPSI3NCIgaGVpZ2h0PSIxMC45MjIiLz4KCQk8L2RlZnM+CgkJPGNsaXBQYXRoIGlkPSJTVkdJRF8xNF8iPgoJCQk8dXNlIHhsaW5rOmhyZWY9IiNTVkdJRF8xM18iICBvdmVyZmxvdz0idmlzaWJsZSIvPgoJCTwvY2xpcFBhdGg+CgkJPHBhdGggY2xpcC1wYXRoPSJ1cmwoI1NWR0lEXzE0XykiIGZpbGw9IiNGMzhCMDAiIGQ9Ik01NC43NTcsOS40MDdjLTAuMjg5LDAuMDE1LTAuNTQ3LDAuMDI0LTAuNzg0LDAuMDM2CgkJCWMtMC4yMzgsMC4wMS0wLjQ2NSwwLjAxLTAuNjYsMC4wMWMtMC4zODMsMC0wLjcwMy0wLjAxNi0wLjk2MS0wLjA1M2MtMC4yNTktMC4wMzUtMC40NjUtMC4xMDMtMC42MTktMC4xOTUKCQkJYy0wLjE1NC0wLjA5NC0wLjI2OS0wLjIxNy0wLjMzLTAuMzcxYy0wLjA2Mi0wLjE0OC0wLjA5NC0wLjM0Ni0wLjA5NC0wLjU4M2MwLTAuMTQ2LDAuMDEyLTAuMzA2LDAuMDIxLTAuNDkxCgkJCWMwLjAyMS0wLjE4MSwwLjA1Mi0wLjM4MiwwLjA5My0wLjU5OWwwLjQ2Ni0yLjY2M0g1MC45OWwwLjIzNi0xLjQ1NWgwLjkzOWwwLjM1Mi0xLjk4MmgyLjQ4OGwtMC4zNTIsMS45ODJoMS4yMTlsLTAuMjQ4LDEuNDU1CgkJCWgtMS4yMDhsLTAuNDAxLDIuMzE2Yy0wLjAyMSwwLjA3OC0wLjAzMSwwLjE0MS0wLjA0MywwLjIwMWMtMC4wMSwwLjA2Mi0wLjAxLDAuMTE5LTAuMDEsMC4xNjZjMCwwLjE1NCwwLjA1MywwLjI2NCwwLjE0NSwwLjMzCgkJCWMwLjEwNCwwLjA2MiwwLjI3OCwwLjA5OCwwLjU0NywwLjA5OGgwLjQwMkw1NC43NTcsOS40MDd6Ii8+Cgk8L2c+Cgk8Zz4KCQk8ZGVmcz4KCQkJPHJlY3QgaWQ9IlNWR0lEXzE1XyIgeT0iMC41MzkiIHdpZHRoPSI3NCIgaGVpZ2h0PSIxMC45MjIiLz4KCQk8L2RlZnM+CgkJPGNsaXBQYXRoIGlkPSJTVkdJRF8xNl8iPgoJCQk8dXNlIHhsaW5rOmhyZWY9IiNTVkdJRF8xNV8iICBvdmVyZmxvdz0idmlzaWJsZSIvPgoJCTwvY2xpcFBhdGg+CgkJPHBhdGggY2xpcC1wYXRoPSJ1cmwoI1NWR0lEXzE2XykiIGZpbGw9IiNGMzhCMDAiIGQ9Ik01Ni4zODksMy4wODloMi4zMDNMNTguNDYzLDQuMzhoMC4wMzFDNTksMy4zOTgsNTkuNzMyLDIuOTA4LDYwLjcwMywyLjkwOAoJCQljMC4wNTIsMCwwLjExMywwLjAwNSwwLjE2NSwwLjAxMWMwLjA1MiwwLjAxMSwwLjEwNCwwLjAyMSwwLjE2NSwwLjAyNGwtMC40NTQsMi41MjljLTAuMDgyLTAuMDIxLTAuMTY1LTAuMDM1LTAuMjQ4LTAuMDUyCgkJCWMtMC4wODItMC4wMTctMC4xNzUtMC4wMjQtMC4yNTgtMC4wMjRjLTAuNTE3LDAtMC45MjksMC4xNC0xLjIzOCwwLjQxMmMtMC4zLDAuMjc4LTAuNTE3LDAuNzYtMC42MywxLjQ0NGwtMC4zODIsMi4xOTloLTIuNTI5CgkJCUw1Ni4zODksMy4wODl6Ii8+Cgk8L2c+Cgk8Zz4KCQk8ZGVmcz4KCQkJPHJlY3QgaWQ9IlNWR0lEXzE3XyIgeT0iMC41MzkiIHdpZHRoPSI3NCIgaGVpZ2h0PSIxMC45MjIiLz4KCQk8L2RlZnM+CgkJPGNsaXBQYXRoIGlkPSJTVkdJRF8xOF8iPgoJCQk8dXNlIHhsaW5rOmhyZWY9IiNTVkdJRF8xN18iICBvdmVyZmxvdz0idmlzaWJsZSIvPgoJCTwvY2xpcFBhdGg+CgkJPHBhdGggY2xpcC1wYXRoPSJ1cmwoI1NWR0lEXzE4XykiIGZpbGw9IiNGMzhCMDAiIGQ9Ik02NC40MDksOS40NjlsLTAuMDExLTAuODc4Yy0wLjQxMiwwLjM0MS0wLjgyNSwwLjU2OC0xLjIxOSwwLjY4NwoJCQljLTAuNDAyLDAuMTE5LTAuODQ3LDAuMTc3LTEuMzIsMC4xNzdjLTAuMjcsMC0wLjUyNi0wLjAzMS0wLjc2NC0wLjA4OGMtMC4yNDgtMC4wNjItMC40NTUtMC4xNTQtMC42MzEtMC4yODkKCQkJYy0wLjE4Ni0wLjEyOS0wLjMyLTAuMjg5LTAuNDM0LTAuNDc5Yy0wLjEwNC0wLjE4Ny0wLjE1NS0wLjQxOC0wLjE1NS0wLjY4N2MwLTAuMTE0LDAuMDExLTAuMjM3LDAuMDQyLTAuMzc3CgkJCWMwLjA3Mi0wLjQ3NiwwLjI1OC0wLjg1MywwLjUyNS0xLjEyYzAuMjctMC4yNzMsMC41ODktMC40NzUsMC45NDktMC42MTRjMC4zNTMtMC4xNCwwLjczMy0wLjIzMSwxLjEzNy0wLjI4NAoJCQljMC40MDItMC4wNTcsMC43NzMtMC4xMDMsMS4xMTUtMC4xNDhjMC4zNTEtMC4wNDEsMC42NC0wLjEwNCwwLjg3Ny0wLjE4MmMwLjIzNy0wLjA3NiwwLjM3MS0wLjIxNywwLjQxMi0wLjQxOAoJCQljMC0wLjAxNiwwLTAuMDMxLDAtMC4wNDFjMC0wLjAxNiwwLjAxMi0wLjAyNSwwLjAxMi0wLjA0MWMwLTAuMDk5LTAuMDMxLTAuMTc2LTAuMDk0LTAuMjMxYy0wLjA1Mi0wLjA1OC0wLjEyMy0wLjEwNC0wLjE5NS0wLjEzCgkJCXMtMC4xNTUtMC4wNDctMC4yNDgtMC4wNjJjLTAuMDk0LTAuMDExLTAuMTY1LTAuMDE2LTAuMjE3LTAuMDE2Yy0wLjA5NCwwLTAuMTg3LDAuMDA1LTAuMjg5LDAuMDE2CgkJCWMtMC4xMDQsMC4wMTYtMC4xOTYsMC4wNDEtMC4yNzgsMC4wODhjLTAuMDkzLDAuMDQ3LTAuMTc2LDAuMTA4LTAuMjU5LDAuMTg3Yy0wLjA3MiwwLjA4My0wLjEyMywwLjE5LTAuMTY1LDAuMzNoLTIuNDI3CgkJCWMwLjA2Mi0wLjM0MSwwLjE3Ny0wLjY0NiwwLjM0Mi0wLjkwM2MwLjE3Ni0wLjI2MywwLjQxMi0wLjQ5LDAuNzIzLTAuNjcxczAuNjkxLTAuMzE5LDEuMTQ2LTAuNDE4CgkJCWMwLjQ1My0wLjA5OSwxLjAwMi0wLjE0NiwxLjYzMi0wLjE0NmMwLjU3NywwLDEuMDQyLDAuMDM3LDEuNDEzLDAuMTEzYzAuMzcxLDAuMDc4LDAuNjYsMC4xOTEsMC44NjcsMC4zMzYKCQkJYzAuMjE3LDAuMTQ2LDAuMzYxLDAuMzIsMC40NDMsMC41MjFjMC4wNzIsMC4yMDEsMC4xMTQsMC40MjksMC4xMTQsMC42ODJjMCwwLjE0OC0wLjAxMSwwLjMxMS0wLjAzMSwwLjQ3MQoJCQljLTAuMDIxLDAuMTY0LTAuMDQxLDAuMzM0LTAuMDcxLDAuNTFMNjYuODM0LDguMzRjLTAuMDIxLDAuMTM1LTAuMDI5LDAuMjQ4LTAuMDI5LDAuMzQyYzAsMC4wODgsMC4wMSwwLjE2NCwwLjA0MSwwLjIzMQoJCQljMC4wNDEsMC4wNzEsMC4wOTIsMC4xNDksMC4xODYsMC4yMzdsLTAuMDEsMC4zMmgtMi42MTJWOS40Njl6IE02My4yNDMsOC4wMmMwLjIxNywwLDAuNDExLTAuMDM3LDAuNTc3LTAuMTE5CgkJCWMwLjE2Ni0wLjA3NywwLjMxMS0wLjE5LDAuNDI0LTAuMzM2YzAuMTEzLTAuMTQsMC4xOTUtMC4zMDUsMC4yNTgtMC40OTZjMC4wNzItMC4xODksMC4xMTQtMC4zOTYsMC4xMzUtMC42MTMKCQkJYy0wLjIyOCwwLjEtMC40NTMsMC4xNzEtMC42ODIsMC4yMTJjLTAuMjI5LDAuMDQ3LTAuNDQzLDAuMDkzLTAuNjUsMC4xNDljLTAuMTk1LDAuMDUyLTAuMzYxLDAuMTIzLTAuNTA2LDAuMjIyCgkJCXMtMC4yMjksMC4yNDgtMC4yNTgsMC40NDh2MC4wNzJjMCwwLjE0MSwwLjA1MiwwLjI1NCwwLjE3NSwwLjMzNkM2Mi44Myw3Ljk3Nyw2My4wMDUsOC4wMiw2My4yNDMsOC4wMiIvPgoJPC9nPgoJPGc+CgkJPGRlZnM+CgkJCTxyZWN0IGlkPSJTVkdJRF8xOV8iIHk9IjAuNTM5IiB3aWR0aD0iNzQiIGhlaWdodD0iMTAuOTIyIi8+CgkJPC9kZWZzPgoJCTxjbGlwUGF0aCBpZD0iU1ZHSURfMjBfIj4KCQkJPHVzZSB4bGluazpocmVmPSIjU1ZHSURfMTlfIiAgb3ZlcmZsb3c9InZpc2libGUiLz4KCQk8L2NsaXBQYXRoPgoJCTxwb2x5Z29uIGNsaXAtcGF0aD0idXJsKCNTVkdJRF8yMF8pIiBmaWxsPSIjRjM4QjAwIiBwb2ludHM9IjY3LjQ1NSw5LjQ1MyA2OC45NzMsMC43MDkgNzEuNTAyLDAuNzA5IDY5Ljk4NCw5LjQ1MyAJCSIvPgoJPC9nPgoJPGc+CgkJPGRlZnM+CgkJCTxyZWN0IGlkPSJTVkdJRF8yMV8iIHk9IjAuNTM5IiB3aWR0aD0iNzQiIGhlaWdodD0iMTAuOTIyIi8+CgkJPC9kZWZzPgoJCTxjbGlwUGF0aCBpZD0iU1ZHSURfMjJfIj4KCQkJPHVzZSB4bGluazpocmVmPSIjU1ZHSURfMjFfIiAgb3ZlcmZsb3c9InZpc2libGUiLz4KCQk8L2NsaXBQYXRoPgoJCTxwb2x5Z29uIGNsaXAtcGF0aD0idXJsKCNTVkdJRF8yMl8pIiBmaWxsPSIjMDA2MDlDIiBwb2ludHM9IjguNzk2LDkuNDUzIDEwLjIxNSw0LjI4NiAxMi4wNDgsNC4yODYgMTEuMzA0LDkuNDUzIAkJIi8+Cgk8L2c+Cgk8Zz4KCQk8ZGVmcz4KCQkJPHJlY3QgaWQ9IlNWR0lEXzIzXyIgeT0iMC41MzkiIHdpZHRoPSI3NCIgaGVpZ2h0PSIxMC45MjIiLz4KCQk8L2RlZnM+CgkJPGNsaXBQYXRoIGlkPSJTVkdJRF8yNF8iPgoJCQk8dXNlIHhsaW5rOmhyZWY9IiNTVkdJRF8yM18iICBvdmVyZmxvdz0idmlzaWJsZSIvPgoJCTwvY2xpcFBhdGg+CgkJPHBhdGggY2xpcC1wYXRoPSJ1cmwoI1NWR0lEXzI0XykiIGZpbGw9IiNGMzhCMDAiIGQ9Ik0xMi45NjYsMS45ODR2LTAuMDFjLTAuMDEtMC4wMTEtMC4wMjEtMC4wMzEtMC4wNDEtMC4wNTIKCQkJYy0wLjAzMS0wLjA1Mi0wLjA5My0wLjExOC0wLjE4Ni0wLjIwMmMtMC4xNzUtMC4xNDgtMC40NTQtMC4zMy0wLjkyOS0wLjQxOGMtMC4yMjctMC4wNDEtMC40MjMtMC4wNDEtMC41ODgtMC4wMjUKCQkJYy0wLjQxMywwLjA0Ny0wLjY2MSwwLjIwNy0wLjc0OSwwLjI3OWMtMC4wMjUsMC4wMjEtMC4wMzEsMC4wMjUtMC4wMzEsMC4wMjVsMCwwYy0wLjExNCwwLjExMy0wLjMwNSwwLjExMy0wLjQyMywwCgkJCWMtMC4xMTMtMC4xMTktMC4xMTMtMC4zMDUsMC0wLjQyNGMwLjAzMS0wLjAzLDAuNDEzLTAuMzk3LDEuMTQxLTAuNDc1YzAuMjI4LTAuMDIxLDAuNDc1LTAuMDE3LDAuNzY0LDAuMDM1CgkJCWMxLjE1NiwwLjIwMSwxLjU1OSwwLjk0NCwxLjU4LDAuOTk2YzAuMDcyLDAuMTQ1LDAuMDEsMC4zMjUtMC4xMzQsMC40MDJjLTAuMDMxLDAuMDE2LTAuMDcyLDAuMDI1LTAuMTAzLDAuMDI1CgkJCUMxMy4xNDIsMi4xNiwxMy4wMjgsMi4wOTgsMTIuOTY2LDEuOTg0Ii8+Cgk8L2c+Cgk8Zz4KCQk8ZGVmcz4KCQkJPHJlY3QgaWQ9IlNWR0lEXzI1XyIgeT0iMC41MzkiIHdpZHRoPSI3NCIgaGVpZ2h0PSIxMC45MjIiLz4KCQk8L2RlZnM+CgkJPGNsaXBQYXRoIGlkPSJTVkdJRF8yNl8iPgoJCQk8dXNlIHhsaW5rOmhyZWY9IiNTVkdJRF8yNV8iICBvdmVyZmxvdz0idmlzaWJsZSIvPgoJCTwvY2xpcFBhdGg+CgkJPHBhdGggY2xpcC1wYXRoPSJ1cmwoI1NWR0lEXzI2XykiIGZpbGw9IiNGMzhCMDAiIGQ9Ik0xMi4yMjMsMi42NjZjMCwwLDAtMC4wMDYtMC4wMS0wLjAzMWMtMC4wMjEtMC4wMjEtMC4wNTItMC4wNjItMC4xMDMtMC4xMDQKCQkJYy0wLjA5My0wLjA4Mi0wLjI1OC0wLjE4Ni0wLjUxNy0wLjIzMmMtMC4xMzQtMC4wMjUtMC4yNDgtMC4wMjUtMC4zNC0wLjAxNWMtMC4yMTcsMC4wMjQtMC4zNjEsMC4xMTItMC40MDMsMC4xNDkKCQkJYy0wLjAxLDAuMDEtMC4wMSwwLjAxLTAuMDEsMC4wMWMtMC4wOTMsMC4wOTktMC4yNTgsMC4wOTktMC4zNTEsMGMtMC4wOTgtMC4wOTgtMC4wOTgtMC4yNTQsMC0wLjM1MgoJCQljMC4wMjEtMC4wMjUsMC4yNTgtMC4yNTgsMC43MjMtMC4zMDVjMC4xMzQtMC4wMTYsMC4yODktMC4wMSwwLjQ2NSwwLjAyMWMwLjcyMywwLjEyOSwwLjk4LDAuNTg4LDAuOTkxLDAuNjI5CgkJCWMwLjA2MiwwLjEyNSwwLjAyMSwwLjI3My0wLjEwMywwLjMzNmMtMC4wMzEsMC4wMTEtMC4wNjIsMC4wMjEtMC4wOTMsMC4wMjVDMTIuMzc4LDIuODExLDEyLjI3NSwyLjc1OSwxMi4yMjMsMi42NjYiLz4KCTwvZz4KCTxnPgoJCTxkZWZzPgoJCQk8cmVjdCBpZD0iU1ZHSURfMjdfIiB5PSIwLjUzOSIgd2lkdGg9Ijc0IiBoZWlnaHQ9IjEwLjkyMiIvPgoJCTwvZGVmcz4KCQk8Y2xpcFBhdGggaWQ9IlNWR0lEXzI4XyI+CgkJCTx1c2UgeGxpbms6aHJlZj0iI1NWR0lEXzI3XyIgIG92ZXJmbG93PSJ2aXNpYmxlIi8+CgkJPC9jbGlwUGF0aD4KCQk8cGF0aCBjbGlwLXBhdGg9InVybCgjU1ZHSURfMjhfKSIgZmlsbD0iI0YzOEIwMCIgZD0iTTEyLjAxNywzLjI3M2MwLDAuMzA2LTAuMjg5LDAuNTU0LTAuNjUsMC41NDkKCQkJYy0wLjM2MSwwLTAuNjUtMC4yNDgtMC42NC0wLjU1M2MwLTAuMzExLDAuMjg5LTAuNTU5LDAuNjQtMC41NTNDMTEuNzI4LDIuNzE4LDEyLjAxNywyLjk3MSwxMi4wMTcsMy4yNzMiLz4KCTwvZz4KCTxnPgoJCTxkZWZzPgoJCQk8cmVjdCBpZD0iU1ZHSURfMjlfIiB5PSIwLjUzOSIgd2lkdGg9Ijc0IiBoZWlnaHQ9IjEwLjkyMiIvPgoJCTwvZGVmcz4KCQk8Y2xpcFBhdGggaWQ9IlNWR0lEXzMwXyI+CgkJCTx1c2UgeGxpbms6aHJlZj0iI1NWR0lEXzI5XyIgIG92ZXJmbG93PSJ2aXNpYmxlIi8+CgkJPC9jbGlwUGF0aD4KCQk8cGF0aCBjbGlwLXBhdGg9InVybCgjU1ZHSURfMzBfKSIgZmlsbD0iI0YzOEIwMCIgZD0iTTcyLjQ0MSwxLjA3NmgwLjUyNWMwLjEyNCwwLDAuMjE3LDAuMDI1LDAuMjc4LDAuMDc2CgkJCWMwLjA2MiwwLjA1OCwwLjA5MywwLjEzLDAuMDkzLDAuMjIzYzAsMC4wNTItMC4wMSwwLjEtMC4wMjksMC4xMzVjLTAuMDEyLDAuMDM2LTAuMDMxLDAuMDYyLTAuMDUzLDAuMDgyCgkJCXMtMC4wNDEsMC4wMzYtMC4wNjIsMC4wNDdjLTAuMDIxLDAuMDEtMC4wMjksMC4wMTYtMC4wNDEsMC4wMjFsMCwwYzAuMDEyLDAuMDA1LDAuMDMxLDAuMDExLDAuMDUzLDAuMDE2CgkJCWMwLjAyMSwwLjAxLDAuMDQxLDAuMDIxLDAuMDUyLDAuMDQxYzAuMDIxLDAuMDE2LDAuMDMxLDAuMDQxLDAuMDQxLDAuMDY3YzAuMDExLDAuMDMsMC4wMjEsMC4wNjcsMC4wMjEsMC4xMTIKCQkJYzAsMC4wNjIsMCwwLjEyNSwwLjAxMiwwLjE3N2MwLjAxLDAuMDUyLDAuMDMxLDAuMDkzLDAuMDUyLDAuMTEyaC0wLjIwN2MtMC4wMjEtMC4wMjEtMC4wMy0wLjA0NS0wLjAzLTAuMDc2czAtMC4wNTgsMC0wLjA4NAoJCQljMC0wLjA1MS0wLjAxMS0wLjA5OC0wLjAxMS0wLjEzM2MtMC4wMTEtMC4wMzctMC4wMjEtMC4wNjctMC4wNDEtMC4wOTRjLTAuMDExLTAuMDIxLTAuMDMtMC4wNDItMC4wNjItMC4wNTIKCQkJYy0wLjAzLTAuMDExLTAuMDYyLTAuMDE3LTAuMTEzLTAuMDE3aC0wLjI3N3YwLjQ1NWgtMC4xOTdWMS4wNzZINzIuNDQxeiBNNzIuNjM5LDEuNTgyaDAuMzE4YzAuMDYyLDAsMC4xMDQtMC4wMTYsMC4xMzUtMC4wNDcKCQkJYzAuMDMtMC4wMjUsMC4wNTMtMC4wNzIsMC4wNTMtMC4xMjljMC0wLjAzNi0wLjAxMi0wLjA2Ny0wLjAyMS0wLjA4OGMtMC4wMS0wLjAyMS0wLjAyMS0wLjA0MS0wLjA0MS0wLjA1MwoJCQljLTAuMDIxLTAuMDE2LTAuMDMxLTAuMDIxLTAuMDYyLTAuMDI0Yy0wLjAyMS0wLjAwNS0wLjA0MS0wLjAwNS0wLjA3MS0wLjAwNWgtMC4zMVYxLjU4MnoiLz4KCTwvZz4KCTxnPgoJCTxkZWZzPgoJCQk8cmVjdCBpZD0iU1ZHSURfMzFfIiB5PSIwLjUzOSIgd2lkdGg9Ijc0IiBoZWlnaHQ9IjEwLjkyMiIvPgoJCTwvZGVmcz4KCQk8Y2xpcFBhdGggaWQ9IlNWR0lEXzMyXyI+CgkJCTx1c2UgeGxpbms6aHJlZj0iI1NWR0lEXzMxXyIgIG92ZXJmbG93PSJ2aXNpYmxlIi8+CgkJPC9jbGlwUGF0aD4KCQk8cGF0aCBjbGlwLXBhdGg9InVybCgjU1ZHSURfMzJfKSIgZmlsbD0iI0YzOEIwMCIgZD0iTTcyLjg1NCwyLjgzNmMtMC42MjksMC0xLjE0Ni0wLjUxNi0xLjE0Ni0xLjE1CgkJCWMwLTAuNjI5LDAuNTE3LTEuMTQ2LDEuMTQ2LTEuMTQ2Uzc0LDEuMDU3LDc0LDEuNjg2Qzc0LDIuMzIsNzMuNDgyLDIuODM2LDcyLjg1NCwyLjgzNiBNNzIuODU0LDAuNzQ1CgkJCWMtMC41MTcsMC0wLjkzOCwwLjQyNC0wLjkzOCwwLjkzOGMwLDAuNTIxLDAuNDIzLDAuOTQ1LDAuOTM4LDAuOTQ1YzAuNTE3LDAsMC45MzktMC40MjQsMC45MzktMC45NDUKCQkJQzczLjc5NCwxLjE2OSw3My4zNywwLjc0NSw3Mi44NTQsMC43NDUiLz4KCTwvZz4KPC9nPgo8L3N2Zz4K"

/***/ }),

/***/ 7:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _assign = __webpack_require__(124);

var _assign2 = _interopRequireDefault(_assign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _assign2.default || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

/***/ }),

/***/ 80:
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(287), __esModule: true };

/***/ }),

/***/ 9:
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),

/***/ 96:
/***/ (function(module, exports) {

module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};


/***/ }),

/***/ 97:
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};


/***/ }),

/***/ 98:
/***/ (function(module, exports) {

exports.f = {}.propertyIsEnumerable;


/***/ }),

/***/ 99:
/***/ (function(module, exports) {

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};


/***/ })

/******/ });