import { VNode, VNodeDirective, VNodeWithData } from '../v2/'
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
    defp(el, 'sval_opts', opts)
    opts.fn(el, dir.value)
}

export function update(el: any, dir: VNodeDirective, vnode: VNodeWithData) {
    if (dir.value === dir.oldValue) {
        //console.warn('sval: vue2 update propagation bug')
        return
    }

    let opts: Opts = el['sval_opts']
    if (opts)
        opts.fn(el, dir.value)
}

//export function unbind(el: any, dir: VNodeDirective, vnode: VNodeWithData) {}