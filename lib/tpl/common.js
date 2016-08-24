"use strict";
exports.anchor = '<content></content>';
function when(cond, val) {
    return cond && val ? val : '';
}
exports.when = when;
function include_if(cond, fn, it) {
    return cond ? fn(it) : '';
}
exports.include_if = include_if;
//# sourceMappingURL=common.js.map