/**
 * Created by han on 2017/2/22.
 */

var bindElementEvent = require('../../src/bindElementEvent').bindElementEvent;

$(function () {
    bindElementEvent($('.aa'), {
        showMe: function(event, param1, param2) {
            alert('param is ' + param1 + ' ' + param2);
        }
    });
});
