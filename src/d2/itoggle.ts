import { VNodeDirective, VNodeWithData } from '../v2/'
import { defp } from 'vueds'
import { Opts, parseOpts, cleanup } from '../_itoggle'

export function bind(el: any, dir: VNodeDirective, vnode: VNodeWithData) {
    if (!dir.arg) {
        console.warn('arg is required for v-itoggle.')
    }
}

export function inserted(el: any, dir: VNodeDirective, vnode: VNodeWithData) {
    if (dir.arg)
        defp(el, 'itoggle', parseOpts(dir.arg.split(','), dir.value, vnode.context, el))
}

export function unbind(el: any, dir: VNodeDirective, vnode: VNodeWithData) {
    let opts: Opts = el.itoggle
    if (opts) {
        cleanup(opts)
        el.itoggle = null
    }
}