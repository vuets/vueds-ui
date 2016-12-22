export interface ItemOpts {
    item_class?: string;
    item_attrs?: any;
    item_show_expr?: string;
    item_class_exprs?: any;
    pojo?: string;
}
export interface ListOpts {
    pager: string;
    attrs?: any;
    custom_list_class?: string;
    list_class?: string;
}
export interface Opts extends ItemOpts, ListOpts {
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
export declare function pi(it: ListOpts, content: string): string;
export declare function main(it: Opts, content: string): string;
