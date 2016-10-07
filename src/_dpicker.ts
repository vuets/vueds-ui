import * as Vue from 'vue'
import { Calendar, Config, Item, getInstance, update, goto } from './c/calendar'
import { localToUtc } from 'vueds/lib/util'
import { Pager, SelectionFlags } from 'vueds/lib/store/'
import { Keys, getPopup, hidePopup, showPopup, visiblePopup } from './dom_util'
import {
    pageFirst, pageLast, moveLeft, moveRight,
    tableDown, tableUp, moveTopOrUp, moveBottomOrDown
} from './pager_util'

export const enum Flags {
    UPDATE = 16
}

export interface Opts {
    flags: number
    update: boolean

    pojo: any
    field: string
    el: any

    col_size: number
    table_flags: number

    pending: boolean

    focusNT: any
    onSelect: any

    focusout: any
    click: any
    keydown: any
}

export function parseOpts(args: string[]|any, pojo, field, el): Opts {
    let i = 0,
        len = !args ? 0 : args.length,
        flags = i === len ? 0 : parseInt(args[i++], 10)
    
    let opts: Opts = {
        flags,
        update: 0 !== (flags & Flags.UPDATE),

        pojo,
        field,
        el,

        col_size: 7,
        table_flags: 0,

        pending: false,

        focusNT: null,
        onSelect: null,

        focusout: null,
        click: null,
        keydown: null
    }

    opts.focusNT = focusNT.bind(opts)
    opts.onSelect = onSelect.bind(opts)
    el.addEventListener('focusout', opts.focusout = focusout.bind(opts))
    el.addEventListener('click', opts.click = click.bind(opts))
    el.addEventListener('keydown', opts.keydown = keydown.bind(opts))

    return opts
}

export function cleanup(opts: Opts) {
    let el = opts.el

    el.removeEventListener('focusout', opts.focusout)
    el.removeEventListener('click', opts.click)
    el.removeEventListener('keydown', opts.keydown)
}

function focusNT(this: Opts) {
    this.el.focus()
}

function toUTC(config: Config): number {
    let selected_date = config.selected_date as any,
        selected_item = config.selected_item,
        date = new Date(selected_date.year, selected_item.month, selected_item.day)
    
    return localToUtc(date.getTime())
}

function onSelect(this: Opts, message: Item, flags: SelectionFlags) {
    let pending = flags === 0
    
    this.pending = pending
    if (pending) return
    
    this.pojo[this.field] = toUTC(getInstance().config)
    Vue.nextTick(this.focusNT)
}

function showCalendar(calendar: Calendar|any, self: Opts, popup?: any) {
    var date: Date,
        val

    if (self.update) {
        date = new Date(self.pojo[self.field])
        goto(calendar, date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
    } else if ((val = self.pojo[self.field])) {
        date = new Date(val)
        goto(calendar, date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
    } else {
        update(calendar, calendar.config.startDate)
    }
    
    calendar.opts = self
    showPopup(popup || getPopup(), calendar.$el, self.el)
}
function toggleCalendar(calendar, self: Opts, p?: any): boolean {
    let popup = p || getPopup(),
        show = true,
        array
    
    if (hidePopup(popup)) {
        show = false
    } else {
        showCalendar(calendar, self, popup)
    }
    
    return show
}

function focusout(this: Opts, e) {
    if (this.pending) {
        this.pending = false
        this.pojo[this.field] = toUTC(getInstance().config)
        hidePopup(getPopup())
    }
}

function click(this: Opts, e) {
    let calendar = getInstance(),
        self = this,
        popup = getPopup()
    
    e.preventDefault()
    e.stopPropagation()

    if (self === calendar.opts) {
        toggleCalendar(calendar, self, popup)
    } else {
        showCalendar(calendar, self, popup)
    }
}

function keydown(this: Opts, e) {
    let self = this,
        calendar: Calendar,
        pager: Pager

    switch (e.which) {
        case Keys.ENTER:
            calendar = getInstance()
            if (toggleCalendar(calendar, self)) {
                // shown
            } else if (self.pending) {
                self.pending = false
                self.pojo[self.field] = toUTC(calendar.config)
            } else if (!self.update && !self.pojo[self.field]) {
                // assign today's value
                self.pojo[self.field] = calendar.config.todayUTC
            }
            break
        case Keys.ESCAPE:
            hidePopup(getPopup())
            break
        case Keys.LEFT:
            calendar = getInstance()
            if (self !== calendar.opts || !visiblePopup(getPopup())) return true

            pager = calendar.pager
            if (e.ctrlKey) pageFirst(e, pager, self)
            else moveLeft(e, pager, self)
            break
        case Keys.UP:
            if (!visiblePopup(getPopup())) break

            calendar = getInstance()
            pager = calendar.pager
            if (e.ctrlKey) moveTopOrUp(e, pager, self)
            else tableUp(pager, self.col_size, 0, pager.index_selected, e, self.flags) // TODO pass flags?
            break
        case Keys.RIGHT:
            calendar = getInstance()
            if (self !== calendar.opts || !visiblePopup(getPopup())) return true

            pager = calendar.pager
            if (e.ctrlKey) pageLast(e, pager, self)
            else moveRight(e, pager, self)
            break
        case Keys.DOWN:
            if (!visiblePopup(getPopup())) break

            calendar = getInstance()
            pager = calendar.pager
            if (e.ctrlKey) moveBottomOrDown(e, pager, self)
            else tableDown(pager, self.col_size, 0, pager.index_selected, e, self.flags) // TODO pass flags?
            break
        default:
            return true
    }
    e.preventDefault()
    e.stopPropagation()
    return false
}
