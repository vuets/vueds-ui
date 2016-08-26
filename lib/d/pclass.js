"use strict";
var util_1 = require('../util');
function bind() {
    this.prefix = this.arg || '';
}
exports.bind = bind;
function update(value, oldValue) {
    if (oldValue) {
        util_1.removeClass(this.el, this.prefix + oldValue);
    }
    if (value) {
        util_1.addClass(this.el, this.prefix + value);
    }
}
exports.update = update;
function unbind() { }
exports.unbind = unbind;
//# sourceMappingURL=pclass.js.map