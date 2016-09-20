import * as Vue from 'vue';
import { getInstance, update, goto } from './c/calendar';
import { localToUtc } from 'vueds/lib/util';
import { getPopup, hidePopup, showPopup, visiblePopup } from './dom_util';
import { pageFirst, pageLast, moveLeft, moveRight, tableDown, tableUp, moveTopOrUp, moveBottomOrDown } from './pager_util';
export function parseOpts(args, pojo, field, el) {
    var i = 0, len = !args ? 0 : args.length, flags = i === len ? 0 : parseInt(args[i++], 10);
    var opts = {
        flags: flags,
        update: 0 !== (flags & 16 /* UPDATE */),
        pojo: pojo,
        field: field,
        el: el,
        col_size: 7,
        table_flags: 0,
        pending: false,
        focusNT: null,
        onSelect: null,
        focusout: null,
        click: null,
        keydown: null
    };
    opts.focusNT = focusNT.bind(opts);
    opts.onSelect = onSelect.bind(opts);
    el.addEventListener('focusout', opts.focusout = focusout.bind(opts));
    el.addEventListener('click', opts.click = click.bind(opts));
    el.addEventListener('keydown', opts.keydown = keydown.bind(opts));
    return opts;
}
export function cleanup(opts) {
    var el = opts.el;
    el.removeEventListener('focusout', opts.focusout);
    el.removeEventListener('click', opts.click);
    el.removeEventListener('keydown', opts.keydown);
}
function focusNT() {
    this.el.focus();
}
function toUTC(config) {
    var selected_date = config.selected_date, selected_item = config.selected_item, date = new Date(selected_date.year, selected_item.month, selected_item.day);
    return localToUtc(date.getTime());
}
function onSelect(message, flags) {
    var self = this, pending = flags === 0;
    self.pending = pending;
    if (pending)
        return;
    self.pojo[self.field] = toUTC(getInstance().config);
    Vue.nextTick(self.focusNT);
}
function showCalendar(calendar, self, popup) {
    var date, val;
    if (self.update) {
        date = new Date(self.pojo[self.field]);
        goto(calendar, date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
    }
    else if ((val = self.pojo[self.field])) {
        date = new Date(val);
        goto(calendar, date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
    }
    else {
        update(calendar, calendar.config.startDate);
    }
    calendar.opts = self;
    showPopup(popup || getPopup(), calendar.$el, self.el);
}
function toggleCalendar(calendar, self, p) {
    var popup = p || getPopup(), show = true, array;
    if (hidePopup(popup)) {
        show = false;
    }
    else {
        showCalendar(calendar, self, popup);
    }
    return show;
}
function focusout(e) {
    var self = this;
    if (self.pending) {
        self.pending = false;
        self.pojo[self.field] = toUTC(getInstance().config);
        hidePopup(getPopup());
    }
}
function click(e) {
    var calendar = getInstance(), self = this, popup = getPopup();
    e.preventDefault();
    e.stopPropagation();
    if (self === calendar.opts) {
        toggleCalendar(calendar, self, popup);
    }
    else {
        showCalendar(calendar, self, popup);
    }
}
function keydown(e) {
    var self = this, calendar, pager;
    switch (e.which) {
        case 13 /* ENTER */:
            calendar = getInstance();
            if (!toggleCalendar(calendar, self) && self.pending) {
                self.pending = false;
                self.pojo[self.field] = toUTC(getInstance().config);
            }
            break;
        case 27 /* ESCAPE */:
            hidePopup(getPopup());
            break;
        case 37 /* LEFT */:
            calendar = getInstance();
            if (self !== calendar.opts || !visiblePopup(getPopup()))
                return true;
            pager = calendar.pager;
            if (e.ctrlKey)
                pageFirst(e, pager, self);
            else
                moveLeft(e, pager, self);
            break;
        case 38 /* UP */:
            if (!visiblePopup(getPopup()))
                break;
            calendar = getInstance();
            pager = calendar.pager;
            if (e.ctrlKey)
                moveTopOrUp(e, pager, self);
            else
                tableUp(pager, self.col_size, 0, pager.index_selected, e, false);
            break;
        case 39 /* RIGHT */:
            calendar = getInstance();
            if (self !== calendar.opts || !visiblePopup(getPopup()))
                return true;
            pager = calendar.pager;
            if (e.ctrlKey)
                pageLast(e, pager, self);
            else
                moveRight(e, pager, self);
            break;
        case 40 /* DOWN */:
            if (!visiblePopup(getPopup()))
                break;
            calendar = getInstance();
            pager = calendar.pager;
            if (e.ctrlKey)
                moveBottomOrDown(e, pager, self);
            else
                tableDown(pager, self.col_size, 0, pager.index_selected, e, false);
            break;
        default:
            return true;
    }
    e.preventDefault();
    e.stopPropagation();
    return false;
}
//# sourceMappingURL=_dpicker.js.map