export declare const enum Flags {
    UPDATE = 16,
}
export interface Opts {
    flags: number;
    pojo: any;
    field: string;
    fetch: any;
    cbfn: any;
    fk: string;
    vm: any;
    el: any;
    pojo_: any;
    col_size: number;
    table_flags: number;
    update: boolean;
    str: string;
    str_fetch: string;
    disabled: boolean;
    cache: any;
    pending_name: any;
    pending_value: any;
    unwatch: any;
    onSelect: any;
    cbFetchSuccess: any;
    cbFetchFailed: any;
    focusNT: any;
    focusout: any;
    click: any;
    input: any;
    keydown: any;
}
export declare function parseOpts(args: string[] | any, pojo: any, field: string, fetch: any, cbfn: any, vm: any, el: any): Opts;
export declare function cleanup(opts: Opts): void;
