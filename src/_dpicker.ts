import { nextTick } from 'vueds'
import { Calendar, Config, Item, getInstance, update, goto } from './c/calendar'
import { localToUtc } from 'vueds/lib/util'
import { formatDate } from 'vueds/lib/datetime_util'
import { Pager, SelectionFlags } from 'vueds/lib/types'
import { Keys, getPopup, hidePopup, showPopup, visiblePopup, fireEvent } from './dom_util'
import {
    pageFirst, pageLast, moveLeft, moveRight,
    tableDown, tableUp, moveTopOrUp, moveBottomOrDown
} from './pager_util'

export const enum Flags {
    UPDATE = 16,
    TRIGGER_CHANGE_ON_SELECT = 32
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
    changeNT: any
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
        changeNT: null,
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

    if ((flags & Flags.TRIGGER_CHANGE_ON_SELECT))
        opts.changeNT = changeNT.bind(opts)

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

function changeNT(this: Opts) {
    fireEvent(this.el, 'change')
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
    
    let val = toUTC(getInstance().config),
        old = this.pojo[this.field]

    nextTick(this.focusNT)

    if (val === old)
        return
    
    if (this.changeNT && this.update)
        this.pojo['_'][this.field] = old || null
    this.pojo[this.field] = val
    if (this.changeNT)
        nextTick(this.changeNT)
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
        show = true
    
    if (hidePopup(popup)) {
        show = false
    } else {
        showCalendar(calendar, self, popup)
    }
    
    return show
}

function focusout(this: Opts, e) {
    if (!this.pending)
        return
    
    this.pending = false
    
    let val = toUTC(getInstance().config),
        old = this.pojo[this.field]

    hidePopup(getPopup())

    if (val === old)
        return
    
    if (this.changeNT && this.update)
        this.pojo['_'][this.field] = old || null
    this.pojo[this.field] = val
    if (this.changeNT)
        nextTick(this.changeNT)
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

function applyPending(self: Opts, calendar: Calendar, hideIfApplied?: boolean): boolean {
    let val = toUTC(calendar.config),
        old = self.pojo[self.field]
    
    self.pending = false

    if (val === old)
        return false
    
    if (self.changeNT && self.update)
        self.pojo['_'][self.field] = old || null
    
    self.pojo[self.field] = val

    if (hideIfApplied)
        hidePopup(getPopup())
    
    window.setTimeout(self.focusNT, 100)
    return true
}

function keydown(this: Opts, e) {
    let self = this,
        calendar: Calendar,
        pager: Pager,
        val

    switch (e.which) {
        case Keys.ENTER:
            if ((val = self.el.value) && val.length === 10) {
                if (self.pending) {
                    if (applyPending(self, getInstance(), true) && self.changeNT)
                        nextTick(self.changeNT)
                    break
                }
                
                // check if the user changed the date manually
                if (val !== formatDate(self.pojo[self.field]))
                    return true
            }
            
            calendar = getInstance()
            if (toggleCalendar(calendar, self)) {
                // shown
                break
            }
            
            if (self.pending) {
                if (!applyPending(self, calendar))
                    break
            } else if (!self.update && !self.pojo[self.field]) {
                // assign today's value
                self.pojo[self.field] = calendar.config.todayUTC
            } else {
                break
            }

            if (self.changeNT)
                nextTick(self.changeNT)
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
