export interface Opts {
    /**
     * Defaults to 'pager'
     */
    pager: string;
    attrs?: any;
    content_loc?: number;
    track_clicks?: boolean;
}
export declare function message_fragment(it: Opts): string;
export declare function nav_item(it: Opts, content: string): string;
export declare function count_item(it: Opts, content: string): string;
export declare function main(it: Opts, body: string): string;
