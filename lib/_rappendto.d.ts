export interface Opts {
    target: any;
    query: string;
    flags: number;
    vm: any;
    el: any;
    orig_parent: any;
    target_parent: any;
    match: any;
    unmatch: any;
}
export declare const enum Flags {
    UNMATCH = 16,
}
export declare function parseOpts(args: string[], vm: any, el: any): Opts;
export declare function cleanup(opts: Opts): void;
