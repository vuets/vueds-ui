export interface Opts {
    clazz: string;
    query: string;
    flags: number;
    el: any;
    match: any;
    unmatch: any;
}
export declare const enum Flags {
    UNMATCH = 16,
}
export declare function parseOpts(args: string[], el: any): Opts;
export declare function cleanup(opts: Opts): void;
