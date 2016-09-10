import { VNode, VNodeDirective, VNodeWithData } from '../v2/'
import { addClass, removeClass } from '../dom_util'

export function inserted(el: any, dir: VNodeDirective, vnode: VNodeWithData) {
    if (dir.value)
        addClass(el, dir.arg as string)
    else
        removeClass(el, dir.arg as string)
}

export function update(el: any, dir: VNodeDirective, vnode: VNodeWithData) {
    if (dir.value === dir.oldValue) {
        //console.warn('sclass: vue2 update propagation bug')
        return
    }

    if (dir.value)
        addClass(el, dir.arg as string)
    else
        removeClass(el, dir.arg as string)
}

//export function unbind(el: any, dir: VNodeDirective, vnode: VNodeWithData) {}