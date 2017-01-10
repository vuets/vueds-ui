import * as Vue from 'vue';
import { getInstance, update, goto } from './c/calendar';
import { localToUtc } from 'vueds/lib/util';
import { formatDate } from 'vueds/lib/datetime_util';
import { getPopup, hidePopup, showPopup, visiblePopup, fireEvent } from './dom_util';
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
        changeNT: null,
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
    if ((flags & 32 /* TRIGGER_CHANGE_ON_SELECT */))
        opts.changeNT = changeNT.bind(opts);
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
function changeNT() {
    fireEvent(this.el, 'change');
}
function toUTC(config) {
    var selected_date = config.selected_date, selected_item = config.selected_item, date = new Date(selected_date.year, selected_item.month, selected_item.day);
    return localToUtc(date.getTime());
}
function onSelect(message, flags) {
    var pending = flags === 0;
    this.pending = pending;
    if (pending)
        return;
    var val = toUTC(getInstance().config), old = this.pojo[this.field];
    Vue.nextTick(this.focusNT);
    if (val === old)
        return;
    if (this.changeNT && this.update)
        this.pojo['_'][this.field] = old || null;
    this.pojo[this.field] = val;
    if (this.changeNT)
        Vue.nextTick(this.changeNT);
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
    var popup = p || getPopup(), show = true;
    if (hidePopup(popup)) {
        show = false;
    }
    else {
        showCalendar(calendar, self, popup);
    }
    return show;
}
function focusout(e) {
    if (!this.pending)
        return;
    this.pending = false;
    var val = toUTC(getInstance().config), old = this.pojo[this.field];
    hidePopup(getPopup());
    if (val === old)
        return;
    if (this.changeNT && this.update)
        this.pojo['_'][this.field] = old || null;
    this.pojo[this.field] = val;
    if (this.changeNT)
        Vue.nextTick(this.changeNT);
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
function applyPending(self, calendar, hideIfApplied) {
    var val = toUTC(calendar.config), old = self.pojo[self.field];
    self.pending = false;
    if (val === old)
        return false;
    if (self.changeNT && self.update)
        self.pojo['_'][self.field] = old || null;
    self.pojo[self.field] = val;
    if (hideIfApplied)
        hidePopup(getPopup());
    window.setTimeout(self.focusNT, 100);
    return true;
}
function keydown(e) {
    var self = this, calendar, pager, val;
    switch (e.which) {
        case 13 /* ENTER */:
            if ((val = self.el.value) && val.length === 10) {
                if (self.pending) {
                    if (applyPending(self, getInstance(), true) && self.changeNT)
                        Vue.nextTick(self.changeNT);
                    break;
                }
                // check if the user changed the date manually
                if (val !== formatDate(self.pojo[self.field]))
                    return true;
            }
            calendar = getInstance();
            if (toggleCalendar(calendar, self)) {
                // shown
                break;
            }
            if (self.pending) {
                if (!applyPending(self, calendar))
                    break;
            }
            else if (!self.update && !self.pojo[self.field]) {
                // assign today's value
                self.pojo[self.field] = calendar.config.todayUTC;
            }
            else {
                break;
            }
            if (self.changeNT)
                Vue.nextTick(self.changeNT);
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
                tableUp(pager, self.col_size, 0, pager.index_selected, e, self.flags); // TODO pass flags?
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
                tableDown(pager, self.col_size, 0, pager.index_selected, e, self.flags); // TODO pass flags?
            break;
        default:
            return true;
    }
    e.preventDefault();
    e.stopPropagation();
    return false;
}
//# sourceMappingURL=_dpicker.js.map