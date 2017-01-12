import { Pager } from 'vueds/lib/types';
export declare const enum Flags {
    UPDATE = 16,
    PAGE_AND_SELECT = 32,
    NO_RELOAD = 64,
    NO_RPC = 128,
    DTAP_ANY = 256,
    SUGGEST = 512,
    NO_SWIPE = 1024,
}
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
export declare function attachOptsTo(el: any, args: string[] | any, pager: Pager, vm: any): void;
export declare function cleanup(opts: Opts): void;
