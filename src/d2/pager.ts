declare function require(path: string): any;

import { VNode, VNodeDirective, VNodeWithData } from '../v2/'

import { focus, putArgsTo, configureHammer, addCustomListenersTo } from '../_pager'

const Hammer = require('hammerjs')

export function bind(el: any, dir: VNodeDirective, vnode: VNodeWithData) {
    let arg = dir.arg,
        hammer = new Hammer(el),
        opts//: Opts
    
    opts = {
        v2: true,
        flags: 0,
        col_size: 0,
        table_flags: 0,
        
        hammer: hammer,
        pager: null,
        vm: vnode.context,

        focus: (e) => focus(e, opts)
    }

    el.pager_opts = opts

    if (arg)
        putArgsTo(opts, arg.split('__'))
    
    // TODO proper focus support
    el.addEventListener('focusin', opts.focus, true)

    configureHammer(hammer, opts)
    
    if (el.id)
        addCustomListenersTo(el, opts)
}

export function update(el: any, { value }: VNodeDirective, vnode: VNodeWithData) {
    let opts = el.pager_opts
    if (opts.pager !== value) opts.pager = value
}

export function unbind(el: any, dir: VNodeDirective, vnode: VNodeWithData) {
    let opts = el.pager_opts
    el.removeEventListener('focusin', opts.focus)
    opts.hammer.destroy()

    if (opts.unbind)
        opts.unbind()
}