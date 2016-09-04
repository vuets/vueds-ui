import { VNode, VNodeDirective, VNodeWithData } from '../v2/'
import { defp } from 'vueds'

export function bind(el: any, dir: VNodeDirective, vnode: VNodeWithData) {
    if (!dir.arg) {
        console.warn('arg is required for v-defp.')
    }
}

export function update(el: any, dir: VNodeDirective, vnode: VNodeWithData) {
    if (dir.arg && !dir.oldValue && dir.value)
        defp(el, dir.arg, dir.value)
}

export function unbind(el: any, dir: VNodeDirective, vnode: VNodeWithData) {}