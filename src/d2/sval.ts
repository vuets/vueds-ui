import { VNode, VNodeDirective, VNodeWithData } from '../v2/'
import { Opts, parseOpts } from '../_sval'

export function bind(el: any, dir: VNodeDirective, vnode: VNodeWithData) {
    if (!dir.arg) {
        console.warn('arg is required for v-sval.')
        return
    }

    dir['opts'] = parseOpts(dir.arg.split('__'), el)
}

export function update(el: any, dir: VNodeDirective, vnode: VNodeWithData) {
    let opts: Opts = dir['opts']
    if (opts)
        opts.fn(el, dir.value)
}

export function unbind(el: any, dir: VNodeDirective, vnode: VNodeWithData) {}