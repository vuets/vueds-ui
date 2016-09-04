import { VNode, VNodeDirective, VNodeWithData } from '../v2/'
import { addClass, removeClass } from '../dom_util'

function doUpdate(el, value) {
    let disabled = !!value

    // check the state before applying
    if (disabled === el.disabled)
        return
    
    el.disabled = disabled
    if (disabled) addClass(el, 'disabled')
    else removeClass(el, 'disabled')
}

export function bind(el: any, dir: VNodeDirective, vnode: VNodeWithData) {
    doUpdate(el, dir.value)
}

export function update(el: any, dir: VNodeDirective, vnode: VNodeWithData) {
    doUpdate(el, dir.value)
}

//export function unbind(el: any, dir: VNodeDirective, vnode: VNodeWithData) { }