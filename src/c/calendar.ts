import { component } from 'vuets'
import { defp, nullp, nextTick } from 'vueds'
import { localToUtc } from 'vueds/lib/util'
import { PojoStore, Pager, ItemSO, SelectionFlags, PojoListState, SelectionType } from 'vueds/lib/store/'
import { ds } from 'vueds/lib/ds/'
import { hidePopup, getPopup } from '../dom_util'
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
            month: 0,
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

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

var instance: Calendar

export function getInstance(): Calendar {
    return instance
}

function mergeFrom(src: cal.Item, descriptor: any, target: Item|any): Item {
    let flags = 0,
        target_flags = target.flags,
        month = src.month,
        day = src.day
    
    if (day === 0) {
        target.day = null
        return target
    }

    if (src.selected)
        flags |= 1
    if (src.siblingMonth)
        flags |= 2
    
    if (flags !== target_flags)
        target.flags = flags
    
    if (day !== target.day)
        target.day = day
    
    if (month !== target.month)
        target.month = month
    
    return target
}

export interface Entry {
    key: string
    val: cal.YMD,
    array: any
    firstDayIdx: number
}

const empty_item: cal.Item = {
    day: 0,
    month: 0,
    selected: false,
    siblingMonth: false,
    weekDay: 0,
    weekNumber: 0,
    year: 0
}

function getEntry(year: number, month: number, opts: cal.Opts, startDate: cal.YMD, cache: any): Entry {
    let key = year + '/' + month,
        entry: Entry = cache[key],
        array: cal.Item[]
    
    if (!entry) {
        array = []
        cache[key] = entry = {
            key, 
            val: { year, month, day: -1 },
            array,
            firstDayIdx: cal.addItemsTo(array, year, month, opts, startDate)
        }
        for (var i = 42 - array.length; i-- > 0;)
            array.push(empty_item)
    }
    
    return entry
}

function selectItemNT(this: Calendar) {
    let selected_item = this.config.selected_item
    //selected_item['_'].lstate = PojoListState.INCLUDED | PojoListState.SELECTED
    this.pstore.select(selected_item, SelectionFlags.FORCE)
}

function selectDayNT(this: Calendar) {
    let config = this.config,
        current_entry = config.current_entry,
        //selected_item = config.selected_item,
        // selected_day is 1-based
        idx = current_entry.firstDayIdx + config.selected_day - 1
    
    /*if (selected_item && idx === selected_item.$index) {
        selected_item['_'].lstate = PojoListState.INCLUDED | PojoListState.SELECTED
    } else {
        this.pstore.select(this.pager.array[idx], SelectionFlags.FORCE)
    }*/
    this.pstore.select(this.pager.array[idx], SelectionFlags.FORCE)
}

export function goto(self: Calendar, year: number, month: number, day: number) {
    let config = self.config,
        entry = getEntry(year, month, config.opts, config.startDate, config.cache),
        ymd = entry.val,
        selected_date = config.selected_date
    config.current = ymd
    config.current_entry = entry
    self.year = ymd.year
    self.month = months[ymd.month]
    self.pstore.replace(entry.array, SelectionType.RESET)

    if (day !== -1) {
        config.selected_day = day
        nextTick(config.selectDayNT)
    } else if (selected_date && ymd.year === selected_date.year && ymd.month === selected_date.month) {
        nextTick(config.selectItemNT)
    }
}

export function update(self: Calendar, target: cal.YMD): boolean {
    if (self.config.current === target)
        return false
    
    goto(self, target.year, target.month, target.day)
    return true
}

function repaint(self: Calendar, next: boolean) {
    let current = self.config.current
    if (next) {
        if (current.month === 11)
            goto(self, current.year + 1, 0, -1)
        else
            goto(self, current.year, current.month + 1, -1)
    } else if (current.month) {
        goto(self, current.year, current.month - 1, -1)
    } else {
        goto(self, current.year - 1, 11, -1)
    }
}

export interface Opts {
    onSelect(message: Item, flags: SelectionFlags)
}

export interface Config {
    today: Date
    todayUTC: number,
    startDate: cal.YMD
    current: cal.YMD
    current_entry: Entry
    selected_item: Item|any
    selected_date: cal.YMD|null
    selected_day: number
    selectItemNT: any
    selectDayNT: any
    opts: cal.Opts
    cache: any
}

export class Calendar {
    pager: Pager
    pstore: PojoStore<Item>
    config: Config
    opts: Opts
    month = ''
    year = 0
    
    constructor() {
        nullp(this, 'pager')
        defp(this, 'opts', null)
    }
    
    static created(self: Calendar) {
        instance = self

        let now = new Date(),
            year = now.getUTCFullYear(),
            month = now.getUTCMonth(),
            day = now.getUTCDate(),
            today = new Date(year, month, day),
            todayUTC = localToUtc(today.getTime()),
            startDate: cal.YMD = { year, month, day },
            opts = { weekStart: 0 },
            cache = {},
            current_entry = getEntry(year, month, opts, startDate, cache)
        
        defp(self, 'config', {
            today,
            todayUTC,
            startDate,
            current: startDate,
            current_entry,
            selected_item: null,
            selected_date: null,
            selected_day: -1,
            selectItemNT: selectItemNT.bind(self),
            selectDayNT: selectDayNT.bind(self),
            opts,
            cache
        } as Config)

        self.pager = defp(self, 'pstore', new PojoStore(current_entry.array, {
            desc: true,
            pageSize: 42,
            descriptor: Item.$descriptor,
            keyProperty: 'id',
            $keyProperty: 'id',
            merge_fn: mergeFrom,
            createObservable(so: ItemSO, idx: number) {
                return Item.$createObservable(String(idx))
            },
            onSelect(selected: Item, flags: SelectionFlags): number {
                if (!selected.day)
                    return 0
                
                let config = self.config,
                    opts = self.opts
                
                config.selected_item = selected
                config.selected_date = config.current

                if (flags !== SelectionFlags.FORCE)
                    opts.onSelect(selected, flags)
                
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

    page(next: boolean, year?: boolean) {
        if (!year) {
            repaint(this, next)
            return
        }
        let current = this.config.current,
            diff = next ? 1 : -1
        goto(this, current.year + diff, current.month, -1)
    }
    
    hide() {
        hidePopup(getPopup())
    }
}
const item_tpl = `
<li v-defp:pager_item="pojo" class="day"
    v-show="pojo.day"
    v-sclass:active="(pojo._.lstate & ${PojoListState.SELECTED})"
    v-pclass:type-="pojo.flags" v-text="pojo.day"></li>
`
export default component({
    created(this: Calendar) { Calendar.created(this) },
    mounted(this: Calendar) { Calendar.mounted(this) }, // vue 2.0
    ready(this: Calendar) { Calendar.mounted(this) }, // vue 1.0
    components: {
        ci: {
            name: 'ci',
            props: {
                pojo: { type: Object, required: true }
            },
            template: item_tpl
        }
    },
    template: `
<ul class="ui calendar" v-pager:0,0,7="pager">
  <li class="header">
    <span class="l">
      <i class="icon angle-double-left link" @click.prevent="page(false, true)"></i>
      <i class="icon angle-left link" @click.prevent="page(false)"></i>
    </span>
    <div @click.prevent="hide">
      <span class="month" v-text="month" @click="hide"></span>&nbsp;&nbsp;<span class="year" v-text="year"></span>
    </div>
    <span class="r">
      <i class="icon angle-right link" @click.prevent="page(true)"></i>
      <i class="icon angle-double-right link" @click.prevent="page(true, true)"></i>
    </span>
  </li>
  <li class="weekday">Sun</li>
  <li class="weekday">Mon</li>
  <li class="weekday">Tue</li>
  <li class="weekday">Wed</li>
  <li class="weekday">Thu</li>
  <li class="weekday">Fri</li>
  <li class="weekday">Sat</li>
  <ci v-for="pojo in pager.array" :pojo="pojo"></ci>
  <div class="footer"></div>
</ul>`
}, Calendar)
