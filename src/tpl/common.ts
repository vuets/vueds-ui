export const anchor = '<content></content>'

export function when(cond: any, val: string): string {
    return cond ? val : ''
}