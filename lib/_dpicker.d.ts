export declare const enum Flags {
    UPDATE = 16,
    TRIGGER_CHANGE_ON_SELECT = 32,
}
export interface Opts {
    flags: number;
    update: boolean;
    pojo: any;
    field: string;
    el: any;
    col_size: number;
    table_flags: number;
    pending: boolean;
    focusNT: any;
    changeNT: any;
    onSelect: any;
    focusout: any;
    click: any;
    keydown: any;
}
export declare function parseOpts(args: string[] | any, pojo: any, field: any, el: any): Opts;
export declare function cleanup(opts: Opts): void;
