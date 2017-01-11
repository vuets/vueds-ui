export interface BaseOpts {
    pojo: string;
    field: string;
    handler: string;
    /** Defaults to `(pojo._.state & ${PojoState.LOADING})` */
    disable_expr?: string;
    id?: string;
    placeholder?: string;
}
export interface ChangeOpts extends BaseOpts {
    change_flags?: number;
}
export declare function change(it: ChangeOpts): string;
export interface SuggestOpts extends BaseOpts {
    fetch: string;
}
export declare function suggest(it: SuggestOpts): string;
