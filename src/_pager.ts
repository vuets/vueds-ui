declare function require(path: string): any;

const Hammer = require('hammerjs')

import * as keymage from './keymage'

import {
    screen, table_compact_columns, 
} from './screen_util'

import { isInput, resolveElement, fireEvent } from './dom_util'

import {
    selectIdx, pageAndSelectIdx, 
    listUp, listDown, 
    tableUp, tableDown, tableLeft, tableRight, tableJumpUp, tableJumpDown, tableJumpLeft, tableJumpRight,
    moveTopOrUp, moveBottomOrDown, moveLeft, moveRight,
    pageFirst, pageLast, pageSort, pageReload,
    pageNextOrLoad, pagePrevOrLoad
} from './pager_util'

import { PojoState, defp } from 'vueds'

import {
    Pager, PagerState, PojoStore, SelectionFlags, SelectionType, resolveNextPageIndex 
} from 'vueds/lib/store/'

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
        col_size = table_flags === 0 ? 0 : table_compact_columns(),
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
}

function configureHammer(hammer: any, opts: Opts) {
    hammer.get('swipe').set({ velocity: 0.1/*, distance: 1*/ })
    hammer.add( new Hammer.Tap({ event: 'doubletap', taps: 2 }) )
    hammer.get('doubletap').recognizeWith('tap')

    hammer.on('swipe', swipe.bind(opts))
    hammer.on('press', press.bind(opts))
    hammer.on('tap', tap.bind(opts))
    hammer.on('doubletap', doubletap.bind(opts))
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
        pager,
        clickUpdate: boolean
    
    if (attr && !(current = target.pager_opts)) {
        target.pager_opts = current = resolveElement(target, attr).pager_opts
    }
    
    if (!current || !(pager = current.pager).index_hidden) return
    
    clickUpdate = !!(current.flags & screen.flags)
    if (current.col_size)
        tableUp(pager, current.col_size, current.table_flags, pager.index_selected, e, clickUpdate)
    else
        listUp(pager, pager.index_selected, e, clickUpdate)
}

function moveDown(e) {
    var target = e.target,
        attr = target.getAttribute('c-list'),
        pager: Pager,
        clickUpdate: boolean
    
    if (attr && !(current = target.pager_opts)) {
        target.pager_opts = current = resolveElement(target, attr).pager_opts
    }
    
    if (!current || !(pager = current.pager).index_hidden) return
    
    clickUpdate = !!(current.flags & screen.flags)
    if (current.col_size)
        tableDown(pager, current.col_size, current.table_flags, pager.index_selected, e, clickUpdate)
    else
        listDown(pager, pager.index_selected, e, clickUpdate)
}

function select(e, opts: Opts, dbltap: boolean, flagsIntersect: number) {
    var target = e.target, 
        parent = target.parentElement, 
        pojo,
        store: PojoStore<any>,
        trigger = target.getAttribute('dtap') || (target=parent).getAttribute('dtap')
    
    if (trigger) fireEvent(target, 'dtap')
    
    if (!(pojo = itemLookup(target)) || pojo.$pager !== opts.pager) return
    
    store = opts.pager['store']

    if (flagsIntersect) {
        if (!(pojo.vstate & PojoState.UPDATE)) {
            pojo.vstate |= PojoState.UPDATE
            store.select(pojo, SelectionFlags.CLICKED_UPDATE, pojo.$index)
        }
    } else if (dbltap && trigger) {
        store.select(pojo, SelectionFlags.CLICKED, pojo.$index)
    } else {
        pojo.vstate ^= PojoState.UPDATE
        store.select(pojo, SelectionFlags.CLICKED_UPDATE, pojo.$index)
    }
}

// =====================================
// context listeners

function focus(e) {
    current = this as Opts
    keymage.setScope('pager')
}

function swipe(e) {
    let opts: Opts = this,
        target = e.target,
        pojo
    if (isInput(target)) return
    current = opts
    keymage.setScope('pager')
    
    if (!(pojo = itemLookup(target)) || pojo.$pager !== opts.pager) return
    
    switch(e.direction) {
        case 2: // right-to-left
            pageNextOrLoad(e, opts.pager, opts)
            break
        case 4: // left-to-right
            pagePrevOrLoad(e, opts.pager, opts)
            break;
    }
}

function press(e) {
    let opts: Opts = this
    current = opts
    if (isInput(e.target)) return
    keymage.setScope('pager')
    
    select(e, opts, false, opts.flags & screen.flags)
}

function tap(e) {
    let opts: Opts = this
    current = opts
    if (isInput(e.target)) return
    keymage.setScope('pager')
    
    if (opts.flags & screen.flags) {
        select(e, opts, false, 1)
        return
    }

    var pojo,
        store: PojoStore<any>
    
    if (!(pojo = itemLookup(e.target)) || pojo.$pager !== opts.pager) return
    
    store = opts.pager['store']
    store.select(pojo, SelectionFlags.CLICKED, pojo.$index)
}

function doubletap(e) {
    let opts: Opts = this
    // TODO remove hack
    if (e.target.hasOwnProperty('$l')) {
        // a date input with a date picker
        // workaround for mobile
        fireEvent(e.target, 'dblclick')
        e.preventDefault()
        //e.stopPropagation()
        return false
    }
    
    current = opts
    if (isInput(e.target)) return
    // tap already handles this, which gets called before this function
    // keymage.setScope('pager')
    
    select(e, opts, true, opts.flags & screen.flags)
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