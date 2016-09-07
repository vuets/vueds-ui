export declare const anchor: string;
export declare function when(cond: any, val?: string): string;
export declare function when_fn<A, B, T, R>(fn: (a: A, b: B) => R, a: A, b: B, out_fn: (t: T, r: R) => string, t: T): string;
export declare function include_if<T>(cond: any, fn: (it: T) => string, it: T): string;
export declare function or<T>(cond: string | null | undefined, fn: (it: T) => string, it: T): string;
export declare function tern<T>(cond: any, fnTrue: (it: T) => string, fnFalse: (it: T) => string, it: T): string;
export declare function tern_yes_no(cond: any): string;
export declare function attrs(obj: any): string;
export declare function append(val: any, prefix?: string): string;
export declare function prepend(val: any, suffix?: string): string;
export declare function exprs(obj: any): string;
/**
 * Quotes the string arg unless it is an object/array literal
 */
export declare function quote(target: string | null | undefined): string;
