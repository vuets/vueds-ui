import { VNodeDirective, VNodeWithData } from '../v2/'
import { defp } from 'vueds'
import { Opts, parseOpts, cleanup } from '../_rappendto'

export function bind(el: any, dir: VNodeDirective, vnode: VNodeWithData) {
    if (!dir.arg) {
        console.warn('arg is required for v-rappendto.')
    }
}

export function inserted(el: any, dir: VNodeDirective, vnode: VNodeWithData) {
    if (dir.arg)
        defp(el, 'rappendto_', parseOpts(dir.arg.split(','), vnode.context, el))
}

export function unbind(el: any, dir: VNodeDirective, vnode: VNodeWithData) {
    let opts: Opts = el.rappendto_
    if (opts)
        cleanup(opts)
}