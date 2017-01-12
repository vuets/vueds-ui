import { VNodeDirective, VNodeWithData } from '../v2/'
import { defp } from 'vueds/lib/util'
import { resolveElement } from '../dom_util'

export function bind(el: any, dir: VNodeDirective, vnode: VNodeWithData) {
    if (!dir.arg) {
        console.warn('arg is required for v-append.')
        return
    }

    update(el, dir, vnode)
}

export function update(el: any, dir: VNodeDirective, vnode: VNodeWithData) {
    if (!dir.arg || !dir.value || dir.value === dir.oldValue) return

    let el_append = el.append_
    
    if (!el_append)
        defp(el, 'append_', el_append = resolveElement(el, dir.arg, vnode.context))
    
    el.appendChild(el_append)
}