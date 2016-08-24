export const anchor = '<content></content>'

export function when(cond: any, val?: string): string {
    return cond && val ? val : ''
}

export function include_if<T>(cond: any, fn: (it: T) => string, it: T): string {
    return cond ? fn(it) : ''
}