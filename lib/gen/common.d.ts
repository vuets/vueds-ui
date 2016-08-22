export declare const c: {
    PREVENT_NONE: number;
    PREVENT_DEFAULT: number;
    PREVENT_PROPAGATION: number;
    PREVENT_BOTH: number;
    STATE_NONE: number;
    STATE_SUCCESS: number;
    STATE_ERROR: number;
    STATE_WARNING: number;
    STATE_LOADING: number;
    MASK_STATUS: number;
    STATE_UPDATE: number;
    LSTATE_NONE: number;
    LSTATE_INCLUDED: number;
    LSTATE_SELECTED: number;
    LSTATE_REFRESH: number;
    MASK_SELECTED_REFRESH: number;
    STATE_DESC: number;
    STATE_LOAD_NEWER: number;
    STATE_LOAD_OLDER: number;
    STATE_RELOAD: number;
    MASK_RPC: number;
    STATE_LOCAL_SEARCH: number;
    MASK_RPC_DISABLE: number;
    HANDLE_ACTIVATE: number;
    HANDLE_PASSIVATE: number;
    HANDLE_NEW: number;
    HANDLE_UPDATE: number;
    HANDLE_DELETE: number;
    HANDLE_ENTRY_INPUT: number;
    HANDLE_ENTRY_DELETE: number;
    HANDLE_ENTRY_SORT: number;
    HANDLE_ENTRY_SEARCH: number;
    SELECT_CLICKED: number;
    SELECT_REFRESH: number;
    SELECT_CLICKED_UPDATE: number;
    SELECT_FORCE: number;
};
export declare const default_obj: {};
/**
 * The arg: value can be number or string.
 */
export declare function expr(value: any, pojo: any): any;
export declare function exprs(array: any[], pojo: any, delim: string, prepend?: boolean): any;
export declare function kv_exprs(attrs: any, pojo: any, delim: string, prepend: boolean, exprDelim: string): string;
