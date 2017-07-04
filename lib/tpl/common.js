//export const anchor = '<content></content>'
var yes_no = "'yes' : 'no'", no_yes = "'no' : 'yes'";
export function when(cond, val) {
    return cond && val ? val : '';
}
// R is for result
export function when_fn(fn, a, b, out_fn, t) {
    var r = fn(a, b);
    return r ? out_fn(t, r) : '';
}
export function include_if(cond, fn, it) {
    return cond ? fn(it) : '';
}
export function or(cond, fn, it) {
    return cond || fn(it);
}
export function tern(cond, fnTrue, fnFalse, it) {
    return cond ? fnTrue(it) : fnFalse(it);
}
export function tern_yes_no(cond) {
    return cond ? yes_no : no_yes;
}
export function attr(obj, k, kattr) {
    var v = obj[k], buf = '';
    if (v)
        buf += ' ' + (kattr || k) + '="' + v + '"';
    return buf;
}
export function attrs(obj) {
    if (!obj)
        return '';
    var buf = '';
    for (var _i = 0, _a = Object.keys(obj); _i < _a.length; _i++) {
        var i = _a[_i];
        buf += ' ' + i + '="' + obj[i] + '"';
    }
    return buf;
}
export function append(val, prefix) {
    return !val ? '' : (prefix || ' ') + val;
}
export function append_kv(k, v, prefix) {
    return !v ? '' : (prefix || ' ') + k + '="' + v + '"';
}
export function prepend(val, suffix) {
    return !val ? '' : val + (suffix || ' ');
}
export function exprs(obj) {
    if (!obj)
        return '';
    var buf = '';
    for (var _i = 0, _a = Object.keys(obj); _i < _a.length; _i++) {
        var i = _a[_i];
        buf += ', ' + i + ': ' + obj[i];
    }
    return buf;
}
/**
 * Quotes the string arg unless it is an object/array literal
 */
export function quote(target) {
    if (!target)
        return '';
    switch (target.charAt(0)) {
        case '{': return target;
        case '[': return target;
        default: return "'" + target + "'";
    }
}
//# sourceMappingURL=common.js.map