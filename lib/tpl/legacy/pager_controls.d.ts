export interface Opts {
    /**
     * Defaults to 'pager'
     */
    pager: string;
    top?: boolean;
    content_loc?: number;
    attrs?: any;
    track_clicks?: boolean;
    without_sort?: boolean;
    reverse_icon?: boolean;
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
export declare function main(it: Opts, body?: string): string;
