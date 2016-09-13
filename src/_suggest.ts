import { SelectionType, SelectionFlags } from 'vueds/lib/store/'
import { ds } from 'vueds/lib/ds/'
import * as keymage from './keymage'
import { getInstance } from './c/suggest'
import { removeClass, addClass, hasClass, popTo, debounce } from './dom_util'

function hidePopup(suggest, conditional?: boolean): boolean {
    let popup = suggest.$el.parentElement
    
    if (conditional && hasClass(popup, 'active'))
        return false
    
    popup.style.visibility = 'hidden'
    removeClass(popup, 'active')
    
    return true
}
function showPopup(suggest, self: Opts) {
    let popup = suggest.$el.parentElement
    
    addClass(popup, 'active')
    popTo(self.el, popup)
}
function togglePopup(suggest, self: Opts): boolean {
    let popup = suggest.$el.parentElement,
        show = true
    
    if (hasClass(popup, 'active')) {
        popup.style.visibility = 'hidden'
        removeClass(popup, 'active')
        show = false
    } else {
        addClass(popup, 'active')
        popTo(self.el, popup)
    }
    
    return show
}
function isPopupShown(suggest): boolean {
    let popup = suggest.$el.parentElement
    
    return hasClass(popup, 'active')
}

export interface Opts {
    field: string,
    flags: number,
    fk: string,
    fetch: any,
    pojo: any,
    vm: any,
    el: any,

    str: string
    empty: boolean
    disabled: boolean
    cache: any

    watch_fn: any
    onSelect: any

    focusin: any
    focusout: any
    click: any
    input: any
}

const emptyArray = []
var current: Opts, previous: Opts

function newWatchFn(pojo, fk) {
    return function() {
        return pojo._[fk]
    }
}

function onUpdate(this: Opts, value, oldValue) {
    this.el.value = value
}

function onSelect(message: ds.ACResult, flags: SelectionFlags) {
    let self: Opts = this
    //self.el.value = message.name
    self.pojo._[self.fk] = message.name
    self.pojo[self.field] = message.id || message.value
}

export function parseOpts(args: string[], pojo, fetch, vm, el): Opts {
    let i = 0,
        len = args.length,
        field = args[i++],
        flags = i === len ? 0 : parseInt(args[i++], 10),
        descriptor = pojo.$d,
        $ = descriptor.$,
        fk = $ ? $[field] : field

    let opts = {
        field,
        flags,
        fk,
        pojo,
        fetch,
        vm,
        el,

        str: '',
        empty: true,
        disabled: false,
        cache: emptyArray,

        watch_fn: null,
        onSelect: null,

        focusin: null,
        focusout: null,
        click: null,
        input: null
    }

    opts.watch_fn = vm.$watch(newWatchFn(pojo, fk), onUpdate.bind(opts))
    opts.onSelect = onSelect.bind(opts)

    el.addEventListener('focusin', opts.focusin = focusin.bind(opts))
    //el.addEventListener('focusout', opts.focusout = focusout.bind(opts))
    ////el.addEventListener('focusout', opts.focusout = debounce(focusout.bind(opts), 200))
    //el.addEventListener('click', opts.click = click.bind(opts))
    el.addEventListener('input', opts.input = input.bind(opts))

    return opts
}

export function cleanup(opts: Opts) {
    let el = opts.el
    el.removeEventListener('focusin', opts.focusin)
    //el.removeEventListener('focusout', opts.focusout)
    //el.removeEventListener('click', opts.click)
    el.removeEventListener('input', opts.input)
}

function focusin(e) {
    e.preventDefault()
    e.stopPropagation()

    previous = current
    current = this

    //if (previous !== current)
    //    hidePopup(getInstance(), true)
}

function focusout(e) {
    let self: Opts = this,
        suggest = getInstance(),
        pager = suggest.pager
    
    if (isPopupShown(suggest)) {
        // could have selected, check clicks
    } else if (pager.index_selected === -1) {
        self.el.value = ''
    } else if (pager.pojo.name !== self.el.value) {
        // resetSuggest
    } else {
        // selectSuggest
    }
}

/*function verifySelectionClick(self: Opts, suggest, obj, selected, clicks) {
    if (clicks !== suggest.pager.$clicks) return
    
    if (self === current && suggest.$el.parentElement) {
        // hide if still visible
        util.hidePopup(true)
    }
    
    if (self.str_selected !== self.el.value) resetSuggest(self, obj, selected)
    else if (selected) selectSuggest(selected, self, obj)
    //else console.log('noop')
}*

function focusout(e) {
    let self: Opts = this,
        suggest = getInstance(),
        obj = getOwner(self),
        selected = self.selected
    
    if (isPopupShown(suggest)) verifySelectionClick(self, suggest, obj, selected, pager.$clicks)
    else if (self.str_selected !== self.el.value) resetSuggest(self, obj, selected)
    else if (selected) selectSuggest(selected, self, obj)
}*/

function click(e) {
    e.preventDefault()
    e.stopPropagation()
    let suggest = getInstance(),
        self: Opts,
        text: string

    if (isPopupShown(suggest))
        return
    
    self = this
    text = self.el.value
    
    if (text && text === self.str && self.cache.length) {
        showPopup(suggest, self)
    }
}

function input(e) {
    let self: Opts = this,
        el = self.el,
        value: string = el.value.trim()
    
    if (self.disabled) {
        // just to make sure
    } else if (value.length !== el.value.length) {
        // the new input has whitespace, replace with trimmed string
        el.value = value
    } else if (!value) {
        self.empty = true
        hidePopup(getInstance())
    } else if (value === self.str) {
        // simply re-typed the single letter char
        getInstance().pstore.replace(self.cache)
        showPopup(getInstance(), self)
    } else {
        el.disabled = self.disabled = true
        self.fetch(ds.ParamRangeKey.$create(false, 11), value)
            .then(data => {
                let array = data['1'],
                    empty = !array || !array.length,
                    suggest = getInstance()
                
                suggest.opts = self
                self.str = value
                if (empty) {
                    self.cache = emptyArray
                } else {
                    self.cache = array
                    suggest.pstore.replace(array, SelectionType.RESET)
                    showPopup(suggest, self)
                }

                el.disabled = self.disabled = false
                return empty
            })
            .then(undefined, err => {
                // ignore
                el.disabled = self.disabled = false
            })
    }
}