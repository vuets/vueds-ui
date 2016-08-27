export var anchor = '<content></content>';
var yes_no = "'yes' : 'no'", no_yes = "'no' : 'yes'";
export function when(cond, val) {
    return cond && val ? val : '';
}
export function include_if(cond, fn, it) {
    return cond ? fn(it) : '';
}
export function tern_yes_no(cond) {
    return cond ? yes_no : no_yes;
}
//# sourceMappingURL=common.js.map