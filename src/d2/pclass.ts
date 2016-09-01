import { VNode, VNodeDirective, VNodeWithData } from '../v2/'
import { addClass, removeClass } from '../dom_util'

export function bind(el: any, dir: VNodeDirective, vnode: VNodeWithData) {}

export function update(el: any, dir: VNodeDirective, vnode: VNodeWithData) {
    let prefix = dir.arg || '',
        value = dir.value,
        oldValue = dir.oldValue
    
    if (oldValue) {
        removeClass(el, prefix + oldValue)
    }
    if (value) {
        addClass(el, prefix + value)
    }
}

export function unbind(el: any, dir: VNodeDirective, vnode: VNodeWithData) {}