declare function require(path: string): any;

const Hammer = require('hammerjs')

import * as keymage from './keymage'

import {
    screen, table_compact_columns, 
} from './screen_util'

import { isInput, resolveElement, removeClass } from './dom_util'

import {
    listUp, listDown,
    tableUp, tableDown,
    moveTopOrUp, moveBottomOrDown, moveLeft, moveRight,
    pageFirst, pageLast, pageSort, pageReload,
    pageNextOrLoad, pagePrevOrLoad
} from './pager_util'

import { defp } from 'vueds'

import {
    Pager, PojoStore, SelectionFlags
} from 'vueds/lib/store/'

export const enum Flags {
    UPDATE = 16,
    PAGE_AND_SELECT = 32,
    NO_RELOAD = 64,
    NO_RPC = 128,
    DTAP_ANY = 256,
    SUGGEST = 512,
    NO_SWIPE = 1024
}

export interface Opts {
    flags: number
    col_size: number
    table_flags: number

    pager: Pager
    hammer: any,
    vm: any,
    el: any

    // listeners
    //pageLeft: any
    //pageRight: any
    focus: any
}

/**
 * Add the property 'pager_opts' to el.
 */
export function attachOptsTo(el, args: string[]|any, pager: Pager, vm) {
    let i = 0,
        len = !args? 0 : args.length,
        flags = i === len ? 0 : parseInt(args[i++], 10),
        table_flags = i === len ? 0 : parseInt(args[i++], 10),
        col_size = i === len ? (table_flags === 0 ? 0 : table_compact_columns()) : parseInt(args[i++], 10),
        hammer = new Hammer(el)
    
    let opts: Opts = {
        flags,
        col_size,
        table_flags,

        pager,
        hammer,
        vm,
        el,

        //pageLeft: null,
        //pageRight: null,
        focus: null
    }

    configureHammer(hammer, opts)
    //if (el.id)
    //    addCustomListenersTo(el, opts)
    
    el.addEventListener('focusin', opts.focus = focus.bind(opts), true)

    defp(el, 'pager_opts', opts)
    
    pager['m']['d'] = opts
}

const SWIPE_VELOCITY = 0.1,
    PRESS_DELAY = 250,
    OPT_DISABLE = { enable: false }

function configureHammer(hammer: any, opts: Opts) {
    if ((opts.flags & Flags.SUGGEST)) {
        // disable
        hammer.get('press').set(OPT_DISABLE)
        hammer.get('doubletap').set(OPT_DISABLE)

        hammer.get('swipe').set({ velocity: SWIPE_VELOCITY/*, distance: 1*/ })
        hammer.on('swipe', swipe.bind(opts))
    } else {
        if (!(opts.flags & Flags.DTAP_ANY)) {
            hammer.get('doubletap').set(OPT_DISABLE)
        } else {
            hammer.on('doubletap', doubletap.bind(opts))
        }

        if ((opts.flags & Flags.NO_SWIPE)) {
            hammer.get('swipe').set(OPT_DISABLE)
        } else {
            hammer.get('swipe').set({ velocity: SWIPE_VELOCITY/*, distance: 1*/ })
            hammer.on('swipe', swipe.bind(opts))
        }

        hammer.get('press').set({ time: PRESS_DELAY })
        hammer.on('press', press.bind(opts))
    }
    
    hammer.on('tap', tap.bind(opts))
}

/*function addCustomListenersTo(el, opts: Opts) {
    let pageLeft = (e) => { current = opts; pagePrevOrLoad(e, opts.pager, opts); },
        pageRight = (e) => { current = opts; pageNextOrLoad(e, opts.pager, opts); }
    
    el.addEventListener('page-left', opts.pageLeft = pageLeft)
    el.addEventListener('page-right', opts.pageRight = pageRight)
}*/

export function cleanup(opts: Opts) {
    let el = opts.el
    el.removeEventListener('focusin', opts.focus)
    opts.hammer.destroy()

    //if (!opts.pageLeft) return
    //el.removeEventListener('page-left', opts.pageLeft)
    //el.removeEventListener('page-right', opts.pageRight)
}

function itemLookup(target, p?): any {
    var parent = p || target.parentElement,
        gparent = parent.parentElement,
        ggparent = gparent.parentElement,
        gggparent = ggparent.parentElement
    
    return target.pager_item || parent.pager_item || gparent.pager_item || ggparent.pager_item || gggparent.pager_item
}

var current: Opts

function moveUp(e) {
    var target = e.target,
        attr = target.getAttribute('c-list'),
        pager
    
    if (attr && !(current = target.pager_opts)) {
        target.pager_opts = current = resolveElement(target, attr).pager_opts
    }
    
    if (!current || !(pager = current.pager).index_hidden) return
    
    if (current.col_size)
        tableUp(pager, current.col_size, current.table_flags, pager.index_selected, e, current.flags)
    else
        listUp(pager, pager.index_selected, e, current.flags)
}

function moveDown(e) {
    var target = e.target,
        attr = target.getAttribute('c-list'),
        pager: Pager
    
    if (attr && !(current = target.pager_opts)) {
        target.pager_opts = current = resolveElement(target, attr).pager_opts
    }
    
    if (!current || !(pager = current.pager).index_hidden) return
    
    if (current.col_size)
        tableDown(pager, current.col_size, current.table_flags, pager.index_selected, e, current.flags)
    else
        listDown(pager, pager.index_selected, e, current.flags)
}

function select(self: Opts, e, dbltap: boolean, clickedUpdate: boolean) {
    var target = e.target, 
        pojo,
        pager: Pager,
        store: PojoStore<any>/*,
        trigger = target.getAttribute('dtap') || (target=parent).getAttribute('dtap')
    
    if (trigger) fireEvent(target, 'dtap')*/
    
    if (!(pojo = itemLookup(target))) return

    if (pojo.$pager !== (pager = self.pager))
        pager = pojo.$pager
    
    store = pager['store']

    store.select(pojo, clickedUpdate ? SelectionFlags.CLICKED_UPDATE : SelectionFlags.CLICKED, pojo.$index)
}

// =====================================
// context listeners

function focus(this: Opts, e) {
    current = this
    keymage.setScope('pager')
}

function swipe(this: Opts, e) {
    let self = this,
        target = e.target,
        pojo,
        pager: Pager,
        flags: number
    if (isInput(target)) return
    current = self
    keymage.setScope('pager')
    
    if (!(pojo = itemLookup(target))) return

    if (pojo.$pager !== (pager = self.pager)) {
        pager = pojo.$pager
        self = pager['m']['d']
        flags = self && self.flags || 0
    } else {
        flags = self.flags
    }
    
    switch(e.direction) {
        case 2: // right-to-left
            pageNextOrLoad(e, pager, flags)
            break
        case 4: // left-to-right
            pagePrevOrLoad(e, pager, flags)
            break;
    }
}

function press(this: Opts, e) {
    if (isInput(e.target)) return
    
    current = this
    keymage.setScope('pager')
    
    select(this, e, false, true)
}

function tap(this: Opts, e) {
    let self = this
    current = self
    if (isInput(e.target)) return
    keymage.setScope('pager')
    
    var pojo,
        pager: Pager,
        store: PojoStore<any>,
        //key,
        suggest: boolean,
        flags: number
    
    if (!(pojo = itemLookup(e.target))) return

    if (pojo.$pager !== (pager = self.pager)) {
        pager = pojo.$pager
        self = pager['m']['d']
        flags = self && self.flags || 0
        suggest = false
    } else {
        flags = self.flags
        suggest = !!(flags & Flags.SUGGEST)
    }
    
    store = pager['store']
    
    if (!suggest && pojo === pager.pojo && pager.prev_key === pojo[store.$k]) return

    store.select(pojo, (flags & screen.flags) ? SelectionFlags.CLICKED_UPDATE : SelectionFlags.CLICKED, pojo.$index)

    // self could be null at this point but then again, suggest is false when it is null
    if (suggest)
        removeClass(self.el.parentElement, 'active')
}

function doubletap(this: Opts, e) {
    let target = e.target
    
    current = this

    if (isInput(target)) return
    keymage.setScope('pager')
    
    if (target.tagName === 'I') return
    
    select(this, e, true, true)
}

// =====================================
// key bindings

keymage.$('pager', 'up', moveUp)
keymage.$('pager', 'down', moveDown)
keymage.$('pager', 'defmod-up', (e) => { if (current) moveTopOrUp(e, current.pager, current) })
keymage.$('pager', 'defmod-down', (e) => { if (current) moveBottomOrDown(e, current.pager, current) })
keymage.$('pager', ['left', 'shift-up'], (e) => { if (current) moveLeft(e, current.pager, current) })
keymage.$('pager', ['right', 'shift-down'], (e) => { if (current) moveRight(e, current.pager, current) })
keymage.$('pager', ['defmod-left', 'defmod-shift-up'], (e) => { if (current) pageFirst(e, current.pager, current) })
keymage.$('pager', ['defmod-right', 'defmod-shift-down'], (e) => { if (current) pageLast(e, current.pager, current) })
keymage.$('pager', 'shift-space', (e) => { if (current) pageSort(e, current.pager, current) })
keymage.$('pager', 'defmod-space', (e) => { if (current) pageReload(e, current.pager, current) })