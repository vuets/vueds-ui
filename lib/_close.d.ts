export declare const enum Flags {
    SELECT_FROM_PARENT = 8,
}
export interface Opts {
    type: string;
    flags: number;
    target: any;
    el: any;
    handler: any;
    array: any[] | null;
}
export declare function parseOpts(args: string[] | any, target: any, el: any): Opts;
export declare function cleanup(opts: Opts): void;
