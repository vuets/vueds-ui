export const default_obj = {}

const operator_map = {
    '===': true,
    '!==': true,
    '==': true,
    '!=': true,
    '<': true,
    '<=': true,
    '>': true,
    '>=': true
}

const regexBacktick = /`/g

/*export function replaceBacktick(str: string) {
    return str.indexOf('`') === -1 ? str : str.replace(regexBacktick, "'")
}*/

/**
 * The arg: value can be number or string.
 */
export function expr(value: any, pojo: any) {
    if (typeof value !== 'number') return value//replaceBacktick(value)
    
    var buf = ""
    if (value < 0) {
        buf += "!"
        value = -value
    }
    
    buf += pojo + "['" + value + "']"
    
    return buf
}

export function exprs(array: any[], pojo: any, delim: string, prepend: boolean = false) {
    if (!Array.isArray(array)) return prepend ? delim + expr(array, pojo) : expr(array, pojo)
    
    var buf = '',
        i = 0,
        l = array.length,
        op
    for (;;) {
        if (prepend) buf += delim
        else prepend = true
        
        buf += expr(array[i++], pojo)
        if (i === l) break
        
        op = array[i]
        if (!operator_map[op]) continue
        
        buf += ' ' + op + ' ' + expr(array[++i], pojo)
        if (++i === l) break
    }
    
    return buf
}

export function kv_exprs(attrs: any, pojo: any, delim: string, prepend: boolean, exprDelim: string) {
    var buf = ''
    
    for (var k in attrs) {
        if (prepend) buf += delim
        else prepend = true
        
        buf += k + ':' + exprs(attrs[k], pojo, exprDelim)
    }
    
    return buf
}