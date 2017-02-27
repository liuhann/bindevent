/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

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

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

var isFunction = __webpack_require__(1);
/**
 *
 * 为指定页面元素根据属性定义绑定到object的事件。目前支持的事件如下:
 * 1 xbn-on-click 按钮点击
 * 2 xbn-on-blur  输入框中去除焦点
 * 3 xbn-on-enter 输入框中按回车后触发
 * 3 xbn-on-change (定义在select上的事件)
 * @method bindElementEvent
 * @memberOf MainUtils
 * @param {DOM} elem 需要绑定的页面层
 * @param {Object} object 绑定的服务对象
 * @example
 *
 *     <!--HTML-->
 *     <div class="aa">
 *         <a xbn-on-click="showMe(1,2)">SHOW</a>
 *     </div>
 *
 *     bindElementEvent($('.aa'), {
 *          showMe: function(event, param1, param2) {
 *              //param1 === 1;
 *              //param2 === 2;
 *          }
 *      });
 *
 */
function bindElementEvent(elem, object) {
    var eventsToBind = ['click','blur','enter','change'];
    var PREFIX = 'xbn-on-';
    for(var i=0; i<eventsToBind.length; i++) {
        var event = eventsToBind[i];
        $(elem).find('[' + PREFIX + event + ']').each(function() {
            var clickedElem = $(this);
            var calls = extractFunctionNameParams($(this).attr(PREFIX + event));
            var func = object[calls.method];
            if (isFunction(func)) {
                if (event ==='enter') { //处理输入框回车事件
                    $(clickedElem).keyup(function(event){
                        if(event.keyCode == 13) {
                            func.apply(object, [event].concat(calls.params));
                        }
                    });
                } else {
                    clickedElem.off(event).on(event, function(se) {
                        if (!$(this).hasClass('disabled')) {
                            var params = [se];
                            //event可能由代码触发，并携带参数。 这种情况下,第一个参数是event忽略。 其他参数都加入到params之中
                            if (arguments.length>1) {
                                for(var i=1; i<arguments.length; i++) {
                                    params.push(arguments[i]);
                                }
                            }
                            params = params.concat(calls.params);
                            func.apply(object, params);
                        }
                    });
                }
            }
        });
    }
}

/**
 * 将一个方法的调用从字符串格式解析为函数名+参数数组的形式
 * @method  extractFunctionNameParams
 * @memberOf MainUtils
 * @param {string} invokeStr 方法调用字符串
 * @return {object}
 * @example
 *
 *      extractFunctionNameParams('hello()');
 *      //返回 {
 *           method: 'hello',
 *           params: []
 *       }
 *       extractFunctionNameParams('hello("daddy", 22)');
 *      //返回 {
 *           method: 'hello',
 *           params: ["daddy", 22]
 *       }
 *        extractFunctionNameParams('hello([11,22], [22,33]);
 *      //返回 {
 *           method: 'hello',
 *           params: [[11,22], [22,33]]
 *       }
 *
 */
function extractFunctionNameParams(invokeStr) {
    var matchParams = invokeStr.match(/\(.*\)/g);
    //验证参数中含有  () 例如 data-baseFnRegexp=floatFn([2,4],[1,3])" 这种情况

    if (matchParams && matchParams.length===1) {
        return {
            method: invokeStr.substring(0, invokeStr.indexOf('(')),
            params: JSON.parse('[' + matchParams[0].slice(1,matchParams[0].length-1).replace(/\'([^\']+|\')\'/g,'"$1"') + ']')
        }
    } else {
        return {
            method: invokeStr,
            params: []
        }
    }
}

module.exports = {
    bindElementEvent: bindElementEvent,
    extractFunctionNameParams: extractFunctionNameParams
};


/***/ }),
/* 1 */
/***/ (function(module, exports) {

/**
 * lodash 3.0.8 (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright 2012-2016 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2016 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/** `Object#toString` result references. */
var funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 8 which returns 'object' for typed array constructors, and
  // PhantomJS 1.9 which returns 'function' for `NodeList` instances.
  var tag = isObject(value) ? objectToString.call(value) : '';
  return tag == funcTag || tag == genTag;
}

/**
 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

module.exports = isFunction;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Created by han on 2017/2/22.
 */

var bindElementEvent = __webpack_require__(0).bindElementEvent;

$(function () {
    bindElementEvent($('.aa'), {
        showMe: function(event, param1, param2) {
            alert('param is ' + param1 + ' ' + param2);
        }
    });
});


/***/ })
/******/ ]);