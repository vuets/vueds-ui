import { VNode, VNodeDirective, VNodeWithData } from '../v2/'
import { defp } from 'vueds'
import { parseOpts, Opts } from '../_close'

export function bind(el: any, dir: VNodeDirective, vnode: VNodeWithData) {
    if (!dir.arg) {
        console.warn('arg is required for v-close.')
        return
    }

    defp(el, 'close_', parseOpts(dir.arg.split(','), dir.value, el))
}

export function unbind(el: any, dir: VNodeDirective, vnode: VNodeWithData) {
    let opts: Opts = el.close_
    if (opts)
        el.removeEventListener(opts.type, opts.handler)
}