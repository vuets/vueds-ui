"use strict";
exports.default_obj = {};
var operator_map = {
    '===': true,
    '!==': true,
    '==': true,
    '!=': true,
    '<': true,
    '<=': true,
    '>': true,
    '>=': true
};
var regexBacktick = /`/g;
/*export function replaceBacktick(str: string) {
    return str.indexOf('`') === -1 ? str : str.replace(regexBacktick, "'")
}*/
/**
 * The arg: value can be number or string.
 */
function expr(value, pojo) {
    if (typeof value !== 'number')
        return value; //replaceBacktick(value)
    var buf = "";
    if (value < 0) {
        buf += "!";
        value = -value;
    }
    buf += pojo + "['" + value + "']";
    return buf;
}
exports.expr = expr;
function exprs(array, pojo, delim, prepend) {
    if (prepend === void 0) { prepend = false; }
    if (!Array.isArray(array))
        return prepend ? delim + expr(array, pojo) : expr(array, pojo);
    var buf = '', i = 0, l = array.length, op;
    for (;;) {
        if (prepend)
            buf += delim;
        else
            prepend = true;
        buf += expr(array[i++], pojo);
        if (i === l)
            break;
        op = array[i];
        if (!operator_map[op])
            continue;
        buf += ' ' + op + ' ' + expr(array[++i], pojo);
        if (++i === l)
            break;
    }
    return buf;
}
exports.exprs = exprs;
function kv_exprs(attrs, pojo, delim, prepend, exprDelim) {
    var buf = '';
    for (var k in attrs) {
        if (prepend)
            buf += delim;
        else
            prepend = true;
        buf += k + ':' + exprs(attrs[k], pojo, exprDelim);
    }
    return buf;
}
exports.kv_exprs = kv_exprs;
//# sourceMappingURL=common.js.map