declare function require(path: string) : any;

import * as Vue from 'vue'
import { Trie } from './trie'

export const vueVersion = Vue['default']['version'],
    vue2 = vueVersion.charAt(0) === '2'

export function extractFlagsLen(str: string): number {
    var len = 0,
        i = str.length - 1,
        c = str.charCodeAt(i)
    
    while (c >= 48 && c <= 57) {
        c = str.charCodeAt(--i)
        len++
    }
    
    return len
}
export function newChangeHandler(self): (e) => any {
    return function(e): any {
        var code = e.which || e.keyCode
        if (13 === code) {
            e.preventDefault()
            self.el.blur()
            self.el.focus()
        }
    }
}
export function prevent(e: Event, flags: number): boolean {
    switch (flags & 3) {
        case 1: e.preventDefault(); return false
        case 2: e.stopPropagation(); return true
        case 3: e.preventDefault(); e.stopPropagation(); return false
        default: return true
    }
}
export function isFlagSet(param, flag: number): boolean {
    return param && 0 !== (param.flags & flag)
}
/**
 * Returns the param
 */
export function putArgsTo(param, array: string[], i: number, flags: number): any {
    var l = array.length,
        k, v
    
    param.flags = flags || 3
    
    while (i < l) {
        k = array[i++]
        v = array[i++]
        param[k] = k.charAt(0) === '$' || isNaN(v) ? v : parseInt(v, 10)
    }
    
    return param
}

export function newTrie(stem, sorting): Trie {
    return new Trie(stem, sorting)
}

