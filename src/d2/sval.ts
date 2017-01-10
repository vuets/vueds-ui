import { VNodeDirective, VNodeWithData } from '../v2/'
import { Opts, parseOpts } from '../_sval'
import { defp } from 'vueds'

export function bind(el: any, dir: VNodeDirective, vnode: VNodeWithData) {
    if (!dir.arg) {
        console.warn('arg is required for v-sval.')
    }
}

export function inserted(el: any, dir: VNodeDirective, vnode: VNodeWithData) {
    if (!dir.arg) return

    let opts: Opts = parseOpts(dir.arg.split(','), el)
    defp(el, 'sval_', opts)
    opts.fn(el, dir.value)
}

export function update(el: any, dir: VNodeDirective, vnode: VNodeWithData) {
    let value = dir.value
    if (value === undefined || value === dir.oldValue)
        return
    
    let opts: Opts = el.sval_
    if (opts)
        opts.fn(el, value)
}

//export function unbind(el: any, dir: VNodeDirective, vnode: VNodeWithData) {}