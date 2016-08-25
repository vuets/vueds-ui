"use strict";
exports.anchor = '<content></content>';
var yes_no = "'yes' : 'no'", no_yes = "'no' : 'yes'";
function when(cond, val) {
    return cond && val ? val : '';
}
exports.when = when;
function include_if(cond, fn, it) {
    return cond ? fn(it) : '';
}
exports.include_if = include_if;
function tern_yes_no(cond) {
    return cond ? yes_no : no_yes;
}
exports.tern_yes_no = tern_yes_no;
//# sourceMappingURL=common.js.map