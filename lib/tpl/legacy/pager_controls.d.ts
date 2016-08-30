export declare const enum ContentSlot {
    FIRST = 0,
    RPC_FIRST = 1,
    RPC_LAST = 2,
    BEFORE_NAV = 3,
    NAV_FIRST = 4,
    NAV_LAST = 5,
    BEFORE_COUNT = 6,
    COUNT_FIRST = 7,
    COUNT_LAST = 8,
    LAST = 9,
}
export interface Opts {
    /**
     * Defaults to 'pager'
     */
    pager: string;
    flags?: number;
    top?: boolean;
    content_slot?: ContentSlot;
    attrs?: any;
    track_clicks?: boolean;
    without_sort?: boolean;
    reverse_icon?: boolean;
    without_nav?: boolean;
    without_count?: boolean;
    without_rpc?: boolean;
    without_rpc_newer?: boolean;
    without_rpc_older?: boolean;
    without_rpc_reload?: boolean;
    without_msg?: boolean;
    list_class?: string;
    _content?: string;
}
export declare function msg_fragment(it: Opts): string;
export declare function sort_btn(it: Opts): string;
export declare function rpc_newer_btn(it: Opts): string;
export declare function rpc_older_btn(it: Opts): string;
export declare function rpc_reload_btn(it: Opts): string;
export declare function rpc_item(it: Opts): string;
export declare function nav_item(it: Opts): string;
export declare function count_item(it: Opts): string;
export declare function main(it: Opts, content?: string): string;
