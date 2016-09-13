import { PojoStore, Pager, SelectionFlags } from 'vueds/lib/store/';
import { ds } from 'vueds/lib/ds/';
export interface Opts {
    str: string;
    fetch(req: ds.ParamRangeKey, str: string): any;
    onSelect(message: ds.ACResult, flags: SelectionFlags): any;
}
export declare function getInstance(): Suggest;
export declare class Suggest {
    pager: Pager;
    pstore: PojoStore<ds.ACResult>;
    opts: Opts;
    constructor();
    static created(self: Suggest): void;
}
declare var _default: any;
export default _default;
