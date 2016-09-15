import { component } from 'vuets'
import { defp, nullp, initObservable } from 'vueds'
import { PojoStore, Pager, StateObject, SelectionFlags, PojoListState } from 'vueds/lib/store/'
import { ds } from 'vueds/lib/ds/'
import * as cal from '../calendar'

/**
 * 
 * message Item {
 *   required uint32 day = 1;
 *   required uint32 flags = 2;
 * }
 */
export interface Item {
    /** required: 1 */
    day: number
    /** required: 2 */
    flags: number
}
export namespace Item {
    /*export const day = "day"
    export const flags = "flags"
    export const enum $f {
        day = 1,
        flags = 2
    }*/

    export function $create(day: number, flags: number): Item {
        return {
            day: day,
            flags: flags
        }
    }
    /*export function $stringify(obj: any): string {
        var buf: string[] = [],
            _1 = obj.day,
            _2 = obj.flags;

        if (_1 != null)
            buf.push('"1":' + _1);
        if (_2 != null)
            buf.push('"2":' + _2);

        return 0 === buf.length ? '{}' : '{' + buf.join(',') + '}';
    }*/
    export function $createObservable(id: string): Item {
        return {
            id,
            day: 0,
            flags: 0,
            _: null//, $d: null
        } as Item
    }

    export const $descriptor = {
        //$fdf: ['1','2'],
        '1': {_: 1, t: 10, m: 2, a: 0, $: 'day', $n: 'Day'},
        '2': {_: 2, t: 10, m: 2, a: 0, $: 'flags', $n: 'Flags'},
        $: {
            day: '1',
            flags: '2'
        }//, $new: $createObservable, $change
    }
}

function mergeFrom(src: cal.Item, descriptor: any, target: Item): Item {
    let flags = 0,
        target_flags = target.flags,
        day = src.day
    
    if (src.selected)
        flags |= 1
    if (src.siblingMonth)
        flags |= 2
    
    if (flags !== target_flags)
        target.flags = flags
    
    if (day !== target.day)
        target.day = day
    
    return target
}

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

export class Calendar {
    pager: Pager
    pstore: PojoStore<Item>
    opt: cal.Opts
    date: Date
    month = ''
    year = ''
    
    constructor() {
        nullp(this, 'pager')
    }
    
    static created(self: Calendar) {
        let today = defp(self, 'date', new Date()),
            year = today.getUTCFullYear(),
            month = today.getUTCMonth(),
            day = today.getUTCDay()
        let opts: cal.Opts = defp(self, 'opts', {
            startDate: { year, month, day },
            weekStart: 0
        })
        let array = cal.getCalendar(opts, year, month) as any

        self.pager = defp(self, 'pstore', new PojoStore(array, {
            desc: true,
            pageSize: 35,
            descriptor: Item.$descriptor,
            keyProperty: 'id',
            $keyProperty: 'id',
            merge_fn: mergeFrom,
            createObservable(so: StateObject, idx: number) {
                return Item.$createObservable(String(idx))
            },
            onSelect(message: Item, flags: SelectionFlags): number {
                // TODO
                return 0
            },
            fetch(req: ds.ParamRangeKey, pager: Pager) {
                // TODO
            }
        })).pager

        self.month = months[month]
        self.year = String(year)
    }

    static mounted(self: Calendar) {
        self.pstore.repaint()
    }
}
export default component({
    created(this: Calendar) { Calendar.created(this) },
    mounted(this: Calendar) { Calendar.mounted(this) },
    template: `
<ul class="ui calendar" v-pager:0,0,7="pager">
  <li class="header"><span class="month" v-text="month"></span>&nbsp;&nbsp;<span class="year" v-text="year"></li>
  <li class="weekday">Sun</li>
  <li class="weekday">Mon</li>
  <li class="weekday">Tue</li>
  <li class="weekday">Wed</li>
  <li class="weekday">Thu</li>
  <li class="weekday">Fri</li>
  <li class="weekday">Sat</li>
  <li v-for="pojo in pager.array" v-defp:pager_item="pojo" class="day"
      v-sclass:active="(pojo._.lstate & ${PojoListState.SELECTED})"
      v-pclass:type-="pojo.flags" v-text="pojo.day"></li>
</ul>`
}, Calendar)