import { component } from 'vuets';
import { defp, nullp } from 'vueds';
import { PojoStore } from 'vueds/lib/store/';
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
function mergeFrom(src, descriptor, target) {
    var flags = 0, target_flags = target.flags, day = src.day;
    if (src.selected)
        flags |= 1;
    if (src.siblingMonth)
        flags |= 2;
    if (flags !== target_flags)
        target.flags = flags;
    if (day !== target.day)
        target.day = day;
    return target;
}
var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
function getEntry(year, month, opts, startDate, cache) {
    var key = year + '/' + month, entry = cache[key];
    if (!entry)
        cache[key] = entry = { key: key, val: { year: year, month: month, day: -1 }, array: cal.getCalendar(year, month, opts, startDate) };
    return entry;
}
function repaint(self, next) {
    var config = self.config, current = config.current, entry;
    if (next) {
        if (current.month === 11)
            entry = getEntry(current.year + 1, 0, config.opts, config.startDate, config.cache);
        else
            entry = getEntry(current.year, current.month + 1, config.opts, config.startDate, config.cache);
    }
    else if (current.month) {
        entry = getEntry(current.year, current.month - 1, config.opts, config.startDate, config.cache);
    }
    else {
        entry = getEntry(current.year - 1, 11, config.opts, config.startDate, config.cache);
    }
    var ymd = entry.val;
    config.current = ymd;
    self.year = ymd.year;
    self.month = months[ymd.month];
    self.pstore.replace(entry.array, 1 /* RESET */);
}
export var Calendar = (function () {
    function Calendar() {
        this.month = '';
        this.year = 0;
        nullp(this, 'pager');
    }
    Calendar.created = function (self) {
        var today = new Date(), year = today.getUTCFullYear(), month = today.getUTCMonth(), day = today.getUTCDate(), startDate = { year: year, month: month, day: day };
        var config = defp(self, 'config', {
            today: today,
            startDate: startDate,
            current: startDate,
            opts: { weekStart: 0 },
            cache: {}
        });
        self.pager = defp(self, 'pstore', new PojoStore(getEntry(year, month, config.opts, startDate, config.cache).array, {
            desc: true,
            pageSize: 35,
            descriptor: Item.$descriptor,
            keyProperty: 'id',
            $keyProperty: 'id',
            merge_fn: mergeFrom,
            createObservable: function (so, idx) {
                return Item.$createObservable(String(idx));
            },
            onSelect: function (message, flags) {
                // TODO
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
    return Calendar;
}());
export default component({
    created: function () { Calendar.created(this); },
    mounted: function () { Calendar.mounted(this); },
    template: "\n<ul class=\"ui calendar\" v-pager:0,0,7=\"pager\">\n  <li class=\"header\"><span class=\"month\" v-text=\"month\"></span>&nbsp;&nbsp;<span class=\"year\" v-text=\"year\"></li>\n  <li class=\"weekday\">Sun</li>\n  <li class=\"weekday\">Mon</li>\n  <li class=\"weekday\">Tue</li>\n  <li class=\"weekday\">Wed</li>\n  <li class=\"weekday\">Thu</li>\n  <li class=\"weekday\">Fri</li>\n  <li class=\"weekday\">Sat</li>\n  <li v-for=\"pojo in pager.array\" v-defp:pager_item=\"pojo\" class=\"day\"\n      v-sclass:active=\"(pojo._.lstate & " + 2 /* SELECTED */ + ")\"\n      v-pclass:type-=\"pojo.flags\" v-text=\"pojo.day\"></li>\n  <div style=\"clear:both\"></div>\n</ul>"
}, Calendar);
//# sourceMappingURL=calendar.js.map