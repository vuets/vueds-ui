"use strict";
var util_1 = require('../util');
function bind() { }
exports.bind = bind;
function update(value, oldValue) {
    if (oldValue) {
        util_1.removeClass(this.el, this.arg + oldValue);
    }
    if (value) {
        util_1.addClass(this.el, this.arg + value);
        oldValue = value;
    }
}
exports.update = update;
function unbind() { }
exports.unbind = unbind;
//# sourceMappingURL=pclass.js.map