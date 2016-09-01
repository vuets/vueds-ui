declare function require(path: string): any;

import {
    screen, table_compact_columns, 
} from '../screen_util'

import { isInput, resolveElement, fireEvent } from '../dom_util'

import {
    selectIdx, pageAndSelectIdx, 
    listUp, listDown, 
    tableUp, tableDown, tableLeft, tableRight, tableJumpUp, tableJumpDown, tableJumpLeft, tableJumpRight,
    moveTopOrUp, moveBottomOrDown, moveLeft, moveRight,
    pageFirst, pageLast, pageSort, pageReload,
    pageNextOrLoad, pagePrevOrLoad
} from '../pager_util'

import { vfragLookup } from '../vm_util'

import {
    Pager, PagerState, PojoStore, PojoState, SelectionFlags, SelectionType, resolveNextPageIndex 
} from 'vueds/lib/store/'

import * as keymage from '../keymage'

var Hammer = require('hammerjs'),
    current

function moveUp(e) {
    var target = e.target,
        attr = target.getAttribute('c-list'),
        pager,
        clickUpdate: boolean
    
    if (attr && !(current = target.list_ctrl)) {
        target.list_ctrl = current = resolveElement(target, attr).list_ctrl
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
    
    if (attr && !(current = target.list_ctrl)) {
        target.list_ctrl = current = resolveElement(target, attr).list_ctrl
    }
    
    if (!current || !(pager = current.pager).index_hidden) return
    
    clickUpdate = !!(current.flags & screen.flags)
    if (current.col_size)
        tableDown(pager, current.col_size, current.table_flags, pager.index_selected, e, clickUpdate)
    else
        listDown(pager, pager.index_selected, e, clickUpdate)
}

keymage.$('list', 'up', moveUp)
keymage.$('list', 'down', moveDown)
keymage.$('list', 'defmod-up', (e) => { if (current) moveTopOrUp(e, current.pager, current) })
keymage.$('list', 'defmod-down', (e) => { if (current) moveBottomOrDown(e, current.pager, current) })
keymage.$('list', ['left', 'shift-up'], (e) => { if (current) moveLeft(e, current.pager, current) })
keymage.$('list', ['right', 'shift-down'], (e) => { if (current) moveRight(e, current.pager, current) })
keymage.$('list', ['defmod-left', 'defmod-shift-up'], (e) => { if (current) pageFirst(e, current.pager, current) })
keymage.$('list', ['defmod-right', 'defmod-shift-down'], (e) => { if (current) pageLast(e, current.pager, current) })
keymage.$('list', 'shift-space', (e) => { if (current) pageSort(e, current.pager, current) })
keymage.$('list', 'defmod-space', (e) => { if (current) pageReload(e, current.pager, current) })


/*module.exports = {
    flags: 0,
    col_size: 0,
    table_flags: 0,
    pager: null,
    */
export function bind() {
    var self = this,
        el = self.el,
        hammer
    
    el.list_ctrl = self
    
    if (el.id) {
        el.addEventListener('page-left', function(e) { current = self; pagePrevOrLoad(e, self.pager, self); })
        el.addEventListener('page-right', function(e) { current = self; pageNextOrLoad(e, self.pager, self); })
    }
    // TODO proper focus support
    this._focus = function(e) {
        current = self
        keymage.setScope('list')
    }
    el.addEventListener('focusin', this._focus, true)
    //el.addEventListener('click', this._focus, true)
    
    self.hammer = hammer = new Hammer(el)
    hammer.get('swipe').set({velocity: 0.1, distance: 1})
    hammer.add( new Hammer.Tap({ event: 'doubletap', taps: 2 }) )
    hammer.get('doubletap').recognizeWith('tap')
    
    this._swipe = function(e) {
        var target = e.target,
            vfrag,
            vm
        if (isInput(target)) return
        current = self
        keymage.setScope('list')
        
        vfrag = vfragLookup(target)
        if (!vfrag || !(vm = vfrag.scope) || !vm.hasOwnProperty('$index') || (vm !== self.vm && vm.$parent !== self.vm)) return
        
        switch(e.direction) {
            case 2: // right-to-left
                pageNextOrLoad(e, self.pager, current)
                break
            case 4: // left-to-right
                pagePrevOrLoad(e, self.pager, current)
                break;
        }
    }
    this._dtap = function(e, dbltap, flagsIntersect) {
        var target = e.target, 
            parent = target.parentElement, 
            vfrag = vfragLookup(target, parent),
            vm,
            trigger = target.getAttribute('dtap') || (target=parent).getAttribute('dtap')
        
        if (trigger) fireEvent(target, 'dtap')
        
        if (!vfrag || !(vm = vfrag.scope) || !vm.hasOwnProperty('$index') || (vm !== self.vm && vm.$parent !== self.vm)) return
        //if (vm.$parent.$data.pager !== self.pager && (!(vm=vm.$parent).$parent || vm.$parent.$data.pager !== self.pager)) return
        
        var pojo = vm[self.loop_var]
        if (!pojo) return
        if (flagsIntersect) {
            if (!(pojo.vstate & PojoState.UPDATE)) {
                pojo.vstate |= PojoState.UPDATE
                self.pager.store.select(pojo, SelectionFlags.CLICKED_UPDATE, vm.$index)
            }
        } else if (dbltap && trigger) {
            self.pager.store.select(pojo, SelectionFlags.CLICKED, vm.$index)
        } else {
            pojo.vstate ^= PojoState.UPDATE
            self.pager.store.select(pojo, SelectionFlags.CLICKED_UPDATE, vm.$index)
        }
    }
    this._press = function(e, dbltap) {
        current = self
        if (isInput(e.target)) return
        keymage.setScope('list')
        
        self._dtap(e, false, self.flags & screen.flags)
    }
    this._tap = function(e) {
        current = self
        if (isInput(e.target)) return
        keymage.setScope('list')
        
        if (self.flags & screen.flags) {
            self._dtap(e, false, true)
            return
        }

        var vfrag = vfragLookup(e.target),
            vm
        if (!vfrag || !(vm = vfrag.scope) || !vm.hasOwnProperty('$index') || (vm !== self.vm && vm.$parent !== self.vm)) return
        //if (vm.$parent.$data.pager !== self.pager && (!(vm=vm.$parent).$parent || vm.$parent.$data.pager !== self.pager)) return
        
        var pojo = vm[self.loop_var]
        if (pojo) self.pager.store.select(pojo, SelectionFlags.CLICKED, vm.$index)
    }
    this._doubletap = function(e) {
        // TODO remove hack
        if (e.target.hasOwnProperty('$l')) {
            // a date input with a date picker
            // workaround for mobile
            fireEvent(e.target, 'dblclick')
            e.preventDefault()
            //e.stopPropagation()
            return false
        }
        
        current = self
        if (isInput(e.target)) return
        // tap already handles this, which gets called before this function
        // keymage.setScope('list')
        
        self._dtap(e, true, self.flags & screen.flags)
    }
    hammer.on('swipe', this._swipe)
    hammer.on('press', this._press)
    hammer.on('tap', this._tap)
    hammer.on('doubletap', this._doubletap)
    
    if (!self.arg) {
        this.loop_var = 'pojo'
        return
    }
    
    var split_args = self.arg.split('__'), 
        len = split_args.length,
        i = 0
    
    this.loop_var = split_args[i++]
    self.flags = parseInt(split_args[i++], 10)
    
    if (i === len) return
    self.table_flags = parseInt(split_args[i++], 10)
    self.col_size = table_compact_columns()
}
export function update(value: any, oldValue: any) {
    if (this.pager !== value) this.pager = value
}
export function unbind() {
    this.el.removeEventListener('focusin', this._focus)
    //this.el.removeEventListener('click', this._focus)
    
    //this.hammer.off('swipe', this._swipe)
    //this.hammer.off('press', this._press)
    this.hammer.destroy()
}