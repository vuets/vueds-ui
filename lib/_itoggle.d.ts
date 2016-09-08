export interface Opts {
    type: string;
    check_initial?: boolean;
    class_def: string;
    class_alt: string;
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
