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
export declare function bind(): void;
export declare function update(value: any, oldValue: any): void;
export declare function unbind(): void;
