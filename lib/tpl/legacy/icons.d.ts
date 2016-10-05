export interface ToggleOpts {
    pojo: string;
    field: string;
    fn: string;
    bit?: number;
    icon_class?: string;
    title_expr?: string;
}
export declare function toggle(it: ToggleOpts): string;
