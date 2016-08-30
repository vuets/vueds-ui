export interface Opts {
    pager: string;
    custom_list_class?: string;
    list_class?: string;
    attrs?: any;
    click_to_select?: boolean;
    item_class?: string;
    item_attrs?: any;
    item_show_expr?: string;
    item_class_exprs?: any;
    pojo?: string;
}
export declare function main(it: Opts, content: string): string;
