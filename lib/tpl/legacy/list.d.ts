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
export declare function item(it: Opts, content: string, initialAttrs?: string): string;
export declare function new_pi(it: Opts): {
    name: string;
    props: {
        pojo: {
            type: ObjectConstructor;
            required: boolean;
        };
    };
    template: string;
};
export declare function pi(pager: string, content: string, custom_list_class?: string, ul_attrs?: any): string;
export declare function main(it: Opts, content: string): string;
