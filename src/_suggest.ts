import * as Vue from 'vue'
import { SelectionType, SelectionFlags } from 'vueds/lib/store/'
import { ds } from 'vueds/lib/ds/'
import * as rpc from 'vueds/lib/rpc/'
import * as keymage from './keymage'
import { getInstance } from './c/suggest'
import { removeClass, addClass, debounce, getPopup, hidePopup, showPopup, visiblePopup } from './dom_util'
import { listDown, listUp, moveTopOrUp, moveBottomOrDown } from './pager_util'

function showSuggest(suggest, self: Opts, popup?: any) {
    suggest.pstore.replace(self.cache, SelectionType.RESET)
    suggest.opts = self
    showPopup(popup || getPopup(), suggest.$el, self.el)
}
function toggleSuggest(suggest, self: Opts, p?: any): boolean {
    let popup = p || getPopup(),
        show = true,
        array
    
    if (hidePopup(popup)) {
        show = false
    } else if ((array = self.cache).length) {
        if (!suggest.pstore.isSameArray(array))
            suggest.pstore.replace(array, SelectionType.RESET)
        suggest.opts = self
        showPopup(popup, suggest.$el, self.el)
    }
    
    return show
}

export const enum Flags {
    UPDATE = 16
}

export interface Opts {
    flags: number
    pojo: any
    field: string
    fetch: any
    fk: string
    vm: any
    el: any
    pojo_: any

    col_size: number
    table_flags: number

    update: boolean
    str: string
    str_fetch: string
    disabled: boolean
    cache: any

    pending_name: any
    pending_value: any

    unwatch: any
    onSelect: any

    cbFetchSuccess: any
    cbFetchFailed: any

    // next tick
    focusNT: any
    //hideSuggestNT: any

    // listeners
    //focusin: any
    focusout: any
    click: any
    input: any
    keyup: any
}

const emptyArray = []
//var current: Opts, previous: Opts

function newWatchFn(pojo_, fk) {
    return function() {
        return pojo_[fk]
    }
}

function onUpdate(this: Opts, value, oldValue) {
    this.el.value = value
    if (value)
        addClass(this.el.parentElement, 'suggested')
    else
        removeClass(this.el.parentElement, 'suggested')
}

function focusNT(this: Opts) {
    this.el.focus()
}

function onSelect(message: ds.ACResult, flags: SelectionFlags) {
    let self: Opts = this,
        name = message.name,
        value = message.id || message.value
    if (!flags) {
        self.pending_name = name
        self.pending_value = value
        self.el.value = name
    } else if (name === self.pojo_[self.fk]) {
        self.pending_name = null
        self.el.value = name // redudant
        addClass(this.el.parentElement, 'suggested')
        Vue.nextTick(self.focusNT)
    } else {
        self.pending_name = null
        self.pojo_[self.fk] = name
        self.pojo[self.field] = value
        Vue.nextTick(self.focusNT)
    }
}

function postPS(req: ds.PS) {
    return rpc.post(this, ds.PS.$stringify(req))
}

export function parseOpts(args: string[]|any, pojo, field, fetch, vm, el): Opts {
    let i = 0,
        len = !args ? 0 : args.length,
        flags = i === len ? 0 : parseInt(args[i++], 10),
        pojo_ = pojo._,
        descriptor = pojo.$d,
        $ = descriptor.$,
        fk = $ ? $[field] : field

    let opts = {
        flags,
        pojo,
        field,
        fetch: typeof fetch === 'string' ? postPS.bind(fetch) : fetch,
        fk,
        vm,
        el,
        pojo_,

        col_size: 0,
        table_flags: 0,

        update: 0 !== (flags & Flags.UPDATE),
        str: '',
        str_fetch: '',
        disabled: false,
        cache: emptyArray,

        pending_name: null,
        pending_value: null,

        unwatch: null,
        onSelect: null,

        cbFetchSuccess: null,
        cbFetchFailed: null,

        focusNT: null,
        //hideSuggestNT: null,
        //focusin: null,
        focusout: null,
        click: null,
        input: null,
        keyup: null
    }

    opts.unwatch = vm.$watch(newWatchFn(pojo_, fk), onUpdate.bind(opts))
    opts.onSelect = onSelect.bind(opts)

    opts.cbFetchSuccess = cbFetchSuccess.bind(opts)
    opts.cbFetchFailed = cbFetchFailed.bind(opts)

    opts.focusNT = focusNT.bind(opts)
    //opts.hideSuggestNT = hideSuggestNT.bind(opts)

    //el.addEventListener('focusin', opts.focusin = focusin.bind(opts))
    el.addEventListener('focusout', opts.focusout = focusout.bind(opts))
    el.addEventListener('click', opts.click = click.bind(opts))
    el.addEventListener('input', opts.input = debounce(input.bind(opts), 250))
    el.addEventListener('keyup', opts.keyup = keyup.bind(opts))

    return opts
}

export function cleanup(opts: Opts) {
    let el = opts.el
    //el.removeEventListener('focusin', opts.focusin)
    el.removeEventListener('focusout', opts.focusout)
    el.removeEventListener('click', opts.click)
    el.removeEventListener('input', opts.input)
    el.removeEventListener('keyup', opts.keyup)
    opts.unwatch()
}

/*function focusin(e) {
    e.preventDefault()
    e.stopPropagation()

    previous = current
    current = this

    //if (previous !== current)
    //    hidePopup(getInstance(), true)
}*/

/*function hideSuggestNT() {
    let suggest = getInstance()
    if (this === suggest.opts && hideSuggest(suggest, true)) {
        // hidden
    }
}*/

function focusout(e) {
    let self: Opts = this,
        name = self.pending_name,
        text = self.el.value,
        suggest = getInstance()
    
    if (name) {
        if (!self.update && text !== name) {
            removeClass(self.el.parentElement, 'suggested')
        } else if (name === self.pojo_[self.fk]) {
            self.el.value = name // redudant on non update
            addClass(self.el.parentElement, 'suggested')
        } else {
            self.pojo_[self.fk] = name
            self.pojo[self.field] = self.pending_value
        }
        self.pending_name = null
        hidePopup(getPopup())
    } else if (text === (name = self.pojo_[self.fk])) {
        addClass(self.el.parentElement, 'suggested') // redudant
    } else if (self.update) {
        self.el.value = name
        addClass(self.el.parentElement, 'suggested')
    } else if (text) {
        removeClass(self.el.parentElement, 'suggested')
    } else if (name) {
        self.el.value = name
        addClass(self.el.parentElement, 'suggested')
    }

    //if (self === suggest.opts)
    //    window.setTimeout(self.hideSuggestNT, 100)
}

function click(e) {
    e.preventDefault()
    e.stopPropagation()
    let suggest = getInstance(),
        self: Opts = this,
        text: string,
        popup

    if (self === suggest.opts && hidePopup(popup = getPopup()))
        return
    
    text = self.el.value
    
    if (text && text === self.str && self.cache.length) {
        showSuggest(suggest, self, popup)
    }
}

function cbFetchSuccess(data) {
    let self: Opts = this,
        value = self.str_fetch
    
    self.disabled = false
    
    if (value !== self.el.value) {
        Vue.nextTick(self.input)
        return true
    }

    let array = data['1'],
        suggest = getInstance()
    
    suggest.opts = self
    self.str = value
    if (!array || !array.length) {
        self.cache = emptyArray
        hidePopup(getPopup())
    } else {
        self.cache = array.reverse()
        showSuggest(suggest, self)
        Vue.nextTick(self.focusNT)
    }

    return true
}

function cbFetchFailed(err) {
    let self: Opts = this

    self.disabled = false
    
    if (self.str_fetch !== self.el.value)
        Vue.nextTick(self.input)
}

function input(e) {
    let self: Opts = this,
        el = self.el,
        value: string = el.value.trim()
    
    if (self.disabled) {
        // ignore
    } else if (value.length !== el.value.length) {
        // the new input has whitespace, replace with trimmed string
        el.value = value
    } else if (!value) {
        hidePopup(getPopup())
    } else if (value === self.str) {
        // simply re-typed the single letter char
        showSuggest(getInstance(), self)
    } else {
        self.str_fetch = value
        self.disabled = true
        // TODO do not hardcode page size
        self.fetch(ds.PS.$create(value, ds.ParamRangeKey.$create(false, 11)))
            .then(self.cbFetchSuccess).then(undefined, self.cbFetchFailed)
    }
}

function keyup(e) {
    let self: Opts = this,
        suggest,
        pager
    switch (e.which) {
        //case 8: // backspace
        //    return self._input(e)
        case 13:
            // do not propagate the enter key event
            suggest = getInstance()
            if (self !== suggest.opts && self.cache.length) {
                // show your results.
                showSuggest(suggest, self)
            } else if (!toggleSuggest(suggest, self) && self.el.value === self.pending_name) {
                self.pojo_[self.fk] = self.pending_name
                self.pojo[self.field] = self.pending_value
                self.pending_name = null
            }
            /*if (self.el.value) {
                togglePopup(getInstance(), self)
            } else if (!self.update && self.pojo[self.field]) {
                // reset suggest
            }*/
            break
        case 27: // escape
            /*if (!util.hidePopup(true) && self.from_editable) {
                getOwner(self).vmessage['f'+self.field_key] = false
            }*/
            //self.pending_name = null
            hidePopup(getPopup())
            break
        /*case 37: // left
            if (!util.isPopupShown()) return true
            if (e.ctrlKey) pageFirst(e)
            else pagePrev(e)
            break*/
        case 38: // up
            if (!visiblePopup(getPopup())) break

            suggest = getInstance()
            pager = suggest.pager
            if (e.ctrlKey) moveTopOrUp(e, pager, self)
            else listUp(pager, pager.index_selected, e, false)
            break
        /*case 39: // right
            if (!util.isPopupShown()) return true
            if (e.ctrlKey) pageLast(e)
            else pageNext(e)
            break*/
        case 40: // down
            if (!visiblePopup(getPopup())) break

            suggest = getInstance()
            pager = suggest.pager
            if (e.ctrlKey) moveBottomOrDown(e, pager, self)
            else listDown(pager, pager.index_selected, e, false)
            break
        default:
            //if (e.which >= 65 && e.which <= 90)
            //    return self._input(e)
            return true
    }
    
    e.preventDefault()
    e.stopPropagation()
    return false
}