import { PojoStore, Pager } from 'vueds/lib/store/';
import * as cal from '../calendar';
/**
 *
 * message Item {
 *   required uint32 day = 1;
 *   required uint32 flags = 2;
 * }
 */
export interface Item {
    /** required: 1 */
    day: number;
    /** required: 2 */
    flags: number;
}
export declare namespace Item {
    function $create(day: number, flags: number): Item;
    function $createObservable(id: string): Item;
    const $descriptor: {
        '1': {
            _: number;
            t: number;
            m: number;
            a: number;
            $: string;
            $n: string;
        };
        '2': {
            _: number;
            t: number;
            m: number;
            a: number;
            $: string;
            $n: string;
        };
        $: {
            day: string;
            flags: string;
        };
    };
}
export interface Config {
    today: Date;
    startDate: cal.YMD;
    current: cal.YMD;
    opts: cal.Opts;
    cache: any;
}
export declare class Calendar {
    pager: Pager;
    pstore: PojoStore<Item>;
    config: Config;
    month: string;
    year: number;
    constructor();
    static created(self: Calendar): void;
    static mounted(self: Calendar): void;
}
declare var _default: any;
export default _default;
