export interface Opts {
    qd: any;
    pager?: string;
}
export declare function field_enum(fd: any, pojo: string, display: string): string;
export declare function field_bool(fd: any, pojo: string, display: string): string;
export declare function field_suggest(fd: any, pojo: string, display: string): string;
export declare function field_num(fd: any, pojo: string, display: string): string;
export declare function field_num_range(fd: any, pojo: string, display: string): string;
export declare function field_default(fd: any, pojo: string, display: string, changeSuffix: string): string;
export declare function filter_fields(it: Opts, jso: any, fields: number[], pojo: string, nf: string): string;
export declare function items(it: Opts, values: any[]): string;
export declare function main(it: Opts): string;
