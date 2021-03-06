import { VNodeDirective, VNodeWithData } from '../v2/'
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

export function inserted(el: any, dir: VNodeDirective, vnode: VNodeWithData) {
    doUpdate(el, dir.value)
}

export function update(el: any, dir: VNodeDirective, vnode: VNodeWithData) {
    if (dir.value === dir.oldValue) {
        //console.warn('disable: vue2 update propagation bug')
        return
    }

    doUpdate(el, dir.value)
}

//export function unbind(el: any, dir: VNodeDirective, vnode: VNodeWithData) { }