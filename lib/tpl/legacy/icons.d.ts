export interface CommonOpts {
    pojo: string;
}
export interface TimeagoOpts extends CommonOpts {
    icon_class?: string;
}
export declare function timeago(it: TimeagoOpts): string;
export interface ToggleOpts extends CommonOpts {
    field: string;
    fn: string;
    bit: number;
    icon_class?: string;
    title_expr?: string;
}
export declare function toggle(it: ToggleOpts): string;
export interface DrawerOpts extends CommonOpts {
    bit: number;
    form?: string;
    fn?: string;
    tabindex?: number;
}
export declare function drawer(it: DrawerOpts, content?: string): string;
