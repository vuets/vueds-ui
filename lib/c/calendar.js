import * as Vue from 'vue';
import { component } from 'vuets';
import { defp, nullp } from 'vueds';
import { localToUtc } from 'vueds/lib/util';
import { PojoStore } from 'vueds/lib/store/';
import { hidePopup, getPopup } from '../dom_util';
import * as cal from '../calendar';
export var Item;
(function (Item) {
    /*export const day = "day"
    export const flags = "flags"
    export const enum $f {
        day = 1,
        flags = 2
    }*/
    function $create(day, flags) {
        return {
            day: day,
            flags: flags
        };
    }
    Item.$create = $create;
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
    function $createObservable(id) {
        return {
            id: id,
            day: 0,
            flags: 0,
            month: 0,
            _: null //, $d: null
        };
    }
    Item.$createObservable = $createObservable;
    Item.$descriptor = {
        //$fdf: ['1','2'],
        '1': { _: 1, t: 10, m: 2, a: 0, $: 'day', $n: 'Day' },
        '2': { _: 2, t: 10, m: 2, a: 0, $: 'flags', $n: 'Flags' },
        $: {
            day: '1',
            flags: '2'
        } //, $new: $createObservable, $change
    };
})(Item || (Item = {}));
var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
var instance;
export function getInstance() {
    return instance;
}
function mergeFrom(src, descriptor, target) {
    var flags = 0, target_flags = target.flags, month = src.month, day = src.day;
    if (src.selected)
        flags |= 1;
    if (src.siblingMonth)
        flags |= 2;
    if (flags !== target_flags)
        target.flags = flags;
    if (day !== target.day)
        target.day = day;
    if (month !== target.month)
        target.month = month;
    return target;
}
function getEntry(year, month, opts, startDate, cache) {
    var key = year + '/' + month, entry = cache[key], array;
    if (!entry) {
        array = [];
        cache[key] = entry = {
            key: key,
            val: { year: year, month: month, day: -1 },
            array: array,
            firstDayIdx: cal.addItemsTo(array, year, month, opts, startDate)
        };
    }
    return entry;
}
function selectItemNT() {
    var selected_item = this.config.selected_item;
    //selected_item['_'].lstate = PojoListState.INCLUDED | PojoListState.SELECTED
    this.pstore.select(selected_item, 8 /* FORCE */);
}
function selectDayNT() {
    var config = this.config, current = config.current, current_entry = config.current_entry, 
    //selected_item = config.selected_item,
    // selected_day is 1-based
    idx = current_entry.firstDayIdx + config.selected_day - 1;
    /*if (selected_item && idx === selected_item.$index) {
        selected_item['_'].lstate = PojoListState.INCLUDED | PojoListState.SELECTED
    } else {
        this.pstore.select(this.pager.array[idx], SelectionFlags.FORCE)
    }*/
    this.pstore.select(this.pager.array[idx], 8 /* FORCE */);
}
export function goto(self, year, month, day) {
    var config = self.config, entry = getEntry(year, month, config.opts, config.startDate, config.cache), ymd = entry.val, selected_date = config.selected_date;
    config.current = ymd;
    config.current_entry = entry;
    self.year = ymd.year;
    self.month = months[ymd.month];
    self.pstore.replace(entry.array, 1 /* RESET */);
    if (day !== -1) {
        config.selected_day = day;
        Vue.nextTick(config.selectDayNT);
    }
    else if (selected_date && ymd.year === selected_date.year && ymd.month === selected_date.month) {
        Vue.nextTick(config.selectItemNT);
    }
}
export function update(self, target) {
    if (self.config.current === target)
        return false;
    goto(self, target.year, target.month, target.day);
    return true;
}
function repaint(self, next) {
    var current = self.config.current;
    if (next) {
        if (current.month === 11)
            goto(self, current.year + 1, 0, -1);
        else
            goto(self, current.year, current.month + 1, -1);
    }
    else if (current.month) {
        goto(self, current.year, current.month - 1, -1);
    }
    else {
        goto(self, current.year - 1, 11, -1);
    }
}
var Calendar = (function () {
    function Calendar() {
        this.month = '';
        this.year = 0;
        nullp(this, 'pager');
        defp(this, 'opts', null);
    }
    Calendar.created = function (self) {
        instance = self;
        var now = new Date(), year = now.getUTCFullYear(), month = now.getUTCMonth(), day = now.getUTCDate(), today = new Date(year, month, day), todayUTC = localToUtc(today.getTime()), startDate = { year: year, month: month, day: day }, opts = { weekStart: 0 }, cache = {}, current_entry = getEntry(year, month, opts, startDate, cache);
        var config = defp(self, 'config', {
            today: today,
            todayUTC: todayUTC,
            startDate: startDate,
            current: startDate,
            current_entry: current_entry,
            selected_item: null,
            selected_date: null,
            selected_day: -1,
            selectItemNT: selectItemNT.bind(self),
            selectDayNT: selectDayNT.bind(self),
            opts: opts,
            cache: cache
        });
        self.pager = defp(self, 'pstore', new PojoStore(current_entry.array, {
            desc: true,
            pageSize: 35,
            descriptor: Item.$descriptor,
            keyProperty: 'id',
            $keyProperty: 'id',
            merge_fn: mergeFrom,
            createObservable: function (so, idx) {
                return Item.$createObservable(String(idx));
            },
            onSelect: function (selected, flags) {
                var config = self.config, opts = self.opts;
                config.selected_item = selected;
                config.selected_date = config.current;
                if (flags !== 8 /* FORCE */)
                    opts.onSelect(selected, flags);
                return 0;
            },
            fetch: function (req, pager) {
                // not used
            },
            page: function (next, pager) {
                repaint(self, next);
            }
        })).pager;
        self.month = months[month];
        self.year = year;
    };
    Calendar.mounted = function (self) {
        self.pstore.repaint();
    };
    Calendar.prototype.page = function (next, year) {
        if (!year) {
            repaint(this, next);
            return;
        }
        var current = this.config.current, diff = next ? 1 : -1;
        goto(this, current.year + diff, current.month, -1);
    };
    Calendar.prototype.hide = function () {
        hidePopup(getPopup());
    };
    return Calendar;
}());
export { Calendar };
var item_tpl = "\n<li v-defp:pager_item=\"pojo\" class=\"day\"\n    v-sclass:active=\"(pojo._.lstate & " + 2 /* SELECTED */ + ")\"\n    v-pclass:type-=\"pojo.flags\" v-text=\"pojo.day\"></li>\n";
export default component({
    created: function () { Calendar.created(this); },
    mounted: function () { Calendar.mounted(this); },
    ready: function () { Calendar.mounted(this); },
    components: {
        ci: {
            name: 'ci',
            props: {
                pojo: { type: Object, required: true }
            },
            template: item_tpl
        }
    },
    template: "\n<ul class=\"ui calendar\" v-pager:0,0,7=\"pager\">\n  <li class=\"header\">\n    <span class=\"l\">\n      <i class=\"icon angle-double-left link\" @click.prevent=\"page(false, true)\"></i>\n      <i class=\"icon angle-left link\" @click.prevent=\"page(false)\"></i>\n    </span>\n    <div @click.prevent=\"hide\">\n      <span class=\"month\" v-text=\"month\" @click=\"hide\"></span>&nbsp;&nbsp;<span class=\"year\" v-text=\"year\"></span>\n    </div>\n    <span class=\"r\">\n      <i class=\"icon angle-right link\" @click.prevent=\"page(true)\"></i>\n      <i class=\"icon angle-double-right link\" @click.prevent=\"page(true, true)\"></i>\n    </span>\n  </li>\n  <li class=\"weekday\">Sun</li>\n  <li class=\"weekday\">Mon</li>\n  <li class=\"weekday\">Tue</li>\n  <li class=\"weekday\">Wed</li>\n  <li class=\"weekday\">Thu</li>\n  <li class=\"weekday\">Fri</li>\n  <li class=\"weekday\">Sat</li>\n  <ci v-for=\"pojo in pager.array\" :pojo=\"pojo\"></ci>\n  <div class=\"footer\"></div>\n</ul>"
}, Calendar);
//# sourceMappingURL=calendar.js.map