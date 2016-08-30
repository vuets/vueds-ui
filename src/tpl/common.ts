export const anchor = '<content></content>'

const yes_no = "'yes' : 'no'",
    no_yes = "'no' : 'yes'"

export function when(cond: any, val?: string): string {
    return cond && val ? val : ''
}

export function include_if<T>(cond: any, fn: (it: T) => string, it: T): string {
    return cond ? fn(it) : ''
}

export function or<T>(cond: string | null | undefined, fn: (it: T) => string, it: T): string {
    return cond || fn(it)
}

export function tern<T>(cond: any, fnTrue: (it: T) => string, fnFalse: (it: T) => string, it: T): string {
    return cond ? fnTrue(it) : fnFalse(it)
}

export function tern_yes_no(cond: any): string {
    return cond ? yes_no : no_yes
}

export function attrs(obj: any): string {
    if (!obj) return ''

    var buf = ''
    for (var i in obj) {
        buf += ' ' + i + '="' + obj[i] + '"'
    }
    return buf
}

export function append(val: any, prefix?: string): string {
    return !val ? '' : (prefix || ' ') + val
}

export function prepend(val: any, suffix?: string): string {
    return !val ? '' : val + (suffix || ' ')
}

export function exprs(obj: any): string {
    if (!obj) return ''

    var buf = ''
    for (var i in obj) {
        buf += ', ' + i + ': ' + obj[i]
    }
    return buf
}