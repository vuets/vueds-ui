import { VNodeDirective, VNodeWithData } from '../v2/'
import { defp } from 'vueds'
import { Opts, parseOpts, cleanup } from '../_toggle'

export function inserted(el: any, dir: VNodeDirective, vnode: VNodeWithData) {
    defp(el, 'toggle', parseOpts(dir.arg && dir.arg.split(','), dir.value, vnode.context, el))
}

export function unbind(el: any, dir: VNodeDirective, vnode: VNodeWithData) {
    let opts: Opts = el.toggle
    if (opts) {
        cleanup(opts)
        el.toggle = null
    }
}