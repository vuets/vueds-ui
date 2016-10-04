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
