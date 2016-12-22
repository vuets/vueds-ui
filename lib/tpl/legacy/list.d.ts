export interface ItemOpts {
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
export interface Opts extends ItemOpts {
    pager: string;
}
export declare function item(it: ItemOpts, content: string, initialAttrs?: string): string;
export declare function new_pi(it: ItemOpts): {
    name: string;
    props: {
        pojo: {
            type: ObjectConstructor;
            required: boolean;
        };
    };
    template: string;
};
export declare function pi(pager: string, content: string, custom_list_class?: string, list_attrs?: any): string;
export declare function main(it: Opts, content: string): string;
