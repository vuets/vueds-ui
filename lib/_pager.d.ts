import { Pager } from 'vueds/lib/store/';
export interface Opts {
    flags: number;
    col_size: number;
    table_flags: number;
    pager: Pager;
    hammer: any;
    vm: any;
    el: any;
    focus: any;
}
/**
 * Add the property 'pager_opts' to el.
 */
export declare function attachOptsTo(el: any, args: string[] | undefined, pager: Pager, vm: any): void;
export declare function cleanup(opts: Opts): void;
