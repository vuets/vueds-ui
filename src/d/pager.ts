declare function require(path: string): any;

import { focus, putArgsTo, addCustomListenersTo, configureHammer } from '../_pager'

const Hammer = require('hammerjs')

export function bind() {
    let el = this.el,
        arg: string = this.arg,
        hammer = new Hammer(el),
        opts//: Opts
    
    this.opts = opts = {
        flags: 0,
        col_size: 0,
        table_flags: 0,
        
        hammer: hammer,
        pager: null,
        vm: this.vm,

        focus: (e) => focus(e, opts)
    }

    el.pager_opts = opts

    if (arg)
        putArgsTo(opts, arg.split(','))
    
    // TODO proper focus support
    el.addEventListener('focusin', opts.focus, true)

    configureHammer(hammer, opts)
    
    if (el.id)
        addCustomListenersTo(el, opts)
}

export function update(value: any, oldValue: any) {
    let opts = this.opts
    if (opts.pager !== value) opts.pager = value
}

export function unbind() {
    let opts = this.opts
    this.el.removeEventListener('focusin', opts.focus)
    opts.hammer.destroy()

    if (opts.unbind)
        opts.unbind()
}