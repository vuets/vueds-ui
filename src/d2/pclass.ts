import { VNode, VNodeDirective, VNodeWithData } from '../v2/'
import { addClass, removeClass } from '../dom_util'

function onUpdate(el, arg, value, oldValue) {
    if (oldValue)
        removeClass(el, arg + oldValue)
    
    if (value)
        addClass(el, arg + value)
}

export function bind(el: any, dir: VNodeDirective, vnode: VNodeWithData) {
    onUpdate(el, dir.arg, dir.value, dir.oldValue)
}

export function update(el: any, dir: VNodeDirective, vnode: VNodeWithData) {
    onUpdate(el, dir.arg, dir.value, dir.oldValue)
}

//export function unbind(el: any, dir: VNodeDirective, vnode: VNodeWithData) {}