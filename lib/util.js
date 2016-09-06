import * as Vue from 'vue';
import { Trie } from './trie';
export var vueVersion = Vue['default']['version'], vue2 = vueVersion.charAt(0) === '2';
export function extractFlagsLen(str) {
    var len = 0, i = str.length - 1, c = str.charCodeAt(i);
    while (c >= 48 && c <= 57) {
        c = str.charCodeAt(--i);
        len++;
    }
    return len;
}
export function newChangeHandler(self) {
    return function (e) {
        var code = e.which || e.keyCode;
        if (13 === code) {
            e.preventDefault();
            self.el.blur();
            self.el.focus();
        }
    };
}
export function prevent(e, flags) {
    switch (flags & 3 /* PREVENT_BOTH */) {
        case 1 /* PREVENT_DEFAULT */:
            e.preventDefault();
            return false;
        case 2 /* PREVENT_PROPAGATION */:
            e.stopPropagation();
            return true;
        case 3 /* PREVENT_BOTH */:
            e.preventDefault();
            e.stopPropagation();
            return false;
        default: return true;
    }
}
export function isFlagSet(param, flag) {
    return param && 0 !== (param.flags & flag);
}
/**
 * Returns the param
 */
export function putArgsTo(param, array, i, flags) {
    var l = array.length, k, v;
    param.flags = flags || 3;
    while (i < l) {
        k = array[i++];
        v = array[i++];
        param[k] = k.charAt(0) === '$' || isNaN(v) ? v : parseInt(v, 10);
    }
    return param;
}
export function newTrie(stem, sorting) {
    return new Trie(stem, sorting);
}
//# sourceMappingURL=util.js.map