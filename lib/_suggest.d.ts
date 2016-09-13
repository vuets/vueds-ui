export declare const enum Flags {
    UPDATE = 16,
}
export interface Opts {
    flags: number;
    pojo: any;
    field: string;
    fetch: any;
    fk: string;
    vm: any;
    el: any;
    col_size: number;
    table_flags: number;
    update: boolean;
    str: string;
    empty: boolean;
    disabled: boolean;
    cache: any;
    pending_name: any;
    pending_value: any;
    unwatch: any;
    onSelect: any;
    focusNT: any;
    hideSuggestNT: any;
    focusout: any;
    click: any;
    input: any;
    keyup: any;
}
export declare function parseOpts(args: string[] | any, pojo: any, field: any, fetch: any, vm: any, el: any): Opts;
export declare function cleanup(opts: Opts): void;
