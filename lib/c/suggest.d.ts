import { Pager, SelectionFlags } from 'vueds/lib/types';
import { PojoStore } from 'vueds/lib/store/';
import { ds } from 'vueds/lib/ds/';
export interface Opts {
    str: string;
    fetch(req: ds.PS): any;
    onSelect(message: ds.ACResult, flags: SelectionFlags): any;
}
export declare function getInstance(): Suggest;
export declare class Suggest {
    pager: Pager;
    pstore: PojoStore<ds.ACResult>;
    opts: Opts;
    cbFetchSuccess: any;
    cbFetchFailed: any;
    constructor();
    static created(self: Suggest): void;
}
declare var _default: any;
export default _default;
