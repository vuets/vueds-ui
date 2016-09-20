import { PojoStore, Pager, SelectionFlags } from 'vueds/lib/store/';
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
export declare function getInstance(): Calendar;
export interface Entry {
    key: string;
    val: cal.YMD;
    array: any;
    firstDayIdx: number;
}
export declare function goto(self: Calendar, year: number, month: number, day: number): void;
export declare function update(self: Calendar, target: cal.YMD): boolean;
export interface Opts {
    onSelect(message: Item, flags: SelectionFlags): any;
}
export interface Config {
    today: Date;
    startDate: cal.YMD;
    current: cal.YMD;
    current_entry: Entry;
    selected_item: Item | any;
    selected_date: cal.YMD | null;
    selected_day: number;
    selectItemNT: any;
    selectDayNT: any;
    opts: cal.Opts;
    cache: any;
}
export declare class Calendar {
    pager: Pager;
    pstore: PojoStore<Item>;
    config: Config;
    opts: Opts;
    month: string;
    year: number;
    constructor();
    static created(self: Calendar): void;
    static mounted(self: Calendar): void;
    page(next: boolean): void;
}
declare var _default: any;
export default _default;
