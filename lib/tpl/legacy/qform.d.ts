export interface Opts {
    qd: any;
    pager?: string;
}
export declare function field_enum(it: Opts, fd: any, pojo: string, display: string): string;
export declare function field_bool(it: Opts, fd: any, pojo: string, display: string): string;
export declare function field_suggest(it: Opts, fd: any, pojo: string, display: string): string;
export declare function field_num(it: Opts, fd: any, pojo: string, display: string): string;
export declare function field_default(it: Opts, fd: any, pojo: string, display: string, changeSuffix: string): string;
export declare function filter_fields(it: Opts, jso: any, fields: number[], pojo: string, nf: string): string;
export declare function items(it: Opts, values: any[]): string;
export declare function main(it: Opts): string;
