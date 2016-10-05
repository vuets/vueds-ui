export interface CommonOpts {
    pojo: string;
}
export declare function timeago(it: CommonOpts): string;
export interface ToggleOpts extends CommonOpts {
    field: string;
    fn: string;
    bit?: number;
    icon_class?: string;
    title_expr?: string;
}
export declare function toggle(it: ToggleOpts): string;
