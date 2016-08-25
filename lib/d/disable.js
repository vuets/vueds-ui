"use strict";
var util_1 = require('../util');
function bind() {
    if (!this.arg)
        this.target = this.el;
}
exports.bind = bind;
function update(value, oldValue) {
    var disabled = !!value, el = this.target;
    if (!el)
        this.target = el = util_1.resolveElement(this.el, this.arg, this.vm);
    el.disabled = disabled;
    if (disabled)
        util_1.addClass(el, 'disabled');
    else
        util_1.removeClass(el, 'disabled');
}
exports.update = update;
function unbind() { }
exports.unbind = unbind;
//# sourceMappingURL=disable.js.map