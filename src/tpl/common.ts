export const anchor = '<content></content>'

const yes_no = "'yes' : 'no'",
    no_yes = "'no' : 'yes'"

export function when(cond: any, val?: string): string {
    return cond && val ? val : ''
}

export function include_if<T>(cond: any, fn: (it: T) => string, it: T): string {
    return cond ? fn(it) : ''
}

export function tern_yes_no(cond: any): string {
    return cond ? yes_no : no_yes
}