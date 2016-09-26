export interface Opts {
    type: string;
    flags: number;
    target: any;
    array: any;
    vm: any;
    el: any;
    handler: any;
    index: number;
    prevIndex: number | null;
}
export declare function parseOpts(args: string[] | any, target: any, vm: any, el: any): Opts;
export declare function cleanup(opts: Opts): void;
