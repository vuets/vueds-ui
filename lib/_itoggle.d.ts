export declare const enum Flags {
    CHECK_INITIIAL = 16,
}
export interface Opts {
    class_def: string;
    class_alt: string;
    type: string;
    flags: number;
    check_initial: boolean;
    array: any[];
    vm: any;
    el: any;
    handler: any;
    index: number;
    prevIndex: number | null;
    el_icon: any;
}
export declare function parseOpts(args: string[], array: any[], vm: any, el: any): Opts;
export declare function cleanup(opts: Opts): void;
