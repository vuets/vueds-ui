import { VNode, VNodeDirective, VNodeWithData } from '../v2/'
import { defp } from 'vueds'
import { parseOpts, Opts } from '../_itoggle'

export function bind(el: any, dir: VNodeDirective, vnode: VNodeWithData) {
    if (!dir.arg) {
        console.warn('arg is required for v-itoggle.')
        return
    }

    defp(el, 'itoggle', parseOpts(dir.arg.split(','), dir.value, vnode.context, el))
}

/*export function update(el: any, { value, oldValue }: VNodeDirective, vnode: VNodeWithData) {
    
}*/

export function unbind(el: any, dir: VNodeDirective, vnode: VNodeWithData) {
    let opts: Opts = el['itoggle']
    if (opts)
        el.removeEventListener(opts.type, opts.handler)
}