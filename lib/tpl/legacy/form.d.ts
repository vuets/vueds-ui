export declare const enum ContentSlot {
    TOP = 0,
    BEFORE_BUTTON = 1,
}
export interface Opts {
    $d: any;
    pojo: string;
    on_submit: string;
    update?: boolean;
    pager?: string;
    btn_text?: string;
    exclude_fn?: (field: number, descriptor) => boolean;
    show_fn?: (field: number, descriptor) => string;
    content_slot?: ContentSlot;
    tag?: string;
    title?: string;
    toggle_el?: string;
    hr_before?: boolean;
    close_el?: string;
    hr_after?: boolean;
    btn_class?: string;
    disable_expr?: string;
    without_fields?: boolean;
    without_msg?: boolean;
    without_vclass?: boolean;
    _content?: string;
    _ffid?: string;
}
export declare function fields(it: Opts, content?: string): string;
export declare function msg(it: Opts): string;
export declare function toggle_el(it: Opts): string;
export declare function title(it: Opts): string;
export declare function disable_pager(it: Opts): string;
export declare function disable_expr(it: Opts): string;
export declare function main(it: Opts, content?: string): string;
