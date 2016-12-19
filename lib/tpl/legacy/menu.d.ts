export declare const enum ContentLoc {
    RIGHT_MENU = 1,
}
export interface CommonOpts {
    itoggle_id?: string;
    content_loc?: ContentLoc;
    id?: string;
}
export declare function right_menu(it: CommonOpts, content?: string): string;
export interface SimpleOpts extends CommonOpts {
    title: string;
}
export declare function simple(it: SimpleOpts, content?: string): string;
export interface PagerOpts extends CommonOpts {
    pager: string;
    title: string;
    search_fk: string;
    dpager?: string;
}
export declare function pager(it: PagerOpts, content?: string): string;
export interface PagerLazyOpts extends PagerOpts {
    /** defaults to lazy_init() */
    lazy_fn?: string;
    /** defaults to lazy_count */
    lazy_count?: string;
    /** defaults to initialized */
    init_var?: string;
}
export declare function pager_lazy(it: PagerLazyOpts, content?: string, items?: string): string;
