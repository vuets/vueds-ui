"use strict";
var util_1 = require('../util');
function bind(el, dir, vnode) { }
exports.bind = bind;
function update(el, dir, vnode) {
    var prefix = dir.arg || '', value = dir.value, oldValue = dir.oldValue;
    if (oldValue) {
        util_1.removeClass(el, prefix + oldValue);
    }
    if (value) {
        util_1.addClass(el, prefix + value);
    }
}
exports.update = update;
function unbind(el, dir, vnode) { }
exports.unbind = unbind;
//# sourceMappingURL=pclass.js.map