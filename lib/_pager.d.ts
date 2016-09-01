import { Pager } from 'vueds/lib/store/';
export interface Opts {
    flags: number;
    col_size: number;
    table_flags: number;
    loop_var: string;
    hammer: any;
    pager: Pager;
    vm: any;
}
export declare function moveUp(e: any): void;
export declare function moveDown(e: any): void;
export declare function focus(e: any, opts: Opts): void;
export declare function swipe(e: any, opts: Opts): void;
export declare function select(e: any, opts: Opts, dbltap: boolean, flagsIntersect: number): void;
export declare function press(e: any, opts: Opts): void;
export declare function tap(e: any, opts: Opts): void;
export declare function doubletap(e: any, opts: Opts): boolean | undefined;
/**
 * ```{loop_var}__{flags}__{table_flags?}```
 */
export declare function putArgsTo(opts: Opts, split_args: string[]): void;
export declare function addCustomListenersTo(el: any, opts: Opts): void;
export declare function configureHammer(hammer: any, opts: Opts): void;
