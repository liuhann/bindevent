var isFunction = require('lodash.isfunction');
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
