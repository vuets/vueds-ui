import { VNodeDirective, VNodeWithData } from '../v2/'
import { defp } from 'vueds'
import { Opts, parseOpts, cleanup } from '../_close'

export function inserted(el: any, dir: VNodeDirective, vnode: VNodeWithData) {
    defp(el, 'close_', parseOpts(dir.arg && dir.arg.split(','), dir.value, el))
}

export function unbind(el: any, dir: VNodeDirective, vnode: VNodeWithData) {
    let opts: Opts = el.close_
    if (opts) {
        cleanup(opts)
        el.close_ = null
    }
}