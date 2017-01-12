import { VNodeDirective, VNodeWithData } from '../v2/'
import { defp } from 'vueds/lib/util'
import { Opts, parseOpts, cleanup } from '../_rclass'

export function bind(el: any, dir: VNodeDirective, vnode: VNodeWithData) {
    if (!dir.arg) {
        console.warn('arg is required for v-rclass.')
    }
}

export function inserted(el: any, dir: VNodeDirective, vnode: VNodeWithData) {
    if (dir.arg)
        defp(el, 'rclass_', parseOpts(dir.arg.split(','), el))
}

export function unbind(el: any, dir: VNodeDirective, vnode: VNodeWithData) {
    let opts: Opts = el.rclass_
    if (opts)
        cleanup(opts)
}