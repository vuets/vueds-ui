import { VNode, VNodeDirective, VNodeWithData } from '../v2/'
import { Opts, attachOptsTo, cleanup } from '../_pager'

export function bind(el: any, dir: VNodeDirective, vnode: VNodeWithData) {
    attachOptsTo(el, dir.arg && dir.arg.split(','), dir.value, vnode.context)
}

export function unbind(el: any, dir: VNodeDirective, vnode: VNodeWithData) {
    let opts = el.pager_opts
    if (opts)
        cleanup(opts)
}