import { VNode, VNodeDirective, VNodeWithData } from '../v2/'
import { defp } from 'vueds'

export function bind(el: any, dir: VNodeDirective, vnode: VNodeWithData) {
    if (!dir.arg) {
        console.warn('arg is required for v-defp.')
    }
}

export function inserted(el: any, dir: VNodeDirective, vnode: VNodeWithData) {
    if (dir.arg)
        defp(el, dir.arg, dir.value)
}

//export function update(el: any, dir: VNodeDirective, vnode: VNodeWithData) {}

//export function unbind(el: any, dir: VNodeDirective, vnode: VNodeWithData) {}