import { component } from 'vuets'
import { defp, nullp, initObservable } from 'vueds'
import { PojoStore, Pager, StateObject, SelectionFlags, PojoListState, SelectionType } from 'vueds/lib/store/'
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

interface Entry {
    key: string
    val: cal.YMD,
    array: any
}

function getEntry(year: number, month: number, opts: cal.Opts, startDate: cal.YMD, cache: any): Entry {
    let key = year + '/' + month,
        entry: Entry = cache[key]
    
    if (!entry)
        cache[key] = entry = { key, val: { year, month, day: -1 }, array: cal.getCalendar(year, month, opts, startDate) }
    
    return entry
}

function repaint(self: Calendar, next: boolean) {
    let config = self.config,
        current = config.current,
        entry: Entry
    if (next) {
        if (current.month === 11)
            entry = getEntry(current.year + 1, 0, config.opts, config.startDate, config.cache)
        else
            entry = getEntry(current.year, current.month + 1, config.opts, config.startDate, config.cache)
    } else if (current.month) {
        entry = getEntry(current.year, current.month - 1, config.opts, config.startDate, config.cache)
    } else {
        entry = getEntry(current.year - 1, 11, config.opts, config.startDate, config.cache)
    }
    
    let ymd = entry.val
    config.current = ymd
    self.year = ymd.year
    self.month = months[ymd.month]
    self.pstore.replace(entry.array, SelectionType.RESET)
}

export interface Config {
    today: Date
    startDate: cal.YMD
    current: cal.YMD
    opts: cal.Opts
    cache: any
}

export class Calendar {
    pager: Pager
    pstore: PojoStore<Item>
    config: Config
    month = ''
    year = 0
    
    constructor() {
        nullp(this, 'pager')
    }
    
    static created(self: Calendar) {
        let today = new Date(),
            year = today.getUTCFullYear(),
            month = today.getUTCMonth(),
            day = today.getUTCDate(),
            startDate: cal.YMD = { year, month, day }
        
        let config: Config = defp(self, 'config', {
            today,
            startDate,
            current: startDate,
            opts: { weekStart: 0 },
            cache: {}
        })

        self.pager = defp(self, 'pstore', new PojoStore(getEntry(year, month, config.opts, startDate, config.cache).array, {
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
                // not used
            },
            page(next: boolean, pager: Pager) {
                repaint(self, next)
            }
        })).pager

        self.month = months[month]
        self.year = year
    }

    static mounted(self: Calendar) {
        self.pstore.repaint()
    }

    page(next: boolean) {
        repaint(this, next)
    }
}
export default component({
    created(this: Calendar) { Calendar.created(this) },
    mounted(this: Calendar) { Calendar.mounted(this) },
    template: `
<ul class="ui calendar" v-pager:0,0,7="pager">
  <li class="header">
    <i class="l icon left-circled" @click.prevent="page(false)"></i>
    <span class="month" v-text="month"></span>&nbsp;&nbsp;<span class="year" v-text="year"></span>
    <i class="r icon right-circled" @click.prevent="page(true)"></i>
  </li>
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
  <div class="footer"></div>
</ul>`
}, Calendar)