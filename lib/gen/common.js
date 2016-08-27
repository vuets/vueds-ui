export var c = {
    PREVENT_NONE: 0,
    PREVENT_DEFAULT: 1,
    PREVENT_PROPAGATION: 2,
    PREVENT_BOTH: 3,
    // states
    STATE_NONE: 0,
    STATE_SUCCESS: 1,
    STATE_ERROR: 2,
    STATE_WARNING: 4,
    STATE_LOADING: 8,
    MASK_STATUS: 7,
    // current pojo state
    STATE_UPDATE: 16,
    LSTATE_NONE: 0,
    LSTATE_INCLUDED: 1,
    LSTATE_SELECTED: 2,
    LSTATE_REFRESH: 4,
    MASK_SELECTED_REFRESH: 6,
    // pager state
    STATE_DESC: 16,
    STATE_LOAD_NEWER: 32,
    STATE_LOAD_OLDER: 64,
    STATE_RELOAD: 128,
    MASK_RPC: 224,
    STATE_LOCAL_SEARCH: 256,
    MASK_RPC_DISABLE: 264,
    HANDLE_ACTIVATE: 1,
    HANDLE_PASSIVATE: 2,
    HANDLE_NEW: 3,
    HANDLE_UPDATE: 4,
    HANDLE_DELETE: 5,
    HANDLE_ENTRY_INPUT: 6,
    HANDLE_ENTRY_DELETE: 7,
    HANDLE_ENTRY_SORT: 8,
    HANDLE_ENTRY_SEARCH: 9,
    SELECT_CLICKED: 1,
    SELECT_REFRESH: 2,
    SELECT_CLICKED_UPDATE: 4,
    SELECT_FORCE: 8
};
export var default_obj = {};
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
export function expr(value, pojo) {
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
export function exprs(array, pojo, delim, prepend) {
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
export function kv_exprs(attrs, pojo, delim, prepend, exprDelim) {
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
//# sourceMappingURL=common.js.map