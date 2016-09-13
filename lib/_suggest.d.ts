export interface Opts {
    flags: number;
    pojo: any;
    field: string;
    fetch: any;
    fk: string;
    vm: any;
    el: any;
    str: string;
    empty: boolean;
    disabled: boolean;
    cache: any;
    unwatch: any;
    onSelect: any;
    focusin: any;
    focusout: any;
    click: any;
    input: any;
}
export declare function parseOpts(args: string[] | any, pojo: any, field: any, fetch: any, vm: any, el: any): Opts;
export declare function cleanup(opts: Opts): void;
